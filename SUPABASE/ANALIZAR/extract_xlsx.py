import pandas as pd
import math

# File paths
xlsx_path = r'c:\Users\wild-sis\Documents\MI REPOSITORIO\HOJA_DE_RUTA\SUPABASE\ANALIZAR\convalidaciones.xlsx'
out_path = r'c:\Users\wild-sis\Documents\MI REPOSITORIO\HOJA_DE_RUTA\SUPABASE\ANALIZAR\conv_lines.txt'

def clean_val(val):
    if pd.isna(val):
        return ""
    return str(val).strip().replace('"', '\\"')

def clean_orden(val):
    if pd.isna(val):
        return "null"
    try:
        return str(int(float(val)))
    except:
        return "null"

try:
    df = pd.read_excel(xlsx_path)
    
    # Expected columns: ORDEN, SIGLA_ANT, NOMBRE_ANT, SEM_ANT, SIGLA_NUEVA, NOMBRE_NUEVA, SEM_NUEVA, TIPO
    # app.js order: [siglaAnt, nombreAnt, semAnt, siglaNueva, nombreNueva, semNuevo, tipo, orden]
    
    lines = []
    for index, row in df.iterrows():
        vals = row.tolist()
        
        orden = clean_orden(vals[0])
        sigla_ant = clean_val(vals[1])
        nombre_ant = clean_val(vals[2])
        sem_ant = clean_val(vals[3])
        sigla_nueva = clean_val(vals[4])
        nombre_nueva = clean_val(vals[5])
        sem_nueva = clean_val(vals[6])
        tipo = clean_val(vals[7])
        
        # Skip empty rows if needed (must have at least one side)
        if not (sigla_ant or nombre_ant) and not (sigla_nueva or nombre_nueva):
            continue
            
        line = f'  ["{sigla_ant}", "{nombre_ant}", "{sem_ant}", "{sigla_nueva}", "{nombre_nueva}", "{sem_nueva}", "{tipo}", {orden}],'
        lines.append(line)
    
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
        
    print(f"OK: Processed {len(lines)} rows.")
    if lines:
        print(f"Sample: {lines[0]}")
        
except Exception as e:
    print(f"ERROR: {e}")
