import json
import os

base = r"c:\Users\chuturubi\Documents\REPOSITORIO\HOJA_DE_RUTA\SUPABASE\ANALIZAR"
with open(os.path.join(base, "temp_excel_output.json"), "r", encoding="utf-8") as f:
    data = json.load(f)["data"]

out = []
for r in data:
    if not any(r): continue
    if r[1] == "SIGLA": continue
    entry = [r[1] or "", r[2] or "", r[3] or "", r[4] or "", r[5] or "", r[6] or "", r[7] or "", r[0] or 0]
    out.append(f"    {json.dumps(entry, ensure_ascii=False)},")

with open(os.path.join(base, "array_only.txt"), "w", encoding="utf-8") as f:
    f.write("\n".join(out))
print("Done")
