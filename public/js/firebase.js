/**
 * firebase.js - Realtime Interaction Logger & Data Storage for Mahima's Birthday Site
 * Collection: "mahima"
 * Consolidates ALL visitor data into ONE cleanly categorized entry per session.
 * Automatically completes/ends session when tapping "A Final Note for You ⭐➡️" on Stage 5,
 * and starts a fresh new session on the next visit.
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, doc, setDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
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

const COLLECTION_NAME = "mahima";

// -------------------------------------------------------------
// Session Manager: One clean entry per session with lifecycle
// -------------------------------------------------------------
function startNewSession() {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, "-");
  const rand = Math.random().toString(36).substring(2, 6);
  const sid = `session_${dateStr}_${timeStr}_${rand}`;

  try {
    sessionStorage.setItem("mahima_session_id", sid);
    sessionStorage.setItem("mahima_session_start", now.toLocaleString());
    sessionStorage.setItem("mahima_click_count", "0");
    sessionStorage.removeItem("mahima_session_ended");
  } catch (e) { }

  console.log("✨ Starting fresh Mahima session:", sid);
  return sid;
}

function getSessionId() {
  // If the previous session was marked ended, start a fresh new session
  if (sessionStorage.getItem("mahima_session_ended") === "true") {
    return startNewSession();
  }

  let sid = sessionStorage.getItem("mahima_session_id");
  if (!sid) {
    sid = startNewSession();
  }
  return sid;
}

window.startNewMahimaSession = function () {
  return startNewSession();
};

function getSessionStartTime() {
  let startTime = sessionStorage.getItem("mahima_session_start");
  if (!startTime) {
    startTime = new Date().toLocaleString();
    try {
      sessionStorage.setItem("mahima_session_start", startTime);
    } catch (e) { }
  }
  return startTime;
}

function incrementClickCount() {
  let count = parseInt(sessionStorage.getItem("mahima_click_count") || "0", 10);
  count += 1;
  try {
    sessionStorage.setItem("mahima_click_count", count);
  } catch (e) { }
  return count;
}

function getDeviceInfo() {
  const ua = navigator.userAgent || "";
  let device = "Desktop";
  if (/iPad|tablet/i.test(ua)) device = "Tablet";
  else if (/iPhone|Android|Mobile/i.test(ua)) device = "Mobile";

  let browser = "Browser";
  if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Edg")) browser = "Edge";

  return `${device} (${browser})`;
}

// -------------------------------------------------------------
// End Session: Called when user reaches Stage 5 & taps "A Final Note for You ⭐➡️"
// -------------------------------------------------------------
window.endMahimaSession = async function (btnName = "A Final Note for You ⭐➡️") {
  const currentDocId = getSessionId();
  const nowLocal = new Date().toLocaleString();
  const nowIso = new Date().toISOString();

  console.log("🏁 Ending Mahima's session:", currentDocId);

  const endPayload = {
    session: {
      status: "Completed",
      endedAt: nowLocal,
      endedAtIso: nowIso,
      completedAtStage: 5,
      isSessionCompleted: true
    },
    milestones: {
      reachedFinalNote: true,
      journeyCompleted: true,
      completedAt: nowLocal
    },
    latestAction: {
      action: "session_ended",
      buttonText: btnName,
      stage: 5,
      time: nowLocal
    },
    actionsTimeline: arrayUnion({
      action: "session_ended",
      buttonText: btnName,
      stage: 5,
      time: new Date().toLocaleTimeString(),
      epoch: Date.now()
    }),
    lastUpdated: nowIso
  };

  try {
    // 1. Update the session document
    await setDoc(doc(db, COLLECTION_NAME, currentDocId), endPayload, { merge: true });
    // 2. Also keep user_journey updated
    await setDoc(doc(db, COLLECTION_NAME, "user_journey"), endPayload, { merge: true });
    console.log("✓ Session successfully closed in Firebase ['mahima/" + currentDocId + "']");
  } catch (err) {
    console.warn("Error ending session in Firebase:", err);
  }

  // Mark session as ended so that NEXT time the user interacts or visits, a new session is started
  try {
    sessionStorage.setItem("mahima_session_ended", "true");
    sessionStorage.removeItem("mahima_session_id");
  } catch (e) { }
};

// -------------------------------------------------------------
// Core Logger: Updates the session entry with categories
// -------------------------------------------------------------
window.logMahimaAction = async function (actionType, details = {}) {
  const docId = getSessionId();
  const ts = Date.now();
  const currentStage = details.stage || window.__currentStage || (window.location.pathname.includes('disco') ? 'disco' : 1);
  const btnText = (details.buttonText || details.text || "").trim();
  const clickCount = incrementClickCount();
  const nowIso = new Date().toISOString();
  const nowLocal = new Date().toLocaleString();
  const timeOnly = new Date().toLocaleTimeString();

  // Categorized Milestone Detection
  const milestonesUpdate = {};
  if (actionType === 'blow_candles') {
    milestonesUpdate['candlesBlown'] = true;
    milestonesUpdate['candlesBlownAt'] = nowLocal;
  } else if (actionType === 'download_certificate') {
    milestonesUpdate['certificateDownloaded'] = true;
    milestonesUpdate['certificateDownloadedAt'] = nowLocal;
  } else if (actionType === 'enter_disco') {
    milestonesUpdate['discoEntered'] = true;
    milestonesUpdate['discoEnteredAt'] = nowLocal;
  } else if (actionType === 'vip_pin_unlocked' || details.elementId === 'vipUnlockBtn') {
    milestonesUpdate['vipPassUnlocked'] = true;
    milestonesUpdate['vipUnlockedAt'] = nowLocal;
  } else if (details.payload && details.payload.photoCaption) {
    milestonesUpdate['lastPhotoViewed'] = details.payload.photoCaption;
  } else if (details.payload && details.payload.selectedTreat) {
    milestonesUpdate['lastTreatClicked'] = details.payload.selectedTreat;
  }

  // Categorized Stage Progression
  const stageKey = typeof currentStage === 'number' ? `stage${currentStage}` : `stage_${currentStage}`;
  const stageUpdate = {
    currentStage: currentStage,
    [stageKey]: {
      visited: true,
      lastSeenAt: nowLocal
    }
  };

  // Timeline Action Item
  const timelineItem = {
    action: actionType || "click",
    buttonText: btnText,
    stage: currentStage,
    time: timeOnly,
    epoch: ts
  };
  if (details.elementId) timelineItem.elementId = details.elementId;
  if (details.payload && Object.keys(details.payload).length > 0) {
    timelineItem.extra = details.payload;
  }

  // Master Payload
  const docPayload = {
    session: {
      visitor: "Mahima (The Market Expert)",
      sessionId: docId,
      status: "Active",
      startedAt: getSessionStartTime(),
      lastActive: nowLocal,
      lastActiveIso: nowIso,
      screen: `${window.innerWidth}x${window.innerHeight}`,
      device: getDeviceInfo(),
      page: window.location.pathname + window.location.search,
      currentStage: currentStage,
      totalActions: clickCount
    },
    stageProgress: stageUpdate,
    latestAction: {
      action: actionType || "click",
      buttonText: btnText,
      stage: currentStage,
      time: nowLocal
    },
    actionsTimeline: arrayUnion(timelineItem),
    lastUpdated: nowIso
  };

  if (Object.keys(milestonesUpdate).length > 0) {
    docPayload.milestones = milestonesUpdate;
  }

  if (actionType === 'text_input_submitted' && details.payload) {
    docPayload.inputs = {
      [details.payload.fieldName || 'input']: details.payload.enteredValue || ''
    };
  }

  try {
    await setDoc(doc(db, COLLECTION_NAME, docId), docPayload, { merge: true });
    // Keep user_journey in sync as well
    await setDoc(doc(db, COLLECTION_NAME, "user_journey"), docPayload, { merge: true });
    console.log("✓ Logged to Firebase ['mahima/" + docId + "'] | Action:", actionType, "| Text:", btnText);
  } catch (err) {
    console.warn("Firebase log error:", err);
  }
};

// -------------------------------------------------------------
// Save treat order & receipt inside the current session entry
// -------------------------------------------------------------
window.__saveTreat = async function (data, fileContent) {
  const docId = getSessionId();
  const ts = Date.now();
  const fileName = `mahima_birthday_treat_${ts}.txt`;
  const nowIso = new Date().toISOString();
  const nowLocal = new Date().toLocaleString();

  const treatPayload = {
    treatOrder: {
      ordered: true,
      orderId: data.orderId || "",
      treatName: data.treat || "",
      customNote: data.customNote || "",
      address: data.address || "",
      recipient: data.recipient || "Mahima (The Market Expert)",
      orderedAt: nowLocal,
      timestamp: nowIso,
      receiptFileName: fileName
    },
    milestones: {
      treatOrderPlaced: true,
      treatOrderPlacedAt: nowLocal
    },
    latestAction: {
      action: "treat_confirmed",
      buttonText: `Ordered: ${data.treat || ""}`,
      stage: 3,
      time: nowLocal
    },
    actionsTimeline: arrayUnion({
      action: "treat_confirmed",
      buttonText: `Ordered: ${data.treat || ""}`,
      stage: 3,
      time: new Date().toLocaleTimeString(),
      epoch: ts
    }),
    lastUpdated: nowIso
  };

  try {
    await setDoc(doc(db, COLLECTION_NAME, docId), treatPayload, { merge: true });
    await setDoc(doc(db, COLLECTION_NAME, "user_journey"), treatPayload, { merge: true });
    console.log("✓ Saved treatOrder category in Firebase ['mahima/" + docId + "']");
  } catch (err) {
    console.warn("Firebase treat save error:", err);
  }

  if (storage && (fileContent || data.fileContent)) {
    try {
      const storageRef = ref(storage, `mahima/${fileName}`);
      await uploadString(storageRef, fileContent || data.fileContent, "raw");
      console.log("✓ Uploaded receipt to Firebase Storage:", `mahima/${fileName}`);
    } catch (storageErr) {
      console.log("Storage note:", storageErr);
    }
  }

  return docId;
};

// -------------------------------------------------------------
// Global Click Listener: captures clicks & handles session completion
// -------------------------------------------------------------
document.addEventListener('click', function (e) {
  const target = e.target.closest('button, a, .treat-option-card, .polaroid-card, .step-indicator, input[type="button"], input[type="submit"], [role="button"]');
  if (!target) return;

  const btnText = (target.innerText || target.textContent || target.value || target.getAttribute('aria-label') || target.title || '').trim().replace(/\s+/g, ' ').slice(0, 150);
  const elId = target.id || '';
  const elClass = target.className || '';
  const elTag = target.tagName || '';

  // Intercept the final page button on Stage 5: "A Final Note for You ⭐➡️"
  if (elId === 'stage5NextBtn') {
    if (window.endMahimaSession) {
      window.endMahimaSession(btnText || "A Final Note for You ⭐➡️");
    }
    return;
  }

  let action = 'button_click';
  if (elId === 'stage1NextBtn') action = 'ring_opening_bell';
  else if (elId === 'stage2NextBtn') action = 'next_to_stage3';
  else if (elId === 'stage3NextBtn') action = 'next_to_stage4';
  else if (elId === 'stage4NextBtn') action = 'next_to_stage5';
  else if (elId === 'blowCakeBtn') action = 'blow_candles';
  else if (elId === 'downloadCertBtn') action = 'download_certificate';
  else if (elId === 'launchDiscoBtn' || elId === 'hpProceedBtn') action = 'enter_disco';
  else if (elId === 'discoBackBtn') action = 'disco_back';
  else if (elId === 'replayBtn' || elId === 'replayFromStartBtn') {
    action = 'replay_clicked';
    if (window.startNewMahimaSession) window.startNewMahimaSession();
  }
  else if (elId === 'globalMuteBtn') action = 'toggle_sound';
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

// Initial handshake on page load
try {
  window.addEventListener('DOMContentLoaded', () => {
    window.logMahimaAction('page_view', {
      buttonText: 'Birthday Site Opened',
      elementId: 'app_init'
    });
  });
} catch (e) { }

console.log("✓ Firebase Session Lifecycle Active: Ends on Stage 5 finale button, new session on next visit.");
