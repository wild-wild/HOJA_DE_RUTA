"""
Script para crear la tabla 'estudiantes' en Supabase con Realtime habilitado.
Requiere: psycopg2-binary  (se instala automáticamente si falta)

Uso: python crear_tabla.py
     (te pedirá la contraseña en pantalla)
"""
import sys
import subprocess

PROJECT_REF = 'kylsbkxxpsntlhhsdqgw'
DB_HOST     = f'db.{PROJECT_REF}.supabase.co'

SQL = """
-- 1. Crear tabla
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

-- 2. Habilitar Row Level Security
ALTER TABLE public.estudiantes ENABLE ROW LEVEL SECURITY;

-- 3. Política de acceso total (para carga masiva interna)
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

-- 4. Habilitar Realtime en la tabla
ALTER PUBLICATION supabase_realtime ADD TABLE public.estudiantes;
"""

def instalar_psycopg2():
    print("  ⏳ Instalando psycopg2-binary...")
    subprocess.check_call(
        [sys.executable, "-m", "pip", "install", "psycopg2-binary", "-q"],
        stdout=subprocess.DEVNULL
    )
    print("  ✅ psycopg2-binary instalado")

def main():
    try:
        import psycopg2
    except ImportError:
        instalar_psycopg2()
        import psycopg2

    print("\n" + "=" * 55)
    print("  Crear tabla 'estudiantes' en Supabase + Realtime")
    print("=" * 55)
    print("\n  Obtén la contraseña en Supabase:")
    print("  Project Settings → Database → Database password\n")

    password = input("  🔑 Contraseña de la BD: ").strip()

    if not password:
        print("❌ Contraseña vacía. Abortando.")
        sys.exit(1)

    print(f"\n  ⏳ Conectando a {DB_HOST}...")

    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=5432,
            dbname="postgres",
            user="postgres",
            password=password,
            connect_timeout=15,
            sslmode="require"
        )
        conn.autocommit = True
        print("  ✅ Conectado")

        cur = conn.cursor()
        cur.execute(SQL)
        cur.close()
        conn.close()

        print("\n  ✅ Tabla 'estudiantes' creada")
        print("  ✅ Row Level Security habilitada")
        print("  ✅ Política de acceso creada")
        print("  ✅ Realtime habilitado en la tabla")
        print("\n  🚀 Listo! Abre http://localhost:5000 y sube los datos.\n")

    except psycopg2.OperationalError as e:
        print(f"\n❌ No se pudo conectar:\n   {e}")
        print("\n  Verifica:")
        print("  1. Contraseña correcta (Project Settings → Database)")
        print("  2. Si hay error de IP → ve a Project Settings → Database")
        print("     → Network → Add your IP Address")
        sys.exit(1)
    except Exception as e:
        # Si Realtime ya estaba habilitado, no es error crítico
        if 'already' in str(e).lower() or 'duplicate' in str(e).lower():
            print(f"\n  ℹ️  Nota: {e}")
            print("  ✅ Todo OK (Realtime ya estaba activado)")
        else:
            print(f"\n❌ Error SQL: {e}")
            sys.exit(1)

if __name__ == '__main__':
    main()
