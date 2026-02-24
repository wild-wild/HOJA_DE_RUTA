"""
Crea la tabla 'estudiantes' en Supabase via psycopg2.
Prueba múltiples endpoints de conexión automáticamente.

Uso: python crear_tabla_db.py
"""
import sys
import subprocess

PROJECT_REF = 'kylsbkxxpsntlhhsdqgw'
DB_PASSWORD = 'Wasddsawwasd123.'

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
"""

# Intentar múltiples combinaciones de host/puerto
CONEXIONES = [
    # Host directo de Supabase (sintaxis nueva: user = postgres.ref)
    {
        'host': f'aws-0-us-east-1.pooler.supabase.com',
        'port': 5432,
        'user': f'postgres.{PROJECT_REF}',
        'dbname': 'postgres',
        'desc': 'Session Pooler us-east-1:5432 (nuevo formato)',
    },
    {
        'host': f'aws-0-us-east-2.pooler.supabase.com',
        'port': 5432,
        'user': f'postgres.{PROJECT_REF}',
        'dbname': 'postgres',
        'desc': 'Session Pooler us-east-2:5432',
    },
    {
        'host': f'aws-0-us-west-1.pooler.supabase.com',
        'port': 5432,
        'user': f'postgres.{PROJECT_REF}',
        'dbname': 'postgres',
        'desc': 'Session Pooler us-west-1:5432',
    },
    # Host directo clásico
    {
        'host': f'db.{PROJECT_REF}.supabase.co',
        'port': 5432,
        'user': 'postgres',
        'dbname': 'postgres',
        'desc': 'Directo DB:5432 (formato clásico)',
    },
    # Transaction pooler (nuevo formato)
    {
        'host': f'aws-0-us-east-1.pooler.supabase.com',
        'port': 6543,
        'user': f'postgres.{PROJECT_REF}',
        'dbname': 'postgres',
        'desc': 'Transaction Pooler us-east-1:6543',
    },
]

def instalar_psycopg2():
    subprocess.check_call(
        [sys.executable, '-m', 'pip', 'install', 'psycopg2-binary', '-q'],
        stdout=subprocess.DEVNULL
    )

def main():
    try:
        import psycopg2
    except ImportError:
        print('  ⏳ Instalando psycopg2-binary...')
        instalar_psycopg2()
        import psycopg2

    print('\n' + '=' * 60)
    print('  Crear tabla en Supabase (probando conexiones...)')
    print('=' * 60)

    conn = None
    for cfg in CONEXIONES:
        try:
            print(f"\n  ⏳ Probando: {cfg['desc']}")
            conn = psycopg2.connect(
                host=cfg['host'],
                port=cfg['port'],
                dbname=cfg['dbname'],
                user=cfg['user'],
                password=DB_PASSWORD,
                connect_timeout=10,
                sslmode='require',
            )
            print(f"  ✅ ¡Conectado! ({cfg['desc']})")
            break
        except psycopg2.OperationalError as e:
            print(f"     ✗ {str(e).strip()}")
            conn = None

    if conn is None:
        print('\n❌ No se pudo conectar con ningún host.')
        print('\n   → Asegúrate de estar en una red sin restricciones de salida')
        print('   → O ejecuta el SQL manualmente en el SQL Editor de Supabase:')
        print(f'   https://supabase.com/dashboard/project/{PROJECT_REF}/sql/new')
        sys.exit(1)

    try:
        conn.autocommit = True
        cur = conn.cursor()
        cur.execute(SQL)
        cur.close()
        conn.close()
        print('\n  ✅ Tabla estudiantes creada correctamente')
        print('  ✅ RLS habilitado + política de acceso creada')
        print('\n  🚀 Ya puedes subir datos desde http://localhost:5000\n')
    except Exception as e:
        print(f'\n❌ Error SQL: {e}')
        sys.exit(1)

if __name__ == '__main__':
    main()
