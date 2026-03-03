import pandas as pd
import json
import os
import numpy as np

def extract_excel_data(file_path):
    try:
        if not os.path.exists(file_path):
            print(f"Error: File not found at {file_path}")
            return

        # Read the Excel file
        df = pd.read_excel(file_path)
        
        # Replace NaN with None for valid JSON null
        df = df.replace({np.nan: None})
        
        # Convert to list of lists
        data = df.values.tolist()
        columns = df.columns.tolist()
        
        result = {
            "columns": columns,
            "data": data
        }
        
        output_path = "temp_excel_output.json"
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(result, f, indent=2)
        print(f"Success: Written to {output_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    extract_excel_data(r"c:\Users\chuturubi\Documents\REPOSITORIO\HOJA_DE_RUTA\SUPABASE\ANALIZAR\convalidaciones.xlsx")
