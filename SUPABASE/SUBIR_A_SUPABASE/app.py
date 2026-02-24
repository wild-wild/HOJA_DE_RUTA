from flask import Flask, render_template, jsonify, request, send_from_directory
import pandas as pd
import math
import os
import requests as http_requests

app = Flask(__name__)

ANALIZAR_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'ANALIZAR'))

EXCEL_PATH    = os.path.join(os.path.dirname(__file__), 'estudiantes.xlsx')
SUPABASE_URL  = 'https://kylsbkxxpsntlhhsdqgw.supabase.co'
SUPABASE_KEY  = 'sb_secret_cm-Upc0-u985Sz6wFpIZmA_79tV6h95'   # secret key (solo en servidor)
SUPABASE_HEADERS = {
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'resolution=merge-duplicates',   # upsert por conflict en 'registro'
}

@app.route('/analizar')
@app.route('/analizar/analizar.html')
def analizar_index():
    """Sirve la app de análisis de estudiantes desde Supabase."""
    return send_from_directory(ANALIZAR_DIR, 'analizar.html')

@app.route('/analizar/<path:nombre>')
def analizar_static(nombre):
    """Sirve archivos estáticos (app.js, estilos.css, etc.) del ANALIZAR."""
    return send_from_directory(ANALIZAR_DIR, nombre)


COLUMNAS_INFO = ['Registro', 'Nombre', 'Fec_ingreso', 'Niv_min', 'Mat_venc']


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
        columnas_materias = [c for c in df.columns if c not in COLUMNAS_INFO]

        estudiantes = []
        for _, row in df.iterrows():
            doc = {}
            for col in df.columns:
                doc[str(col)] = limpiar_valor(row[col])

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
            doc['_total_aprobadas']   = len(aprobadas)
            doc['_total_pendientes']  = len(pendientes)
            doc['_total_materias']    = total_mat
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


@app.route('/api/subir', methods=['POST'])
def subir_estudiantes():
    """
    Recibe una lista de estudiantes en JSON y los sube a Supabase via upsert.
    El upsert usa la secret key de forma segura en el servidor.
    """
    try:
        body = request.get_json()
        estudiantes = body.get('estudiantes', [])
        columnas_materias = set(body.get('columnas_materias', []))

        if not estudiantes:
            return jsonify({'success': False, 'error': 'Lista vacía'}), 400

        # Construir registros en el formato de la tabla Supabase
        registros = []
        for e in estudiantes:
            materias = {}
            for k, v in e.items():
                if str(k) in columnas_materias:
                    materias[str(k)] = v

            row = {
                'registro':          str(e.get('Registro') or e.get('registro') or ''),
                'nombre':            e.get('Nombre') or e.get('nombre'),
                'fec_ingreso':       str(e.get('Fec_ingreso') or e.get('fec_ingreso') or ''),
                'niv_min':           str(e.get('Niv_min') or e.get('niv_min') or ''),
                'mat_venc':          e.get('Mat_venc') or e.get('mat_venc'),
                'total_aprobadas':   e.get('_total_aprobadas', 0),
                'total_pendientes':  e.get('_total_pendientes', 0),
                'total_materias':    e.get('_total_materias', 0),
                'porcentaje_avance': e.get('_porcentaje_avance', 0),
                'materias':          materias,
                'timestamp_subida':  body.get('timestamp'),
            }
            registros.append(row)

        # Upsert a Supabase (en lote)
        url = f'{SUPABASE_URL}/rest/v1/estudiantes'
        resp = http_requests.post(url, headers=SUPABASE_HEADERS, json=registros, timeout=30)

        if resp.status_code in (200, 201):
            return jsonify({'success': True, 'total': len(registros)})
        else:
            return jsonify({'success': False, 'error': resp.text, 'status': resp.status_code}), 500

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/resumen')
def get_resumen():
    try:
        df = pd.read_excel(EXCEL_PATH)
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
