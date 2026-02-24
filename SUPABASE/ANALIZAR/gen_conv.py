import json
with open(r'c:\Users\wild-sis\Desktop\conv_con_orden.json', encoding='utf-8') as f:
    rows = json.load(f)

lines = []
for r in rows:
    orden = r[0]; sigla=str(r[1]); nombre=str(r[2]); sem=str(r[3])
    sn=str(r[4] or ''); nn=str(r[5] or ''); snu=str(r[6] or ''); tipo=str(r[7])
    ov = str(orden) if orden is not None else 'null'
    # escape quotes
    nombre = nombre.replace('"', '\\"')
    nn = nn.replace('"', '\\"')
    lines.append(f'  ["{sigla}","{nombre}","{sem}","{sn}","{nn}","{snu}","{tipo}",{ov}],')

out = '\n'.join(lines)
with open(r'c:\Users\wild-sis\Desktop\Python Desarrollos\HOJA_DE_RUTA\ANALIZAR\conv_lines.txt', 'w', encoding='utf-8') as f:
    f.write(out)
print(f'OK: {len(lines)} filas')
print(lines[0])
print(lines[7])
