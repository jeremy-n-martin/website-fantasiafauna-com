"""Regression tests for incremental publication of reviewed notices."""
import hashlib
import importlib.util
import json
import tempfile
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]


class ReviewedNoticeTests(unittest.TestCase):
    def test_only_reviewed_notice_is_selected(self):
        spec = importlib.util.spec_from_file_location('reviewed', ROOT / 'tools/build_reviewed_notices.py')
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        notice = json.loads((ROOT / 'data/notices/tyrannoeil.json').read_text(encoding='utf-8'))
        digest = hashlib.sha256(json.dumps(notice, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode('utf-8')).hexdigest()
        selected, errors = module.select_reviewed({'tyrannoeil': notice, 'zombie': {}}, ['tyrannoeil', 'zombie'], {'tyrannoeil': digest})
        self.assertEqual(errors, [])
        self.assertEqual(list(selected), ['tyrannoeil'])

    def test_changed_notice_requires_new_review(self):
        spec = importlib.util.spec_from_file_location('reviewed', ROOT / 'tools/build_reviewed_notices.py')
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        notice = json.loads((ROOT / 'data/notices/tyrannoeil.json').read_text(encoding='utf-8'))
        digest = hashlib.sha256(json.dumps(notice, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode('utf-8')).hexdigest()
        notice['description'] += ' Texte ajouté après relecture.'
        selected, errors = module.select_reviewed({'tyrannoeil': notice}, ['tyrannoeil'], {'tyrannoeil': digest})
        self.assertEqual(selected, {})
        self.assertTrue(any('modifiée' in e for e in errors))

    def test_invalid_or_empty_approval_cannot_publish(self):
        spec = importlib.util.spec_from_file_location('reviewed', ROOT / 'tools/build_reviewed_notices.py')
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        notice = json.loads((ROOT / 'data/notices/tyrannoeil.json').read_text(encoding='utf-8'))
        cases = [
            ({'tyrannoeil': notice}, {}, 'empty'),
            ({'tyrannoeil': notice}, [], 'wrong manifest type'),
            ({}, {'tyrannoeil': 'a' * 64}, 'missing notice'),
            ({'tyrannoeil': notice}, {'unknown': 'a' * 64}, 'unknown slug'),
            ({'tyrannoeil': {}}, {'tyrannoeil': module.notice_digest({})}, 'invalid structure'),
        ]
        for notices, approvals, label in cases:
            with self.subTest(label=label):
                selected, errors = module.select_reviewed(notices, ['tyrannoeil'], approvals)
                self.assertEqual(selected, {})
                self.assertTrue(errors)

    def test_publish_writes_only_reviewed_content_and_preserves_on_failure(self):
        spec = importlib.util.spec_from_file_location('reviewed', ROOT / 'tools/build_reviewed_notices.py')
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        notice = json.loads((ROOT / 'data/notices/tyrannoeil.json').read_text(encoding='utf-8'))
        approvals = {'tyrannoeil': module.notice_digest(notice)}
        with tempfile.TemporaryDirectory() as directory:
            destination = Path(directory) / 'notices.js'
            result = module.publish_reviewed({'tyrannoeil': notice, 'zombie': {}}, ['tyrannoeil', 'zombie'], approvals, destination)
            self.assertEqual(result['errors'], [])
            text = destination.read_text(encoding='utf-8')
            payload = json.loads(text.split('window.FF_NOTICES = ', 1)[1].rstrip(';\n'))
            self.assertEqual(list(payload), ['tyrannoeil'])
            notice['description'] += ' Changement non relu.'
            result = module.publish_reviewed({'tyrannoeil': notice}, ['tyrannoeil'], approvals, destination)
            self.assertTrue(result['errors'])
            self.assertEqual(destination.read_text(encoding='utf-8'), text)

    def test_cli_check_does_not_change_bundle(self):
        spec = importlib.util.spec_from_file_location('reviewed', ROOT / 'tools/build_reviewed_notices.py')
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        notice = json.loads((ROOT / 'data/notices/tyrannoeil.json').read_text(encoding='utf-8'))
        with tempfile.TemporaryDirectory() as directory:
            manifest = Path(directory) / 'reviewed.json'
            destination = Path(directory) / 'notices.js'
            manifest.write_text(json.dumps({'tyrannoeil': module.notice_digest(notice)}), encoding='utf-8')
            destination.write_text('original bundle', encoding='utf-8')
            self.assertEqual(module.main(['--manifest', str(manifest), '--output', str(destination), '--check']), 0)
            self.assertEqual(destination.read_text(encoding='utf-8'), 'original bundle')


if __name__ == '__main__':
    unittest.main()
