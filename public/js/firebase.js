/**
 * firebase.js - Realtime interaction logger & data storage for Mahima's Birthday Site
 * Collection: "mahima"
 * Captures all button clicks, text, treat selections, candle blows, certificate downloads, and stage transitions
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
  console.log("Storage note:", e);
}

// -------------------------------------------------------------
// Core Logger: writes all interactions to Firestore collection "mahima"
// -------------------------------------------------------------
window.logMahimaAction = async function (actionType, details = {}) {
  const ts = Date.now();
  const rand = Math.random().toString(36).substring(2, 7);
  const docId = `action_${ts}_${rand}`;

  const currentStage = details.stage || window.__currentStage || (window.location.pathname.includes('disco') ? 'disco' : 1);

  const payload = {
    collection: "mahima",
    action: actionType || "click",
    buttonText: (details.buttonText || details.text || "").trim(),
    elementId: details.elementId || "",
    elementTag: details.elementTag || "",
    elementClass: details.elementClass || "",
    stage: currentStage,
    page: window.location.pathname + window.location.search,
    details: details.payload || details.extra || {},
    timestamp: new Date().toISOString(),
    localTime: new Date().toLocaleString(),
    epoch: ts,
    screen: `${window.innerWidth}x${window.innerHeight}`
  };

  try {
    await setDoc(doc(db, "mahima", docId), payload);
    console.log("✓ Logged to Firebase ['mahima']:", actionType, "| Text:", payload.buttonText);
  } catch (err) {
    console.warn("Firebase log error:", err);
  }
};

// -------------------------------------------------------------
// Save treat order & receipt document to collection "mahima"
// -------------------------------------------------------------
window.__saveTreat = async function (data, fileContent) {
  const ts = Date.now();
  const rand = Math.random().toString(36).substring(2, 8);
  const uniqueDocId = `treat_${ts}_${rand}`;
  const fileName = `mahima_birthday_treat_${ts}.txt`;

  // 1. Save document in Firestore collection "mahima"
  await setDoc(doc(db, "mahima", uniqueDocId), {
    docId: uniqueDocId,
    collection: "mahima",
    type: "treat_selection",
    action: "treat_confirmed",
    fileName: fileName,
    fileContent: fileContent || data.fileContent || "",
    recipient: "Mahima (The Market Expert)",
    orderId: data.orderId || "",
    treatName: data.treat || "",
    customNote: data.customNote || "",
    address: data.address || "",
    payload: data,
    createdAt: new Date().toISOString(),
    timestamp: new Date().toISOString(),
    epoch: ts
  });

  console.log("✓ Saved treat order in Firebase ['mahima']:", uniqueDocId);

  // 2. Upload text receipt to Firebase Storage
  if (storage && (fileContent || data.fileContent)) {
    try {
      const storageRef = ref(storage, `mahima/${fileName}`);
      await uploadString(storageRef, fileContent || data.fileContent, "raw");
      console.log("✓ Uploaded receipt to Firebase Storage:", `mahima/${fileName}`);
    } catch (storageErr) {
      console.log("Storage note:", storageErr);
    }
  }

  return uniqueDocId;
};

// -------------------------------------------------------------
// Global Click Listener: automatically captures EVERY button & link click
// -------------------------------------------------------------
document.addEventListener('click', function (e) {
  const target = e.target.closest('button, a, .treat-option-card, .polaroid-card, .step-indicator, input[type="button"], input[type="submit"], [role="button"]');
  if (!target) return;

  const btnText = (target.innerText || target.textContent || target.value || target.getAttribute('aria-label') || target.title || '').trim().replace(/\s+/g, ' ').slice(0, 150);
  const elId = target.id || '';
  const elClass = target.className || '';
  const elTag = target.tagName || '';

  let action = 'button_click';
  if (elId === 'stage1NextBtn') action = 'ring_opening_bell';
  else if (elId === 'stage2NextBtn') action = 'next_to_stage3';
  else if (elId === 'stage3NextBtn') action = 'next_to_stage4';
  else if (elId === 'stage4NextBtn') action = 'next_to_stage5';
  else if (elId === 'blowCakeBtn') action = 'blow_candles';
  else if (elId === 'downloadCertBtn') action = 'download_certificate';
  else if (elId === 'launchDiscoBtn' || elId === 'hpProceedBtn') action = 'enter_disco';
  else if (elId === 'discoBackBtn') action = 'disco_back';
  else if (elId === 'replayBtn') action = 'replay_clicked';
  else if (target.classList.contains('treat-option-card')) action = 'treat_card_clicked';
  else if (target.classList.contains('polaroid-card')) action = 'photo_zoom_clicked';
  else if (target.classList.contains('step-indicator')) action = 'stage_indicator_jump';
  else if (elId === 'play') action = 'disco_play_pause';
  else if (elId === 'fs') action = 'disco_fullscreen';
  else if (elId === 'go') action = 'disco_start';

  const extra = {};
  if (target.dataset && target.dataset.treat) extra.selectedTreat = target.dataset.treat;
  if (target.dataset && target.dataset.caption) extra.photoCaption = target.dataset.caption;
  if (target.dataset && target.dataset.tag) extra.photoTag = target.dataset.tag;
  if (target.dataset && target.dataset.step) extra.targetStep = target.dataset.step;

  window.logMahimaAction(action, {
    buttonText: btnText,
    elementId: elId,
    elementTag: elTag,
    elementClass: elClass,
    payload: extra
  });
}, true);

// -------------------------------------------------------------
// Capture Typed Text in Inputs & Textareas
// -------------------------------------------------------------
document.addEventListener('change', function (e) {
  if (e.target.tagName === 'TEXTAREA' || (e.target.tagName === 'INPUT' && e.target.type === 'text')) {
    const val = (e.target.value || '').trim();
    if (!val) return;
    window.logMahimaAction('text_input_submitted', {
      buttonText: `[Input: ${e.target.id || e.target.name || 'field'}]`,
      elementId: e.target.id || '',
      elementTag: e.target.tagName,
      payload: { 
        fieldName: e.target.id || e.target.name || 'field',
        enteredValue: val 
      }
    });
  }
}, true);

console.log("✓ Firebase Analytics Initialized for collection ['mahima']");
