import pandas as pd
import os

file_path = r'c:\Users\wild-sis\Documents\MI REPOSITORIO\HOJA_DE_RUTA\SUPABASE\ANALIZAR\convalidaciones.xlsx'
if os.path.exists(file_path):
    df = pd.read_excel(file_path, header=None)
    print(df.head(10).to_string())
else:
    print(f"File not found: {file_path}")
