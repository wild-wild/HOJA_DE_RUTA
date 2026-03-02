import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import {
    CONVALIDACIONES,
    SECS_SEMESTRES,
    SECS_EXTRA,
} from "./data.js";

const SUPABASE_URL = "https://kylsbkxxpsntlhhsdqgw.supabase.co";
const SUPABASE_KEY = "sb_publishable_7KbBls3f9-VlD0uj2ZU2sg_ll3-mJ5_";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
    }
});

// State
let selectedSubjects = new Set(); // Siglas del Plan 148-1 (Antiguo)
let tabActual = "antigua";

// Tab Switching
window.mostrarTab = function (tab) {
    tabActual = tab;
    ["antigua", "nueva"].forEach((t) => {
        const cont = document.getElementById("content" + t.charAt(0).toUpperCase() + t.slice(1));
        const btn = document.getElementById("tab" + t.charAt(0).toUpperCase() + t.slice(1));
        if (cont) cont.style.display = t === tab ? "block" : "none";
        if (btn) btn.classList.toggle("active", t === tab);
    });
    renderCurrentMalla();
};

function renderCurrentMalla() {
    if (tabActual === "antigua") renderMallaAntigua();
    else renderMallaNueva();
}

// ─────────────────────────────────────────────────────────────
// 1. MALLA ANTIGUA (Plan 148-1)
// ─────────────────────────────────────────────────────────────
function renderMallaAntigua() {
    const container = document.getElementById("mallaAntigua");
    const byKey = {};

    CONVALIDACIONES.forEach((r) => {
        const sigla = r[0], nombre = r[1], sem = r[2], tipo = r[6], orden = r[7];
        if (!byKey[sem]) byKey[sem] = [];
        byKey[sem].push({ sigla, nombre, tipo, orden });
    });

    Object.values(byKey).forEach(arr => arr.sort((a, b) => (a.orden ?? 999) - (b.orden ?? 999)));

    let html = '<div class="malla-horizontal">';
    SECS_SEMESTRES.forEach(sec => {
        const mats = byKey[sec.key] || [];
        html += `
            <div class="sem-col">
                <div class="sem-col-header" style="background:${sec.color}20;border-color:${sec.color}60;color:${sec.color}">
                    <span class="sem-num">${sec.label}</span>
                    <span class="sem-full-name">${sec.key}</span>
                </div>
                <div class="sem-col-body">
                    ${mats.map(m => createMatCardAntigua(m)).join("")}
                </div>
            </div>`;
    });
    html += '</div>';

    SECS_EXTRA.forEach(sec => {
        const mats = byKey[sec.key] || [];
        if (!mats.length) return;
        html += `
            <div class="extra-section mt-8">
                <div class="extra-header" style="border-color:${sec.color}60;color:${sec.color}">
                    ${sec.label}
                </div>
                <div class="extra-grid">
                    ${mats.map(m => createMatCardAntigua(m)).join("")}
                </div>
            </div>`;
    });

    container.innerHTML = html;
    attachEvents();
}

function createMatCardAntigua(m) {
    const isEliminated = m.tipo === "ELIMINADA";
    const isSelected = selectedSubjects.has(m.sigla);
    let cls = "mat-card relative cursor-pointer";
    if (isEliminated) cls += " mat-eliminada";
    else if (isSelected) cls += " selected";
    else cls += " mat-pendiente";

    if (isEliminated && isSelected) cls += " selected";

    return `
        <div class="${cls}" data-sigla="${m.sigla}" data-type="antigua">
            <div class="mat-sigla">${m.sigla}</div>
            <div class="mat-nombre">${m.nombre}</div>
            ${isEliminated ? '<div class="conv-tag conv-eliminada">Eliminada</div>' : ''}
        </div>`;
}

// ─────────────────────────────────────────────────────────────
// 2. MALLA NUEVA (Plan 148-2)
// ─────────────────────────────────────────────────────────────
function renderMallaNueva() {
    const container = document.getElementById("mallaNueva");
    const byKey = {};

    CONVALIDACIONES.forEach((conv) => {
        const [siglaAnt, nombreAnt, semAnt, siglaNueva, nombreNueva, semNuevo, tipo] = conv;
        if (!siglaNueva || tipo === "ELIMINADA") return;

        if (!byKey[semNuevo]) byKey[semNuevo] = {};
        if (!byKey[semNuevo][siglaNueva]) {
            byKey[semNuevo][siglaNueva] = { siglaNueva, nombreNueva, tipo, origs: [] };
        }
        byKey[semNuevo][siglaNueva].origs.push({ siglaAnt, nombreAnt });
    });

    let html = '<div class="malla-horizontal">';
    SECS_SEMESTRES.forEach(sec => {
        const items = Object.values(byKey[sec.key] || {});
        html += `
            <div class="sem-col">
                <div class="sem-col-header" style="background:${sec.color}20;border-color:${sec.color}60;color:${sec.color}">
                    <span class="sem-num">${sec.label}</span>
                    <span class="sem-full-name">${sec.key}</span>
                </div>
                <div class="sem-col-body">
                    ${items.map(it => createMatCardNueva(it)).join("")}
                </div>
            </div>`;
    });
    html += '</div>';

    container.innerHTML = html;
    attachEvents();
}

