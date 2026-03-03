import json
import os

def patch_data_js():
    try:
        # Read JSON data
        with open('temp_excel_output.json', 'r', encoding='utf-8') as f:
            excel_data = json.load(f)['data']
        
        # Format the CONVALIDACIONES entries
        new_entries = []
        for row in excel_data:
            if not any(row): continue
            
            def clean(val):
                if val is None: return ""
                if isinstance(val, (int, float)):
                    if val == int(val): return int(val)
                    return val
                return str(val).strip()

            sigla_ant = clean(row[1])
            nom_ant = clean(row[2])
            sem_ant = clean(row[3])
            sigla_nue = clean(row[4])
            nom_nue = clean(row[5])
            sem_nue = clean(row[6])
            obs = clean(row[7])
            orden = clean(row[0])
            
            if not sigla_ant and not sigla_nue: continue
            if sigla_ant == "SIGLA": continue

            entry = [sigla_ant, nom_ant, sem_ant, sigla_nue, nom_nue, sem_nue, obs, orden]
            new_entries.append(entry)
        
        # Read original data.js to preserve other exports
        with open('data.js', 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        # Find the start and end of CONVALIDACIONES array
        start_idx = -1
        end_idx = -1
        for i, line in enumerate(lines):
            if 'export const CONVALIDACIONES = [' in line:
                start_idx = i
            if start_idx != -1 and '];' in line and i > start_idx:
                end_idx = i
                break
        
        if start_idx == -1 or end_idx == -1:
            print("Error: Could not find CONVALIDACIONES in data.js")
            return

        # Construct new data.js
        new_lines = lines[:start_idx + 1]
        for entry in new_entries:
            new_lines.append(f"    {json.dumps(entry, ensure_ascii=False)},\n")
        new_lines.extend(lines[end_idx:])
        
        # Write back to data.js
        with open('data.js', 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
            
        print(f"Success: Updated data.js with {len(new_entries)} entries.")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    patch_data_js()
