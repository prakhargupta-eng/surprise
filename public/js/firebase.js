/**
 * firebase.js - Firebase integration for treat selections
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAUnJWIPnjkDKEd4J-B-L6gfAAQx4je74Y",
  authDomain: "bithday-d2a79.firebaseapp.com",
  projectId: "bithday-d2a79",
  storageBucket: "bithday-d2a79.firebasestorage.app",
  messagingSenderId: "193709716736",
  appId: "1:193709716736:web:60afc615b824165b2e6fe5",
  measurementId: "G-K3T9C7S0BL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Save preferences in Firebase with unique 'agrawal' doc id in events1 table
window.__saveTreat = async function (data) {
  const ts = Date.now();
  const rand = Math.random().toString(36).substring(2, 8);
  const uniqueDocId = `agrawal_${ts}_${rand}`;

  await setDoc(doc(db, "events1", uniqueDocId), {
    docId: uniqueDocId,
    user: "Miss Agrawal",
    type: "treat_choice",
    payload: data,
    createdAt: new Date().toISOString(),
    timestamp: new Date()
  });

  console.log("✓ Saved in Firebase under unique doc ID:", uniqueDocId);
  return uniqueDocId;
};
