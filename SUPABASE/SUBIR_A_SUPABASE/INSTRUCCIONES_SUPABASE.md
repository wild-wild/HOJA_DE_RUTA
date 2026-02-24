# Instrucciones para subir estudiantes a Supabase

## 1. Crear la tabla en Supabase

1. Ir a [Supabase Dashboard](https://supabase.com/dashboard/project/kylsbkxxpsntlhhsdqgw)
2. Clic en **SQL Editor** → **New query**
3. Pegar y ejecutar el contenido de `crear_tabla_supabase.sql`

## 2. Verificar la API Key

La clave en `config-supabase.js` debe ser la **anon/public key** del proyecto.
Ve a: **Project Settings → API → Project API keys → anon public**

Si la clave actual no funciona (empieza con `sb_publishable_...`), cópiala de ahí
y actualiza esta línea en `templates/index.html`:

```js
const SUPABASE_KEY = 'TU_ANON_KEY_AQUI';
```

## 3. Arrancar la app Flask

```bash
cd SUPABASE/SUBIR_A_SUPABASE
pip install flask pandas openpyxl
python app.py
```

Abre http://localhost:5000

## 4. Usar la app

1. Clic **"Cargar Excel"** → carga y muestra los estudiantes
2. Clic **"⚡ Subir a Supabase"** → sube en lotes de 50 (upsert)
3. Cada fila muestra el estado: Pendiente → Subiendo → Guardado

## Nota sobre columnas dinámicas del Excel

Las columnas de materias del Excel se guardan tal cual en Supabase.
Si el Excel cambia de estructura, simplemente vuelve a ejecutar la subida
(upsert actualiza los registros existentes por `registro`).
