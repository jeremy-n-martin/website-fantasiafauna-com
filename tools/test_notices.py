"""Regression gates for the editable encyclopedic notices."""
import copy
import importlib.util
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]


class NoticeBuildTests(unittest.TestCase):
    def test_missing_notices_are_rejected_before_publication(self):
        script = ROOT / "tools" / "build_notices.py"
        self.assertTrue(script.is_file(), "The notice assembler must enforce complete coverage")
        spec = importlib.util.spec_from_file_location("build_notices", script)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        errors = module.validate_catalog({"tyrannoeil": {}}, ["tyrannoeil", "banshee"])
        self.assertTrue(any("banshee" in error for error in errors))

    def test_leading_zero_citation_is_rejected_without_normalization(self):
        spec = importlib.util.spec_from_file_location("build_notices", ROOT / "tools/build_notices.py")
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        raw = (ROOT / "data/notices/tyrannoeil.json").read_text(encoding="utf-8")
        base = json.loads(module.CITATION.sub("", raw))
        base["sources"] = [{"id": 1, "title": "Test fixture", "url": "https://example.org/reference"}]
        base["sections"]["fascination"][0] += "[1]"
        self.assertEqual(module.validate_notice("tyrannoeil", base), [])
        for token in ("01", "001"):
            with self.subTest(token=token):
                broken = copy.deepcopy(base)
                broken["sections"]["fascination"][0] = broken["sections"]["fascination"][0].replace("[1]", f"[{token}]")
                original = copy.deepcopy(broken)
                errors = module.validate_notice("tyrannoeil", broken)
                self.assertIn(f"tyrannoeil: identifiant d'appel de source avec zéro initial [{token}]", errors)
                self.assertIn("tyrannoeil: source non citée [1]", errors)
                self.assertEqual(broken, original)

    def test_non_string_source_url_returns_validation_error(self):
        spec = importlib.util.spec_from_file_location("build_notices", ROOT / "tools/build_notices.py")
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        raw = (ROOT / "data/notices/tyrannoeil.json").read_text(encoding="utf-8")
        base = json.loads(module.CITATION.sub("", raw))
        base["sources"] = [{"id": 1, "title": "Test fixture", "url": "https://example.org/reference"}]
        base["sections"]["fascination"][0] += "[1]"
        self.assertEqual(module.validate_notice("tyrannoeil", base), [])
        for url in (42, None, True, [], {}, b"https://example.org/reference"):
            with self.subTest(url=url):
                broken = copy.deepcopy(base)
                broken["sources"][0]["url"] = url
                self.assertEqual(module.validate_notice("tyrannoeil", broken), ["tyrannoeil: URL de source invalide : 1"])

    def test_incomplete_or_unsourced_notice_cannot_be_assembled(self):
        spec = importlib.util.spec_from_file_location("build_notices", ROOT / "tools/build_notices.py")
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        raw = (ROOT / "data/notices/tyrannoeil.json").read_text(encoding="utf-8")
        base = json.loads(module.CITATION.sub("", raw))
        # Rendering/build fixture, not an editorial reference.
        base["sources"] = [{"id": 901, "title": "Test fixture", "url": "https://example.org/reference"}]
        base["sections"]["fascination"][0] += "[901]"
        self.assertEqual(module.validate_catalog({"tyrannoeil": base}, ["tyrannoeil"]), [])
        broken = copy.deepcopy(base)
        broken["sections"]["naturelle"]["parts"].pop()
        self.assertTrue(module.validate_catalog({"tyrannoeil": broken}, ["tyrannoeil"]), "Six natural-history parts are required")
        broken = copy.deepcopy(base)
        broken["sections"]["fascination"] = [""]
        self.assertTrue(module.validate_catalog({"tyrannoeil": broken}, ["tyrannoeil"]), "Empty paragraphs must fail")
        broken = copy.deepcopy(base)
        broken["sources"][0]["url"] = "javascript:alert(1)"
        self.assertTrue(module.validate_catalog({"tyrannoeil": broken}, ["tyrannoeil"]), "Unsafe URLs must fail")
        broken = copy.deepcopy(base)
        broken["sources"] = []
        self.assertTrue(module.validate_catalog({"tyrannoeil": broken}, ["tyrannoeil"]), "Unresolved citations must fail")
        self.assertTrue(module.validate_catalog({"tyrannoeil": {}}, ["tyrannoeil"]), "An empty shell is not a notice")


if __name__ == "__main__":
    unittest.main()
