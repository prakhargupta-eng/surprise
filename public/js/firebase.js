/**
 * firebase.js - Firebase integration for treat selections & text file storage
 * All records and files saved with 'mahima' prefix
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getStorage, ref, uploadString } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";

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
let storage = null;
try {
  storage = getStorage(app);
} catch (e) {
  console.log("Storage initialization note:", e);
}

// Save preferences and treat file in Firebase with 'mahima' prefix
window.__saveTreat = async function (data, fileContent) {
  const ts = Date.now();
  const rand = Math.random().toString(36).substring(2, 8);
  const uniqueDocId = `mahima_${ts}_${rand}`;
  const fileName = `mahima_birthday_treat_${ts}.txt`;

  // 1. Save document in Firestore 'events1' table with 'mahima' prefix
  await setDoc(doc(db, "events1", uniqueDocId), {
    docId: uniqueDocId,
    prefix: "mahima",
    fileName: fileName,
    fileContent: fileContent || data.fileContent || "",
    user: "Mahima (Expert)",
    type: "treat_choice",
    payload: data,
    createdAt: new Date().toISOString(),
    timestamp: new Date()
  });

  console.log("✓ Saved in Firestore under unique doc ID:", uniqueDocId);

  // 2. Upload text file to Firebase Storage with 'mahima' prefix if available
  if (storage && (fileContent || data.fileContent)) {
    try {
      const storageRef = ref(storage, `mahima/${fileName}`);
      await uploadString(storageRef, fileContent || data.fileContent, "raw");
      console.log("✓ Uploaded file to Firebase Storage:", `mahima/${fileName}`);
    } catch (storageErr) {
      console.log("Storage note (Firestore doc safely saved with 'mahima' prefix):", storageErr);
    }
  }

  return uniqueDocId;
};
