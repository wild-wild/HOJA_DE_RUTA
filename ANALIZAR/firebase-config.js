// Firebase SDK v10 – módulos ES
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    query,
    orderBy,
    limit,
    startAfter,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDgTL3KlSvtvXeaLMRIgC4IWIbpM5FxNeE",
    authDomain: "psiconet-hoja-de-ruta.firebaseapp.com",
    projectId: "psiconet-hoja-de-ruta",
    storageBucket: "psiconet-hoja-de-ruta.firebasestorage.app",
    messagingSenderId: "486390420148",
    appId: "1:486390420148:web:1e64bd9fcd9b8f043cfde1",
    measurementId: "G-SQQY602BCT",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, getDocs, query, orderBy, limit, startAfter };