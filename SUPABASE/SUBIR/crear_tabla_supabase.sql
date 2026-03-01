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
CREATE INDEX IF NOT EXISTS idx_estudiantes_nombre  ON public.estudiantes (nombre);
CREATE INDEX IF NOT EXISTS idx_estudiantes_materias ON public.estudiantes USING GIN (materias);
ALTER TABLE public.estudiantes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "acceso_publico"
    ON public.estudiantes
    FOR ALL
    USING (true)
    WITH CHECK (true);
