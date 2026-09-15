"""Audit des approbations publiées : chaque entrée doit être adossée à une relecture réelle.

Pour chaque slug du manifeste, cherche dans les rapports de relecture une entrée de verdict
« pass » dont l'empreinte des octets bruts correspond exactement au fichier actuel.
Sans correspondance, l'approbation n'est pas justifiable et doit être retirée.
"""
import hashlib
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'tools'))
from build_reviewed_notices import notice_digest  # noqa: E402
from build_notices import load_notices  # noqa: E402

ORIGINAL = {
    'aarakocra', 'aasimar', 'aboleth', 'barde', 'basajaun', 'cryomancien', 'cu-sith',
    'dryade', 'ecuyer', 'marilith', 'meduse', 'melusine', 'quetzalcoatl', 'rakshasa',
    'shoggoth', 'sidhe', 'triton', 'troll', 'tyrannoeil',
}


def raw_digest(slug):
    return hashlib.sha256((ROOT / 'data/notices' / (slug + '.json')).read_bytes()).hexdigest()


def main():
    manifest = json.loads((ROOT / 'data/reviewed-notices.json').read_text(encoding='utf-8'))
    notices, errors = load_notices()
    assert not errors, errors

    evidence = {}
    for path in sorted((ROOT / 'tmp/editorial').glob('relecture-*.json')):
        report = json.loads(path.read_text(encoding='utf-8'))
        date = path.stat().st_mtime
        for entry in report.get('reviewed', []):
            slug = entry['slug']
            verdict = entry.get('verdict') or entry.get('final_verdict')
            if verdict != 'pass':
                continue
            if entry.get('sha256') != raw_digest(slug):
                continue
            evidence.setdefault(slug, []).append({
                'report': path.name,
                'mtime': date,
                'reviewed_digest': entry['sha256'],
                'sources_checked': len(entry.get('source_checks') or entry.get('sources_cross_checked') or []),
            })

    rows, unjustified = [], []
    for slug in sorted(manifest):
        current = raw_digest(slug)
        canon_ok = notice_digest(notices[slug]) == manifest[slug]
        found = evidence.get(slug)
        row = {
            'slug': slug,
            'origin': 'préexistante (d936d00)' if slug in ORIGINAL else 'ajoutée le 2026-09-15',
            'digest_manifeste_conforme': canon_ok,
            'relecture': found or None,
        }
        rows.append(row)
        if not canon_ok or not found:
            unjustified.append(slug)

    result = {
        'manifeste': len(manifest),
        'justifiees': len([r for r in rows if r['digest_manifeste_conforme'] and r['relecture']]),
        'non_justifiees': unjustified,
        'audit': rows,
    }
    (ROOT / 'tmp/editorial/audit-approbations.json').write_text(
        json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')

    print(json.dumps({k: v for k, v in result.items() if k != 'audit'}, ensure_ascii=False, indent=2))
    for row in rows:
        marks = 'OK ' if (row['digest_manifeste_conforme'] and row['relecture']) else 'NON'
        reports = ','.join(sorted({e['report'].replace('relecture-', '').replace('.json', '') for e in (row['relecture'] or [])})) or '-'
        date = ''
        if row['relecture']:
            import datetime
            date = datetime.datetime.fromtimestamp(max(e['mtime'] for e in row['relecture'])).strftime('%Y-%m-%d %H:%M')
        print(f"{marks} {row['slug']:<20} {row['origin']:<26} {date:<16} {reports}")


if __name__ == '__main__':
    main()
