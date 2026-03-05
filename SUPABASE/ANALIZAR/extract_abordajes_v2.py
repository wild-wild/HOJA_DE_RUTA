import pandas as pd
import json
import os

file_path = r'c:\Users\wild-sis\Documents\MI REPOSITORIO\HOJA_DE_RUTA\SUPABASE\ANALIZAR\convalidaciones.xlsx'
if os.path.exists(file_path):
    # Read with header at index 1
    df = pd.read_excel(file_path, header=1)
    
    # Filter for ABORDAJE in any column
    mask = df.astype(str).apply(lambda x: x.str.contains('ABORDAJE', case=False, na=False)).any(axis=1)
    abordajes = df[mask]
    
    # Filter for s/n in SEM. column (column index 2 or 5)
    sn_rows = df[df.iloc[:, 2].astype(str).str.contains('s/n', na=False) | 
                 df.iloc[:, 5].astype(str).str.contains('s/n', na=False)]
    
    print("Abordajes found:", len(abordajes))
    print(json.dumps(abordajes.values.tolist(), indent=2))
    print("\ns/n rows found:", len(sn_rows))
    print(json.dumps(sn_rows.values.tolist()[:10], indent=2)) # Show first 10
else:
    print(f"File not found: {file_path}")
