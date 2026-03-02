-- Agregar columnas para guardar las selecciones de inscripción G1/G2
ALTER TABLE public.estudiantes
  ADD COLUMN IF NOT EXISTS gestion1_2026 JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS gestion2_2026 JSONB DEFAULT '[]'::jsonb;
