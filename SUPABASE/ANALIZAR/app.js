// ============================================================
//  app.js – Hoja de Ruta Académica  (Plan 148)
//  Fuente de datos: Supabase (tabla "estudiantes")
// ============================================================
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://kylsbkxxpsntlhhsdqgw.supabase.co";
const SUPABASE_KEY = "sb_publishable_7KbBls3f9-VlD0uj2ZU2sg_ll3-mJ5_"; // publishable key (solo lectura con RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

// ─────────────────────────────────────────────────────────────
// 1. TABLA DE CONVALIDACIONES  (del Excel convalidaciones.xlsx)
//    [siglaAnt, nombreAnt, semAnt, siglaNueva, nombreNueva, semNuevo, tipo, orden]
// ─────────────────────────────────────────────────────────────
const CONVALIDACIONES = [
  ["ANT100", "ANTROPOLOGÍA CULTURAL", "PRIMER SEMESTRE", "ANT 181", "ANTROPOLOGÍA", "PRIMER SEMESTRE", "HOMOLOGACIÓN", 4],
  ["BIO100", "BIOPSICOLOGIA", "PRIMER SEMESTRE", "BIO 141", "BIOPSICOLOGÍA", "PRIMER SEMESTRE", "HOMOLOGACIÓN", 6],
  ["CSO101", "SOCIOLOGÍA I", "PRIMER SEMESTRE", "CSO 121", "SOCIOLOGÍA GENERAL", "PRIMER SEMESTRE", "HOMOLOGACIÓN", 3],
  ["DEP112", "ESTRATEGIAS DE APRENDIZAJE", "PRIMER SEMESTRE", "INV 131", "ESTRATEGIAS DE APRENDIZAJE", "PRIMER SEMESTRE", "HOMOLOGACIÓN", 7],
  ["EST121", "ESTADÍSTICA I", "PRIMER SEMESTRE", "EST 351", "ESTADÍSTICA APLICADA A LA PSICOLOGÍA I", "TERCER SEMESTRE", "HOMOLOGACIÓN", 2],
  ["FIL101", "FILOSOFÍA", "PRIMER SEMESTRE", "FIL 161", "FILOSOFÍA", "PRIMER SEMESTRE", "HOMOLOGACIÓN", 1],
  ["PSI101", "PSICOLOGÍA I", "PRIMER SEMESTRE", "PSI 105", "PSICOLOGÍA I", "PRIMER SEMESTRE", "HOMOLOGACIÓN", 5],
  ["ANT150", "ANTROPOLOGIA CULTURAL BOLIVIANA", "SEGUNDO SEMESTRE", "", "", "", "ELIMINADA", 4],
  ["BIO150", "PSICOFISIOLOGÍA", "SEGUNDO SEMESTRE", "BIO 242", "PSICOFISIOLOGÍA", "SEGUNDO SEMESTRE", "HOMOLOGACIÓN", 6],
  ["CSO150", "SOCIOLOGÍA II", "SEGUNDO SEMESTRE", "CSO 222", "FORMACIÓN SOCIAL BOLIVIANA", "SEGUNDO SEMESTRE", "HOMOLOGACIÓN", 3],
  ["EST152", "ESTADÍSTICA II", "SEGUNDO SEMESTRE", "EST 452", "ESTADÍSTICA APLICADA A LA PSICOLOGÍA II", "CUARTO SEMESTRE", "HOMOLOGACIÓN", 2],
  ["FIL150", "EPISTEMOLOGIA", "SEGUNDO SEMESTRE", "FIL 262", "EPISTEMOLOGÍA", "SEGUNDO SEMESTRE", "HOMOLOGACIÓN", 1],
  ["PSI150", "PSICOLOGÍA II", "SEGUNDO SEMESTRE", "PSI 212", "PSICOLOGÍA II", "SEGUNDO SEMESTRE", "HOMOLOGACIÓN", 5],
  ["BIO200", "NEUROPSICOLOGÍA I", "TERCER SEMESTRE", "BIO 343", "NEUROPSICOLOGÍA I", "TERCER SEMESTRE", "HOMOLOGACIÓN", 5],
  ["CSO200", "PSICOLOGÍA SOCIAL", "TERCER SEMESTRE", "CSO 525", "PSICOLOGÍA SOCIAL", "QUINTO SEMESTRE", "HOMOLOGACIÓN", 2],
  ["CSO201", "PSICOLOGIA ETNOECOLÓGICA", "TERCER SEMESTRE", "OPT 009", "ETNOPSICOLOGÍA", "ELECTIVA", "HOMOLOGACIÓN", 3],
  ["INV200", "INVESTIGACIÓN I", "TERCER SEMESTRE", "INV 232", "REDACCIÓN CIENTÍFICA", "SEGUNDO SEMESTRE", "HOMOLOGACIÓN", 1],
  ["PSI200", "DESARROLLO HUMANO I", "TERCER SEMESTRE", "PSI 213", "DESARROLLO HUMANO I", "SEGUNDO SEMESTRE", "HOMOLOGACIÓN", 3],
  ["PSI202", "APRENDIZAJE", "TERCER SEMESTRE", "PSI 314", "ANÁLISIS EXPERIMENTAL DE LA CONDUCTA HUMANA", "TERCER SEMESTRE", "CONVALIDACIÓN", 6],
  ["PSI203", "TEORIAS Y SISTEMAS I", "TERCER SEMESTRE", "PSI 314", "ANÁLISIS EXPERIMENTAL DE LA CONDUCTA HUMANA", "TERCER SEMESTRE", "HOMOLOGACIÓN", 4],
  ["BIO250", "NEUROPSICOLOGÍA II", "CUARTO SEMESTRE", "BIO 444", "NEUROPSICOLOGÍA II", "CUARTO SEMESTRE", "HOMOLOGACIÓN", 5],
  ["CSO250", "PSICOLOGÍA GRUPAL Y ORGANIZACIONAL", "CUARTO SEMESTRE", "CSO 524", "PSICOLOGÍA DE LOS GRUPOS", "QUINTO SEMESTRE", "HOMOLOGACIÓN", 2],
  ["INV250", "INVESTIGACIÓN II", "CUARTO SEMESTRE", "INV 232", "REDACCIÓN CIENTÍFICA", "SEGUNDO SEMESTRE", "HOMOLOGACIÓN", 1],
  ["PSI254", "DESARROLLO HUMANO II", "CUARTO SEMESTRE", "PSI 311", "DESARROLLO HUMANO II", "TERCER SEMESTRE", "HOMOLOGACIÓN", 3],
  ["PSI255", "ETOLOGÍA", "CUARTO SEMESTRE", "", "", "", "ELIMINADA", 6],
  ["PSI256", "TEORIAS Y SISTEMAS II", "CUARTO SEMESTRE", "", "", "", "ELIMINADA", 4],
  ["CSO300", "COMPORTAMIENTO Y SOCIEDAD", "QUINTO SEMESTRE", "CSO 425", "COMPORTAMIENTO Y SOCIEDAD", "CUARTO SEMESTRE", "HOMOLOGACIÓN", 2],
  ["INV300", "INVESTIGACIÓN III", "QUINTO SEMESTRE", "INV 633", "MÉTODOS DE INVESTIGACIÓN CUANTITATIVA", "SEXTO SEMESTRE", "HOMOLOGACIÓN", 1],
  ["PSI310", "PSICOLOGÍA DE LA PERSONALIDAD I", "QUINTO SEMESTRE", "", "", "", "ELIMINADA", 3],
  ["PSI311", "EVALUACIÓN PSICOLÓGICA I", "QUINTO SEMESTRE", "PSI 316", "TÉCNICAS PSICOMÉTRICAS I", "TERCER SEMESTRE", "HOMOLOGACIÓN", 4],
  ["PSI312", "PSICOLOGIA COGNITIVA I", "QUINTO SEMESTRE", "PSI 412", "PSICOLOGIA COGNITIVA I", "CUARTO SEMESTRE", "HOMOLOGACIÓN", 6],
  ["PSI313", "PSICOPATOLOGÍA I", "QUINTO SEMESTRE", "PSI 515", "PSICOPATOLOGÍA I", "QUINTO SEMESTRE", "HOMOLOGACIÓN", 5],
  ["CSO350", "DIAGNÓSTICO DE NECESIDADES", "SEXTO SEMESTRE", "CSO 726", "PROYECTOS I", "SÉPTIMO SEMESTRE", "CONVALIDACIÓN", 2],
  ["INV350", "INVESTIGACIÓN IV", "SEXTO SEMESTRE", "INV 734", "MÉTODOS DE INVESTIGACIÓN CUALITATIVA", "SÉPTIMO SEMESTRE", "HOMOLOGACIÓN", 1],
  ["PSI350", "PSICOLOGÍA DE LA PERSONALIDAD II", "SEXTO SEMESTRE", "", "", "", "ELIMINADA", 3],
  ["PSI351", "EVALUACIÓN PSICOLÓGICA II", "SEXTO SEMESTRE", "PSI 414", "TÉCNICAS PSICOMÉTRICAS II", "CUARTO SEMESTRE", "HOMOLOGACIÓN", 4],
  ["PSI352", "PSICOLOGÍA COGNITIVA II", "SEXTO SEMESTRE", "PSI 517", "PSICOLOGÍA COGNITIVA II", "QUINTO SEMESTRE", "HOMOLOGACIÓN", 7],
  ["PSI353", "PSICOANÁLISIS", "SEXTO SEMESTRE", "PSI 315", "PSICOANÁLISIS I", "TERCER SEMESTRE", "HOMOLOGACIÓN", 6],
  ["PSI354", "PSICOPATOLOGÍA II", "SEXTO SEMESTRE", "PSI 619", "PSICOPATOLOGÍA II", "SEXTO SEMESTRE", "HOMOLOGACIÓN", 5],
  ["CSO400", "PROYECTOS I", "SÉPTIMO SEMESTRE", "CSO 726", "PROYECTOS I", "SÉPTIMO SEMESTRE", "HOMOLOGACIÓN", 2],
  ["CSO401", "TÉCNICAS DE INTERVENCIÓN SOCIO-ORGANIZACIONAL I", "SÉPTIMO SEMESTRE", "PSI 634", "INTERVENCIÓN PSICOSOCIAL", "SEXTO SEMESTRE", "HOMOLOGACIÓN", 3],
  ["INV400", "INVESTIGACIÓN V", "SÉPTIMO SEMESTRE", "INV 835", "MÉTODOS DE INVESTIGACIÓN MIXTA", "OCTAVO SEMESTRE", "HOMOLOGACIÓN", 1],
  ["PSI400", "TECNICAS DE INTERVENCION CLINICA I", "SÉPTIMO SEMESTRE", "PSI 611", "PSICOLOGÍA CLÍNICA", "SEXTO SEMESTRE", "HOMOLOGACIÓN", 5],
  ["PSI401", "TÉCNICAS PROYECTIVAS", "SÉPTIMO SEMESTRE", "PSI 518", "TÉCNICAS PSICODINÁMICAS", "QUINTO SEMESTRE", "HOMOLOGACIÓN", 4],
  ["PSI402", "TÉCNICAS DE INTERVENCIÓN EDUCACIONAL I", "SÉPTIMO SEMESTRE", "PSI 815", "INTERVENCIÓN EDUCATIVA I", "OCTAVO SEMESTRE", "HOMOLOGACIÓN", 6],
  ["CSO450", "PROYECTOS II", "OCTAVO SEMESTRE", "CSO 827", "PROYECTOS II", "OCTAVO SEMESTRE", "HOMOLOGACIÓN", 2],
  ["CSO451", "TÉCNICAS DE INTERVENCIÓN SOCIO-ORGANIZACIONAL II", "OCTAVO SEMESTRE", "PSI 614", "INTERVENCIÓN ORGANIZACIONAL RECURSOS HUMANOS I", "SEXTO SEMESTRE", "HOMOLOGACIÓN", 3],
  ["INV450", "INVESTIGACIÓN VI", "OCTAVO SEMESTRE", "INV 915", "GESTIÓN DEL CONOCIMIENTO", "NOVENO SEMESTRE", "CONVALIDACIÓN", 1],
  ["PSI450", "TECNICAS DE INTERVENCION CLINICA II", "OCTAVO SEMESTRE", "PSI 817", "INTERVENCIÓN CLÍNICA SISTÉMICA", "OCTAVO SEMESTRE", "COMPENSACIÓN", 5],
  ["PSI451", "PSICODIAGNÓSTICO", "OCTAVO SEMESTRE", "PSI 612", "PSICODIAGNÓSTICO", "SEXTO SEMESTRE", "HOMOLOGACIÓN", 4],
  ["PSI452", "TECNICAS DE INTERVENCION EDUCACIONAL II", "OCTAVO SEMESTRE", "PSI 918", "INTERVENCIÓN EDUCATIVA II", "NOVENO SEMESTRE", "HOMOLOGACIÓN", 6],
  ["DEP500", "ETICA PROFESIONAL I", "NOVENO SEMESTRE", "PSI 916", "PSICOÉTICA", "NOVENO SEMESTRE", "CONVALIDACIÓN", 1],
  ["DEP501", "ETICA PROFESIONAL II", "DÉCIMO SEMESTRE", "", "", "", "ELIMINADA", 1],
  ["DEP012", "GRUPO RELACIONAL I", "ELECTIVA", "OPT 006", "GRUPO RELACIONAL I", "ELECTIVA", "HOMOLOGACIÓN", null],
  ["DEP013", "GRUPO RELACIONAL II", "ELECTIVA", "OPT 007", "GRUPO RELACIONAL II", "ELECTIVA", "HOMOLOGACIÓN", null],
  ["DEP015", "TECNICAS RECREACIONALES", "ELECTIVA", "OPT 006", "GRUPO RELACIONAL I", "ELECTIVA", "CONVALIDACIÓN", null],
  ["INF151", "COMPUTACIÓN I", "ELECTIVA", "OPT 005", "TALLER DE TIC", "ELECTIVA", "CONVALIDACIÓN", null],
  ["INF152", "COMPUTACIÓN II", "ELECTIVA", "", "", "", "ELIMINADA", null],
  ["LEN301", "LENGUA NATIVA I", "ELECTIVA", "OPT 002", "LENGUA NATIVA", "ELECTIVA", "HOMOLOGACIÓN", null],
  ["LEN321", "LENGUA NATIVA II", "ELECTIVA", "", "", "", "ELIMINADA", null],
  ["LEN401", "LENGUA NATIVA III", "ELECTIVA", "", "", "", "ELIMINADA", null],
  ["LEN421", "LENGUA NATIVA IV", "ELECTIVA", "", "", "", "ELIMINADA", null],
  ["LIN110", "IDIOMA INGLÉS I", "ELECTIVA", "", "", "", "ELIMINADA", null],
  ["LIN111", "IDIOMA INGLÉS II", "ELECTIVA", "", "", "", "ELIMINADA", null],
  ["INV500", "TALLER DE GRADO DE TESIS I", "NOVENO SEMESTRE", "INV 936", "PERFIL DE GRADO", "NOVENO SEMESTRE", "HOMOLOGACIÓN", null],
  ["INV501", "TALLER DE GRADO DE TRABAJO DIRIGIDO I", "NOVENO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["INV502", "TALLER DE GRADO DE PROYECTO SOCIAL I", "NOVENO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["CSO452", "PSICOLOGÍA AMBIENTAL I", "NOVENO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["CSO453", "PSICOLOGÍA COMUNITARIA I", "NOVENO SEMESTRE", "PSI 714", "PSICOLOGÍA COMUNITARIA", "SÉPTIMO SEMESTRE", "HOMOLOGACIÓN", null],
  ["CSO454", "PSICOLOGÍA DE LAS ORGANIZACIONES I", "NOVENO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["CSO455", "PSICOLOGÍA AMBIENTAL II", "DÉCIMO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["CSO456", "PSICOLOGÍA COMUNITARIA II", "DÉCIMO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["CSO457", "PSICOLOGÍA DE LAS ORGANIZACIONES II", "DÉCIMO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["PSI500", "ABORDAJE CLÍNICO I", "NOVENO SEMESTRE", "PSI 712", "INTERVENCIÓN CLÍNICA HUMANISTA", "SÉPTIMO SEMESTRE", "COMPENSACIÓN", null],
  ["PSI501", "ABORDAJE EDUCATIVO I", "NOVENO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["PSI502", "ABORDAJE SOCIO ORGANIZACIONAL I", "NOVENO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["PSI503", "ABORDAJE CLÍNICO II", "DÉCIMO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["PSI504", "ABORDAJE EDUCATIVO II", "DÉCIMO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["PSI505", "ABORDAJE SOCIO-ORGANIZACIONAL II", "DÉCIMO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["PSI600", "ABORDAJE CLÍNICO I", "NOVENO SEMESTRE", "PSI 816", "INTERVENCIÓN CLÍNICA COGNITIVO CONDUCTUAL I", "OCTAVO SEMESTRE", "HOMOLOGACIÓN", null],
  ["PSI601", "ABORDAJE EDUCATIVO I", "NOVENO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["PSI602", "ABORDAJE SOCIO-ORGANIZACIONAL I", "NOVENO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["PSI603", "ABORDAJE CLÍNICO II", "DÉCIMO SEMESTRE", "PSI 912", "INTERVENCIÓN CLÍNICA COGNITIVO CONDUCTUAL II", "NOVENO SEMESTRE", "HOMOLOGACIÓN", null],
  ["PSI604", "ABORDAJE EDUCATIVO II", "DÉCIMO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["PSI605", "ABORDAJE SOCIO-ORGANIZACIONAL II", "DÉCIMO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["PSI700", "ABORDAJE CLÍNICO I", "NOVENO SEMESTRE", "PSI 711", "INTERVENCIÓN CLÍNICA PSICOANALÍTICA", "SÉPTIMO SEMESTRE", "CONVALIDACIÓN", null],
  ["PSI701", "ABORDAJE EDUCATIVO I", "NOVENO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["PSI702", "ABORDAJE SOCIO-ORGANIZACIONAL I", "NOVENO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["PSI703", "ABORDAJE CLÍNICO II", "DÉCIMO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["PSI704", "ABORDAJE EDUCATIVO II", "DÉCIMO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["PSI705", "ABORDAJE SOCIO-ORGANIZACIONAL II", "DÉCIMO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["INV503", "TALLER DE GRADO DE TESIS II", "DÉCIMO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["INV504", "TALLER DE GRADO DE TRABAJO DIRIGIDO II", "DÉCIMO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["INV505", "TALLER DE GRADO DE PROYECTO SOCIAL II", "DÉCIMO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["ANT201", "MOVIMIENTOS INDÍGENAS EN BOLIVIA", "TALLER", "", "", "", "ELIMINADA", null],
  ["ANT301", "TERRITORIOS EN LOS PUEBLOS INDÍGENAS BOLIVIANOS", "TALLER", "", "", "", "ELIMINADA", null],
  ["ANT302", "RELAC.INTERÉTNICAS Y ETNICIDAD", "TALLER", "", "", "", "ELIMINADA", null],
  ["ANT304", "IDENTIDAD Y CULTURAS", "TALLER", "", "", "", "ELIMINADA", null],
  ["CSA202", "SOCIEDAD DE LA INFANCIA, ADOLESCENCIA Y JUVENTUD", "TALLER", "OPT 004", "LEGISLACIÓN Y DERECHOS HUMANOS", "ELECTIVA", "CONVALIDACIÓN", null],
  ["CSA203", "SOCIOLOGÍA DE LA ORGANIZACIÓN Y TRABAJO", "TALLER", "", "", "", "ELIMINADA", null],
  ["CSA301", "SOCIOLOGÍA DE LAS MIGRACIONES", "TALLER", "", "", "", "ELIMINADA", null],
  ["EPS203", "DELITO Y SOCIEDAD", "TALLER", "PSI 914", "PSICOLOGÍA JURÍDICA Y FORENSE", "NOVENO SEMESTRE", "CONVALIDACIÓN", null],
  ["PSI552", "CLINICA PSICOANALITICA", "TALLER", "", "", "", "ELIMINADA", null],
  ["PSI553", "PSICOANALISIS CON ADOLESCENTES", "TALLER", "", "", "", "ELIMINADA", null],
  ["PSI554", "PSICOSOMÁTICA", "TALLER", "", "", "", "ELIMINADA", null],
  ["PSI555", "PSICOANALISIS DE NINOS", "TALLER", "PSI 413", "PSICOANÁLISIS II", "CUARTO SEMESTRE", "CONVALIDACIÓN", null],
  ["PSI556", "SALUD MENTAL COMUNITARIA", "TALLER", "", "", "", "ELIMINADA", null],
  ["PSI557", "PSICOLOGÍA DE LA COMUNICACIÓN", "TALLER", "", "", "", "ELIMINADA", null],
  ["PSI558", "TÉCNICAS DE CONCILIACIÓN", "TALLER", "", "", "", "ELIMINADA", null],
  ["PSI559", "TERAPIA ROGERIANA", "TALLER", "PSI 416", "PSICOLOGÍA HUMANÍSTICA", "CUARTO SEMESTRE", "CONVALIDACIÓN", null],
  ["PSI560", "PSICODRAMA", "TALLER", "", "", "", "ELIMINADA", null],
  ["PSI561", "PSICOLOGÍA POSITIVA", "TALLER", "", "", "", "ELIMINADA", null],
  ["PSI562", "DIFICULTADES DE APRENDIZAJE", "TALLER", "", "", "", "ELIMINADA", null],
  ["PSI563", "PSICOFARMACOLOGÍA", "TALLER", "", "", "", "ELIMINADA", null],
  ["PSI564", "PSICOHIGIENE", "TALLER", "", "", "", "ELIMINADA", null],
  ["PSI565", "ORIENTACIÓN VOCACIONAL", "TALLER", "", "", "", "ELIMINADA", null],
  ["PSI566", "PSICOLOGÍA DE LA SEXUALIDAD", "TALLER", "OPT 008", "PSICOLOGÍA DE LA SEXUALIDAD", "ELECTIVA", "HOMOLOGACIÓN", null],
  ["PSI567", "PSICOLOGIA ORGANIZACIONAL", "TALLER", "", "", "", "ELIMINADA", null],
  ["PSI568", "EDUCACIÓN ESPECIAL", "TALLER", "OPT 003", "EDUCACIÓN ESPECIAL", "ELECTIVA", "HOMOLOGACIÓN", null],
  ["PSI569", "PSICOLOGÍA DEL DEPORTE", "TALLER", "", "", "", "ELIMINADA", null],
  ["SCA204", "SOCIOLOGÍA DE LA SALUD", "TALLER", "", "", "", "ELIMINADA", null],
  ["SCA205", "GÉNERO Y DESARROLLO", "TALLER", "OPT 001", "PSICOLOGÍA DE LA SALUD", "ELECTIVA", "CONVALIDACIÓN", null],
  ["SUI201", "TEORÍA DEL CONFLICTO SOCIAL", "TALLER", "", "", "", "ELIMINADA", null],
  ["SUI302", "ECOLOGÍA SOCIAL", "TALLER", "", "", "", "ELIMINADA", null],
  ["", "", "", "PPP 100", "PRÁCTICA PRE PROFESIONAL", "NOVENO SEMESTRE", "NUEVA", null],
  ["", "", "", "BIO 523", "PSICOLINGUISTICA", "QUINTO SEMESTRE", "NUEVA", null],
  ["", "", "", "GRL 001", "MODALIDAD DE GRADUACIÓN", "DÉCIMO SEMESTRE", "NUEVA ASIGNATURA", null],
  ["", "", "", "GDI 001", "GRADUACIÓN DIRECTA", "DÉCIMO SEMESTRE", "NUEVA ASIGNATURA", null],
  ["", "", "", "OPT 010", "SOCIOPATOLOGÍA", "ELECTIVA", "NUEVA ASIGNATURA", null],
  ["", "", "", "OPT 011", "PSICOTERAPIA INFANTIL", "ELECTIVA", "NUEVA ASIGNATURA", null],
];

// Siglas que se muestran SIEMPRE en 9no/10mo (sin importar si tiene nota)
const SIGLAS_SIEMPRE_9_10 = new Set(["DEP500", "DEP501"]);
// Semestres donde aplica el filtro "solo mostrar si aprobada"
const SEMS_FILTRO = new Set(["NOVENO SEMESTRE", "DÉCIMO SEMESTRE"]);

// Índice rápido: siglaAntigua → registro de convalidación
const CONV_BY_SIGLA = {};
CONVALIDACIONES.forEach((r) => {
  CONV_BY_SIGLA[r[0]] = r;
});

// Grupos de semestres en orden estricto para la malla
const SECS_SEMESTRES = [
  { key: "PRIMER SEMESTRE", label: "1°", color: "#1d4ed8" },
  { key: "SEGUNDO SEMESTRE", label: "2°", color: "#1e40af" },
  { key: "TERCER SEMESTRE", label: "3°", color: "#1a56db" },
  { key: "CUARTO SEMESTRE", label: "4°", color: "#6d28d9" },
  { key: "QUINTO SEMESTRE", label: "5°", color: "#7c3aed" },
  { key: "SEXTO SEMESTRE", label: "6°", color: "#a21caf" },
  { key: "SÉPTIMO SEMESTRE", label: "7°", color: "#be185d" },
  { key: "OCTAVO SEMESTRE", label: "8°", color: "#b91c1c" },
  { key: "NOVENO SEMESTRE", label: "9°", color: "#92400e" },
  { key: "DÉCIMO SEMESTRE", label: "10°", color: "#065f46" },
];
const SECS_EXTRA = [
  { key: "ELECTIVA", label: "⚡ ELECTIVAS", color: "#0f766e" },
  { key: "TALLER", label: "🛠 TALLERES", color: "#374151" },
  { key: "PRÁCTICAS", label: "📋 PRÁCTICAS", color: "#1e3a5f" },
];

// ─────────────────────────────────────────────────────────────
// 2. ESTADO GLOBAL
// ─────────────────────────────────────────────────────────────
let todosLosEstudiantes = [];
let estudianteFiltrado = [];
let estudianteActual = null;
let tabActual = "antigua";
let modoEdicion = false;
let materiasEditadas = new Set();

// ─────────────────────────────────────────────────────────────
// 3. CARGA DESDE SUPABASE
// ─────────────────────────────────────────────────────────────
async function cargarEstudiantes() {
  try {
    // Paginación: Supabase devuelve máx 1000 por defecto, pedimos todo
    let todos = [];
    let from = 0;
    const PAGE = 1000;

    while (true) {
      const { data, error } = await supabase
        .from("estudiantes")
        .select("*")
        .range(from, from + PAGE - 1)
        .order("nombre", { ascending: true });

      if (error) throw error;
      if (!data || data.length === 0) break;

      // Normalizar: reconstruir objeto compatible con la lógica de mallas
      // Supabase guarda: registro, nombre, fec_ingreso, niv_min, mat_venc + materias (JSONB)
      // La app usa: Registro, Nombre, Fec_ingreso, Niv_min, Mat_venc + est[siglaAnt]
      const normalizados = data.map((row) => {
        const est = {
          id: row.registro,
          Registro: row.registro,
          Nombre: row.nombre,
          Fec_ingreso: row.fec_ingreso,
          Niv_min: row.niv_min,
          Mat_venc: row.mat_venc,
          _total_aprobadas: row.total_aprobadas,
          _total_pendientes: row.total_pendientes,
          _total_materias: row.total_materias,
          _porcentaje_avance: row.porcentaje_avance,
          _gestion1_2026: row.gestion1_2026 || [],
          _gestion2_2026: row.gestion2_2026 || [],
        };
        // Expandir materias JSONB a nivel raíz: est["ANT100"] = 75
        if (row.materias && typeof row.materias === "object") {
          Object.assign(est, row.materias);
        }
        return est;
      });

      todos = todos.concat(normalizados);
      if (data.length < PAGE) break;
      from += PAGE;
    }

    todosLosEstudiantes = todos;

    document.getElementById("statTotal").innerHTML =
      `<span class="stat-num">${todosLosEstudiantes.length.toLocaleString()}</span><span class="stat-label">estudiantes</span>`;

    document.getElementById("loadingMsg").style.display = "none";
    estudianteFiltrado = [...todosLosEstudiantes];
    renderLista(estudianteFiltrado);
  } catch (err) {
    console.error(err);
    document.getElementById("loadingMsg").style.display = "none";
    const el = document.getElementById("errorMsg");
    el.style.display = "block";
    el.textContent = "❌ Error al cargar Supabase: " + err.message;
  }
}

// ─────────────────────────────────────────────────────────────
// 4. RENDER LISTA DE ESTUDIANTES
// ─────────────────────────────────────────────────────────────
function iniciales(nombre) {
  if (!nombre) return "?";
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

const COLS_INFO = [
  "Registro",
  "Nombre",
  "Fec_ingreso",
  "Niv_min",
  "Mat_venc",
  "id",
  "_total_aprobadas",
  "_total_pendientes",
  "_total_materias",
  "_porcentaje_avance",
];

function calcPorcentaje(est) {
  const siglas = Object.keys(est).filter((k) => !COLS_INFO.includes(k));
  if (!siglas.length) return 0;
  const aprobadas = siglas.filter(
    (s) => est[s] != null && !isNaN(Number(est[s])),
  ).length;
  return Math.round((aprobadas / siglas.length) * 100);
}

function renderLista(lista) {
  const ul = document.getElementById("studentList");
  ul.innerHTML = "";
  document.getElementById("searchCount").textContent =
    lista.length !== todosLosEstudiantes.length
      ? `${lista.length} de ${todosLosEstudiantes.length}`
      : `${lista.length} estudiantes`;

  lista.forEach((est) => {
    const pct = est["_porcentaje_avance"] ?? calcPorcentaje(est);
    const venc = est["Mat_venc"] ?? "–";
    const li = document.createElement("li");
    li.className =
      "student-item" + (estudianteActual?.id === est.id ? " active" : "");
    li.dataset.id = est.id;
    li.innerHTML = `
      <div class="si-left">
        <div class="si-avatar">${iniciales(est.Nombre)}</div>
        <div class="si-info">
          <span class="si-nombre">${est.Nombre ?? "–"}</span>
          <span class="si-reg">${est.Registro ?? "–"} · ${est.Fec_ingreso ?? "–"}</span>
        </div>
      </div>
      <div class="si-right">
        <span class="si-pct" style="--pct:${pct}">${pct}%</span>
        <span class="si-venc">${venc} mat.</span>
      </div>`;
    li.addEventListener("click", () => seleccionarEstudiante(est));
    ul.appendChild(li);
  });
}

// ─────────────────────────────────────────────────────────────
// 5. SELECCIONAR ESTUDIANTE
// ─────────────────────────────────────────────────────────────
function seleccionarEstudiante(est) {
  console.log("Datos del estudiante seleccionado (columnas):", Object.keys(est));
  estudianteActual = est;
  document
    .querySelectorAll(".student-item")
    .forEach((el) => el.classList.toggle("active", el.dataset.id === est.id));

  document.getElementById("placeholder").style.display = "none";
  document.getElementById("studentDetail").style.display = "block";

  document.getElementById("detAvatar").textContent = iniciales(est.Nombre);
  document.getElementById("detNombre").textContent = est.Nombre ?? "–";
  document.getElementById("detRegistro").textContent =
    "Reg: " + (est.Registro ?? "–");
  document.getElementById("detIngreso").textContent =
    "Ingreso: " + (est.Fec_ingreso ?? "–");
  document.getElementById("detVenc").textContent =
    "Mat. vencidas: " + (est.Mat_venc ?? "–");

  const pct = est["_porcentaje_avance"] ?? calcPorcentaje(est);
  document.getElementById("detPct").textContent = pct + "%";
  const circ = 2 * Math.PI * 32;
  const ring = document.getElementById("ringFill");
  ring.style.strokeDasharray = circ;
  ring.style.strokeDashoffset = circ - (pct / 100) * circ;

  // Actualizar contadores (Troncales, Electivas, Talleres)
  let troncales = 0, electivas = 0, talleres = 0;
  CONVALIDACIONES.forEach(c => {
    const sigla = c[0];
    const sem = c[2];
    const nota = est[sigla];
    const aprobada = nota != null && !isNaN(Number(nota)) && Number(nota) >= 51;

    if (aprobada) {
      if (sem === "ELECTIVA") electivas++;
      else if (sem === "TALLER") talleres++;
      else if (sem !== "PRÁCTICAS" && sem !== "TRABAJO DE GRADO") troncales++;
    }
  });

  const elTron = document.getElementById("countTroncales");
  const elElec = document.getElementById("countElectivas");
  const elTall = document.getElementById("countTalleres");
  if (elTron) elTron.textContent = troncales;
  if (elElec) elElec.textContent = electivas;
  if (elTall) elTall.textContent = talleres;

  mostrarTab(tabActual);
}

// ─────────────────────────────────────────────────────────────
// 5.1. MODO EDICIÓN
// ─────────────────────────────────────────────────────────────
window.activarModoEdicion = function () {
  if (!estudianteActual) return;
  modoEdicion = true;
  materiasEditadas.clear();
  document.body.classList.add('modo-edicion');

  // Hacer que las tarjetas sean interactivas
  const cards = document.querySelectorAll('.mat-card');
  cards.forEach(card => {
    const sigla = card.querySelector('.mat-sigla')?.textContent ||
      card.querySelector('.mat-sigla-nueva')?.textContent;

    if (!sigla) return;

    card.classList.add('editable');
    card.onclick = (e) => togglerMateriaEdicion(sigla, card);
  });
};

window.desactivarModoEdicion = function () {
  modoEdicion = false;
  materiasEditadas.clear();
  document.body.classList.remove('modo-edicion');

  // Volver a renderizar para limpiar estados visuales de edición
  mostrarTab(tabActual);
};

function togglerMateriaEdicion(sigla, cardEl) {
  if (!modoEdicion) return;

  // Verificar si ya está aprobada en la base de datos
  const notaOriginal = estudianteActual[sigla];
  const aprobadaOriginal = notaOriginal != null && !isNaN(Number(notaOriginal)) && Number(notaOriginal) >= 51;

  if (materiasEditadas.has(sigla)) {
    materiasEditadas.delete(sigla);
    cardEl.classList.remove('edit-selected');
  } else {
    // Solo permitir seleccionar si no estaba aprobada ya
    if (!aprobadaOriginal) {
      materiasEditadas.add(sigla);
      cardEl.classList.add('edit-selected');
    }
  }
}

window.guardarCambiosEdicion = async function () {
  if (materiasEditadas.size === 0) {
    desactivarModoEdicion();
    return;
  }

  const btnSave = document.querySelector('.btn-save');
  const originalContent = btnSave.innerHTML;
  btnSave.disabled = true;
  btnSave.innerHTML = '<i class="fa-solid fa-circle-notch animate-spin"></i> Guardando...';

  try {
    // 1. Obtener el registro actual de Supabase para tener la versión más reciente de 'materias'
    const { data: currentData, error: fetchError } = await supabase
      .from('estudiantes')
      .select('materias')
      .eq('registro', estudianteActual.Registro)
      .single();

    if (fetchError) throw fetchError;

    let materiasActuales = currentData.materias || {};

    // 2. Aplicar los cambios
    materiasEditadas.forEach(sigla => {
      materiasActuales[sigla] = 51; // Nota por defecto (pasada)
    });

    // 3. Recalcular estadísticas para mantener coherencia en la tabla
    let aprobadas = 0;
    CONVALIDACIONES.forEach(c => {
      const sigla = c[0];
      const nota = materiasActuales[sigla];
      if (nota != null && !isNaN(Number(nota)) && Number(nota) >= 51) {
        aprobadas++;
      }
    });

    const totalMaterias = CONVALIDACIONES.length;
    const porcentaje = Math.round((aprobadas / totalMaterias) * 100);

    // 4. Actualizar en Supabase enfocándose en la columna JSONB 'materias'
    const { error: updateError } = await supabase
      .from('estudiantes')
      .update({
        materias: materiasActuales,
        total_aprobadas: aprobadas,
        total_pendientes: totalMaterias - aprobadas,
        porcentaje_avance: porcentaje,
        timestamp_subida: new Date().toISOString()
      })
      .eq('registro', estudianteActual.Registro);

    if (updateError) throw updateError;

    alert('🎉 Materias actualizadas correctamente');

    await cargarEstudiantes();

    const actualizado = todosLosEstudiantes.find(e => e.Registro === estudianteActual.Registro);
    if (actualizado) seleccionarEstudiante(actualizado);

    desactivarModoEdicion();
  } catch (err) {
    console.error("Error al guardar:", err);
    alert("❌ Error al guardar los cambios: " + err.message);
  } finally {
    btnSave.disabled = false;
    btnSave.innerHTML = originalContent;
  }
};

// ─────────────────────────────────────────────────────────────
// 6. TABS
// ─────────────────────────────────────────────────────────────
window.mostrarTab = function (tab) {
  tabActual = tab;
  ["antigua", "nueva", "conv", "sug"].forEach((t) => {
    const cont = document.getElementById(
      "content" + t.charAt(0).toUpperCase() + t.slice(1),
    );
    const btn = document.getElementById(
      "tab" + t.charAt(0).toUpperCase() + t.slice(1),
    );
    if (cont) cont.style.display = t === tab ? "block" : "none";
    if (btn) btn.classList.toggle("active", t === tab);
  });
  if (!estudianteActual) return;

  // Actualizar título de impresión dinámico
  const pTitle = document.getElementById("printTitle");
  if (pTitle) {
    if (tab === "antigua") pTitle.textContent = "AVANCE EN MALLA ANTIGUA (PLAN 148-1)";
    else if (tab === "nueva") pTitle.textContent = "AVANCE EN MALLA NUEVA (PLAN 148-2)";
    else if (tab === "conv") pTitle.textContent = "TABLA DE CONVALIDACIONES";
    else if (tab === "sug") pTitle.textContent = "SUGERENCIAS DE INSCRIPCIÓN";
  }

  if (tab === "antigua") renderMallaAntigua(estudianteActual);
  if (tab === "nueva") renderMallaNueva(estudianteActual);
  if (tab === "conv") renderTablaConv(estudianteActual);
  if (tab === "sug") renderSugerencias(estudianteActual);
};

// ─────────────────────────────────────────────────────────────
// 7. HELPERS DE TARJETA DE MATERIA
// ─────────────────────────────────────────────────────────────
// esCriticaAnt = true → la materia es pendiente en sem 1-6 de malla antigua
// (la nueva malla 148-2 la cubre, así que se marca en ROJO)
function claseMateria(nota, tipo, esCriticaAnt = false) {
  const n =
    nota != null && nota !== "" && !isNaN(Number(nota)) ? Number(nota) : null;
  if (tipo === "ELIMINADA") {
    if (n !== null)
      return n >= 51
        ? "mat-card mat-aprobada mat-era-eliminada"
        : "mat-card mat-reprobada mat-era-eliminada";
    return "mat-card mat-eliminada";
  }
  if (n === null) {
    // Pendiente en semestres 1-6 de malla antigua → rojo (nueva malla lo cubre)
    if (esCriticaAnt) return "mat-card mat-pendiente-critico";
    return "mat-card mat-pendiente";
  }
  return n >= 51 ? "mat-card mat-aprobada" : "mat-card mat-reprobada";
}

function etiquetaMateria(nota, tipo, esCriticaAnt = false) {
  const n =
    nota != null && nota !== "" && !isNaN(Number(nota)) ? Number(nota) : null;
  if (tipo === "ELIMINADA") {
    if (n !== null) return n >= 51 ? `✓ ${n}` : `✗ ${n}`;
    return "❌ Eliminada";
  }
  if (n === null) return esCriticaAnt ? "🔴 Pendiente (nueva malla)" : "⏳ Pendiente";
  return n >= 51 ? "✓ Aprobada" : "✗ Reprobada";
}

// El 6° parámetro opcional: esCriticaAnt = sem 1-6 antigua sin aprobar
function tarjetaMateria(sigla, nombre, nota, tipo, mostrarConv = true, esCriticaAnt = false) {
  const cls = claseMateria(nota, tipo, esCriticaAnt);
  const n = nota != null && nota !== '' && !isNaN(Number(nota)) ? Number(nota) : null;
  const convTag = tipo
    ? `<div class="conv-tag conv-${tipo.toLowerCase().split(" ")[0]}">${tipo}</div>`
    : "";

  // Información de convalidación (qué materia es en la nueva malla)
  let convInfo = "";
  if (mostrarConv) {
    const c = CONV_BY_SIGLA[sigla];
    if (c && c[3]) { // c[3] is siglaNueva
      convInfo = `<div class="mat-conv-info">
        <span class="conv-label">convalida con:</span>
        <span class="conv-sigla">${c[3]}</span>
      </div>`;
    }
  }

  // Mostrar badge “REPROBADA” solo si tiene nota reprobatoria (y no estamos en modo edición)
  const reprTag = (n !== null && n < 51 && tipo !== 'ELIMINADA' && !modoEdicion)
    ? `<div class="mat-reprobada-tag"><i class="fa-solid fa-circle-xmark"></i> Reprobada</div>` : '';
  // Prerrequisito de malla antigua
  const req = PREREQ_148_1[sigla];
  const reqTag = req ? `<div class="mat-prereq"><i class="fa-solid fa-key"></i> ${req}</div>` : '';
  return `<div class="${cls}">
    <div class="mat-sigla">${sigla}</div>
    <div class="mat-nombre">${nombre}</div>
    ${reprTag}${reqTag}${convTag}${convInfo}
  </div>`;
}

// ─────────────────────────────────────────────────────────────
// 8. MALLA ANTIGUA  –  layout horizontal semestres 1-10
// ─────────────────────────────────────────────────────────────
function renderMallaAntigua(est) {
  const container = document.getElementById("contentAntigua");

  // Agrupar por semestre, guardando el orden (índice 7)
  // ⚠ Regla especial: en NOVENO y DÉCIMO SEMESTRE solo se muestran:
  //   - DEP500 y DEP501 siempre (tal cual)
  //   - Las demás materias SOLO si el estudiante ya las venció (nota >= 51)
  const byKey = {};
  CONVALIDACIONES.forEach((r) => {
    const sigla = r[0],
      nombre = r[1],
      sem = r[2],
      tipo = r[6],
      orden = r[7];

    if (SEMS_FILTRO.has(sem) && !SIGLAS_SIEMPRE_9_10.has(sigla)) {
      // Solo incluir si el estudiante tiene la materia aprobada
      const nota = est[sigla];
      const n =
        nota != null && nota !== "" && !isNaN(Number(nota))
          ? Number(nota)
          : null;
      if (n === null || n < 51) return; // no mostrar
    }

    if (!byKey[sem]) byKey[sem] = [];
    byKey[sem].push({ sigla, nombre, tipo, orden });
  });
  // Ordenar por ORDEN (las materias sin orden quedan al final)
  Object.values(byKey).forEach((arr) => {
    arr.sort((a, b) => (a.orden ?? 999) - (b.orden ?? 999));
  });

  let html = "";

  // ─ BLOQUE HORIZONTAL: semestres 1 al 10 ─
  html += `<div class="malla-wrap">`;

  // Fila de cabeceras
  html += `<div class="malla-horizontal">`;
  SECS_SEMESTRES.forEach((sec) => {
    const mats = byKey[sec.key] || [];
    // Sem 1-6 de malla antigua: pendientes se marcan en ROJO
    // porque la nueva malla 148-2 los cubre y el estudiante aún no los aprobó
    const semNumActual = SEM_NUM[sec.key] || 0;
    const esSemCritico = semNumActual >= 1 && semNumActual <= 6;
    html += `
      <div class="sem-col">
        <div class="sem-col-header" style="background:${sec.color}20;border-color:${sec.color}60;color:${sec.color}">
          <span class="sem-num">${sec.label}</span>
          <span class="sem-full-name">${sec.key}</span>
         
        </div>
        <div class="sem-col-body">
          ${mats.map((m) => {
      const nota = est[m.sigla];
      const n = nota != null && nota !== '' && !isNaN(Number(nota)) ? Number(nota) : null;
      const critica = esSemCritico && n === null && m.tipo !== 'ELIMINADA';
      return tarjetaMateria(m.sigla, m.nombre, nota, m.tipo, true, critica);
    }).join("")}
        </div>
      </div>`;
  });
  html += `</div>`; // /malla-horizontal

  // ─ BLOQUE EXTRA: Electivas, Talleres, Prácticas ─
  SECS_EXTRA.forEach((sec) => {
    const mats = byKey[sec.key] || [];
    if (!mats.length) return;
    html += `
      <div class="extra-section">
        <div class="extra-header" style="border-color:${sec.color}60;color:${sec.color}">
          ${sec.label}
          <span class="extra-count">${mats.length} materias</span>
        </div>
        <div class="extra-grid">
          ${mats.map((m) => tarjetaMateria(m.sigla, m.nombre, est[m.sigla], m.tipo)).join("")}
        </div>
      </div>`;
  });

  html += `</div>`; // /malla-wrap
  container.innerHTML = html;
}

// ─────────────────────────────────────────────────────────────
// 9. MALLA NUEVA  –  columnas análogas (Plan 148-2)
// ─────────────────────────────────────────────────────────────
function buildCardNueva(it) {
  const aprobada = it.origs.some(
    (o) => o.nota != null && !isNaN(Number(o.nota)) && Number(o.nota) >= 51,
  );
  const tieneNota = it.origs.some(
    (o) => o.nota != null && !isNaN(Number(o.nota)),
  );

  // Clase de color según estado y tipo
  let cls;
  if (aprobada) {
    cls = "mat-card mat-nueva mat-aprobada";
  } else if (tieneNota) {
    cls = "mat-card mat-nueva mat-reprobada";
  } else {
    cls =
      it.tipo === "HOMOLOGACIÓN"
        ? "mat-card mat-nueva mat-homolog"
        : it.tipo === "CONVALIDACIÓN"
          ? "mat-card mat-nueva mat-convalid"
          : it.tipo === "COMPENSACIÓN"
            ? "mat-card mat-nueva mat-compens"
            : it.tipo === "NUEVA ASIGNATURA"
              ? "mat-card mat-nueva mat-pendiente"
              : "mat-card mat-nueva mat-pendiente";
  }

  // Nota o estado a mostrar
  let notaLabel;
  if (aprobada) {
    notaLabel = "✓ Aprobada";
  } else if (tieneNota) {
    notaLabel = "✗ Reprobada";
  } else {
    notaLabel = "⏳ Pendiente";
  }

  // Badge de tipo
  const tipoCls = `tipo-badge tipo-${it.tipo.split(" ")[0].toLowerCase()}`;
  const tipoBadge = `<span class="${tipoCls}">${it.tipo}</span>`;

  // Chips de origen: Nombre - Sigla
  const origChips = it.origs
    .map((o) => {
      const nombre = o.nombreAnt || "–";
      return `<span class="orig-chip" title="${nombre} (${o.siglaAnt})">
          ${nombre} - <b>${o.siglaAnt}</b>
        </span>`;
    })
    .join("");

  // Prerrequisito de malla nueva
  const req = PREREQ_148_2[it.siglaNueva];
  const reqTag = req ? `<div class="mat-prereq"><i class="fa-solid fa-key"></i> ${req}</div>` : '';

  // Etiqueta de nota (solo si no estamos en modo edición)
  const finalNotaLabel = (!modoEdicion)
    ? `<div class="mat-nota-nueva">${notaLabel}</div>`
    : "";

  return `<div class="${cls}">
      <div class="nueva-header">
        <span class="mat-sigla-nueva">${it.siglaNueva}</span>
        ${tipoBadge}
      </div>
      <div class="mat-nombre">${it.nombreNueva}</div>
      ${finalNotaLabel}
      ${reqTag}
      <div class="mat-origs-nueva">
        <span class="origs-label">antes:</span>
        <div class="origs-lista">${origChips}</div>
      </div>
    </div>`;
}

function renderMallaNueva(est) {
  const container = document.getElementById("contentNueva");

  const SEMS_NUEVA = [
    { key: "PRIMER SEMESTRE", label: "1°", color: "#1d4ed8" },
    { key: "SEGUNDO SEMESTRE", label: "2°", color: "#1e40af" },
    { key: "TERCER SEMESTRE", label: "3°", color: "#1a56db" },
    { key: "CUARTO SEMESTRE", label: "4°", color: "#6d28d9" },
    { key: "QUINTO SEMESTRE", label: "5°", color: "#7c3aed" },
    { key: "SEXTO SEMESTRE", label: "6°", color: "#a21caf" },
    { key: "SÉPTIMO SEMESTRE", label: "7°", color: "#be185d" },
    { key: "OCTAVO SEMESTRE", label: "8°", color: "#b91c1c" },
    { key: "NOVENO SEMESTRE", label: "9°", color: "#92400e" },
    { key: "DÉCIMO SEMESTRE", label: "10°", color: "#065f46" },
  ];

  // Construir grupos nueva malla: por semestre nuevo, deduplicar siglaNueva
  const byKey = {};
  CONVALIDACIONES.forEach((conv) => {
    const [
      siglaAnt,
      nombreAnt,
      semAnt,
      siglaNueva,
      nombreNueva,
      semNuevo,
      tipo,
    ] = conv;
    if (!siglaNueva || tipo === "ELIMINADA") return;
    const k = semNuevo || "ELECTIVA";
    if (!byKey[k]) byKey[k] = {};
    if (!byKey[k][siglaNueva]) {
      byKey[k][siglaNueva] = {
        siglaNueva,
        nombreNueva,
        tipo,
        origs: [],
        semNum: SEM_NUM[semNuevo] || 0, // ← número de semestre para marcar críticos
      };
    }
    byKey[k][siglaNueva].origs.push({
      siglaAnt,
      nombreAnt,
      nota: est[siglaAnt],
    });
  });

  let html = `<div class="malla-wrap">`;

  // Horizontal semestres nuevos
  html += `<div class="malla-horizontal">`;
  SEMS_NUEVA.forEach((sec) => {
    const items = Object.values(byKey[sec.key] || {});
    html += `
      <div class="sem-col">
        <div class="sem-col-header" style="background:${sec.color}20;border-color:${sec.color}60;color:${sec.color}">
          <span class="sem-num">${sec.label}</span>
          <span class="sem-full-name">${sec.key}</span>
          <span class="sem-count">${items.length} mat.</span>
        </div>
        <div class="sem-col-body">
          ${items.map((it) => buildCardNueva(it)).join("")}
        </div>
      </div>`;
  });
  html += `</div>`;

  // Electivas nuevas
  const electNueva = Object.values(byKey["ELECTIVA"] || {});
  if (electNueva.length) {
    html += `<div class="extra-section">
      <div class="extra-header" style="border-color:#0f766e60;color:#0f766e">⚡ ELECTIVAS NUEVA MALLA
        <span class="extra-count">${electNueva.length} materias</span>
      </div>
      <div class="extra-grid">
        ${electNueva.map((it) => buildCardNueva(it)).join("")}
      </div>
    </div>`;
  }

  html += `</div>`;
  container.innerHTML = html;
}

// ─────────────────────────────────────────────────────────────
// 10. TABLA DE CONVALIDACIONES
// ─────────────────────────────────────────────────────────────
function renderTablaConv(est) {
  const container = document.getElementById("contentConv");
  const filas = CONVALIDACIONES.map((conv) => {
    const [
      siglaAnt,
      nombreAnt,
      semAnt,
      siglaNueva,
      nombreNueva,
      semNuevo,
      tipo,
    ] = conv;
    const nota = est[siglaAnt];
    const n =
      nota != null && nota !== "" && !isNaN(Number(nota)) ? Number(nota) : null;
    let estadoCls = "est-pendiente",
      estado = "Pendiente";
    if (tipo === "ELIMINADA") {
      estadoCls = "est-eliminada";
      estado = "Eliminada";
    } else if (n !== null && n >= 51) {
      estadoCls = "est-aprobada";
      estado = "Aprobada";
    } else if (n !== null && n < 51) {
      estadoCls = "est-reprobada";
      estado = "Reprobada ✗";
    }

    return `<tr>
      <td><span class="sigla-chip">${siglaAnt}</span></td>
      <td>${nombreAnt}</td>
      <td class="sem-cell">${semAnt}</td>
      <td>${siglaNueva ? `<span class="sigla-chip sigla-nueva">${siglaNueva}</span>` : "–"}</td>
      <td>${nombreNueva || "–"}</td>
      <td class="sem-cell">${semNuevo || "–"}</td>
      <td><span class="tipo-badge tipo-${tipo.split(" ")[0].toLowerCase()}">${tipo}</span></td>
      <td><span class="${estadoCls}">${estado}</span></td>
    </tr>`;
  }).join("");

  container.innerHTML = `
    <div class="table-wrap">
      <table class="conv-table">
        <thead><tr>
          <th>Sigla ant.</th><th>Materia anterior</th><th>Sem. ant.</th>
          <th>Sigla nueva</th><th>Materia nueva</th><th>Sem. nuevo</th>
          <th>Tipo</th><th>Estado</th>
        </tr></thead>
        <tbody>${filas}</tbody>
      </table>
    </div>`;
}

// ─────────────────────────────────────────────────────────────
// 11. BUSCADOR
// ─────────────────────────────────────────────────────────────
document.getElementById("searchInput").addEventListener("input", (e) => {
  const q = e.target.value.trim().toLowerCase();
  estudianteFiltrado = !q
    ? [...todosLosEstudiantes]
    : todosLosEstudiantes.filter(
      (est) =>
        (est.Nombre ?? "").toLowerCase().includes(q) ||
        (est.Registro ?? "").toString().toLowerCase().includes(q),
    );
  renderLista(estudianteFiltrado);
});

// ─────────────────────────────────────────────────────────────
// 12. MAPA SEMESTRE → NÚMERO
// ─────────────────────────────────────────────────────────────
const SEM_NUM = {
  "PRIMER SEMESTRE": 1,
  "SEGUNDO SEMESTRE": 2,
  "TERCER SEMESTRE": 3,
  "CUARTO SEMESTRE": 4,
  "QUINTO SEMESTRE": 5,
  "SEXTO SEMESTRE": 6,
  "SÉPTIMO SEMESTRE": 7,
  "OCTAVO SEMESTRE": 8,
  "NOVENO SEMESTRE": 9,
  "DÉCIMO SEMESTRE": 10,
};

// ─────────────────────────────────────────────────────────────
// PRERREQUISITOS MALLA ANTIGUA 148-1
// Fuente: prerrequisitos148-1.xlsx
// ─────────────────────────────────────────────────────────────
const PREREQ_148_1 = {
  ANT150: "ANT100", BIO150: "BIO100", CSO150: "CSO101",
  EST152: "EST121", FIL150: "FIL101", PSI150: "PSI101",
  BIO200: "BIO150", CSO200: "CSO150", CSO201: "ANT150",
  INV200: "EST152, FIL150", PSI200: "PSI150",
  PSI202: "PSI150", PSI203: "PSI150",
  BIO250: "BIO200", CSO250: "CSO200", INV250: "INV200",
  PSI254: "PSI200", PSI255: "PSI200",
  PSI256: "PSI202, PSI203",
  PSI313: "PSI254, BIO250",
  CSO350: "CSO300", INV350: "INV300",
  PSI350: "PSI310", PSI351: "PSI311", PSI352: "PSI312",
  PSI353: "PSI256, PSI310", PSI354: "PSI313",
  CSO401: "CSO201, CSO350", INV400: "INV350",
  PSI400: "PSI350, PSI354", PSI401: "PSI351, PSI353",
  PSI402: "PSI352",
  CSO450: "CSO400", CSO451: "CSO401",
  INV450: "INV400",
  PSI450: "PSI400", PSI451: "PSI401", PSI452: "PSI402",
  DEP500: "PSI451", DEP501: "DEP500",
  CSO452: "CSO451", CSO453: "CSO451", CSO454: "CSO451",
  CSO455: "CSO452", CSO456: "CSO453", CSO457: "CSO454",
  PSI500: "PSI450", PSI501: "PSI452", PSI502: "CSO451",
  PSI503: "PSI500", PSI504: "PSI501", PSI505: "PSI502",
  PSI600: "PSI450", PSI601: "PSI452", PSI602: "CSO451",
  PSI603: "PSI600", PSI604: "PSI601", PSI605: "PSI602",
  PSI700: "PSI450", PSI701: "PSI452", PSI702: "CSO451",
  PSI703: "PSI700", PSI704: "PSI701", PSI705: "PSI702",
  DEP13: "DEP012", INF152: "INF151",
  ANT201: "ANT150", ANT301: "ANT150", ANT302: "ANT150",
  ANT304: "CSO300", CSA202: "PSI353", CSA203: "CSO250",
  CSA301: "CSO150", EPS203: "CSO300",
  PSI552: "PSI353", PSI553: "PSI353", PSI554: "BIO250",
  PSI555: "PSI353", PSI556: "PSI354",
  PSI557: "PSI400", PSI558: "CSO401",
  PSI559: "PSI400", PSI560: "PSI400", PSI561: "PSI400",
  PSI562: "PSI202",
  PSI563: "PSI400", PSI564: "PSI400", PSI565: "PSI402",
  PSI566: "PSI313", PSI567: "CSO250",
  PSI568: "PSI402", PSI569: "BIO100",
  SCA204: "CSO150", SCA205: "CSO200",
  SUI201: "CSO200", SUI302: "CSO201",
};

// ─────────────────────────────────────────────────────────────
// PRERREQUISITOS MALLA NUEVA 148-2
// Fuente: prerrequisitos148-2.xlsx
// ─────────────────────────────────────────────────────────────
const PREREQ_148_2 = {
  "PSI 212": "PSI 105", "BIO 242": "BIO 141",
  "CSO 222": "CSO 121", "PSI 213": "PSI 105",
  "FIL 262": "FIL 161", "INV 232": "INV 131",
  "PSI 311": "PSI 213", "PSI 314": "PSI 212",
  "PSI 315": "PSI 212", "PSI 316": "PSI 212",
  "BIO 343": "BIO 242", "EST 351": "INV 232",
  "PSI 416": "PSI 311", "PSI 412": "PSI 311, PSI 314",
  "PSI 414": "PSI 316", "PSI 413": "PSI 315",
  "BIO 444": "BIO 343", "CSO 425": "CSO 222",
  "EST 452": "EST 351",
  "BIO 523": "BIO 444",
  "PSI 517": "PSI 412", "PSI 518": "PSI 413",
  "PSI 515": "BIO 444",
  "CSO 524": "CSO 425", "CSO 525": "ANT 181, CSO 425",
  "PSI 611": "PSI 515", "PSI 612": "PSI 518, PSI 414",
  "PSI 614": "CSO 525", "PSI 619": "PSI 515",
  "PSI 634": "CSO 525", "INV 633": "EST 452, FIL 262",
  "PSI 711": "PSI 611, PSI 619", "PSI 712": "PSI 611",
  "PSI 719": "PSI 614", "PSI 714": "CSO 524",
  "CSO 726": "PSI 634", "INV 734": "INV 633",
  "PSI 816": "PSI 517", "PSI 815": "PSI 612",
  "PSI 817": "PSI 712", "PSI 813": "PSI 719",
  "PSI 811": "PSI 714",
  "CSO 827": "CSO 726", "INV 835": "INV 734",
  "PSI 912": "PSI 816", "PSI 918": "PSI 815",
  "PSI 913": "PSI 817", "PSI 914": "PSI 816",
  "INV 936": "INV 835", "INV 915": "INV 835",
  "PSI 916": "PSI 611",
  "PPP 100": "8vo sem. concluido",
  "GRL 001": "9no sem. concluido",
  "GDI 001": "9no sem. concluido",
  "OPT 001": "PSI 611", "OPT 002": "ANT 181",
  "OPT 003": "BIO 444", "OPT 004": "CSO 121",
  "OPT 005": "INV 232", "OPT 006": "CSO 524",
  "OPT 007": "OPT 006", "OPT 008": "PSI 611",
  "OPT 009": "CSO 222", "OPT 010": "PSI 611",
  "OPT 011": "PSI 816",
};

// ─────────────────────────────────────────────────────────────
// 13. CLASIFICACIÓN DEL ESTUDIANTE
//  Devuelve: { plan, maxSemNum, maxSemNombre, totalAprobadas }
//
//  Plan 148-1 → aprobó ≥39 materias  Y  tiene alguna de 7mo-10mo
//  Plan 148-2 → todos los demás (nueva malla hasta 6to, antigua desde 7mo)
// ─────────────────────────────────────────────────────────────
function calcularSituacion(est) {
  let totalAprobadas = 0;
  let maxSemNum = 0;
  let maxSemNombre = "";

  CONVALIDACIONES.forEach((r) => {
    const sigla = r[0],
      sem = r[2];
    const nota = est[sigla];
    const n =
      nota != null && nota !== "" && !isNaN(Number(nota)) ? Number(nota) : null;
    if (n !== null && n >= 51) {
      totalAprobadas++;
      const sn = SEM_NUM[sem] || 0;
      if (sn > maxSemNum) {
        maxSemNum = sn;
        maxSemNombre = sem;
      }
    }
  });

  const tieneAlto = maxSemNum >= 7;
  const plan = totalAprobadas >= 39 && tieneAlto ? "148-1" : "148-2";
  return { plan, maxSemNum, maxSemNombre, totalAprobadas };
}

// ─────────────────────────────────────────────────────────────
// 14. SUGERENCIAS DE INSCRIPCIÓN
//  Devuelve: { plan, maxSemNum, totalAprobadas, gestion1[], gestion2[] }
//
//  Reglas:
//  • Plan 148-1  → sugerencias de malla ANTIGUA 148-1 (todas las pendientes)
//  • Plan 148-2  → primero pendientes de NUEVA MALLA 148-2 (sem 1-6)
//                  luego pendientes de MALLA ANTIGUA 148-1 (sem 7+)
//  • Máximo 7 materias por gestión
// ─────────────────────────────────────────────────────────────
function getSugerencias(est) {
  const { plan, maxSemNum, totalAprobadas, maxSemNombre } =
    calcularSituacion(est);

  /* ── Pendientes nueva malla 148-2 (sem 1-6) ─────────────── */
  const processedNueva = new Set();
  const pendNueva = [];
  CONVALIDACIONES.forEach((conv) => {
    const [
      siglaAnt,
      nombreAnt,
      semAnt,
      siglaNueva,
      nombreNueva,
      semNuevo,
      tipo,
    ] = conv;
    if (!siglaNueva || tipo === "ELIMINADA") return;
    const semN = SEM_NUM[semNuevo] || 0;
    if (semN < 1 || semN > 6) return;
    if (processedNueva.has(siglaNueva)) return;
    // ¿ya aprobada vía alguna materia antigua?
    const origs = CONVALIDACIONES.filter(
      (c) => c[3] === siglaNueva && c[6] !== "ELIMINADA",
    ).map((c) => est[c[0]]);
    const aprobada = origs.some((nota) => {
      const n = nota != null && !isNaN(Number(nota)) ? Number(nota) : null;
      return n !== null && n >= 51;
    });
    if (!aprobada) {
      processedNueva.add(siglaNueva);
      pendNueva.push({
        sigla: siglaNueva,
        nombre: nombreNueva,
        semNum: semN,
        semNombre: semNuevo,
        malla: "148-2",
      });
    }
  });
  pendNueva.sort((a, b) => a.semNum - b.semNum);

  /* ── Pendientes malla antigua 148-1 (sem 7+) ────────────── */
  const pendAntigua7 = [];
  CONVALIDACIONES.forEach((conv) => {
    const [sigla, nombre, sem, , , , tipo] = conv;
    const semN = SEM_NUM[sem] || 0;
    if (semN < 7) return;
    if (SEMS_FILTRO.has(sem) && !SIGLAS_SIEMPRE_9_10.has(sigla)) return;
    const nota = est[sigla];
    const n = nota != null && !isNaN(Number(nota)) ? Number(nota) : null;
    if (n === null || n < 51) {
      pendAntigua7.push({
        sigla,
        nombre,
        semNum: semN,
        semNombre: sem,
        tipo,
        malla: "148-1",
      });
    }
  });
  pendAntigua7.sort((a, b) => a.semNum - b.semNum);

  /* ── Pendientes malla antigua 148-1 COMPLETA (para plan 148-1) ── */
  const pendAntiguaAll = [];
  CONVALIDACIONES.forEach((conv) => {
    const [sigla, nombre, sem, , , , tipo] = conv;
    const semN = SEM_NUM[sem] || 0;
    if (semN < 1) return;
    if (SEMS_FILTRO.has(sem) && !SIGLAS_SIEMPRE_9_10.has(sigla)) return;
    const nota = est[sigla];
    const n = nota != null && !isNaN(Number(nota)) ? Number(nota) : null;
    if (n === null || n < 51) {
      pendAntiguaAll.push({
        sigla,
        nombre,
        semNum: semN,
        semNombre: sem,
        tipo,
        malla: "148-1",
      });
    }
  });
  pendAntiguaAll.sort((a, b) => a.semNum - b.semNum);

  /* ── Armar lista final ───────────────────────────────────── */
  let pool;
  if (plan === "148-1") {
    pool = pendAntiguaAll;
  } else {
    // 148-2: primero completa nueva malla (1-6), luego antigua (7+)
    pool = [...pendNueva, ...pendAntigua7];
  }

  const gestion1 = pool.slice(0, 7);
  const gestion2 = pool.slice(7, 14);

  return { plan, maxSemNum, maxSemNombre, totalAprobadas, gestion1, gestion2, pool };
}

// ─────────────────────────────────────────────────────────────
// 15. RENDER SUGERENCIAS  (vista resumen + modal edición)
// ─────────────────────────────────────────────────────────────

let sugSeleccion = {};
let sugEstActual = null;
let sugPoolCache = [];

const SEM_NAMES_SUG = ["", "Primer", "Segundo", "Tercer", "Cuarto",
  "Quinto", "Sexto", "Séptimo", "Octavo", "Noveno", "Décimo"];

function inicializarSeleccion(est, pool) {
  const id = est.id || est.Registro;
  if (sugEstActual === id) return;
  sugEstActual = id;
  sugSeleccion = {};

  // Si ya hay datos guardados en Supabase, precargar desde ahí
  const g1Saved = est._gestion1_2026 || [];
  const g2Saved = est._gestion2_2026 || [];
  if (g1Saved.length > 0 || g2Saved.length > 0) {
    g1Saved.forEach(sigla => { sugSeleccion[sigla] = 'g1'; });
    g2Saved.forEach(sigla => { sugSeleccion[sigla] = 'g2'; });
  } else {
    // Auto-sugerencia por defecto
    pool.slice(0, 7).forEach(m => { sugSeleccion[m.sigla] = 'g1'; });
    pool.slice(7, 14).forEach(m => { sugSeleccion[m.sigla] = 'g2'; });
  }
}

/* Clic en card pendiente: cicla none → g1 → g2 → none */
window.sugCiclar = function (sigla) {
  const actual = sugSeleccion[sigla] || null;
  if (actual === null) {
    const cG1 = Object.values(sugSeleccion).filter(v => v === 'g1').length;
    if (cG1 >= 7) {
      const cG2 = Object.values(sugSeleccion).filter(v => v === 'g2').length;
      if (cG2 >= 7) { alert('Ambas gestiones están llenas (7/7).'); return; }
      sugSeleccion[sigla] = 'g2';
    } else {
      sugSeleccion[sigla] = 'g1';
    }
  } else if (actual === 'g1') {
    const cG2 = Object.values(sugSeleccion).filter(v => v === 'g2').length;
    if (cG2 >= 7) { sugSeleccion[sigla] = null; }
    else { sugSeleccion[sigla] = 'g2'; }
  } else {
    sugSeleccion[sigla] = null;
  }
  actualizarModalMalla();
};

/* Quitar materia de una gestión (desde panel inferior) */
window.sugQuitar = function (sigla) {
  sugSeleccion[sigla] = null;
  actualizarModalMalla();
};

/* Abre el modal grande con la malla */
window.abrirModalMalla = function () {
  const est = estudianteActual;
  if (!est) return;
  const { pool } = getSugerencias(est);
  sugPoolCache = pool;
  inicializarSeleccion(est, pool);

  let overlay = document.getElementById('modalMallaOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'modalMallaOverlay';
    overlay.className = 'modal-malla-overlay';
    document.body.appendChild(overlay);
  }
  overlay.style.display = 'flex';
  actualizarModalMalla();
  document.body.style.overflow = 'hidden';
};

/* Guardar selección en Supabase y cerrar */
window.guardarModalMalla = async function () {
  const est = estudianteActual;
  if (!est) return;

  // Construir arrays de siglas
  const g1 = Object.entries(sugSeleccion).filter(([, v]) => v === 'g1').map(([s]) => s);
  const g2 = Object.entries(sugSeleccion).filter(([, v]) => v === 'g2').map(([s]) => s);

  // Feedback: deshabilitar botón
  const btn = document.querySelector('.mm-btn-save');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';
  }

  try {
    const { error } = await supabase
      .from('estudiantes')
      .update({
        gestion1_2026: g1,
        gestion2_2026: g2
      })
      .eq('registro', est.Registro);

    if (error) throw error;

    // Actualizar datos locales para que al recargar se precarguen
    est._gestion1_2026 = g1;
    est._gestion2_2026 = g2;

    // Cerrar modal
    const overlay = document.getElementById('modalMallaOverlay');
    if (overlay) overlay.style.display = 'none';
    document.body.style.overflow = '';
    renderSugerencias(est);

    // Toast de éxito
    mostrarToast('Selección guardada correctamente', 'ok');
  } catch (err) {
    console.error('Error al guardar selección:', err);
    mostrarToast('Error al guardar: ' + (err.message || err), 'error');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Guardar y cerrar';
    }
  }
};

/* Toast helper */
function mostrarToast(msg, tipo) {
  const t = document.createElement('div');
  t.className = 'toast-msg toast-' + tipo;
  t.innerHTML = `<i class="fa-solid ${tipo === 'ok' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i> ${msg}`;
  document.body.appendChild(t);
  setTimeout(() => { t.classList.add('toast-show'); }, 10);
  setTimeout(() => { t.classList.remove('toast-show'); setTimeout(() => t.remove(), 300); }, 3000);
}

/* ── Imprimir Hoja de Ruta en PDF ──────────────────────────── */
window.imprimirHojaRuta = function () {
  const est = estudianteActual;
  if (!est) return;

  const { plan, totalAprobadas, maxSemNum, pool } = getSugerencias(est);
  const semActualStr = maxSemNum > 0 ? SEM_NAMES_SUG[maxSemNum] + ' Semestre' : '—';
  const displayPlan = plan === "148-2" ? "Plan 148-2" : "Plan 148-1";

  // Reutilizar lógica de agrupación para la malla en el PDF
  let mallaCols = '';

  if (plan === '148-2') {
    // ── PLAN 148-2: Malla Nueva (1-6) + Antigua (7-10) ────────
    const SEMS_NUEVA = [
      { key: "PRIMER SEMESTRE", label: "1° N", color: "#1d4ed8" },
      { key: "SEGUNDO SEMESTRE", label: "2° N", color: "#1e40af" },
      { key: "TERCER SEMESTRE", label: "3° N", color: "#1a56db" },
      { key: "CUARTO SEMESTRE", label: "4° N", color: "#6d28d9" },
      { key: "QUINTO SEMESTRE", label: "5° N", color: "#7c3aed" },
      { key: "SEXTO SEMESTRE", label: "6° N", color: "#a21caf" }
    ];
    const SEMS_ANT_7PLUS = [
      { key: "SÉPTIMO SEMESTRE", label: "7°", color: "#be185d" },
      { key: "OCTAVO SEMESTRE", label: "8°", color: "#b91c1c" },
      { key: "NOVENO SEMESTRE", label: "9°", color: "#92400e" },
      { key: "DÉCIMO SEMESTRE", label: "10°", color: "#065f46" }
    ];

    const byNueva = {};
    CONVALIDACIONES.forEach(conv => {
      const [siglaAnt, , , siglaNueva, nombreNueva, semNuevo, tipo] = conv;
      if (!siglaNueva || tipo === 'ELIMINADA') return;
      const k = semNuevo || 'ELECTIVA';
      if (!byNueva[k]) byNueva[k] = {};
      if (!byNueva[k][siglaNueva]) {
        byNueva[k][siglaNueva] = { siglaNueva, nombreNueva, tipo, origs: [] };
      }
      byNueva[k][siglaNueva].origs.push({ siglaAnt, nombreAnt: conv[1], nota: est[siglaAnt] });
    });

    const byAnt = {};
    CONVALIDACIONES.forEach(r => {
      const sigla = r[0], nombre = r[1], sem = r[2], tipo = r[6], orden = r[7];
      const semN = SEM_NUM[sem] || 0;
      if (semN < 7) return;
      if (SEMS_FILTRO.has(sem) && !SIGLAS_SIEMPRE_9_10.has(sigla)) {
        const n = Number(est[sigla]);
        if (isNaN(n) || n < 51) return;
      }
      if (!byAnt[sem]) byAnt[sem] = [];
      byAnt[sem].push({ sigla, nombre, tipo, orden });
    });

    // Renderizar las 10 columnas (6 nuevas + 4 antiguas)
    [...SEMS_NUEVA, ...SEMS_ANT_7PLUS].forEach((sec, idx) => {
      let content = '';
      if (idx < 6) {
        // Malla Nueva
        const items = Object.values(byNueva[sec.key] || {});
        items.forEach(it => {
          const res = it.origs.reduce((best, o) => {
            const n = o.nota != null && !isNaN(Number(o.nota)) ? Number(o.nota) : null;
            return n !== null && (best === null || n > best) ? n : best;
          }, null);
          const aprobada = res !== null && res >= 51;
          const reprobada = res !== null && res < 51;
          const sel = sugSeleccion[it.siglaNueva] || null;

          let bg, borderCol, color, notaStr, badge = '';
          if (aprobada) { bg = '#dcfce7'; borderCol = '#16a34a'; color = '#15803d'; notaStr = '✓'; }
          else if (reprobada) { bg = '#fee2e2'; borderCol = '#dc2626'; color = '#dc2626'; notaStr = '✗'; }
          else if (sel === 'g1') { bg = '#dbeafe'; borderCol = '#1e3a8a'; color = '#1e3a8a'; notaStr = ''; badge = '<span style="background:#1e3a8a;color:#fff;font-size:5px;padding:0 2px;border-radius:2px;margin-left:2px">G1</span>'; }
          else if (sel === 'g2') { bg = '#ede9fe'; borderCol = '#6d28d9'; color = '#6d28d9'; notaStr = ''; badge = '<span style="background:#6d28d9;color:#fff;font-size:5px;padding:0 2px;border-radius:2px;margin-left:2px">G2</span>'; }
          else { bg = '#f8fafc'; borderCol = '#cbd5e1'; color = '#64748b'; notaStr = 'PEND'; }

          const origText = it.origs.map(o => `<div style="font-size:4.5px;line-height:1">${o.nombreAnt || o.siglaAnt} - <b>${o.siglaAnt}</b></div>`).join('');

          content += `<div style="padding:2px;border:1px solid ${borderCol};border-radius:2px;font-size:6.5px;background:${bg};margin-bottom:2px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1px">
              <b>${it.siglaNueva}</b>${badge}
              <span style="color:${color};font-weight:700;font-size:6px">${notaStr}</span>
            </div>
            <div style="font-size:5.5px;font-weight:600;line-height:1.1">${it.nombreNueva}</div>
            <div style="margin-top:2px;border-top:1px solid ${borderCol}40;padding-top:1px">
              <span style="font-size:4.5px;color:#6b7280;display:block">antes:</span>
              ${origText}
            </div>
          </div>`;
        });
      } else {
        // Malla Antigua (7-10)
        const mats = byAnt[sec.key] || [];
        mats.sort((a, b) => (a.orden ?? 999) - (b.orden ?? 999));
        mats.forEach(m => {
          const n = Number(est[m.sigla]);
          const aprobada = !isNaN(n) && n >= 51;
          const reprobada = !isNaN(n) && n < 51;
          const sel = sugSeleccion[m.sigla] || null;

          let bg, borderCol, color, notaStr, badge = '';
          if (aprobada) { bg = '#dcfce7'; borderCol = '#16a34a'; color = '#15803d'; notaStr = '✓'; }
          else if (reprobada) { bg = '#fee2e2'; borderCol = '#dc2626'; color = '#dc2626'; notaStr = '✗'; }
          else if (sel === 'g1') { bg = '#dbeafe'; borderCol = '#1e3a8a'; color = '#1e3a8a'; notaStr = ''; badge = '<span style="background:#1e3a8a;color:#fff;font-size:5px;padding:0 2px;border-radius:2px;margin-left:2px">G1</span>'; }
          else if (sel === 'g2') { bg = '#ede9fe'; borderCol = '#6d28d9'; color = '#6d28d9'; notaStr = ''; badge = '<span style="background:#6d28d9;color:#fff;font-size:5px;padding:0 2px;border-radius:2px;margin-left:2px">G2</span>'; }
          else { bg = '#fef9c3'; borderCol = '#f59e0b'; color = '#92400e'; notaStr = 'PEND'; }

          content += `<div style="padding:2px;border:1px solid ${borderCol};border-radius:2px;font-size:6.5px;background:${bg};margin-bottom:2px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1px">
              <b>${m.sigla}</b>${badge}
              <span style="color:${color};font-weight:700;font-size:6px">${notaStr}</span>
            </div>
            <div style="font-size:5.5px;font-weight:600;line-height:1.1">${m.nombre}</div>
          </div>`;
        });
      }

      mallaCols += `<td style="vertical-align:top;width:10%;padding:1px">
        <div style="background:${sec.color}15;border:1px solid ${sec.color}40;color:${sec.color};border-radius:2px;padding:1px;font-size:6px;font-weight:800;text-align:center;margin-bottom:2px">
          ${sec.label}
        </div>
        ${content}
      </td>`;
    });

  } else {
    // ── PLAN 148-1: Malla Antigua Completa (10 columnas) ──────
    const byKey = {};
    CONVALIDACIONES.forEach(r => {
      const sigla = r[0], nombre = r[1], sem = r[2], tipo = r[6], orden = r[7];
      if (SEMS_FILTRO.has(sem) && !SIGLAS_SIEMPRE_9_10.has(sigla)) {
        const n = Number(est[sigla]);
        if (isNaN(n) || n < 51) return;
      }
      if (!byKey[sem]) byKey[sem] = [];
      byKey[sem].push({ sigla, nombre, tipo, orden });
    });

    SECS_SEMESTRES.forEach(sec => {
      const mats = byKey[sec.key] || [];
      mats.sort((a, b) => (a.orden ?? 999) - (b.orden ?? 999));
      let matRows = '';
      mats.forEach(m => {
        const n = Number(est[m.sigla]);
        const aprobada = !isNaN(n) && n >= 51;
        const reprobada = !isNaN(n) && n < 51;
        const sel = sugSeleccion[m.sigla] || null;

        let bg, borderCol, color, notaStr, badge = '';
        if (aprobada) { bg = '#dcfce7'; borderCol = '#16a34a'; color = '#15803d'; notaStr = '✓'; }
        else if (reprobada) { bg = '#fee2e2'; borderCol = '#dc2626'; color = '#dc2626'; notaStr = '✗'; }
        else if (sel === 'g1') { bg = '#dbeafe'; borderCol = '#1e3a8a'; color = '#1e3a8a'; notaStr = ''; badge = '<span style="background:#1e3a8a;color:#fff;font-size:5px;padding:0 2px;border-radius:2px;margin-left:2px">G1</span>'; }
        else if (sel === 'g2') { bg = '#ede9fe'; borderCol = '#6d28d9'; color = '#6d28d9'; notaStr = ''; badge = '<span style="background:#6d28d9;color:#fff;font-size:5px;padding:0 2px;border-radius:2px;margin-left:2px">G2</span>'; }
        else if (m.tipo === 'ELIMINADA') { bg = '#f3f4f6'; borderCol = '#d1d5db'; color = '#9ca3af'; notaStr = 'ELIM'; }
        else { bg = '#fef9c3'; borderCol = '#f59e0b'; color = '#92400e'; notaStr = 'PEND'; }

        matRows += `<div style="padding:2px;border:1px solid ${borderCol};border-radius:2px;font-size:6.5px;background:${bg};margin-bottom:2px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1px">
            <b>${m.sigla}</b>${badge}
            <span style="color:${color};font-weight:700;font-size:6px">${notaStr}</span>
          </div>
          <div style="font-size:5.5px;font-weight:600;line-height:1.1">${m.nombre}</div>
        </div>`;
      });
      mallaCols += `<td style="vertical-align:top;width:10%;padding:1px">
        <div style="background:${sec.color}15;border:1px solid ${sec.color}40;color:${sec.color};border-radius:2px;padding:1px;font-size:6px;font-weight:800;text-align:center;margin-bottom:2px">
          ${sec.label}
        </div>
        ${matRows}
      </td>`;
    });
  }

  // Tablas de selección G1/G2
  const selG1 = Object.entries(sugSeleccion).filter(([, v]) => v === 'g1').map(([s]) => s);
  const selG2 = Object.entries(sugSeleccion).filter(([, v]) => v === 'g2').map(([s]) => s);
  const siglaToNombreMap = {};
  pool.forEach(m => { siglaToNombreMap[m.sigla] = m.nombre; });

  function tablaImpresion(titulo, lista, colorBg) {
    let filas = lista.map((sigla, i) => {
      const nombre = siglaToNombreMap[sigla] || sigla;
      return `<tr><td style="text-align:center;width:20px">${i + 1}</td><td style="font-weight:700;width:60px">${sigla}</td><td>${nombre}</td></tr>`;
    }).join('');
    if (!lista.length) filas = '<tr><td colspan="3" style="text-align:center;color:#9ca3af;font-style:italic">Sin materias asignadas</td></tr>';
    return `<div style="flex:1">
      <div style="background:${colorBg};color:#fff;padding:3px 6px;border-radius:3px 3px 0 0;font-weight:700;font-size:8px">${titulo} (${lista.length}/7)</div>
      <table style="width:100%;border-collapse:collapse;font-size:7px">
        <thead><tr style="background:#f8fafc"><th style="padding:1px 3px;text-align:left">#</th><th style="padding:1px 3px;text-align:left">Sigla</th><th style="padding:1px 3px;text-align:left">Materia</th></tr></thead>
        <tbody>${filas}</tbody>
      </table>
    </div>`;
  }

  const fechaHoy = new Date().toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const tituloPagina = plan === "148-2" ? "AVANCE EN MALLA NUEVA 148-2" : "AVANCE EN MALLA ANTIGUA (148-1)";

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Hoja de Ruta - ${est.Nombre}</title>
<style>
  @page { size: landscape; margin: 5mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 8px; color: #1e293b; padding: 2mm; }
  .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #1e3a8a; padding-bottom: 3px; margin-bottom: 5px; }
  .header h1 { font-size: 14px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; }
  .header .info { text-align: right; line-height: 1.2; }
  .stats { display: flex; gap: 10px; margin-bottom: 5px; }
  .stat { background: #f1f5f9; padding: 2px 6px; border-radius: 3px; border: 1px solid #e2e8f0; }
  .stat b { color: #1e3a8a; }
  .legend { display: flex; gap: 8px; margin-bottom: 5px; font-size: 6.5px; color: #64748b; }
  .leg-item { display: flex; align-items: center; gap: 3px; }
  .leg-dot { width: 7px; height: 7px; border-radius: 1px; border: 1px solid #cbd5e1; }
  .malla-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  .section-title { font-size: 9px; font-weight: 800; color: #1e3a8a; margin: 6px 0 3px; border-left: 3px solid #1e3a8a; padding-left: 6px; text-transform: uppercase; }
  .sel-wrap { display: flex; gap: 10px; }
  table td, table th { border: 1px solid #e2e8f0; padding: 1px 3px; }
  .footer { margin-top: 8px; font-size: 6px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 3px; }
</style>
</head><body>
  <div class="header">
    <div>
      <h1>📋 HOJA DE RUTA</h1>
      <div style="font-size:7px;font-weight:700;color:#64748b">${tituloPagina}</div>
    </div>
    <div class="info">
      <div style="font-size:9px;font-weight:800;color:#1e3a8a">${est.Nombre}</div>
      <div style="font-size:7px;font-weight:600">Registro: ${est.Registro} — Fecha: ${fechaHoy}</div>
    </div>
  </div>

  <div class="stats">
    <span class="stat">Semestre Actual: <b>${semActualStr}</b></span>
    <span class="stat">Aprobadas: <b>${totalAprobadas}</b></span>
    <span class="stat">Situación: <b>${displayPlan}</b></span>
  </div>

  <div class="legend">
    <div class="leg-item"><span class="leg-dot" style="background:#dcfce7;border-color:#16a34a"></span> Aprobada</div>
    <div class="leg-item"><span class="leg-dot" style="background:#fee2e2;border-color:#dc2626"></span> Reprobada</div>
    <div class="leg-item"><span class="leg-dot" style="background:#fef9c3;border-color:#f59e0b"></span> Pendiente</div>
    <div class="leg-item"><span class="leg-dot" style="background:#dbeafe;border-color:#1e3a8a"></span> G1/2026</div>
    <div class="leg-item"><span class="leg-dot" style="background:#ede9fe;border-color:#6d28d9"></span> G2/2026</div>
  </div>

  <div class="section-title">CONTROL DE AVANCE ACADÉMICO</div>
  <table class="malla-table"><tr>${mallaCols}</tr></table>

  <div class="section-title">MATERIAS SUGERIDAS PARA GESTIÓN 2026</div>
  <div class="sel-wrap">
    ${tablaImpresion('Gestión 1/2026', selG1, '#1e3a8a')}
    ${tablaImpresion('Gestión 2/2026', selG2, '#6d28d9')}
  </div>

  <div class="footer">Este documento es una guía académica sugerida generada el ${fechaHoy}.</div>
</body></html>`;

  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.onload = () => { win.print(); };
};

window.cerrarModalMalla = function () {
  const overlay = document.getElementById('modalMallaOverlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
  renderSugerencias(estudianteActual);
};

/* Reconstruye el contenido del modal */
function actualizarModalMalla() {
  const est = estudianteActual;
  const overlay = document.getElementById('modalMallaOverlay');
  if (!overlay || !est) return;

  const { plan } = getSugerencias(est);
  const cntG1 = Object.values(sugSeleccion).filter(v => v === 'g1').length;
  const cntG2 = Object.values(sugSeleccion).filter(v => v === 'g2').length;
  const siglasPool = new Set(sugPoolCache.map(m => m.sigla));

  // Map sigla → nombre para tablas inferiores
  const siglaToNombre = {};
  sugPoolCache.forEach(m => { siglaToNombre[m.sigla] = m.nombre; });

  // ── Helper: card de materia en el modal ──────────────────────
  function cardMatModal(sigla, nombre, notaVal, esPendientePool, type = 'antigua', origs = []) {
    const n = notaVal != null && notaVal !== '' && !isNaN(Number(notaVal)) ? Number(notaVal) : null;
    const aprobada = n !== null && n >= 51;
    const reprobada = n !== null && n < 51;
    const sel = sugSeleccion[sigla] || null;

    let cls = 'mm-card';
    if (aprobada) cls += ' mm-aprobada';
    else if (reprobada) cls += ' mm-reprobada';
    else if (sel === 'g1') cls += ' mm-sel-g1-card';
    else if (sel === 'g2') cls += ' mm-sel-g2-card';
    else if (esPendientePool) cls += ' mm-pendiente mm-clickable';
    else cls += ' mm-otra';

    const clickAttr = esPendientePool && !aprobada
      ? `onclick="sugCiclar('${sigla}')" style="cursor:pointer"` : '';

    let selBadge = '';
    if (sel === 'g1') selBadge = '<span class="mm-sel mm-sel-g1">G1</span>';
    if (sel === 'g2') selBadge = '<span class="mm-sel mm-sel-g2">G2</span>';

    let statusTag = '';
    if (aprobada) statusTag = `<span class="mm-nota mm-nota-ok"><i class="fa-solid fa-circle-check"></i> Aprobada</span>`;
    else if (reprobada) statusTag = `<span class="mm-nota mm-nota-fail"><i class="fa-solid fa-circle-xmark"></i> Reprobada</span>`;

    // Convalidación (para malla antigua)
    let convInfo = "";
    if (type === 'antigua') {
      const c = CONV_BY_SIGLA[sigla];
      if (c && c[3]) {
        convInfo = `<div class="mm-mat-extra">convalida con: <b>${c[3]}</b></div>`;
      }
    }

    // Prerrequisitos
    let prereqInfo = "";
    const req = type === 'nueva' ? PREREQ_148_2[sigla] : PREREQ_148_1[sigla];
    // if (req) {
    //   prereqInfo = `<div class="mm-mat-extra"><i class="fa-solid fa-key"></i> ${req}</div>`;
    // }

    // Orígenes (para malla nueva)
    let origInfo = "";
    if (type === 'nueva' && origs.length > 0) {
      const origsHtml = origs.map(o => `<span>${o.siglaAnt}</span>`).join(', ');
      origInfo = `<div class="mm-mat-extra">antes: ${origsHtml}</div>`;
    }

    return `<div class="${cls}" ${clickAttr}>
      <div class="mm-card-head">
        <span class="mm-sigla">${sigla}</span>
        ${selBadge}${statusTag}
      </div>
      <div class="mm-nombre">${nombre}</div>
      <div class="mm-card-footer">
        ${convInfo}${prereqInfo}${origInfo}
      </div>
    </div>`;
  }

  // ── Construir grid de semestres según plan ──────────────────
  let semCols = '';

  if (plan === '148-2') {
    // ── PLAN 148-2: Malla Nueva (sem 1-6) + Antigua (sem 7+) ──
    const SEMS_NUEVA_MODAL = [
      { key: "PRIMER SEMESTRE", label: "1° N", color: "#1d4ed8" },
      { key: "SEGUNDO SEMESTRE", label: "2° N", color: "#1e40af" },
      { key: "TERCER SEMESTRE", label: "3° N", color: "#1a56db" },
      { key: "CUARTO SEMESTRE", label: "4° N", color: "#6d28d9" },
      { key: "QUINTO SEMESTRE", label: "5° N", color: "#7c3aed" },
      { key: "SEXTO SEMESTRE", label: "6° N", color: "#a21caf" },
    ];
    const SEMS_ANT_7PLUS = [
      { key: "SÉPTIMO SEMESTRE", label: "7°", color: "#be185d" },
      { key: "OCTAVO SEMESTRE", label: "8°", color: "#b91c1c" },
      { key: "NOVENO SEMESTRE", label: "9°", color: "#92400e" },
      { key: "DÉCIMO SEMESTRE", label: "10°", color: "#065f46" },
    ];

    // Agrupar malla nueva por semestre (siglaNueva, deduplicadas)
    const byNueva = {};
    CONVALIDACIONES.forEach(conv => {
      const [siglaAnt, , , siglaNueva, nombreNueva, semNuevo, tipo] = conv;
      if (!siglaNueva || tipo === 'ELIMINADA') return;
      const k = semNuevo || 'ELECTIVA';
      if (!byNueva[k]) byNueva[k] = {};
      if (!byNueva[k][siglaNueva]) {
        byNueva[k][siglaNueva] = { siglaNueva, nombreNueva, tipo, origs: [] };
      }
      byNueva[k][siglaNueva].origs.push({ siglaAnt, nota: est[siglaAnt] });
    });

    // Columnas malla nueva (1-6)
    SEMS_NUEVA_MODAL.forEach(sec => {
      const items = Object.values(byNueva[sec.key] || {});
      const cards = items.map(it => {
        // Estado: aprobada si alguna orig >= 51
        const bestNota = it.origs.reduce((best, o) => {
          const n = o.nota != null && !isNaN(Number(o.nota)) ? Number(o.nota) : null;
          return n !== null && (best === null || n > best) ? n : best;
        }, null);
        const aprobada = bestNota !== null && bestNota >= 51;
        const notaForCard = aprobada ? bestNota : (bestNota !== null && bestNota < 51 ? bestNota : null);
        const esPend = siglasPool.has(it.siglaNueva);
        return cardMatModal(it.siglaNueva, it.nombreNueva, notaForCard, esPend, 'nueva', it.origs);
      }).join('');

      semCols += `
        <div class="mm-sem-col">
          <div class="mm-sem-header" style="background:${sec.color}18;border-color:${sec.color}50;color:${sec.color}">
            <span class="mm-sem-num">${sec.label}</span>
            <span class="mm-sem-count">${items.length}</span>
          </div>
          <div class="mm-sem-body">${cards}</div>
        </div>`;
    });

    // Separador visual
    semCols += `<div class="mm-separator"><span>148-1</span></div>`;

    // Columnas malla antigua (7+)
    const byAnt = {};
    CONVALIDACIONES.forEach(r => {
      const sigla = r[0], nombre = r[1], sem = r[2], tipo = r[6], orden = r[7];
      const semN = SEM_NUM[sem] || 0;
      if (semN < 7) return;
      if (SEMS_FILTRO.has(sem) && !SIGLAS_SIEMPRE_9_10.has(sigla)) {
        const nota = est[sigla];
        const n = nota != null && nota !== '' && !isNaN(Number(nota)) ? Number(nota) : null;
        if (n === null || n < 51) return;
      }
      if (!byAnt[sem]) byAnt[sem] = [];
      byAnt[sem].push({ sigla, nombre, tipo, orden });
    });
    Object.values(byAnt).forEach(arr => arr.sort((a, b) => (a.orden ?? 999) - (b.orden ?? 999)));

    SEMS_ANT_7PLUS.forEach(sec => {
      const mats = byAnt[sec.key] || [];
      const cards = mats.map(m => {
        const nota = est[m.sigla];
        const esPend = siglasPool.has(m.sigla);
        return cardMatModal(m.sigla, m.nombre, nota, esPend);
      }).join('');
      semCols += `
        <div class="mm-sem-col">
          <div class="mm-sem-header" style="background:${sec.color}18;border-color:${sec.color}50;color:${sec.color}">
            <span class="mm-sem-num">${sec.label}</span>
            <span class="mm-sem-count">${mats.length}</span>
          </div>
          <div class="mm-sem-body">${cards}</div>
        </div>`;
    });

  } else {
    // ── PLAN 148-1: Malla Antigua completa ────────────────────
    const byKey = {};
    CONVALIDACIONES.forEach(r => {
      const sigla = r[0], nombre = r[1], sem = r[2], tipo = r[6], orden = r[7];
      if (SEMS_FILTRO.has(sem) && !SIGLAS_SIEMPRE_9_10.has(sigla)) {
        const nota = est[sigla];
        const n = nota != null && nota !== '' && !isNaN(Number(nota)) ? Number(nota) : null;
        if (n === null || n < 51) return;
      }
      if (!byKey[sem]) byKey[sem] = [];
      byKey[sem].push({ sigla, nombre, tipo, orden });
    });
    Object.values(byKey).forEach(arr => arr.sort((a, b) => (a.orden ?? 999) - (b.orden ?? 999)));

    SECS_SEMESTRES.forEach(sec => {
      const mats = byKey[sec.key] || [];
      const cards = mats.map(m => {
        const nota = est[m.sigla];
        const esPend = siglasPool.has(m.sigla);
        return cardMatModal(m.sigla, m.nombre, nota, esPend);
      }).join('');
      semCols += `
        <div class="mm-sem-col">
          <div class="mm-sem-header" style="background:${sec.color}18;border-color:${sec.color}50;color:${sec.color}">
            <span class="mm-sem-num">${sec.label}</span>
            <span class="mm-sem-count">${mats.length}</span>
          </div>
          <div class="mm-sem-body">${cards}</div>
        </div>`;
    });
  }

  // Panel inferior: materias seleccionadas como tablas
  const selG1 = Object.entries(sugSeleccion).filter(([, v]) => v === 'g1').map(([s]) => s);
  const selG2 = Object.entries(sugSeleccion).filter(([, v]) => v === 'g2').map(([s]) => s);

  function tablaGestion(lista, gest, titulo, cnt) {
    const colorCls = gest === 'g1' ? 'mm-tbl-g1' : 'mm-tbl-g2';
    const filas = lista.length
      ? lista.map((sigla, i) => {
        const nombre = siglaToNombre[sigla] || sigla;
        return `<tr>
            <td class="mm-tbl-num">${i + 1}</td>
            <td class="mm-tbl-sigla">${sigla}</td>
            <td class="mm-tbl-nombre">${nombre}</td>
            <td class="mm-tbl-action"><i class="fa-solid fa-xmark mm-tbl-remove" onclick="event.stopPropagation();sugQuitar('${sigla}')" title="Quitar"></i></td>
          </tr>`;
      }).join('')
      : `<tr><td colspan="4" class="mm-tbl-empty">Sin materias asignadas</td></tr>`;
    return `<div class="mm-panel-col ${colorCls}">
      <div class="mm-panel-title"><i class="fa-solid fa-calendar-days"></i> ${titulo} <span class="mm-panel-cnt">${cnt}/7</span></div>
      <table class="mm-tbl">
        <thead><tr><th>#</th><th>Sigla</th><th>Materia</th><th></th></tr></thead>
        <tbody>${filas}</tbody>
      </table>
    </div>`;
  }

  overlay.innerHTML = `
    <div class="modal-malla-content">
      <div class="mm-header-bar">
        <div class="mm-title">
          <i class="fa-solid fa-table-cells-large"></i>
          Seleccionar materias — ${est.Nombre}
        </div>
        <div class="mm-counters">
          <span class="sug-counter ${cntG1 >= 7 ? 'sug-counter-full' : ''}">
            <i class="fa-solid fa-calendar-days sug-g1-icon"></i> G1: <b>${cntG1}</b>/7
          </span>
          <span class="sug-counter ${cntG2 >= 7 ? 'sug-counter-full' : ''}">
            <i class="fa-solid fa-calendar-days sug-g2-icon"></i> G2: <b>${cntG2}</b>/7
          </span>
        </div>
        <button class="mm-close" onclick="cerrarModalMalla()">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="mm-legend">
        <span class="mm-leg-item"><span class="mm-dot mm-dot-ok"></span> Aprobada</span>
        <span class="mm-leg-item"><span class="mm-dot mm-dot-fail"></span> Reprobada</span>
        <span class="mm-leg-item"><span class="mm-dot mm-dot-pend"></span> Pendiente</span>
        <span class="mm-leg-item"><span class="mm-dot mm-dot-g1"></span> G1/2026</span>
        <span class="mm-leg-item"><span class="mm-dot mm-dot-g2"></span> G2/2026</span>
        <span class="mm-leg-item"><i class="fa-solid fa-hand-pointer"></i> Clic para asignar</span>
      </div>
      <div class="mm-malla-scroll">
        <div class="mm-malla-grid">
          ${semCols}
        </div>
      </div>
      <div class="mm-bottom-panel">
        ${tablaGestion(selG1, 'g1', 'Gestión 1/2026', cntG1)}
        ${tablaGestion(selG2, 'g2', 'Gestión 2/2026', cntG2)}
        <div class="mm-panel-actions">
          <button class="mm-btn-print" onclick="imprimirHojaRuta()">
            <i class="fa-solid fa-print"></i> Imprimir PDF
          </button>
          <button class="mm-btn-save" onclick="guardarModalMalla()">
            <i class="fa-solid fa-check"></i> Guardar y cerrar
          </button>
        </div>
      </div>
    </div>`;
}

/* ── renderSugerencias: solo modo VISTA ─────────────────────── */
function renderSugerencias(est) {
  const container = document.getElementById("contentSug");
  const { plan, maxSemNum, totalAprobadas, gestion1: autoG1,
    gestion2: autoG2, pool } = getSugerencias(est);

  inicializarSeleccion(est, pool);

  const semActualStr = maxSemNum > 0
    ? `${SEM_NAMES_SUG[maxSemNum]} Semestre (${maxSemNum}°)` : "Sin aprobadas";

  const planBadge = plan === "148-1"
    ? `<span class="plan-badge plan-148-1"><i class="fa-solid fa-book"></i> Plan 148-1 (Malla Antigua)</span>`
    : `<span class="plan-badge plan-148-2"><i class="fa-solid fa-book-open"></i> Plan 148-2 (Malla Nueva hasta 6°)</span>`;

  const noticiaPlan = plan === "148-2"
    ? `<div class="sug-notice">⚠️ <b>Plan 148-2:</b> Nueva malla hasta 6°. Desde 7° continúa con 148-1.</div>`
    : `<div class="sug-notice sug-notice-ok">✔ <b>Plan 148-1:</b> Permanece en Malla Antigua.</div>`;

  // Usar selección personalizada si hay
  const g1 = pool.filter(m => sugSeleccion[m.sigla] === 'g1');
  const g2 = pool.filter(m => sugSeleccion[m.sigla] === 'g2');
  const useG1 = g1.length > 0 || g2.length > 0 ? g1 : autoG1;
  const useG2 = g1.length > 0 || g2.length > 0 ? g2 : autoG2;

  function cardMat(m) {
    const mallaCls = m.malla === "148-1" ? "sug-card-antigua" : "sug-card-nueva";
    const mallaIcon = m.malla === "148-1"
      ? '<i class="fa-solid fa-book"></i>' : '<i class="fa-solid fa-book-open"></i>';
    return `<div class="sug-card ${mallaCls}">
      <div class="sug-card-top">
        <span class="sug-sigla">${m.sigla}</span>
        <span class="sug-malla-tag">${mallaIcon} ${m.malla}</span>
      </div>
      <div class="sug-nombre">${m.nombre}</div>
      <div class="sug-sem">${m.semNombre}</div>
    </div>`;
  }

  function colGestion(titulo, colorCls, mats) {
    const items = mats.length
      ? mats.map(cardMat).join("")
      : `<div class="sug-empty"><i class="fa-solid fa-circle-check"></i> Sin materias</div>`;
    return `<div class="sug-col">
      <div class="sug-col-head ${colorCls}">
        <span><i class="fa-solid fa-calendar-days"></i> ${titulo}</span>
        <span class="sug-count">${mats.length} / 7</span>
      </div>
      <div class="sug-col-body">${items}</div>
    </div>`;
  }

  container.innerHTML = `
    <div class="sug-wrap">
      <div class="sug-head-info">
        ${planBadge}
        <div class="sug-stats-row">
          <span class="sug-stat-chip"><i class="fa-solid fa-graduation-cap"></i> <b>${semActualStr}</b></span>
          <span class="sug-stat-chip"><i class="fa-solid fa-circle-check"></i> Aprobadas: <b>${totalAprobadas}</b></span>
        </div>
        ${noticiaPlan}
      </div>
      <div class="sug-edit-bar">
        <button class="sug-edit-toggle" onclick="abrirModalMalla()">
          <i class="fa-solid fa-pen-to-square"></i> Editar selección
        </button>
      </div>
      <div class="sug-columns">
        ${colGestion("Gestión 1/2026", "sug-head-g1", useG1)}
        ${colGestion("Gestión 2/2026", "sug-head-g2", useG2)}
      </div>
      ${useG1.length + useG2.length === 0
      ? '<div class="sug-notice sug-notice-ok">🎉 ¡Sin materias pendientes!</div>'
      : ''}
    </div>`;
}



// ─────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────
cargarEstudiantes();
