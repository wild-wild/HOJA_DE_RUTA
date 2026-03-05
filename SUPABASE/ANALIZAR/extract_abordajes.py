import pandas as pd
import json
import os

file_path = r'c:\Users\wild-sis\Documents\MI REPOSITORIO\HOJA_DE_RUTA\SUPABASE\ANALIZAR\convalidaciones.xlsx'
if os.path.exists(file_path):
    df = pd.read_excel(file_path)
    print("Columns:", df.columns.tolist())
    # Try case-insensitive column search if names differ
    sigla_ant_col = next((c for c in df.columns if 'sigla' in c.lower() and 'ant' in c.lower()), df.columns[0])
    nombre_ant_col = next((c for c in df.columns if 'materia' in c.lower() and 'ant' in c.lower()), df.columns[1])
    sigla_nueva_col = next((c for c in df.columns if 'sigla' in c.lower() and ('nueva' in c.lower() or 'nuevo' in c.lower())), df.columns[3])
    nombre_nueva_col = next((c for c in df.columns if 'materia' in c.lower() and ('nueva' in c.lower() or 'nuevo' in c.lower())), df.columns[4])
    
    abordajes = df[df[sigla_ant_col].astype(str).str.contains('ABORDAJE', na=False, case=False) | 
                   df[nombre_ant_col].astype(str).str.contains('ABORDAJE', na=False, case=False) |
                   df[sigla_nueva_col].astype(str).str.contains('ABORDAJE', na=False, case=False) |
                   df[nombre_nueva_col].astype(str).str.contains('ABORDAJE', na=False, case=False)]
    
    print("Abordajes found:", len(abordajes))
    print(json.dumps(abordajes.values.tolist(), indent=2))
else:
    print(f"File not found: {file_path}")
