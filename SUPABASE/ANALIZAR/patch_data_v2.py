import json
import os

def patch_data_js():
    try:
        base_path = r"c:\Users\chuturubi\Documents\REPOSITORIO\HOJA_DE_RUTA\SUPABASE\ANALIZAR"
        json_path = os.path.join(base_path, "temp_excel_output.json")
        js_path = os.path.join(base_path, "data.js")
        
        # Read JSON data
        with open(json_path, 'r', encoding='utf-8') as f:
            excel_data = json.load(f)['data']
        
        # Format the entry exactly like data.js
        # entry example: ["ANT100", "ANTROPOLOGÍA CULTURAL", "PRIMER SEMESTRE", "ANT 181", "ANTROPOLOGÍA", "PRIMER SEMESTRE", "HOMOLOGACIÓN", 4]
        
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
        
        # Read original data.js
        with open(js_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        lines = content.splitlines(True)
        
        start_idx = -1
        end_idx = -1
        for i, line in enumerate(lines):
            if 'export const CONVALIDACIONES = [' in line:
                start_idx = i
            if start_idx != -1 and '];' in line and i > start_idx:
                end_idx = i
                break
        
        if start_idx == -1 or end_idx == -1:
            print("Error: Could not find CONVALIDACIONES array markers.")
            return

        # Construct new content
        new_lines = lines[:start_idx + 1]
        for entry in new_entries:
            # Use json.dumps to handle quotes and unicode
            line_str = f"    {json.dumps(entry, ensure_ascii=False)},\n"
            new_lines.append(line_str)
        new_lines.extend(lines[end_idx:])
        
        # Final output content
        final_content = "".join(new_lines)
        
        # Use temp file and rename to avoid corruption
        temp_path = js_path + ".tmp"
        with open(temp_path, 'w', encoding='utf-8') as f:
            f.write(final_content)
        
        os.replace(temp_path, js_path)
            
        print(f"Success: Patched {len(new_entries)} entries into {js_path}")
        
    except Exception as e:
        import traceback
        print(f"Error: {e}")
        print(traceback.format_exc())

if __name__ == "__main__":
    patch_data_js()
