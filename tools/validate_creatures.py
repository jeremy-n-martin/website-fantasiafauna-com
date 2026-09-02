# -*- coding: utf-8 -*-
from pathlib import Path
import json

root = Path(__file__).resolve().parents[1]
text = (root / "js" / "creatures-data.js").read_text(encoding="utf-8")
start = text.index("{")
end = text.rindex("}") + 1
data = json.loads(text[start:end])
creatures = data["creatures"]
slugs = [c["slug"] for c in creatures]
missing = []
for creature in creatures:
    for image in creature["images"]:
        for key in ("src", "thumb"):
            path = root / image[key]
            if not path.is_file():
                missing.append(image[key])

print("creatures", len(creatures))
print("unique_slugs", len(set(slugs)))
print("thumbs", len(list((root / "thumbs").glob("*.png"))))
print("missing", len(missing))
print("apostrophe", [c["name"] for c in creatures if "'" in c["name"]])
