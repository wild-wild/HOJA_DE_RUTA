// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

console.log("Firebase module loading...");

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgTL3KlSvtvXeaLMRIgC4IWIbpM5FxNeE",
  authDomain: "psiconet-hoja-de-ruta.firebaseapp.com",
  projectId: "psiconet-hoja-de-ruta",
  storageBucket: "psiconet-hoja-de-ruta.firebasestorage.app",
  messagingSenderId: "486390420148",
  appId: "1:486390420148:web:1e64bd9fcd9b8f043cfde1",
  measurementId: "G-SQQY602BCT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Función global para guardar análisis
window.guardarAnalisis = async function (datos) {
  try {
    const docRef = await addDoc(collection(db, "analisis"), datos);
    console.log("Documento guardado con ID: ", docRef.id);
    alert("¡Análisis guardado correctamente!");
    return docRef.id;
  } catch (e) {
    console.error("Error al guardar documento: ", e);
    alert("Error al guardar el análisis. Revisa la consola.");
  }
};

// Función global para guardar registro (nuevo)
window.guardarRegistro = async function (datos) {
  try {
    const docRef = await addDoc(collection(db, "registros"), datos);
    console.log("Registro guardado con ID: ", docRef.id);
    alert("¡Registro guardado correctamente!");
    return docRef.id;
  } catch (e) {
    console.error("Error al guardar registro: ", e);
    alert("Error al guardar el registro. Revisa la consola.");
    throw e;
  }
};