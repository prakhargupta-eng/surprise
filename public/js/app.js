/**
 * app.js - Main Application Controller for Miss Agrawal's Birthday Site
 */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // ================= CONFIGURATION =================
  var NAME = 'Miss Agrawal';
  var BIRTHDAY_DATE = new Date('2026-10-13T00:00:00'); // October 13, 2026
  var EXPIRY_DATE = new Date('2026-10-14T00:00:00');   // October 14, 2026 (Post-birthday)
  var PHOTOS = ['photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg'];
  var CAPTIONS = ['첫 번째 컷 · Cut 1', '두 번째 컷 · Cut 2', '세 번째 컷 · Cut 3', '네 번째 컷 · Cut 4'];
  var FRIEND_WHATSAPP = '';
  // =================================================

  var sfx = (window.BdayAudio && window.BdayAudio.sfx) || window.sfx || {};
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Insert name into placeholders
  document.querySelectorAll('.nm').forEach(function (el) {
    el.textContent = NAME;
  });

  // Mute button controller
  var muteBtn = document.getElementById('muteBtn');
  if (muteBtn) {
    muteBtn.addEventListener('click', function () {
      if (window.BdayAudio) {
        var isMuted = window.BdayAudio.toggleMute();
        muteBtn.textContent = isMuted ? '🔇' : '🔊';
      }
    });
  }

  /* ---------- SHIN-CHAN CORNER WIDGET INTERACTION ---------- */
  var shinchanCorner = document.getElementById('shinchanCorner');
  var shinchanBubble = document.getElementById('shinchanBubble');
  var shinchanPhrases = [
    "Belated happy birthday! 🌸",
    "Hope you had a wonderful day! 🍰",
    "A great start to your new year! ✨",
    "Cake khila do! Hungry Shinchan! 🍰",
    "Zero bugs all year long! ✨",
    "Main character vibes! 🎬",
    "Boba & Ramen treat time! 🧋",
    "Shin-chan still saved you cake! 🍰"
  ];
  var shinchanIndex = 0;
  if (shinchanCorner && shinchanBubble) {
    shinchanCorner.addEventListener('click', function () {
      if (sfx.cheer) sfx.cheer();
      shinchanCorner.classList.add('bounce');
      setTimeout(function () {
        shinchanCorner.classList.remove('bounce');
      }, 400);
      shinchanIndex = (shinchanIndex + 1) % shinchanPhrases.length;
      shinchanBubble.textContent = shinchanPhrases[shinchanIndex];
    });
  }

  /* ---------- AUTO-SCROLLING ENGINE ---------- */
  var autoScrollEnabled = true;
  var lastManualScroll = 0;
  var autoScrollPill = document.getElementById('autoScrollPill');
  var autoScrollTxt = document.getElementById('autoScrollTxt');
  var scrollTimeout = null;

  function onManualScroll() {
    lastManualScroll = Date.now();
    if (autoScrollPill) autoScrollPill.classList.add('paused');
    if (autoScrollTxt) autoScrollTxt.textContent = 'Auto-scroll: Paused';
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function () {
      if (autoScrollEnabled) {
        if (autoScrollPill) autoScrollPill.classList.remove('paused');
        if (autoScrollTxt) autoScrollTxt.textContent = 'Auto-scroll ON';
      }
    }, 2200);
  }

  ['wheel', 'touchmove', 'keydown'].forEach(function (ev) {
    window.addEventListener(ev, onManualScroll, { passive: true });
  });

  if (autoScrollPill && autoScrollTxt) {
    autoScrollPill.addEventListener('click', function () {
      autoScrollEnabled = !autoScrollEnabled;
      if (autoScrollEnabled) {
        autoScrollPill.classList.remove('paused');
        autoScrollTxt.textContent = 'Auto-scroll ON';
      } else {
        autoScrollPill.classList.add('paused');
        autoScrollTxt.textContent = 'Auto-scroll OFF';
      }
    });
  }

  function autoScrollTo(el, alignCenter) {
    if (!autoScrollEnabled) return;
    if (Date.now() - lastManualScroll < 2200) return;
    if (!el) return;
    try {
      var rect = el.getBoundingClientRect();
      var offset = alignCenter ? (window.innerHeight - rect.height) / 2 : window.innerHeight * 0.35;
      var targetY = window.pageYOffset + rect.top - Math.max(20, offset);
      window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
    } catch (e) {}
  }

  /* Auto-reveal helper with automatic gentle scrolling */
  function revealAll(selector, startDelay, gap, sound, autoScroll) {
    var items = document.querySelectorAll(selector);
    items.forEach(function (el, idx) {
      setTimeout(function () {
        el.classList.add('show');
        if (sound) sound();
        if (autoScroll !== false) {
          autoScrollTo(el, false);
        }
      }, reduce ? 0 : startDelay + idx * gap);
    });
  }

  /* ---------- CARD BOOSTER (EP 2) ---------- */
  window.celebrateCard = function (btn) {
    if (sfx.cheer) sfx.cheer();
    btn.textContent = '★ ACTIVE!';
    btn.style.background = 'rgba(143, 227, 200, 0.3)';
    btn.style.color = '#8fe3c8';
  };

  /* ---------- STAGES NAVIGATION ---------- */
  var stages = {
    0: document.getElementById('step0'),
    1: document.getElementById('step1'),
    2: document.getElementById('step2'),
    3: document.getElementById('step3'),
    4: document.getElementById('step4'),
    'expired': document.getElementById('stepExpired')
  };
  var eps = document.querySelectorAll('.ep');
  var epsNavContainer = document.querySelector('.eps');

  function goTo(stageKey) {
    Object.keys(stages).forEach(function (k) {
      if (stages[k]) {
        stages[k].classList.toggle('active', String(k) === String(stageKey));
      }
    });

    eps.forEach(function (e) {
      e.classList.toggle('on', String(e.dataset.ep) === String(stageKey));
    });

    // Control visibility of top episode pills
    if (epsNavContainer) {
      if (stageKey === 'expired') {
        epsNavContainer.style.display = 'none';
      } else {
        epsNavContainer.style.display = 'flex';
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eps.forEach(function (pill) {
    pill.addEventListener('click', function () {
      var targetEp = pill.dataset.ep;
      if (targetEp === undefined) return;
      if (sfx.click) sfx.click();
      var num = Number(targetEp);
      goTo(isNaN(num) ? targetEp : num);
      if (num === 2) {
        typeCode();
      } else if (num === 4) {
        enterFinal();
      }
    });
  });

  /* ---------- DATE LOGIC & ROUTING ---------- */
  var urlParams = new URLSearchParams(window.location.search);
  var now = new Date();

  // URL overrides for easy testing (e.g. ?preview=expired or ?date=2026-10-14)
  if (urlParams.has('date')) {
    var parsed = new Date(urlParams.get('date'));
    if (!isNaN(parsed.getTime())) now = parsed;
  } else if (urlParams.get('preview') === 'expired') {
    now = new Date('2026-10-14T12:00:00');
  } else if (urlParams.get('preview') === 'countdown') {
    now = new Date('2026-10-12T12:00:00');
  } else if (urlParams.get('preview') === 'live' || urlParams.get('preview') === 'birthday') {
    now = new Date('2026-10-13T12:00:00');
  }

  var ep0Pill = document.getElementById('ep0Pill');
  var isPostBirthday = (now >= EXPIRY_DATE);
  var isBeforeBirthday = (now < BIRTHDAY_DATE);
  var unlockedSession = sessionStorage.getItem('unlocked_bday_preview');

  /* ---------- COUNTDOWN TIMER LOGIC (BEFORE 13 OCT) ---------- */
  var cdDays = document.getElementById('cdDays');
  var cdHours = document.getElementById('cdHours');
  var cdMins = document.getElementById('cdMins');
  var cdSecs = document.getElementById('cdSecs');
  var countdownFinished = false;

  function updateCountdown() {
    var curr = new Date();
    if (urlParams.has('date')) {
      var p = new Date(urlParams.get('date'));
      if (!isNaN(p.getTime())) curr = p;
    }
    var diff = BIRTHDAY_DATE - curr;

    if (diff <= 0) {
      if (!countdownFinished) {
        countdownFinished = true;
        onCountdownComplete();
      }
      return;
    }

    var d = Math.floor(diff / (1000 * 60 * 60 * 24));
    var h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    var m = Math.floor((diff / (1000 * 60)) % 60);
    var s = Math.floor((diff / 1000) % 60);

    if (cdDays) cdDays.textContent = d < 10 ? '0' + d : d;
    if (cdHours) cdHours.textContent = h < 10 ? '0' + h : h;
    if (cdMins) cdMins.textContent = m < 10 ? '0' + m : m;
    if (cdSecs) cdSecs.textContent = s < 10 ? '0' + s : s;
  }

  function onCountdownComplete() {
    if (window.BdayConfetti) window.BdayConfetti.fireConfettiOnce();
    if (sfx.cheer) sfx.cheer();
    goTo(1);
  }

  if (isBeforeBirthday) {
    var timerInterval = setInterval(updateCountdown, 1000);
    updateCountdown();
  }

  /* ---------- VIP PIN MODAL LOGIC ---------- */
  var TARGET_PIN = '131096';
  var currentPin = '';
  var vipModal = document.getElementById('vipPinModal');
  var pinSlots = document.querySelectorAll('.pin-slot');
  var pinWrap = document.getElementById('pinDigitsWrap');
  var pinFeedback = document.getElementById('pinFeedback');
  var isVerifying = false;

  function renderPin() {
    pinSlots.forEach(function (slot, idx) {
      slot.className = 'pin-slot';
      if (idx < currentPin.length) {
        slot.textContent = currentPin[idx];
        slot.classList.add('filled');
      } else {
        slot.textContent = '';
      }
      if (idx === currentPin.length && !isVerifying) {
        slot.classList.add('active');
      }
    });
  }

  function openVipModal() {
    currentPin = '';
    isVerifying = false;
    if (pinFeedback) {
      pinFeedback.className = 'pin-feedback info';
      pinFeedback.textContent = 'Enter the 6-digit passcode to proceed';
    }
    renderPin();
    if (vipModal) {
      if (typeof vipModal.showModal === 'function') {
        vipModal.showModal();
      } else {
        vipModal.setAttribute('open', '');
      }
    }
    if (sfx.click) sfx.click();
  }

  function closeVipModal() {
    if (vipModal) {
      if (typeof vipModal.close === 'function') {
        vipModal.close();
      } else {
        vipModal.removeAttribute('open');
      }
    }
    currentPin = '';
    isVerifying = false;
    renderPin();
  }

  function handleDigit(digit) {
    if (isVerifying || currentPin.length >= 6) return;
    currentPin += digit;
    if (sfx.type) sfx.type();
    renderPin();
    if (currentPin.length === 6) {
      verifyPin();
    }
  }

  function handleBackspace() {
    if (isVerifying || currentPin.length === 0) return;
    currentPin = currentPin.slice(0, -1);
    if (sfx.click) sfx.click();
    renderPin();
    if (pinFeedback) {
      pinFeedback.className = 'pin-feedback info';
      pinFeedback.textContent = 'Enter the 6-digit passcode to proceed';
    }
  }

  function handleClear() {
    if (isVerifying) return;
    currentPin = '';
    if (sfx.click) sfx.click();
    renderPin();
    if (pinFeedback) {
      pinFeedback.className = 'pin-feedback info';
      pinFeedback.textContent = 'Enter the 6-digit passcode to proceed';
    }
  }

  function verifyPin() {
    isVerifying = true;
    if (currentPin === TARGET_PIN) {
      pinSlots.forEach(function (slot) { slot.className = 'pin-slot success'; });
      if (pinFeedback) {
        pinFeedback.className = 'pin-feedback success';
        pinFeedback.textContent = '🎉 VIP Access Granted! Welcome! 🌸';
      }
      if (sfx.cheer) sfx.cheer();
      if (window.BdayConfetti) window.BdayConfetti.fireConfettiOnce();
      setTimeout(function () {
        sessionStorage.setItem('unlocked_bday_preview', 'true');
        closeVipModal();
        goTo(1);
      }, 650);
    } else {
      pinSlots.forEach(function (slot) { slot.className = 'pin-slot error'; });
      if (pinWrap) pinWrap.classList.add('shake');
      if (pinFeedback) {
        pinFeedback.className = 'pin-feedback error';
        pinFeedback.textContent = '❌ Incorrect PIN. Please try again.';
      }
      if (sfx.error) sfx.error();
      setTimeout(function () {
        if (pinWrap) pinWrap.classList.remove('shake');
        currentPin = '';
        isVerifying = false;
        if (pinFeedback) {
          pinFeedback.className = 'pin-feedback info';
          pinFeedback.textContent = 'Enter the 6-digit passcode to proceed';
        }
        renderPin();
      }, 700);
    }
  }

  var unlockNowBtn = document.getElementById('unlockNowBtn');
  if (unlockNowBtn) unlockNowBtn.addEventListener('click', openVipModal);

  var pinCloseBtn = document.getElementById('pinCloseBtn');
  if (pinCloseBtn) pinCloseBtn.addEventListener('click', closeVipModal);

  if (vipModal) {
    vipModal.addEventListener('click', function (e) {
      var rect = vipModal.getBoundingClientRect();
      var inDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
      if (!inDialog) closeVipModal();
    });
  }

  var pinKeypad = document.getElementById('pinKeypad');
  if (pinKeypad) {
    pinKeypad.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      var digit = btn.dataset.digit;
      var action = btn.dataset.action;
      if (digit !== undefined) {
        handleDigit(digit);
      } else if (action === 'backspace') {
        handleBackspace();
      } else if (action === 'clear') {
        handleClear();
      }
    });
  }

  window.addEventListener('keydown', function (e) {
    if (!vipModal || !vipModal.hasAttribute('open')) return;
    if (e.key >= '0' && e.key <= '9') {
      e.preventDefault();
      handleDigit(e.key);
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      handleBackspace();
    } else if (e.key === 'Escape') {
      closeVipModal();
    }
  });

  window.addEventListener('paste', function (e) {
    if (!vipModal || !vipModal.hasAttribute('open')) return;
    var text = (e.clipboardData || window.clipboardData).getData('text');
    if (text) {
      var cleaned = text.replace(/\D/g, '').slice(0, 6);
      if (cleaned) {
        e.preventDefault();
        currentPin = '';
        for (var i = 0; i < cleaned.length; i++) {
          currentPin += cleaned[i];
        }
        if (sfx.type) sfx.type();
        renderPin();
        if (currentPin.length === 6) verifyPin();
      }
    }
  });

  /* ---------- PHOTO STRIP BUILDER (4 CUTS) ---------- */
  function buildPhotoStrip(containerId) {
    var strip = document.getElementById(containerId);
    if (!strip) return;
    strip.innerHTML = '';
    PHOTOS.forEach(function (src, i) {
      var shot = document.createElement('div');
      shot.className = 'shot show';

      var tape = document.createElement('div');
      tape.className = 'washi-tape';
      shot.appendChild(tape);

      var ph = document.createElement('div');
      ph.className = 'ph';
      var img = document.createElement('img');
      img.alt = 'Miss Agrawal celebration cut ' + (i + 1);
      img.src = src;
      img.addEventListener('error', function () {
        ph.innerHTML = '<div style="padding:20px; color:var(--sakura); font-size:12px;">📷 Cut ' + (i + 1) + '</div>';
      });
      ph.appendChild(img);

      var cap = document.createElement('div');
      cap.className = 'cap';
      cap.textContent = CAPTIONS[i] || ('Cut ' + (i + 1));
      shot.appendChild(ph);
      shot.appendChild(cap);
      strip.appendChild(shot);
    });
  }

  // Populate photos for Final Page and Post-Birthday page
  buildPhotoStrip('strip');
  buildPhotoStrip('expiredStrip');

  /* ---------- POST-BIRTHDAY / EXPIRED PAGE CONTROLLERS ---------- */
  var expiredSongBtn = document.getElementById('expiredSongBtn');
  if (expiredSongBtn) {
    expiredSongBtn.addEventListener('click', function () {
      if (window.BdayAudio) window.BdayAudio.toggleSong();
    });
  }

  var expiredConfettiBtn = document.getElementById('expiredConfettiBtn');
  if (expiredConfettiBtn) {
    expiredConfettiBtn.addEventListener('click', function () {
      if (window.BdayConfetti) window.BdayConfetti.fireConfetti(true);
      if (sfx.cheer) sfx.cheer();
    });
  }

  var expiredReplayBtn = document.getElementById('expiredReplayBtn');
  if (expiredReplayBtn) {
    expiredReplayBtn.addEventListener('click', function () {
      openVipModal();
    });
  }

  /* ---------- ROUTING EVALUATION ON LOAD ---------- */
  if (isPostBirthday) {
    // Visits on or after October 14th show the Post-Birthday Special page
    goTo('expired');
  } else if (isBeforeBirthday && !unlockedSession) {
    // Visits before October 13th show Countdown
    if (ep0Pill) ep0Pill.style.display = 'inline-block';
    goTo(0);
  } else {
    // Visits on October 13th (or preview unlocked) start at EP.01
    goTo(1);
  }

  /* ---------- EP 2 : Typewriter Terminal ---------- */
  var codeLines = [
    '<span class="c">// birthday.js</span>',
    '<span class="k">const</span> <span class="f">birthday</span> = {',
    '  name: <span class="s">"' + NAME + '"</span>,',
    '  role: <span class="s">"Web Developer"</span>,',
    '  city: <span class="s">"Pune"</span>,',
    '  loves: [<span class="s">"K-Drama"</span>, <span class="s">"Good Food"</span>, <span class="s">"Clean Code"</span>],',
    '  age: <span class="n">age</span> + <span class="n">1</span>,',
    '  status: <span class="s">"Level Up 🎮"</span>',
    '};',
    '',
    '<span class="f">celebrate</span>(birthday); <span class="c">// 생일 축하해요! (Happy Birthday!)</span>',
    '<span class="p">&gt; Compiled successfully. 0 errors, 1 amazing friend.</span>'
  ];
  var codeEl = document.getElementById('codeOut');
  var typed = false;
  function typeCode(done) {
    if (typed || !codeEl) return;
    typed = true;
    var i = 0, out = [];
    (function next() {
      if (i >= codeLines.length) {
        codeEl.innerHTML = out.join('\n');
        if (done) done();
        return;
      }
      if (sfx.type) sfx.type();
      out.push(codeLines[i]);
      i++;
      codeEl.innerHTML = out.join('\n') + '\n<span class="cursor"></span>';
      if (i % 3 === 0) {
        autoScrollTo(codeEl, false);
      }
      setTimeout(next, reduce ? 0 : 280);
    })();
  }

  /* ---------- Treat Picker (EP 3) ---------- */
  var TREATS = [
    { id: 'cake',     emoji: '🎂', en: 'Chocolate Cake', ko: '초콜릿 케이크' },
    { id: 'waffle',   emoji: '🧇', en: 'Waffles',        ko: '와플' },
    { id: 'dessert',  emoji: '🧁', en: 'Dessert Box',    ko: '디저트 박스' },
    { id: 'icecream', emoji: '🍦', en: 'Ice Cream',      ko: '아이스크림' },
    { id: 'boba',     emoji: '🧋', en: 'Bubble Tea',     ko: '버블티' },
    { id: 'pizza',    emoji: '🍕', en: 'Veg Pizza',      ko: '채식 피자' },
    { id: 'other',    emoji: '✍️', en: 'Something else', ko: '다른 것' }
  ];
  var selected = null;
  var treatsBox = document.getElementById('treats');
  var otherInput = document.getElementById('otherInput');
  var treatBtn = document.getElementById('treatBtn');
  var needMsg = document.getElementById('needMsg');
  var addrInput = document.getElementById('addrInput');

  if (treatsBox) {
    TREATS.forEach(function (t) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'treat';
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', 'false');
      b.innerHTML = '<span class="em"></span><span class="en"></span><span class="ko"></span>';
      b.querySelector('.em').textContent = t.emoji;
      b.querySelector('.en').textContent = t.en;
      b.querySelector('.ko').textContent = t.ko;
      b.addEventListener('click', function () {
        selected = t;
        if (sfx.select) sfx.select();
        treatsBox.querySelectorAll('.treat').forEach(function (x) {
          x.classList.remove('sel');
          x.setAttribute('aria-checked', 'false');
        });
        b.classList.add('sel');
        b.setAttribute('aria-checked', 'true');
        if (otherInput) {
          otherInput.style.display = t.id === 'other' ? 'block' : 'none';
          if (t.id === 'other') otherInput.focus();
        }
        validateTreat();
        if (addrInput) autoScrollTo(addrInput, false);
      });
      treatsBox.appendChild(b);
    });
  }

  function treatLabel() {
    if (!selected) return '';
    if (selected.id === 'other' && otherInput) return otherInput.value.trim();
    return selected.en;
  }

  function validateTreat() {
    if (!treatBtn || !needMsg || !addrInput) return;
    var ok = !!selected &&
      (selected.id !== 'other' || (otherInput && otherInput.value.trim().length > 0)) &&
      addrInput.value.trim().length >= 8;
    treatBtn.disabled = !ok;
    treatBtn.textContent = ok ? 'Continue to Final Episode ▶' : 'Choose treat + address first';
    needMsg.style.visibility = ok ? 'hidden' : 'visible';
  }

  if (otherInput) {
    otherInput.addEventListener('input', validateTreat);
    otherInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && treatBtn && !treatBtn.disabled) submitTreat();
    });
  }

  if (addrInput) {
    addrInput.addEventListener('input', validateTreat);
  }

  function saveLocal(data, docId) {
    try {
      var key = 'birthday_events';
      var existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push({ type: 'treat_choice', docId: docId, payload: data, ts: Date.now() });
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (e) {}
  }

  function saveTreat(data) {
    try {
      if (window.__saveTreat) {
        window.__saveTreat(data).then(function (id) {
          saveLocal(data, id);
        }).catch(function (err) {
          console.warn("Firebase save fallback to local:", err);
          saveLocal(data, 'agrawal_' + Date.now());
        });
      } else {
        saveLocal(data, 'agrawal_' + Date.now());
      }
    } catch (e) {
      saveLocal(data, 'agrawal_' + Date.now());
    }
  }

  var chosenText = '';
  function submitTreat() {
    if (!treatBtn || treatBtn.disabled) return;
    if (sfx.click) sfx.click();
    chosenText = treatLabel();
    saveTreat({
      name: NAME,
      treat: chosenText,
      korean: selected.ko,
      custom: selected.id === 'other',
      address: addrInput ? addrInput.value.trim() : ''
    });
    buildTreatSummary();
    goTo(4);
    enterFinal();
  }

  if (treatBtn) treatBtn.addEventListener('click', submitTreat);
  validateTreat();

  function buildTreatSummary() {
    var box = document.getElementById('treatCard');
    if (!box) return;
    var b = box.querySelector('b');
    var s = box.querySelector('.sub');
    if (b) b.textContent = (selected.id === 'other' ? '✍️ ' : selected.emoji + ' ') + chosenText;
    if (s && addrInput) {
      s.textContent = '선택한 간식: ' + (selected.id === 'other' ? chosenText : selected.ko) + ' · 배달 주소: ' + addrInput.value.trim();
    }
    if (FRIEND_WHATSAPP && addrInput) {
      var wa = document.getElementById('waBtn');
      if (wa) {
        wa.href = 'https://wa.me/' + FRIEND_WHATSAPP + '?text=' + encodeURIComponent('Hi! My birthday treat pick is: ' + chosenText + ' 🎂\nAddress: ' + addrInput.value.trim());
        wa.style.display = 'inline-block';
      }
    }
  }

  /* ---------- WISHES (FINAL PAGE) ---------- */
  var WISHES = [
    { kr: '첫 번째 소원 · Wish #1', en: 'May your code compile on the first try, every deploy go green, and every bug turn out to be a missing semicolon. 🐛✨', ko: '코드가 한 번에 컴파일되고, 배포는 항상 성공하고, 모든 버그가 세미콜론 하나 때문이길 바라요.' },
    { kr: '두 번째 소원 · Wish #2', en: 'May your life have a happy-ending K-drama plot: great friends, great food, zero filler episodes, and a perfect OST on repeat. 🎶', ko: '좋은 친구와 맛있는 음식, 지루한 에피소드 없이, 최고의 OST가 흐르는 해피엔딩 드라마 같은 삶이 되길 바라요.' },
    { kr: '세 번째 소원 · Wish #3', en: 'Thank you for being such a kind, supportive and fun friend. May this year bring you growth, big wins and all the peace you deserve. 💛', ko: '다정하고 든든하고 재미있는 친구가 되어줘서 고마워요. 올해는 성장과 큰 성과, 그리고 마음의 평화가 가득하길 바라요.' },
    { kr: '네 번째 소원 · Wish #4', en: '화이팅! (Fighting!) Keep building cool things in Pune. The best season of your story is just starting. 🚀', ko: '푸네에서 멋진 것들을 계속 만들어가세요. 당신 이야기의 가장 좋은 시즌이 이제 시작이에요.' }
  ];

  function renderFinalWishes() {
    var box = document.getElementById('finalWishes');
    if (!box) return;
    box.innerHTML = '';
    WISHES.forEach(function (w) {
      var card = document.createElement('div'); card.className = 'wish';
      var kr = document.createElement('div'); kr.className = 'kr'; kr.textContent = w.kr;
      var p = document.createElement('p'); p.textContent = w.en;
      var s = document.createElement('span'); s.className = 'sub'; s.textContent = w.ko;
      card.appendChild(kr); card.appendChild(p); card.appendChild(s);
      box.appendChild(card);
    });

    var treatCard = document.createElement('div');
    treatCard.className = 'wish treat-box';
    treatCard.id = 'treatCard';
    treatCard.innerHTML = '<div class="kr">🎁 Your Birthday Treat · 생일 간식</div><p><b></b></p><span class="sub"></span>';
    box.appendChild(treatCard);
  }
  renderFinalWishes();

  /* ---------- Mystery Gift Box (Final Page) ---------- */
  window.openMysteryBox = function () {
    var perks = document.getElementById('secretPerks');
    if (perks) {
      perks.classList.toggle('open');
      if (sfx.cheer) sfx.cheer();
      if (window.BdayConfetti) window.BdayConfetti.fireConfettiOnce();
      autoScrollTo(perks, false);
    }
  };

  /* ---------- Song Player (Final Page) ---------- */
  var songBtn = document.getElementById('songBtn');
  if (songBtn) {
    songBtn.addEventListener('click', function () {
      if (window.BdayAudio) window.BdayAudio.toggleSong();
    });
  }

  /* ---------- Final Page Sequencing & Auto-Scrolling ---------- */
  var finalStarted = false;
  function enterFinal() {
    if (finalStarted) return;
    finalStarted = true;
    if (window.BdayConfetti) window.BdayConfetti.fireConfettiOnce();

    if (!reduce && sfx.thud) {
      [600, 1100, 1500].forEach(function (ms) { setTimeout(sfx.thud, ms); });
      [1700, 1850, 2000].forEach(function (ms) { if (sfx.candle) setTimeout(sfx.candle, ms); });
      if (sfx.light) setTimeout(sfx.light, 2400);
    }

    if (window.BdayAudio) {
      setTimeout(function () {
        window.BdayAudio.playSong();
      }, reduce ? 0 : 1300);
    }

    // Reveal photos
    revealAll('#step4 .shot', 2500, 900, sfx.shutter, true);

    // Mystery Box
    setTimeout(function () {
      var mb = document.getElementById('mysteryBox');
      if (mb) {
        mb.classList.add('show');
        if (sfx.wish) sfx.wish();
        autoScrollTo(mb, false);
      }
    }, 6200);

    // Final Wishes
    revealAll('#finalWishes .wish', 7000, 750, sfx.wish, true);
  }

  /* ---------- EP 1 -> EP 2 Navigation ---------- */
  var startBtn = document.getElementById('startBtn');
  if (startBtn) {
    startBtn.addEventListener('click', function () {
      if (sfx.click) sfx.click();
      goTo(2);
      typeCode(function () {
        var header = document.getElementById('dossierHeader');
        var sub = document.getElementById('dossierSub');
        if (header) header.style.opacity = '1';
        if (sub) sub.style.opacity = '1';

        revealAll('#dossierGrid .dcard', 200, 650, sfx.wish, true);

        setTimeout(function () {
          autoScrollTo(document.getElementById('toTreatBtn'), false);
        }, 3200);
      });
    });
  }

  /* ---------- EP 2 -> EP 3 Navigation ---------- */
  var toTreatBtn = document.getElementById('toTreatBtn');
  if (toTreatBtn) {
    toTreatBtn.addEventListener('click', function () {
      if (sfx.click) sfx.click();
      goTo(3);
    });
  }
});
