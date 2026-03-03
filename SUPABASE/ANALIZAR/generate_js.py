import json
import traceback

def generate_js_array():
    try:
        with open('temp_excel_output.json', 'r', encoding='utf-8') as f:
            data_obj = json.load(f)
            excel_data = data_obj['data']
        
        js_lines = []
        
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

            line = f'    [{json.dumps(sigla_ant)}, {json.dumps(nom_ant)}, {json.dumps(sem_ant)}, {json.dumps(sigla_nue)}, {json.dumps(nom_nue)}, {json.dumps(sem_nue)}, {json.dumps(obs)}, {json.dumps(orden)}],'
            js_lines.append(line)
        
        with open('generated_array.js', 'w', encoding='utf-8') as f:
            f.write('\n'.join(js_lines))
        with open('debug_success.txt', 'w') as f:
            f.write(f"Generated {len(js_lines)} lines.")
            
    except Exception as e:
        with open('debug_error.txt', 'w') as f:
            f.write(str(e))
            f.write("\n")
            f.write(traceback.format_exc())

if __name__ == "__main__":
    generate_js_array()
