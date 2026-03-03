import pandas as pd

# Load the Excel file
file_path = r'c:\Users\wild-sis\Documents\MI REPOSITORIO\HOJA_DE_RUTA\SUPABASE\ANALIZAR\convalidaciones.xlsx'

try:
    df = pd.read_excel(file_path)
    print("--- HEADERS ---")
    print(df.columns.tolist())
    print("\n--- FIRST 5 ROWS ---")
    print(df.head().to_string())
    print("\n--- DATA TYPES ---")
    print(df.dtypes)
except Exception as e:
    print(f"ERROR: {e}")
