import json

# Data from data.js
data_js_siglas = [
    "ANT100", "BIO100", "CSO101", "DEP112", "EST121", "FIL101", "PSI101",
    "ANT150", "BIO150", "CSO150", "EST152", "FIL150", "PSI150",
    "BIO200", "CSO200", "CSO201", "INV200", "PSI200", "PSI202", "PSI203",
    "BIO250", "CSO250", "INV250", "PSI254", "PSI255", "PSI256",
    "CSO300", "INV300", "PSI310", "PSI311", "PSI312", "PSI313",
    "CSO350", "INV350", "PSI350", "PSI351", "PSI352", "PSI353", "PSI354",
    "CSO400", "CSO401", "INV400", "PSI400", "PSI401", "PSI402",
    "CSO450", "CSO451", "INV450", "PSI450", "PSI451", "PSI452",
    "DEP500", "INV500", "INV501", "INV502", "CSO452", "CSO453", "CSO454",
    "PSI500", "PSI501", "PSI502", "PSI600", "PSI601", "PSI602",
    "PSI700", "PSI701", "PSI702", "DEP501", "CSO455", "CSO456", "CSO457",
    "PSI503", "PSI504", "PSI505", "PSI603", "PSI604", "PSI605",
    "PSI703", "PSI704", "PSI705",
    "DEP012", "INF151", "ANT201", "ANT301", "ANT302", "ANT304", "CSA202", "CSA203", "CSA301", "EPS203",
    "PSI552", "PSI553", "PSI554", "PSI555", "PSI556", "PSI557",
    "DEP113", "INF152", "PSI558", "PSI559", "PSI560", "PSI561", "PSI562", "PSI563", "PSI564", "PSI565", "PSI566", "PSI567", "PSI568", "PSI569",
    "SCA204", "SCA205", "SUI201", "SUI302", "INFORME"
]

def find_discrepancies():
    try:
        with open("temp_excel_output.json", "r", encoding="utf-8") as f:
            excel_data = json.load(f)
        
        excel_rows = excel_data["data"]
        missing = []
        
        js_siglas_set = set(data_js_siglas)
        
        for row in excel_rows:
            if len(row) < 3: continue
            sigla = row[1]
            if not isinstance(sigla, str): continue
            
            if sigla not in js_siglas_set:
                missing.append({
                    "sigla": sigla,
                    "nombre": row[2],
                    "semestre": row[3],
                    "obs": row[7] if len(row) > 7 else ""
                })
        
        # Also check if anything in data.js is NOT in Excel
        excel_siglas_set = set(row[1] for row in excel_rows if len(row) > 1 and isinstance(row[1], str))
        extra_in_js = [s for s in data_js_siglas if s not in excel_siglas_set]

        result = {
            "missing_from_js": missing,
            "extra_in_js": extra_in_js
        }
        
        with open("comparison_result.json", "w", encoding="utf-8") as f:
            json.dump(result, f, indent=2)
        print("Success: Results written to comparison_result.json")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    find_discrepancies()