function createMatCardNueva(it) {
    const isAprobada = it.origs.some(o => selectedSubjects.has(o.siglaAnt));
    let cls = "mat-card relative cursor-pointer";
    if (isAprobada) cls += " selected";
    else {
        cls += " mat-pendiente";
        if (it.tipo !== "NUEVA ASIGNATURA") cls += " opacity-75";
    }

    return `
        <div class="${cls}" data-sigla-nueva="${it.siglaNueva}" data-type="nueva">
            <div class="mat-sigla">${it.siglaNueva}</div>
            <div class="mat-nombre">${it.nombreNueva}</div>
            <div class="text-[9px] mt-1 text-slate-400">Origen: ${it.origs.map(o => o.siglaAnt).join(", ")}</div>
        </div>`;
}

// ─────────────────────────────────────────────────────────────
// 3. EVENTOS Y LÓGICA
// ─────────────────────────────────────────────────────────────
function attachEvents() {
    document.querySelectorAll('.mat-card').forEach(card => {
        card.addEventListener('click', () => {
            if (card.dataset.type === "antigua") {
                toggleSubjectAntigua(card.dataset.sigla);
            } else {
                toggleSubjectNueva(card.dataset.siglaNueva);
            }
        });
    });
}

function toggleSubjectAntigua(sigla) {
    if (selectedSubjects.has(sigla)) {
        selectedSubjects.delete(sigla);
    } else {
        selectedSubjects.add(sigla);
    }
    updateUI();
}

function toggleSubjectNueva(siglaNueva) {
    // Cuando hacen clic en una nueva, marcamos TODAS sus originarias como aprobadas (o desaprobadas)
    const mappings = CONVALIDACIONES.filter(c => c[3] === siglaNueva);
    const someSelected = mappings.some(c => selectedSubjects.has(c[0]));

    if (someSelected) {
        mappings.forEach(c => selectedSubjects.delete(c[0]));
    } else {
        mappings.forEach(c => selectedSubjects.add(c[0]));
    }
    updateUI();
}

function updateUI() {
    renderCurrentMalla();
    document.getElementById("selectedCount").textContent = `${selectedSubjects.size} materias seleccionadas`;
}

// Save Functionality
async function handleSave() {
    const nombre = document.getElementById("nombre").value.trim().toUpperCase();
    const registro = document.getElementById("registro").value.trim();
    const fec_ingreso = document.getElementById("fecha_ingreso").value.trim();

    if (!nombre || !registro) {
        showToast("Nombre y Registro son obligatorios", "error");
        return;
    }

    const btn = document.getElementById("btnSave");
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';

    const materiasObj = {};
    selectedSubjects.forEach(sigla => {
        materiasObj[sigla] = "51";
    });

    const total_aprobadas = selectedSubjects.size;
    const total_materias = CONVALIDACIONES.filter(r => r[6] !== "ELIMINADA").length;
    const porcentaje_avance = Math.round((total_aprobadas / total_materias) * 100);

    const payload = {
        registro: registro,
        nombre: nombre,
        fec_ingreso: fec_ingreso,
        materias: materiasObj,
        total_aprobadas,
        total_materias,
        porcentaje_avance,
        niv_min: "–",
        mat_venc: "–"
    };

    try {
        const { error } = await supabase.from("estudiantes").insert([payload]);
        if (error) throw error;

        showToast("¡Estudiante registrado con éxito!", "ok");
        setTimeout(() => { window.location.href = "analizar.html"; }, 1500);
    } catch (err) {
        console.error(err);
        showToast("Error al guardar: " + err.message, "error");
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Guardar Estudiante';
    }
}

function showToast(msg, tipo) {
    const container = document.getElementById("toastContainer");
    const t = document.createElement("div");
    t.className = `p-4 mb-2 rounded shadow-lg text-white transform transition-all duration-300 translate-y-full ${tipo === 'ok' ? 'bg-green-600' : 'bg-red-600'}`;
    t.innerHTML = `<i class="fa-solid ${tipo === 'ok' ? 'fa-check-circle' : 'fa-exclamation-triangle'} mr-2"></i> ${msg}`;
    container.appendChild(t);
    setTimeout(() => { t.classList.remove('translate-y-full'); }, 10);
    setTimeout(() => {
        t.classList.add('opacity-0');
        setTimeout(() => t.remove(), 300);
    }, 4000);
}

// Init
document.getElementById("btnSave").addEventListener("click", handleSave);
renderMallaAntigua();