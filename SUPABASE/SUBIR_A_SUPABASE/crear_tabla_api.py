"""
Crea la tabla 'estudiantes' en Supabase usando la Management API (HTTPS).
No requiere habilitar IPs ni acceso al puerto 5432.

Uso: python crear_tabla_api.py TU_ACCESS_TOKEN
  El access token se obtiene en: https://supabase.com/dashboard/account/tokens
"""
import sys
import subprocess
import json

PROJECT_REF  = 'kylsbkxxpsntlhhsdqgw'
API_ENDPOINT = f'https://api.supabase.com/v1/projects/{PROJECT_REF}/database/query'

SQL = """
CREATE TABLE IF NOT EXISTS public.estudiantes (
    registro            TEXT        PRIMARY KEY,
    nombre              TEXT,
    fec_ingreso         TEXT,
    niv_min             TEXT,
    mat_venc            TEXT,
    total_aprobadas     INTEGER,
    total_pendientes    INTEGER,
    total_materias      INTEGER,
    porcentaje_avance   NUMERIC,
    materias            JSONB DEFAULT '{}'::jsonb,
    timestamp_subida    TEXT
);

ALTER TABLE public.estudiantes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'estudiantes' AND policyname = 'acceso_publico'
    ) THEN
        CREATE POLICY "acceso_publico"
            ON public.estudiantes
            FOR ALL
            USING (true)
            WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND tablename = 'estudiantes'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.estudiantes;
    END IF;
END $$;
"""

def instalar_requests():
    subprocess.check_call(
        [sys.executable, "-m", "pip", "install", "requests", "-q"],
        stdout=subprocess.DEVNULL
    )

def main():
    try:
        import requests
    except ImportError:
        instalar_requests()
        import requests

    print("\n" + "=" * 60)
    print("  Crear tabla 'estudiantes' en Supabase (via API)")
    print("=" * 60)
    print("\n  Necesitas un Personal Access Token de Supabase.")
    print("  Obtenerlo en:")
    print("  https://supabase.com/dashboard/account/tokens\n")

    token = input("  🔑 Access Token: ").strip()

    if not token:
        print("❌ Token vacío.")
        sys.exit(1)

    print("\n  ⏳ Ejecutando SQL en Supabase...")

    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
    }
    payload = {'query': SQL}

    try:
        resp = requests.post(API_ENDPOINT, headers=headers, json=payload, timeout=30)

        if resp.status_code in (200, 201):
            print("\n  ✅ Tabla 'estudiantes' creada correctamente")
            print("  ✅ Row Level Security habilitada")
            print("  ✅ Realtime habilitado")
            print("\n  🚀 Listo! Abre http://localhost:5000 y sube los datos.\n")
        elif resp.status_code == 401:
            print("\n❌ Token inválido o expirado. Genera uno nuevo en:")
            print("   https://supabase.com/dashboard/account/tokens")
        elif resp.status_code == 403:
            print("\n❌ Sin permisos. Asegúrate de usar el token del owner del proyecto.")
        else:
            print(f"\n❌ Error {resp.status_code}: {resp.text}")
    except Exception as e:
        print(f"\n❌ Error de red: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
