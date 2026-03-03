import pandas as pd

# Load the Excel file
file_path = r'c:\Users\wild-sis\Documents\MI REPOSITORIO\HOJA_DE_RUTA\SUPABASE\ANALIZAR\convalidaciones.xlsx'

try:
    df = pd.read_excel(file_path)
    print(f"Headers: {df.columns.tolist()}")
    for i in range(min(10, len(df))):
        print(f"Row {i}: {df.iloc[i].tolist()}")
except Exception as e:
    print(f"ERROR: {e}")
