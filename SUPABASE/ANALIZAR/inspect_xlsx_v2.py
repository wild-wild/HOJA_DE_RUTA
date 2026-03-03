import pandas as pd
import json

# Load the Excel file
file_path = r'c:\Users\wild-sis\Documents\MI REPOSITORIO\HOJA_DE_RUTA\SUPABASE\ANALIZAR\convalidaciones.xlsx'

try:
    df = pd.read_excel(file_path)
    
    # Map columns based on the structure in app.js:
    # [siglaAnt, nombreAnt, semAnt, siglaNueva, nombreNueva, semNuevo, tipo, orden]
    
    # Headers found (partially): ['ORDEN', 'SIGLA', 'ASIGNATURA', 'SEMESTRE', 'SIGLA', 'ASIGNATURA', 'SEMESTRE', 'TIPO']
    # Wait, there might be duplicate headers. Let's list them properly.
    
    headers = df.columns.tolist()
    print(f"Headers: {headers}")
    
    # Let's assume the columns are in order:
    # ORDEN, SIGLA_ANT, NOMBRE_ANT, SEM_ANT, SIGLA_NUEVA, NOMBRE_NUEVA, SEM_NUEVA, TIPO
    # But wait, looking at app.js documentation:
    # [siglaAnt, nombreAnt, semAnt, siglaNueva, nombreNueva, semNuevo, tipo, orden]
    
    rows = []
    for index, row in df.iterrows():
        # Handle NaN values
        r = [str(x) if pd.notna(x) else "" for x in row]
        
        # Based on app.js order: [siglaAnt, nombreAnt, semAnt, siglaNueva, nombreNueva, semNuevo, tipo, orden]
        # Let's try to map them. 
        # I'll print the first row to be sure.
        if index == 0:
            print(f"Row 0: {r}")
        
except Exception as e:
    print(f"ERROR: {e}")
