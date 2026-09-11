"""Validate and assemble the 340 editable Fantasia Fauna notices.

Run: python tools/build_notices.py [--check] [--report PATH]
An incomplete corpus never replaces js/notices.js. Validation is structural;
it does not certify the historical accuracy or the literary quality of prose.
"""
import argparse
from collections import defaultdict
import json
from pathlib import Path
import re
import sys
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
SECTIONS = ("fascination", "legendes", "anomalies", "naturelle", "reliques")
PARTS = ("Comportement", "Habitat", "Alimentation", "Intelligence", "Reproduction", "Prédateurs")
CITATION = re.compile(r"\[(\d+)\]")
WORDS = re.compile(r"[^\W_]+(?:['’\-][^\W_]+)*", re.UNICODE)


def paragraphs(value):
    if isinstance(value, str):
        return [value]
    if isinstance(value, list):
        return [text for item in value for text in paragraphs(item)]
    if isinstance(value, dict):
        return [text for key, item in value.items() if key != "title" for text in paragraphs(item)]
    return []


def prose(notice):
    return paragraphs(notice.get("description", "")) + paragraphs(notice.get("sections", {}))


def word_count(notice):
    return len(WORDS.findall(CITATION.sub("", " ".join(prose(notice)))))


def validate_notice(slug, notice):
    errors = []

    def fail(message):
        errors.append(f"{slug}: {message}")

    def check_paragraphs(value, label, minimum=1):
        values = [value] if isinstance(value, str) else value
        if not isinstance(values, list) or len(values) < minimum:
            fail(f"{label}: au moins {minimum} paragraphe(s) requis")
        elif any(not isinstance(p, str) or not p.strip() for p in values):
            fail(f"{label}: paragraphe vide ou invalide")

    if not isinstance(notice, dict):
        fail("objet JSON attendu")
        return errors
    if not isinstance(notice.get("description"), str) or not notice["description"].strip():
        fail("description absente")
    sections = notice.get("sections", {})
    if not isinstance(sections, dict) or set(sections) != set(SECTIONS):
        fail("les cinq rubriques du Tyrannœil sont requises")
        sections = sections if isinstance(sections, dict) else {}
    for section, minimum in (("fascination", 2), ("legendes", 3), ("anomalies", 2), ("reliques", 2)):
        check_paragraphs(sections.get(section), section, minimum)
    natural = sections.get("naturelle", {})
    if not isinstance(natural, dict):
        natural = {}
    check_paragraphs(natural.get("lead"), "naturelle.lead")
    parts = natural.get("parts", [])
    if not isinstance(parts, list):
        parts = []
    if [p.get("title") if isinstance(p, dict) else None for p in parts] != list(PARTS):
        fail("six sous-parties d'histoire naturelle attendues, dans l'ordre")
    for part in parts:
        if isinstance(part, dict):
            check_paragraphs(part.get("body"), str(part.get("title")))
    count = word_count(notice)
    if count < 900:
        fail(f"notice trop courte ({count} mots, minimum 900)")
    sources = notice.get("sources")
    ids = set()
    if not isinstance(sources, list) or not sources:
        fail("références documentaires absentes")
        sources = []
    for source in sources:
        if not isinstance(source, dict):
            fail("source invalide")
            continue
        identifier = source.get("id")
        if type(identifier) is not int or identifier < 1 or identifier in ids:
            fail("identifiant de source invalide ou dupliqué")
        else:
            ids.add(identifier)
        try:
            source_url = source.get("url", "")
            if not isinstance(source_url, str):
                raise TypeError("URL de source non textuelle")
            url = urlsplit(source_url)
            if url.scheme not in ("https", "http") or not url.hostname or url.username or url.password:
                fail(f"URL de source invalide : {identifier}")
        except (ValueError, TypeError):
            fail(f"URL de source invalide : {identifier}")
        if not isinstance(source.get("title"), str) or not source["title"].strip():
            fail(f"titre de source absent : {identifier}")
    text = " ".join(prose(notice))
    cited = set()
    for token in CITATION.findall(text):
        if len(token) > 1 and token.startswith("0"):
            fail(f"identifiant d'appel de source avec zéro initial [{token}]")
        else:
            cited.add(int(token))
    if not cited:
        fail("aucun appel de source dans la prose")
    for identifier in sorted(cited - ids):
        fail(f"appel de source non résolu [{identifier}]")
    for identifier in sorted(ids - cited):
        fail(f"source non citée [{identifier}]")
    if re.search(r"<[^>]+>|\[unverified\]|\b(?:TODO|TBD|LOREM IPSUM)\b", text, re.I):
        fail("HTML ou marqueur de travail présent dans la prose")
    return errors


def validate_catalog(notices, expected):
    errors = []
    for slug in sorted(set(expected) - set(notices)):
        errors.append(f"{slug}: notice manquante")
    for slug in sorted(set(notices) - set(expected)):
        errors.append(f"{slug}: identifiant absent du catalogue")
    seen = defaultdict(list)
    for slug, notice in notices.items():
        errors.extend(validate_notice(slug, notice))
        if not isinstance(notice, dict):
            continue
        for paragraph in prose(notice):
            normalized = re.sub(r"\s+", " ", CITATION.sub("", paragraph)).strip().casefold()
            if len(normalized) > 120:
                seen[normalized].append(slug)
    for text, owners in seen.items():
        if len(owners) > 1:
            errors.append(f"paragraphe dupliqué ({', '.join(owners)}): {text[:100]}")
    return errors


def load_catalog():
    text = (ROOT / "js/creatures-data.js").read_text(encoding="utf-8")
    data = json.loads(text[text.index("{"):text.rindex("}") + 1])
    expected = [creature["slug"] for creature in data["creatures"]]
    if len(expected) != 340 or len(set(expected)) != 340:
        raise ValueError("Le catalogue de référence doit contenir 340 identifiants uniques")
    return expected


def load_notices():
    notices, errors = {}, []
    for path in sorted((ROOT / "data/notices").glob("*.json")):
        try:
            notices[path.stem] = json.loads(path.read_text(encoding="utf-8"))
        except (ValueError, OSError) as exc:
            errors.append(f"{path.name}: {exc}")
    return notices, errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Validate without writing the browser bundle")
    parser.add_argument("--report", type=Path, default=ROOT / "tmp/editorial/validation.json")
    args = parser.parse_args()
    expected = load_catalog()
    notices, parse_errors = load_notices()
    errors = parse_errors + validate_catalog(notices, expected)
    counts = {slug: word_count(notice) for slug, notice in notices.items() if isinstance(notice, dict)}
    report = {
        "expected": len(expected), "present": len(notices), "missing": sorted(set(expected) - set(notices)),
        "structural_validation_passed": not errors,
        "editorial_review": "separate_manual_gate",
        "words": {"total": sum(counts.values()), "per_notice": counts},
        "errors": errors,
    }
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: v for k, v in report.items() if k not in ("missing", "words", "errors")}, ensure_ascii=False))
    if errors:
        print(f"{len(errors)} erreur(s) — détail : {args.report}")
        for error in errors[:15]:
            print(error)
        return 1
    if not args.check:
        ordered = {slug: notices[slug] for slug in expected}
        content = "// Generated by tools/build_notices.py. Edit data/notices/*.json.\n"
        content += "window.FF_NOTICES = " + json.dumps(ordered, ensure_ascii=False, indent=2) + ";\n"
        (ROOT / "js/notices.js").write_text(content, encoding="utf-8")
        print(f"340 notices assemblées ({sum(counts.values())} mots de prose).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
