import csv
import yaml
from pathlib import Path

csv_path = Path("/Users/jacobbertilsson/Documents/NUXT Apps/saas-3/storage/skogsbruk_svampar_5feb.csv")
yaml_path = csv_path.with_suffix(".yml")

def to_number(value: str):
    value = value.strip()
    # empty stays empty
    if value == "":
        return value
    # try int
    try:
        i = int(value)
        return i
    except ValueError:
        pass
    # try float
    try:
        f = float(value)
        return f
    except ValueError:
        pass
    # otherwise keep as string
    return value

with csv_path.open(encoding="utf-8-sig") as f:
    reader = csv.DictReader(f)
    rows = []
    for row in reader:
        converted = {k: to_number(v) for k, v in row.items()}
        rows.append(converted)

with yaml_path.open("w", encoding="utf-8") as f:
    yaml.dump(rows, f, allow_unicode=True, sort_keys=False)

print(f"Written to {yaml_path}")