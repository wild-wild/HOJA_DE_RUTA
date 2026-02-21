from flask import Flask, render_template, jsonify
import pandas as pd
import math
import os

app = Flask(__name__)

EXCEL_PATH = os.path.join(os.path.dirname(__file__), 'estudiantes.xlsx')

def limpiar_valor(val):
    """Convierte NaN a None para JSON, preserva todo lo demás."""
    if isinstance(val, float) and math.isnan(val):
        return None
    if isinstance(val, (int, float)):
        return val
    return str(val) if val is not None else None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/estudiantes')
def get_estudiantes():
    try:
        df = pd.read_excel(EXCEL_PATH)

        # Primeras 5 columnas son info del estudiante, el resto son materias
        COLUMNAS_INFO = ['Registro', 'Nombre', 'Fec_ingreso', 'Niv_min', 'Mat_venc']
        columnas_materias = [c for c in df.columns if c not in COLUMNAS_INFO]

        estudiantes = []
        for _, row in df.iterrows():
            # Guardar TODOS los campos tal cual están en el Excel
            doc = {}
            for col in df.columns:
                doc[str(col)] = limpiar_valor(row[col])

            # Campos adicionales de resumen (para la UI)
            aprobadas = {
                str(m): float(row[m])
                for m in columnas_materias
                if not (isinstance(row[m], float) and math.isnan(row[m])) and row[m] is not None
            }
            pendientes = [
                str(m) for m in columnas_materias
                if (isinstance(row[m], float) and math.isnan(row[m])) or row[m] is None
            ]
            total_mat = len(columnas_materias)
            doc['_total_aprobadas']  = len(aprobadas)
            doc['_total_pendientes'] = len(pendientes)
            doc['_total_materias']   = total_mat
            doc['_porcentaje_avance'] = (
                round(len(aprobadas) / total_mat * 100, 1) if total_mat > 0 else 0
            )

            estudiantes.append(doc)

        return jsonify({
            'success': True,
            'total': len(estudiantes),
            'columnas': list(df.columns),
            'columnas_materias': columnas_materias,
            'estudiantes': estudiantes
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/resumen')
def get_resumen():
    try:
        df = pd.read_excel(EXCEL_PATH)
        COLUMNAS_INFO = ['Registro', 'Nombre', 'Fec_ingreso', 'Niv_min', 'Mat_venc']
        columnas_materias = [c for c in df.columns if c not in COLUMNAS_INFO]
        return jsonify({
            'success': True,
            'total_estudiantes': len(df),
            'total_columnas': len(df.columns),
            'total_materias': len(columnas_materias),
            'columnas': list(df.columns),
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    print("🚀 Servidor iniciado en http://localhost:5000")
    app.run(debug=True, port=5000)
