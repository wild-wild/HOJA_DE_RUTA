// ============================================================
//  app.js – Hoja de Ruta Académica  (Plan 148)
//  Fuente de datos: Supabase (tabla "estudiantes")
// ============================================================
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://kylsbkxxpsntlhhsdqgw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_7KbBls3f9-VlD0uj2ZU2sg_ll3-mJ5_'; // publishable key (solo lectura con RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─────────────────────────────────────────────────────────────
// 1. TABLA DE CONVALIDACIONES  (del Excel convalidaciones.xlsx)
//    [siglaAnt, nombreAnt, semAnt, siglaNueva, nombreNueva, semNuevo, tipo, orden]
// ─────────────────────────────────────────────────────────────
const CONVALIDACIONES = [
  // PRIMER SEMESTRE
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
  // NOVENO SEMESTRE (⚠ solo DEP500 siempre; el resto solo si aprobada)
  ["DEP500", "ETICA PROFESIONAL I", "NOVENO SEMESTRE", "PSI 916", "PSICOÉTICA", "NOVENO SEMESTRE", "CONVALIDACIÓN", 1],
  ["INV500", "TALLER DE GRADO DE TESIS I", "NOVENO SEMESTRE", "INV 936", "PERFIL DE GRADO", "NOVENO SEMESTRE", "HOMOLOGACIÓN", null],
  ["INV501", "TALLER DE GRADO DE TRABAJO DIRIGIDO I", "NOVENO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["INV502", "TALLER DE GRADO DE PROYECTO SOCIAL I", "NOVENO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["CSO452", "PSICOLOGÍA AMBIENTAL I", "NOVENO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["CSO453", "PSICOLOGÍA COMUNITARIA I", "NOVENO SEMESTRE", "PSI 714", "PSICOLOGÍA COMUNITARIA", "SÉPTIMO SEMESTRE", "HOMOLOGACIÓN", null],
  ["CSO454", "PSICOLOGÍA DE LAS ORGANIZACIONES I", "NOVENO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["PSI500", "ABORDAJE CLÍNICO I", "NOVENO SEMESTRE", "PSI 712", "INTERVENCIÓN CLÍNICA HUMANISTA", "SÉPTIMO SEMESTRE", "COMPENSACIÓN", null],
  ["PSI501", "ABORDAJE EDUCATIVO I", "NOVENO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["PSI502", "ABORDAJE SOCIO ORGANIZACIONAL I", "NOVENO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["PSI600", "ABORDAJE CLÍNICO I", "NOVENO SEMESTRE", "PSI 816", "INTERVENCIÓN CLÍNICA COGNITIVO CONDUCTUAL I", "OCTAVO SEMESTRE", "HOMOLOGACIÓN", null],
  ["PSI601", "ABORDAJE EDUCATIVO I", "NOVENO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["PSI602", "ABORDAJE SOCIO-ORGANIZACIONAL I", "NOVENO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["PSI700", "ABORDAJE CLÍNICO I", "NOVENO SEMESTRE", "PSI 711", "INTERVENCIÓN CLÍNICA PSICOANALÍTICA", "SÉPTIMO SEMESTRE", "CONVALIDACIÓN", null],
  ["PSI701", "ABORDAJE EDUCATIVO I", "NOVENO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["PSI702", "ABORDAJE SOCIO-ORGANIZACIONAL I", "NOVENO SEMESTRE", "", "", "", "ELIMINADA", null],
  // DÉCIMO SEMESTRE (⚠ solo DEP501 siempre; el resto solo si aprobada)
  ["DEP501", "ETICA PROFESIONAL II", "DÉCIMO SEMESTRE", "", "", "", "ELIMINADA", 1],
  ["CSO455", "PSICOLOGÍA AMBIENTAL II", "DÉCIMO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["CSO456", "PSICOLOGÍA COMUNITARIA II", "DÉCIMO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["CSO457", "PSICOLOGÍA DE LAS ORGANIZACIONES II", "DÉCIMO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["PSI503", "ABORDAJE CLÍNICO II", "DÉCIMO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["PSI504", "ABORDAJE EDUCATIVO II", "DÉCIMO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["PSI505", "ABORDAJE SOCIO-ORGANIZACIONAL II", "DÉCIMO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["PSI603", "ABORDAJE CLÍNICO II", "DÉCIMO SEMESTRE", "PSI 912", "INTERVENCIÓN CLÍNICA COGNITIVO CONDUCTUAL II", "NOVENO SEMESTRE", "HOMOLOGACIÓN", null],
  ["PSI604", "ABORDAJE EDUCATIVO II", "DÉCIMO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["PSI605", "ABORDAJE SOCIO-ORGANIZACIONAL II", "DÉCIMO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["PSI703", "ABORDAJE CLÍNICO II", "DÉCIMO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["PSI704", "ABORDAJE EDUCATIVO II", "DÉCIMO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["PSI705", "ABORDAJE SOCIO-ORGANIZACIONAL II", "DÉCIMO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["INV503", "TALLER DE GRADO DE TESIS II", "DÉCIMO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["INV504", "TALLER DE GRADO DE TRABAJO DIRIGIDO II", "DÉCIMO SEMESTRE", "", "", "", "ELIMINADA", null],
  ["INV505", "TALLER DE GRADO DE PROYECTO SOCIAL II", "DÉCIMO SEMESTRE", "", "", "", "ELIMINADA", null],
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
  // (INV500-505, CSO452-457, PSI500-705 están en NOVENO/DÉCIMO SEMESTRE arriba)
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
  ["INFORME", "PRÁCTICAS REALIZADAS EN DIRECCIÓN DE CARRERA E INSTITUCIONES O UNIDADES", "PRÁCTICAS", "PPP 100", "PRÁCTICA PRE PROFESIONAL", "NOVENO SEMESTRE", "NUEVA ASIGNATURA", null],
];

// Siglas que se muestran SIEMPRE en 9no/10mo (sin importar si tiene nota)
const SIGLAS_SIEMPRE_9_10 = new Set(["DEP500", "DEP501"]);
// Semestres donde aplica el filtro "solo mostrar si aprobada"
const SEMS_FILTRO = new Set(["NOVENO SEMESTRE", "DÉCIMO SEMESTRE"]);

// Índice rápido: siglaAntigua → registro de convalidación
const CONV_BY_SIGLA = {};
CONVALIDACIONES.forEach(r => { CONV_BY_SIGLA[r[0]] = r; });

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
        .from('estudiantes')
        .select('*')
        .range(from, from + PAGE - 1)
        .order('nombre', { ascending: true });

      if (error) throw error;
      if (!data || data.length === 0) break;

      // Normalizar: reconstruir objeto compatible con la lógica de mallas
      // Supabase guarda: registro, nombre, fec_ingreso, niv_min, mat_venc + materias (JSONB)
      // La app usa: Registro, Nombre, Fec_ingreso, Niv_min, Mat_venc + est[siglaAnt]
      const normalizados = data.map(row => {
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
        };
        // Expandir materias JSONB a nivel raíz: est["ANT100"] = 75
        if (row.materias && typeof row.materias === 'object') {
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
  return nombre.trim().split(/\s+/).slice(0, 2).map(p => p[0]).join("").toUpperCase();
}

const COLS_INFO = ["Registro", "Nombre", "Fec_ingreso", "Niv_min", "Mat_venc",
  "id", "_total_aprobadas", "_total_pendientes", "_total_materias", "_porcentaje_avance"];

function calcPorcentaje(est) {
  const siglas = Object.keys(est).filter(k => !COLS_INFO.includes(k));
  if (!siglas.length) return 0;
  const aprobadas = siglas.filter(s => est[s] != null && !isNaN(Number(est[s]))).length;
  return Math.round(aprobadas / siglas.length * 100);
}

function renderLista(lista) {
  const ul = document.getElementById("studentList");
  ul.innerHTML = "";
  document.getElementById("searchCount").textContent =
    lista.length !== todosLosEstudiantes.length
      ? `${lista.length} de ${todosLosEstudiantes.length}`
      : `${lista.length} estudiantes`;

  lista.forEach(est => {
    const pct = est["_porcentaje_avance"] ?? calcPorcentaje(est);
    const venc = est["Mat_venc"] ?? "–";
    const li = document.createElement("li");
    li.className = "student-item" + (estudianteActual?.id === est.id ? " active" : "");
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
  estudianteActual = est;
  document.querySelectorAll(".student-item").forEach(el =>
    el.classList.toggle("active", el.dataset.id === est.id));

  document.getElementById("placeholder").style.display = "none";
  document.getElementById("studentDetail").style.display = "block";

  document.getElementById("detAvatar").textContent = iniciales(est.Nombre);
  document.getElementById("detNombre").textContent = est.Nombre ?? "–";
  document.getElementById("detRegistro").textContent = "Reg: " + (est.Registro ?? "–");
  document.getElementById("detIngreso").textContent = "Ingreso: " + (est.Fec_ingreso ?? "–");
  document.getElementById("detVenc").textContent = "Mat. vencidas: " + (est.Mat_venc ?? "–");

  const pct = est["_porcentaje_avance"] ?? calcPorcentaje(est);
  document.getElementById("detPct").textContent = pct + "%";
  const circ = 2 * Math.PI * 32;
  const ring = document.getElementById("ringFill");
  ring.style.strokeDasharray = circ;
  ring.style.strokeDashoffset = circ - (pct / 100) * circ;

  mostrarTab(tabActual);
}

// ─────────────────────────────────────────────────────────────
// 6. TABS
// ─────────────────────────────────────────────────────────────
window.mostrarTab = function (tab) {
  tabActual = tab;
  ["antigua", "nueva", "conv"].forEach(t => {
    document.getElementById("content" + t.charAt(0).toUpperCase() + t.slice(1)).style.display =
      t === tab ? "block" : "none";
    document.getElementById("tab" + t.charAt(0).toUpperCase() + t.slice(1)).classList.toggle("active", t === tab);
  });
  if (!estudianteActual) return;
  if (tab === "antigua") renderMallaAntigua(estudianteActual);
  if (tab === "nueva") renderMallaNueva(estudianteActual);
  if (tab === "conv") renderTablaConv(estudianteActual);
};

// ─────────────────────────────────────────────────────────────
// 7. HELPERS DE TARJETA DE MATERIA
// ─────────────────────────────────────────────────────────────
function claseMateria(nota, tipo) {
  const n = nota != null && nota !== "" && !isNaN(Number(nota)) ? Number(nota) : null;
  if (tipo === "ELIMINADA") {
    // Si tiene nota: colorear igual que una materia cursada
    if (n !== null) return n >= 51 ? "mat-card mat-aprobada mat-era-eliminada" : "mat-card mat-reprobada mat-era-eliminada";
    return "mat-card mat-eliminada";  // sin nota: gris/rosa
  }
  if (n === null) return "mat-card mat-pendiente";
  return n >= 51 ? "mat-card mat-aprobada" : "mat-card mat-reprobada";
}

function etiquetaMateria(nota, tipo) {
  const n = nota != null && nota !== "" && !isNaN(Number(nota)) ? Number(nota) : null;
  if (tipo === "ELIMINADA") {
    if (n !== null) return n >= 51 ? `✓ ${n}` : `✗ ${n}`;
    return "❌ Eliminada";
  }
  if (n === null) return "⏳ Pendiente";
  return n >= 51 ? `✓ ${n}` : `✗ ${n}`;
}

function tarjetaMateria(sigla, nombre, nota, tipo, mostrarConv = true) {
  const cls = claseMateria(nota, tipo);
  const etq = etiquetaMateria(nota, tipo);
  // Mostrar badge de tipo para todas (incluyendo ELIMINADA)
  const convTag = tipo
    ? `<div class="conv-tag conv-${tipo.toLowerCase().split(' ')[0]}">${tipo}</div>` : "";
  return `<div class="${cls}">
    <div class="mat-sigla">${sigla}</div>
    <div class="mat-nombre">${nombre}</div>
    <div class="mat-nota">${etq}</div>
    ${convTag}
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
  CONVALIDACIONES.forEach(r => {
    const sigla = r[0], nombre = r[1], sem = r[2], tipo = r[6], orden = r[7];

    if (SEMS_FILTRO.has(sem) && !SIGLAS_SIEMPRE_9_10.has(sigla)) {
      // Solo incluir si el estudiante tiene la materia aprobada
      const nota = est[sigla];
      const n = nota != null && nota !== "" && !isNaN(Number(nota)) ? Number(nota) : null;
      if (n === null || n < 51) return; // no mostrar
    }

    if (!byKey[sem]) byKey[sem] = [];
    byKey[sem].push({ sigla, nombre, tipo, orden });
  });
  // Ordenar por ORDEN (las materias sin orden quedan al final)
  Object.values(byKey).forEach(arr => {
    arr.sort((a, b) => (a.orden ?? 999) - (b.orden ?? 999));
  });

  let html = "";

  // ─ BLOQUE HORIZONTAL: semestres 1 al 10 ─
  html += `<div class="malla-wrap">`;

  // Fila de cabeceras
  html += `<div class="malla-horizontal">`;
  SECS_SEMESTRES.forEach(sec => {
    const mats = byKey[sec.key] || [];
    html += `
      <div class="sem-col">
        <div class="sem-col-header" style="background:${sec.color}20;border-color:${sec.color}60;color:${sec.color}">
          <span class="sem-num">${sec.label}</span>
          <span class="sem-full-name">${sec.key}</span>
          <span class="sem-count">${mats.length} mat.</span>
        </div>
        <div class="sem-col-body">
          ${mats.map(m => tarjetaMateria(m.sigla, m.nombre, est[m.sigla], m.tipo)).join("")}
        </div>
      </div>`;
  });
  html += `</div>`; // /malla-horizontal

  // ─ BLOQUE EXTRA: Electivas, Talleres, Prácticas ─
  SECS_EXTRA.forEach(sec => {
    const mats = byKey[sec.key] || [];
    if (!mats.length) return;
    html += `
      <div class="extra-section">
        <div class="extra-header" style="border-color:${sec.color}60;color:${sec.color}">
          ${sec.label}
          <span class="extra-count">${mats.length} materias</span>
        </div>
        <div class="extra-grid">
          ${mats.map(m => tarjetaMateria(m.sigla, m.nombre, est[m.sigla], m.tipo)).join("")}
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
  const aprobada = it.origs.some(o => o.nota != null && !isNaN(Number(o.nota)) && Number(o.nota) >= 51);
  const tieneNota = it.origs.some(o => o.nota != null && !isNaN(Number(o.nota)));

  // Clase de color según estado y tipo
  let cls;
  if (aprobada) {
    cls = "mat-card mat-nueva mat-aprobada";
  } else if (tieneNota) {
    cls = "mat-card mat-nueva mat-reprobada";
  } else {
    cls = it.tipo === "HOMOLOGACIÓN" ? "mat-card mat-nueva mat-homolog"
      : it.tipo === "CONVALIDACIÓN" ? "mat-card mat-nueva mat-convalid"
        : it.tipo === "COMPENSACIÓN" ? "mat-card mat-nueva mat-compens"
          : it.tipo === "NUEVA ASIGNATURA" ? "mat-card mat-nueva mat-pendiente"
            : "mat-card mat-nueva mat-pendiente";
  }

  // Nota o estado a mostrar
  let notaLabel;
  if (aprobada) {
    const max = Math.max(...it.origs.filter(o => o.nota != null && !isNaN(Number(o.nota))).map(o => Number(o.nota)));
    notaLabel = `✓ ${max}`;
  } else if (tieneNota) {
    const max = Math.max(...it.origs.filter(o => o.nota != null && !isNaN(Number(o.nota))).map(o => Number(o.nota)));
    notaLabel = `✗ ${max}`;
  } else {
    notaLabel = "⏳ Pendiente";
  }

  // Badge de tipo
  const tipoCls = `tipo-badge tipo-${it.tipo.split(' ')[0].toLowerCase()}`;
  const tipoBadge = `<span class="${tipoCls}">${it.tipo}</span>`;

  // Chips de origen: sigla + nombre abreviado
  const origChips = it.origs.map(o => {
    const nombre = o.nombreAnt ? o.nombreAnt.replace(/(.{20})..+/, "$1…") : o.siglaAnt;
    return `<span class="orig-chip" title="${o.nombreAnt ?? o.siglaAnt}">
          <b>${o.siglaAnt}</b> ${nombre}
        </span>`;
  }).join("");

  return `<div class="${cls}">
      <div class="nueva-header">
        <span class="mat-sigla-nueva">${it.siglaNueva}</span>
        ${tipoBadge}
      </div>
      <div class="mat-nombre">${it.nombreNueva}</div>
      <div class="mat-nota-nueva">${notaLabel}</div>
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
  CONVALIDACIONES.forEach(conv => {
    const [siglaAnt, nombreAnt, semAnt, siglaNueva, nombreNueva, semNuevo, tipo] = conv;
    if (!siglaNueva || tipo === "ELIMINADA") return;
    const k = semNuevo || "ELECTIVA";
    if (!byKey[k]) byKey[k] = {};
    if (!byKey[k][siglaNueva]) byKey[k][siglaNueva] = { siglaNueva, nombreNueva, tipo, origs: [] };
    byKey[k][siglaNueva].origs.push({ siglaAnt, nombreAnt, nota: est[siglaAnt] });
  });

  let html = `<div class="malla-wrap">`;

  // Horizontal semestres nuevos
  html += `<div class="malla-horizontal">`;
  SEMS_NUEVA.forEach(sec => {
    const items = Object.values(byKey[sec.key] || {});
    html += `
      <div class="sem-col">
        <div class="sem-col-header" style="background:${sec.color}20;border-color:${sec.color}60;color:${sec.color}">
          <span class="sem-num">${sec.label}</span>
          <span class="sem-full-name">${sec.key}</span>
          <span class="sem-count">${items.length} mat.</span>
        </div>
        <div class="sem-col-body">
          ${items.map(it => buildCardNueva(it)).join("")}
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
        ${electNueva.map(it => buildCardNueva(it)).join("")}
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
  const filas = CONVALIDACIONES.map(conv => {
    const [siglaAnt, nombreAnt, semAnt, siglaNueva, nombreNueva, semNuevo, tipo] = conv;
    const nota = est[siglaAnt];
    const n = nota != null && nota !== "" && !isNaN(Number(nota)) ? Number(nota) : null;
    let estadoCls = "est-pendiente", estado = "Pendiente";
    if (tipo === "ELIMINADA") { estadoCls = "est-eliminada"; estado = "Eliminada"; }
    else if (n !== null && n >= 51) { estadoCls = "est-aprobada"; estado = n; }
    else if (n !== null && n < 51) { estadoCls = "est-reprobada"; estado = n + " ✗"; }

    return `<tr>
      <td><span class="sigla-chip">${siglaAnt}</span></td>
      <td>${nombreAnt}</td>
      <td class="sem-cell">${semAnt}</td>
      <td>${siglaNueva ? `<span class="sigla-chip sigla-nueva">${siglaNueva}</span>` : "–"}</td>
      <td>${nombreNueva || "–"}</td>
      <td class="sem-cell">${semNuevo || "–"}</td>
      <td><span class="tipo-badge tipo-${tipo.split(' ')[0].toLowerCase()}">${tipo}</span></td>
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
document.getElementById("searchInput").addEventListener("input", e => {
  const q = e.target.value.trim().toLowerCase();
  estudianteFiltrado = !q
    ? [...todosLosEstudiantes]
    : todosLosEstudiantes.filter(est =>
      (est.Nombre ?? "").toLowerCase().includes(q) ||
      (est.Registro ?? "").toString().toLowerCase().includes(q)
    );
  renderLista(estudianteFiltrado);
});

// ─────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────
cargarEstudiantes();
