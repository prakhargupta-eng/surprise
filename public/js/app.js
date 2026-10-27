/**
 * app.js - Main Application Controller for Miss Agrawal's Birthday Surprise
 * Stock Market Theme × Cute Pastel Bubu & Dudu Aesthetic
 */
function initMahimaApp() {
  'use strict';

  // ================= CONFIGURATION =================
  var NAME = 'Mahima';
  var NICKNAME = 'Expert';
  var TOTAL_STAGES = 6;
  var currentStage = 1;
  window.__currentStage = 1;
  // =================================================


  var sfx = (window.BdayAudio && window.BdayAudio.sfx) || window.sfx || {};
  var audioCtrl = window.BdayAudio;
  var fireConfetti = window.fireConfetti || function () { };

  // Ambient floating stars and celebration sparkles generator
  var ambientBg = document.getElementById('ambientBg');
  if (ambientBg) {
    var starSymbols = ['⭐', '✨', '🌟', '💫', '📈', '🎂', '🎉', '💎'];
    for (var h = 0; h < 24; h++) {
      var star = document.createElement('div');
      star.className = 'floating-star';
      star.textContent = starSymbols[Math.floor(Math.random() * starSymbols.length)];
      star.style.left = (Math.random() * 95) + 'vw';
      star.style.animationDelay = (Math.random() * 12) + 's';
      star.style.animationDuration = (8 + Math.random() * 8) + 's';
      star.style.fontSize = (16 + Math.random() * 16) + 'px';
      ambientBg.appendChild(star);
    }
  }

  // ================= CONFIGURATION =================
  var NAME = 'Mahima';
  var TARGET_PIN = '051100';
  var BIRTHDAY_DATE = new Date('2026-10-27T07:20:00'); // October 26, 2026 at 01:20 AM IST
  var EXPIRY_DATE = new Date('2026-10-28T00:00:00');   // October 27, 2026 (Post-birthday)
  // =================================================

  var vipLockOverlay = document.getElementById('vipLockOverlay');
  var vipCountdownView = document.getElementById('vipCountdownView');
  var vipPinView = document.getElementById('vipPinView');
  var openVipPinBtn = document.getElementById('openVipPinBtn');
  var backToCountdownBtn = document.getElementById('backToCountdownBtn');
  var cdHours = document.getElementById('cdHours');
  var cdMinutes = document.getElementById('cdMinutes');
  var cdSeconds = document.getElementById('cdSeconds');
  var cdStatusText = document.getElementById('cdStatusText');
  var pinBoxes = document.querySelectorAll('.pin-box');
  var vipPinError = document.getElementById('vipPinError');
  var vipUnlockBtn = document.getElementById('vipUnlockBtn');
  var keyBtns = document.querySelectorAll('.key-btn');

  var cdBadge = document.getElementById('cdBadge');
  var cdTitle = document.getElementById('cdTitle');
  var cdSubtitle = document.getElementById('cdSubtitle');
  var cdGrid = document.getElementById('cdGrid');
  var postBirthdayNotice = document.getElementById('postBirthdayNotice');
  var cdLiveDot = document.getElementById('cdLiveDot');
  var cdHeaderText = document.getElementById('cdHeaderText');

  /* ---------- DATE LOGIC & ROUTING (from commit 63cfd92d) ---------- */
  var urlParams = new URLSearchParams(window.location.search);
  var now = new Date();

  // URL overrides for easy testing (e.g. ?preview=expired or ?preview=countdown or ?date=2026-10-27)
  if (urlParams.has('date')) {
    var parsed = new Date(urlParams.get('date'));
    if (!isNaN(parsed.getTime())) now = parsed;
  } else if (urlParams.get('preview') === 'expired' || urlParams.get('preview') === 'post') {
    now = new Date('2026-10-27T12:00:00');
  } else if (urlParams.get('preview') === 'countdown') {
    now = new Date('2026-10-25T12:00:00');
  } else if (urlParams.get('preview') === 'live' || urlParams.get('preview') === 'birthday') {
    now = new Date('2026-10-26T12:00:00');
  }

  var isPostBirthday = (now >= EXPIRY_DATE);
  var isBeforeBirthday = (now < BIRTHDAY_DATE);
  var unlockedSession = sessionStorage.getItem('mahima_vip_unlocked') || sessionStorage.getItem('unlocked_bday_preview');

  /* ---------- POST-BIRTHDAY SETUP ---------- */
  function showPostBirthdayView() {
    if (cdBadge) {
      cdBadge.textContent = '🌸 SPECIAL SESSION CONCLUDED · POST-BIRTHDAY MEMO';
      cdBadge.style.background = 'var(--gold-light)';
      cdBadge.style.color = '#b45309';
    }
    if (cdTitle) {
      cdTitle.innerHTML = 'Belated Happy Birthday, <span class="highlight">' + NAME + '!</span> 🎂✨';
    }
    if (cdSubtitle) {
      cdSubtitle.textContent = 'The birthday trading bell has rung and the special session for this year has concluded.';
    }
    if (cdGrid) cdGrid.style.display = 'none';
    if (postBirthdayNotice) postBirthdayNotice.style.display = 'block';
    if (cdLiveDot) {
      cdLiveDot.style.background = '#f59e0b';
      cdLiveDot.style.boxShadow = '0 0 8px #f59e0b';
    }
    if (cdHeaderText) cdHeaderText.textContent = 'SESSION CONCLUDED FOR THIS YEAR';
    if (cdStatusText) {
      cdStatusText.textContent = '✨ Market session closed · Visit next year to celebrate again! 🎊';
      cdStatusText.style.color = '#b45309';
    }
    if (openVipPinBtn) {
      openVipPinBtn.innerHTML = '👑 VIP Pass Entry (View Birthday Memories) 🔑';
    }
  }

  /* ---------- COUNTDOWN TIMER LOGIC ---------- */
  var countdownFinished = false;

  function updateCountdown() {
    var curr = new Date();
    if (urlParams.has('date')) {
      var p = new Date(urlParams.get('date'));
      if (!isNaN(p.getTime())) curr = p;
    } else if (urlParams.get('preview') === 'countdown') {
      curr = new Date('2026-10-25T12:00:00');
    }
    var diff = BIRTHDAY_DATE - curr;

    if (diff <= 0) {
      if (!countdownFinished) {
        countdownFinished = true;
        onCountdownComplete();
      }
      return;
    }

    var totalSecs = Math.floor(diff / 1000);
    var hrs = Math.floor(totalSecs / 3600);
    var mins = Math.floor((totalSecs % 3600) / 60);
    var secs = totalSecs % 60;

    var hrsStr = (hrs < 10 ? '0' : '') + hrs;
    var minsStr = (mins < 10 ? '0' : '') + mins;
    var secsStr = (secs < 10 ? '0' : '') + secs;

    if (cdHours) cdHours.textContent = hrsStr;
    if (cdMinutes) cdMinutes.textContent = minsStr;
    if (cdSeconds) cdSeconds.textContent = secsStr;
  }

  function onCountdownComplete() {
    if (cdHours) cdHours.textContent = '00';
    if (cdMinutes) cdMinutes.textContent = '00';
    if (cdSeconds) cdSeconds.textContent = '00';
    if (cdStatusText) {
      cdStatusText.textContent = "🎉 IT'S TIME! The Birthday Bell Has Officially Rung! 🔔✨";
      cdStatusText.style.color = '#10b981';
    }
    setTimeout(function () {
      unlockVipAccess();
    }, 300);
  }

  /* ---------- ROUTING EVALUATION ON LOAD (from commit 63cfd92d) ---------- */
  if (unlockedSession === 'true') {
    // Unlocked previously in this session
    if (vipLockOverlay) vipLockOverlay.style.display = 'none';
  } else if (isPostBirthday) {
    // Visits on or after October 27th show Post-Birthday Special view
    showPostBirthdayView();
  } else if (isBeforeBirthday) {
    // Visits before October 26th 1:20 AM show Countdown
    var timerInterval = setInterval(updateCountdown, 1000);
    updateCountdown();
  } else {
    // Visits on Birthday (October 26th): Countdown is zero, auto-unlock!
    onCountdownComplete();
  }

  // View Switching (Countdown <-> PIN View)
  if (openVipPinBtn) {
    openVipPinBtn.addEventListener('click', function () {
      if (vipCountdownView) vipCountdownView.style.display = 'none';
      if (vipPinView) vipPinView.style.display = 'block';
      if (sfx && sfx.click) sfx.click();
      if (pinBoxes && pinBoxes.length > 0) {
        setTimeout(function () { pinBoxes[0].focus(); }, 120);
      }
    });
  }

  if (backToCountdownBtn) {
    backToCountdownBtn.addEventListener('click', function () {
      if (vipPinView) vipPinView.style.display = 'none';
      if (vipCountdownView) vipCountdownView.style.display = 'block';
      if (sfx && sfx.click) sfx.click();
      clearPin(false);
      if (vipPinError) vipPinError.style.display = 'none';
    });
  }

  // 2. VIP PIN Unlock Functions
  function getEnteredPin() {
    var pin = '';
    pinBoxes.forEach(function (box) {
      pin += (box.value || '').trim();
    });
    return pin;
  }

  function clearPin(focusFirst) {
    pinBoxes.forEach(function (box) {
      box.value = '';
      box.classList.remove('has-val');
      box.classList.remove('error');
    });
    if (focusFirst !== false && pinBoxes.length > 0 && vipPinView && vipPinView.style.display !== 'none') {
      pinBoxes[0].focus();
    }
  }

  function unlockVipAccess() {
    if (vipLockOverlay) {
      vipLockOverlay.classList.add('unlocked');
      setTimeout(function () {
        vipLockOverlay.style.display = 'none';
      }, 500);
    }
    try {
      sessionStorage.setItem('mahima_vip_unlocked', 'true');
    } catch (e) { }

    if (audioCtrl && audioCtrl.marketBell) {
      audioCtrl.marketBell();
    } else if (audioCtrl && audioCtrl.sfx && audioCtrl.sfx.cheer) {
      audioCtrl.sfx.cheer();
    }
    fireConfetti(true);
  }

  function validateVipPin() {
    var entered = getEnteredPin();
    if (vipPinError) vipPinError.style.display = 'none';

    if (entered === TARGET_PIN) {
      unlockVipAccess();
    } else {
      if (vipPinError) {
        vipPinError.textContent = '❌ Incorrect VIP Passcode. Access Restricted!';
        vipPinError.style.display = 'block';
      }
      pinBoxes.forEach(function (b) { b.classList.add('error'); });
      if (sfx.pop) sfx.pop();
      setTimeout(function () {
        clearPin();
      }, 400);
    }
  }

  // Check if previously unlocked in this session
  try {
    if (sessionStorage.getItem('mahima_vip_unlocked') === 'true') {
      if (vipLockOverlay) {
        vipLockOverlay.style.display = 'none';
      }
    }
  } catch (e) { }

  // Keypad clicks
  keyBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var val = btn.getAttribute('data-key');
      var action = btn.getAttribute('data-action');
      if (sfx.click) sfx.click();

      if (action === 'clear') {
        clearPin();
        if (vipPinError) vipPinError.style.display = 'none';
      } else if (action === 'back') {
        for (var i = pinBoxes.length - 1; i >= 0; i--) {
          if (pinBoxes[i].value) {
            pinBoxes[i].value = '';
            pinBoxes[i].classList.remove('has-val');
            pinBoxes[i].focus();
            break;
          }
        }
      } else if (val !== null && val !== undefined) {
        for (var j = 0; j < pinBoxes.length; j++) {
          if (!pinBoxes[j].value) {
            pinBoxes[j].value = val;
            pinBoxes[j].classList.add('has-val');
            if (j < pinBoxes.length - 1) {
              pinBoxes[j + 1].focus();
            } else {
              // All 6 filled: auto validate!
              setTimeout(validateVipPin, 150);
            }
            break;
          }
        }
      }
    });
  });

  // Keyboard typing inside PIN input boxes
  pinBoxes.forEach(function (box, idx) {
    box.addEventListener('input', function () {
      var val = box.value.replace(/[^0-9]/g, '');
      box.value = val ? val[val.length - 1] : '';
      if (box.value) {
        box.classList.add('has-val');
        if (idx < pinBoxes.length - 1) {
          pinBoxes[idx + 1].focus();
        } else {
          setTimeout(validateVipPin, 150);
        }
      } else {
        box.classList.remove('has-val');
      }
    });

    box.addEventListener('keydown', function (e) {
      if (e.key === 'Backspace' && !box.value && idx > 0) {
        pinBoxes[idx - 1].focus();
      } else if (e.key === 'Enter') {
        validateVipPin();
      }
    });
  });

  if (vipUnlockBtn) {
    vipUnlockBtn.addEventListener('click', validateVipPin);
  }

  // =================================================
  // STAGE NAVIGATION CONTROLLER
  // =================================================
  var progressLineFill = document.getElementById('progressLineFill');

  function areAllCardsScratched() {
    var revealed = document.querySelectorAll('.scratch-card-box[data-revealed="true"]').length;
    var totalCards = document.querySelectorAll('.scratch-card-box').length || 3;
    return revealed >= totalCards;
  }

  function requireScratchNotice() {
    var scratchRequiredMsg = document.getElementById('scratchRequiredMsg');
    var lotterySection = document.getElementById('dividendLotterySection');
    var revealed = document.querySelectorAll('.scratch-card-box[data-revealed="true"]').length;
    var totalCards = document.querySelectorAll('.scratch-card-box').length || 3;

    if (scratchRequiredMsg) {
      scratchRequiredMsg.textContent = '⚠️ Please scratch and unlock all ' + totalCards + ' Birthday Dividend Cards above before moving to the next page! 🪙✨ (Unlocked: ' + revealed + ' of ' + totalCards + ')';
      scratchRequiredMsg.style.display = 'block';
      scratchRequiredMsg.style.animation = 'none';
      void scratchRequiredMsg.offsetWidth;
      scratchRequiredMsg.style.animation = 'shake 0.45s ease-in-out';
    }

    if (lotterySection) {
      lotterySection.classList.add('needs-scratch');
      lotterySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(function () {
        lotterySection.classList.remove('needs-scratch');
      }, 1500);
    }

    if (sfx.pop) sfx.pop();
  }

  function isTreatAddressRequiredAndMissing() {
    var formEl = document.getElementById('treatFormContainer');
    var isYesActive = (window.__treatYesChosen === true) || (formEl && formEl.classList.contains('active'));

    // If YES was not chosen, address is not mandatory
    if (!isYesActive) {
      return false;
    }

    // If order was already successfully placed in this session
    if (window.__treatOrderPlaced) {
      return false;
    }

    // Check if previously saved with a valid address
    try {
      var saved = localStorage.getItem('bday_treat_order');
      if (saved) {
        var parsed = JSON.parse(saved);
        if (parsed && parsed.address && parsed.address.trim()) {
          return false;
        }
      }
    } catch (e) { }

    // Otherwise, user picked YES but hasn't filled/ordered their address yet
    return true;
  }

  function requireTreatAddressNotice() {
    var treatRequiredMsg = document.getElementById('treatRequiredMsg');
    var treatAddress = document.getElementById('treatAddress');
    var treatErrorMsg = document.getElementById('treatErrorMsg');

    if (treatRequiredMsg) {
      treatRequiredMsg.style.display = 'block';
      treatRequiredMsg.style.animation = 'none';
      void treatRequiredMsg.offsetWidth;
      treatRequiredMsg.style.animation = 'shake 0.45s ease-in-out';
    }

    if (treatErrorMsg) {
      treatErrorMsg.textContent = '⚠️ You picked YES for the Birthday Treat! Please enter your delivery address and tap "Order Treats 🛍️✨" before proceeding to memories!';
      treatErrorMsg.style.display = 'block';
    }

    if (treatAddress) {
      treatAddress.classList.add('input-error');
      treatAddress.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(function () {
        treatAddress.focus();
      }, 350);
    }

    if (sfx.pop) sfx.pop();
  }

  function goToStage(stepNumber) {
    if (stepNumber < 1 || stepNumber > TOTAL_STAGES) return;

    // Mandatory Treat Address Check: If YES is selected, must fill address and complete order before advancing
    if (currentStage === 3 && stepNumber > 3 && isTreatAddressRequiredAndMissing()) {
      requireTreatAddressNotice();
      return;
    }

    // Mandatory Scratch Check: Do not allow moving past Stage 3 without scratching all dividend cards
    if (currentStage === 3 && stepNumber > 3 && !areAllCardsScratched()) {
      requireScratchNotice();
      return;
    }

    var previousStage = currentStage;
    currentStage = stepNumber;
    window.__currentStage = currentStage;

    // Toggle active stage cards
    for (var s = 1; s <= TOTAL_STAGES; s++) {
      var stageEl = document.getElementById('stage' + s);
      var indEl = document.getElementById('stepInd' + s);

      if (stageEl) {
        if (s === currentStage) {
          stageEl.classList.add('active');
        } else {
          stageEl.classList.remove('active');
        }
      }

      if (indEl) {
        if (s === currentStage) {
          indEl.classList.add('active');
          indEl.classList.remove('done');
        } else if (s < currentStage) {
          indEl.classList.remove('active');
          indEl.classList.add('done');
        } else {
          indEl.classList.remove('active');
          indEl.classList.remove('done');
        }
      }
    }

    // Update progress line percentage
    if (progressLineFill) {
      var pct = ((currentStage - 1) / (TOTAL_STAGES - 1)) * 100;
      progressLineFill.style.width = pct + '%';
    }

    // Smooth scroll into stage view
    var activeStageEl = document.getElementById('stage' + currentStage);
    if (activeStageEl) {
      activeStageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Specific stage behaviors
    if (currentStage === 2) {
      // Stock market stage: trigger pop sound
      if (sfx.pop) sfx.pop();
    } else if (currentStage === 5) {
      // Grand Finale: initially show glowing candles unless already blown this session
      if (!window.__candlesBlown) {
        var flameEl = document.getElementById('cakeFlame');
        var smokeEl = document.getElementById('smokePuff');
        var bannerEl = document.getElementById('cakeCutBanner');
        var queenBannerEl = document.getElementById('marketQueenBanner');
        var blowBtnEl = document.getElementById('blowCakeBtn');
        if (flameEl) flameEl.classList.remove('blown-out');
        if (smokeEl) smokeEl.classList.remove('active');
        if (bannerEl) bannerEl.classList.remove('active');
        if (queenBannerEl) queenBannerEl.classList.remove('active');
        if (blowBtnEl) {
          blowBtnEl.textContent = '💨 Make a Wish & Blow the Candles!';
          blowBtnEl.disabled = false;
        }
      }
      fireConfetti(true);
      if (audioCtrl && audioCtrl.playSong) {
        audioCtrl.playSong();
      }
    } else if (currentStage === 6) {
      updateThankYouDeliveryCardVisibility();
    }
  }

  // Step indicator clicks
  for (var i = 1; i <= TOTAL_STAGES; i++) {
    (function (step) {
      var ind = document.getElementById('stepInd' + step);
      if (ind) {
        ind.addEventListener('click', function () {
          if (sfx.click) sfx.click();
          goToStage(step);
        });
      }
    })(i);
  }

  // =================================================
  // STAGE 1: OPENING BELL
  // =================================================
  var stage1NextBtn = document.getElementById('stage1NextBtn');
  if (stage1NextBtn) {
    stage1NextBtn.addEventListener('click', function () {
      if (audioCtrl && audioCtrl.marketBell) {
        audioCtrl.marketBell();
      }
      fireConfetti(true);
      setTimeout(function () {
        goToStage(2);
      }, 350);
    });
  }

  // =================================================
  // STAGE 2: STOCK MARKET REPORT
  // =================================================
  var stage2PrevBtn = document.getElementById('stage2PrevBtn');
  var stage2NextBtn = document.getElementById('stage2NextBtn');

  if (stage2PrevBtn) {
    stage2PrevBtn.addEventListener('click', function () {
      if (sfx.click) sfx.click();
      goToStage(1);
    });
  }
  if (stage2NextBtn) {
    stage2NextBtn.addEventListener('click', function () {
      if (sfx.select) sfx.select();
      goToStage(3);
    });
  }

  // =================================================
  // STAGE 3: BIRTHDAY TREAT REQUEST (.TXT EXPORT)
  // =================================================
  var treatYesBtn = document.getElementById('treatYesBtn');
  var treatNoBtn = document.getElementById('treatNoBtn');
  var treatFormContainer = document.getElementById('treatFormContainer');
  var treatDecisionBox = document.getElementById('treatDecisionBox');
  var saveTreatBtn = document.getElementById('saveTreatBtn');
  var treatReceiptCard = document.getElementById('treatReceiptCard');
  var stage3PrevBtn = document.getElementById('stage3PrevBtn');
  var stage3NextBtn = document.getElementById('stage3NextBtn');

  var selectedTreatName = 'Gourmet Birthday Cake (Belgium Truffle / Red Velvet)';

  // Treat Yes Click
  if (treatYesBtn) {
    treatYesBtn.addEventListener('click', function () {
      window.__treatYesChosen = true;
      var treatRequiredMsg = document.getElementById('treatRequiredMsg');
      if (treatRequiredMsg) treatRequiredMsg.style.display = 'none';
      if (sfx.cheer) sfx.cheer();
      fireConfetti();
      if (treatFormContainer) {
        treatFormContainer.classList.add('active');
      }
      treatYesBtn.textContent = 'Awesome! Claiming Treat 🥳';
    });
  }

  // Playful No Button & Funny Popup
  var noPopupModal = document.getElementById('noPopupModal');
  var noPopupRetryBtn = document.getElementById('noPopupRetryBtn');

  if (treatNoBtn) {
    treatNoBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (sfx.click) sfx.click();
      if (noPopupModal) {
        noPopupModal.classList.add('active');
      }
    });
  }

  if (noPopupRetryBtn) {
    noPopupRetryBtn.addEventListener('click', function () {
      if (sfx.click) sfx.click();
      if (noPopupModal) {
        noPopupModal.classList.remove('active');
      }
      if (treatNoBtn) {
        treatNoBtn.style.transform = '';
        treatNoBtn.textContent = 'No thanks';
      }
      // Draw attention to YES button
      if (treatYesBtn) {
        treatYesBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // Treat Option Selection Cards & Dynamic Field Handling
  var treatCards = document.querySelectorAll('.treat-option-card');
  var treatCustomWrap = document.getElementById('treatCustomWrap');
  var treatCustomNote = document.getElementById('treatCustomNote');
  var treatAddress = document.getElementById('treatAddress');
  var treatErrorMsg = document.getElementById('treatErrorMsg');

  var selectedTreatName = 'Gourmet Birthday Cake';
  var isOtherSelected = false;

  treatCards.forEach(function (card) {
    card.addEventListener('click', function () {
      if (sfx.select) sfx.select();
      treatCards.forEach(function (c) { c.classList.remove('selected'); });
      card.classList.add('selected');

      selectedTreatName = card.getAttribute('data-treat') || 'Gourmet Birthday Cake';
      isOtherSelected = card.getAttribute('data-is-other') === 'true';

      // Clear any prior validation error styling
      if (treatErrorMsg) treatErrorMsg.style.display = 'none';
      if (treatCustomNote) treatCustomNote.classList.remove('input-error');
      if (treatAddress) treatAddress.classList.remove('input-error');

      // Dynamically toggle the custom treat description field
      if (treatCustomWrap) {
        if (isOtherSelected) {
          treatCustomWrap.style.display = 'block';
          if (treatCustomNote) treatCustomNote.focus();
        } else {
          treatCustomWrap.style.display = 'none';
        }
      }
    });
  });

  // Order Treats Action (No download, strict validation, instant confirmation)
  if (saveTreatBtn) {
    saveTreatBtn.addEventListener('click', function () {
      // Clear previous error states
      if (treatErrorMsg) treatErrorMsg.style.display = 'none';
      if (treatCustomNote) treatCustomNote.classList.remove('input-error');
      if (treatAddress) treatAddress.classList.remove('input-error');

      var customVal = treatCustomNote ? treatCustomNote.value.trim() : '';
      var addressVal = treatAddress ? treatAddress.value.trim() : '';

      // 1. Mandatory validation for custom treat if 'Other' is selected
      if (isOtherSelected && !customVal) {
        if (treatCustomNote) treatCustomNote.classList.add('input-error');
        if (treatErrorMsg) {
          treatErrorMsg.textContent = '⚠️ Please describe what custom treat or craving you would like!';
          treatErrorMsg.style.display = 'block';
        }
        if (treatCustomNote) treatCustomNote.focus();
        return;
      }

      // 2. Mandatory validation for delivery address (required in all cases)
      if (!addressVal) {
        if (treatAddress) treatAddress.classList.add('input-error');
        if (treatErrorMsg) {
          treatErrorMsg.textContent = '⚠️ Please enter your delivery address so we can deliver your treat!';
          treatErrorMsg.style.display = 'block';
        }
        if (treatAddress) treatAddress.focus();
        return;
      }

      // Successful Order Placement
      if (audioCtrl && audioCtrl.sfx && audioCtrl.sfx.cheer) {
        audioCtrl.sfx.cheer();
      } else if (sfx.cheer) {
        sfx.cheer();
      }
      fireConfetti(true);

      var orderItemDisplay = isOtherSelected ? ('Custom Craving: ' + customVal) : selectedTreatName;
      var now = new Date();
      var timestampStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
      var orderId = 'EXPERT-TREAT-' + Math.floor(100000 + Math.random() * 900000);

      // Save to Firebase & LocalStorage without prompting any file download
      var treatData = {
        recipient: NAME + ' (The Expert)',
        orderId: orderId,
        treat: selectedTreatName,
        customNote: customVal || 'Standard Selected',
        address: addressVal,
        date: timestampStr
      };

      if (window.__saveTreat) {
        window.__saveTreat(treatData, JSON.stringify(treatData)).catch(function (e) {
          console.log('Firebase log:', e);
        });
      }

      try {
        localStorage.setItem('bday_treat_order', JSON.stringify(treatData));
      } catch (e) { }

      // Update On-Screen Confirmation Card
      var rItem = document.getElementById('receiptItem');
      var rNote = document.getElementById('receiptNote');
      var rNoteRow = document.getElementById('receiptNoteRow');
      var rAddr = document.getElementById('receiptAddress');

      if (rItem) rItem.textContent = orderItemDisplay;
      if (rAddr) rAddr.textContent = addressVal;

      if (rNote && rNoteRow) {
        if (isOtherSelected) {
          rNote.textContent = customVal;
          rNoteRow.style.display = 'flex';
        } else {
          rNoteRow.style.display = 'none';
        }
      }

      if (treatReceiptCard) {
        treatReceiptCard.classList.add('active');
        treatReceiptCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      saveTreatBtn.textContent = '✓ Order Placed & Reserved! 🛵🎉';
      saveTreatBtn.disabled = true;
      window.__treatOrderPlaced = true;
      var treatRequiredMsg = document.getElementById('treatRequiredMsg');
      if (treatRequiredMsg) treatRequiredMsg.style.display = 'none';
      if (typeof updateThankYouDeliveryCardVisibility === 'function') {
        updateThankYouDeliveryCardVisibility();
      }
    });
  }

  if (treatAddress) {
    treatAddress.addEventListener('input', function () {
      treatAddress.classList.remove('input-error');
      var treatRequiredMsg = document.getElementById('treatRequiredMsg');
      if (treatRequiredMsg) treatRequiredMsg.style.display = 'none';
      if (treatErrorMsg) treatErrorMsg.style.display = 'none';
    });
  }
  if (treatCustomNote) {
    treatCustomNote.addEventListener('input', function () {
      treatCustomNote.classList.remove('input-error');
      if (treatErrorMsg) treatErrorMsg.style.display = 'none';
    });
  }

  if (stage3PrevBtn) {
    stage3PrevBtn.addEventListener('click', function () {
      if (sfx.click) sfx.click();
      goToStage(2);
    });
  }
  if (stage3NextBtn) {
    stage3NextBtn.addEventListener('click', function () {
      if (isTreatAddressRequiredAndMissing()) {
        requireTreatAddressNotice();
        return;
      }
      var treatRequiredMsg = document.getElementById('treatRequiredMsg');
      if (treatRequiredMsg) treatRequiredMsg.style.display = 'none';

      if (!areAllCardsScratched()) {
        requireScratchNotice();
        return;
      }
      var scratchRequiredMsg = document.getElementById('scratchRequiredMsg');
      if (scratchRequiredMsg) scratchRequiredMsg.style.display = 'none';
      if (sfx.select) sfx.select();
      goToStage(4);
    });
  }

  // =================================================
  // FEATURE 2: 🎁 "SCRATCH-OFF" BIRTHDAY DIVIDEND CARDS (LOTTERY STYLE)
  // =================================================
  var scratchCardBoxes = document.querySelectorAll('.scratch-card-box');
  var scratchedCountEl = document.getElementById('scratchedCount');
  var scratchAllBtn = document.getElementById('scratchAllBtn');
  var lastScratchSfxTime = 0;

  function initScratchCard(box) {
    var canvas = box.querySelector('.scratch-card-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var isDrawing = false;
    var lastX = 0, lastY = 0;
    var moveCount = 0;

    // Set real resolution to avoid blur
    var width = 280;
    var height = 350;
    canvas.width = width;
    canvas.height = height;

    // Draw rich glittering golden foil
    function drawFoil() {
      // Golden gradient base
      var grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#fef08a');
      grad.addColorStop(0.25, '#f59e0b');
      grad.addColorStop(0.5, '#fef08a');
      grad.addColorStop(0.75, '#d97706');
      grad.addColorStop(1, '#fde047');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Metallic sheen overlay
      var sheen = ctx.createRadialGradient(width * 0.35, height * 0.35, 10, width * 0.5, height * 0.5, width * 0.7);
      sheen.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      sheen.addColorStop(0.5, 'rgba(245, 166, 35, 0.15)');
      sheen.addColorStop(1, 'rgba(180, 83, 9, 0.35)');
      ctx.fillStyle = sheen;
      ctx.fillRect(0, 0, width, height);

      // Gold Sparkle Stars pattern
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      for (var s = 0; s < 40; s++) {
        var sx = (s * 47) % width;
        var sy = (s * 79) % height;
        var r = (s % 3 === 0) ? 2.5 : 1.5;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Elegant inner border
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 3;
      ctx.strokeRect(12, 12, width - 24, height - 24);

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(16, 16, width - 32, height - 32);
      ctx.setLineDash([]);

      // Badge & Text
      ctx.textAlign = 'center';
      ctx.fillStyle = '#78350f';
      ctx.font = 'bold 12px Fredoka, sans-serif';
      ctx.fillText('★ 100-BAGGER LOTTERY ★', width / 2, 55);

      ctx.font = '36px sans-serif';
      ctx.fillText('🪙', width / 2, 115);

      ctx.fillStyle = '#451a03';
      ctx.font = 'bold 16px Outfit, sans-serif';
      ctx.fillText('GOLDEN DIVIDEND', width / 2, 170);

      ctx.fillStyle = '#78350f';
      ctx.font = '12px Fredoka, sans-serif';
      ctx.fillText('Rub with Finger or Mouse ✨', width / 2, 205);

      // Decorative stars bottom
      ctx.font = '14px sans-serif';
      ctx.fillText('✨ 🎁 💎 🎁 ✨', width / 2, 290);
    }

    drawFoil();

    function getCoords(e) {
      var r = canvas.getBoundingClientRect();
      var clientX = e.clientX;
      var clientY = e.clientY;
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
      return {
        x: (clientX - r.left) * (canvas.width / r.width),
        y: (clientY - r.top) * (canvas.height / r.height),
        screenX: clientX,
        screenY: clientY
      };
    }

    function spawnScratchSparkle(x, y) {
      if (Math.random() > 0.45) return;
      var dot = document.createElement('div');
      dot.className = 'scratch-sparkle-dot';
      var colors = ['#fbbf24', '#f59e0b', '#fef08a', '#ffffff', '#ff8fb1'];
      dot.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      var sz = Math.floor(Math.random() * 6) + 4;
      dot.style.width = sz + 'px';
      dot.style.height = sz + 'px';
      dot.style.left = (x - sz / 2) + 'px';
      dot.style.top = (y - sz / 2) + 'px';
      var angle = Math.random() * Math.PI * 2;
      var dist = Math.random() * 40 + 15;
      dot.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
      dot.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
      document.body.appendChild(dot);
      setTimeout(function () {
        if (dot.parentNode) dot.parentNode.removeChild(dot);
      }, 600);
    }

    function checkScratchPercentage() {
      if (box.getAttribute('data-revealed') === 'true') return;
      var samplePoints = 20;
      var transparentCount = 0;
      var stepX = Math.floor(canvas.width / samplePoints);
      var stepY = Math.floor(canvas.height / samplePoints);
      try {
        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var data = imgData.data;
        for (var py = 0; py < canvas.height; py += stepY) {
          for (var px = 0; px < canvas.width; px += stepX) {
            var index = (py * canvas.width + px) * 4 + 3;
            if (data[index] < 128) {
              transparentCount++;
            }
          }
        }
        var totalSamples = (canvas.width / stepX) * (canvas.height / stepY);
        var ratio = transparentCount / totalSamples;
        if (ratio > 0.42) {
          revealCard(box);
        }
      } catch (err) { }
    }

    function scratch(e) {
      if (!isDrawing) return;
      if (box.getAttribute('data-revealed') === 'true') return;
      var coords = getCoords(e);

      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 44;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();

      lastX = coords.x;
      lastY = coords.y;

      spawnScratchSparkle(coords.screenX, coords.screenY);

      var now = Date.now();
      if (now - lastScratchSfxTime > 90) {
        lastScratchSfxTime = now;
        if (audioCtrl && audioCtrl.sfx && audioCtrl.sfx.scratch) {
          audioCtrl.sfx.scratch();
        }
      }

      moveCount++;
      if (moveCount % 12 === 0) {
        checkScratchPercentage();
      }
    }

    function startScratch(e) {
      if (box.getAttribute('data-revealed') === 'true') return;
      isDrawing = true;
      var coords = getCoords(e);
      lastX = coords.x;
      lastY = coords.y;
      scratch(e);
    }

    function stopScratch() {
      if (isDrawing) {
        isDrawing = false;
        checkScratchPercentage();
      }
    }

    // Mouse listeners
    canvas.addEventListener('mousedown', startScratch);
    window.addEventListener('mousemove', scratch);
    window.addEventListener('mouseup', stopScratch);

    // Touch listeners
    canvas.addEventListener('touchstart', function (e) {
      startScratch(e);
      e.preventDefault();
    }, { passive: false });
    canvas.addEventListener('touchmove', function (e) {
      scratch(e);
      e.preventDefault();
    }, { passive: false });
    window.addEventListener('touchend', stopScratch);
  }

  function revealCard(box) {
    if (box.getAttribute('data-revealed') === 'true') return;
    box.setAttribute('data-revealed', 'true');
    box.classList.add('scratched');
    var canvas = box.querySelector('.scratch-card-canvas');
    if (canvas) {
      canvas.style.transition = 'opacity 0.6s ease';
      canvas.style.opacity = '0';
      setTimeout(function () {
        canvas.style.display = 'none';
      }, 650);
    }

    if (audioCtrl && audioCtrl.sfx && audioCtrl.sfx.voucherWin) {
      audioCtrl.sfx.voucherWin();
    }
    fireConfetti(false);

    // Update revealed count
    updateScratchedCount();
  }

  function updateScratchedCount() {
    var revealed = document.querySelectorAll('.scratch-card-box[data-revealed="true"]').length;
    if (scratchedCountEl) scratchedCountEl.textContent = revealed;
    if (revealed >= 3) {
      if (scratchAllBtn) {
        scratchAllBtn.textContent = '🎉 All 3 Dividends Unlocked & Active!';
        scratchAllBtn.disabled = true;
      }
      var scratchRequiredMsg = document.getElementById('scratchRequiredMsg');
      if (scratchRequiredMsg) scratchRequiredMsg.style.display = 'none';
      if (stage3NextBtn) {
        stage3NextBtn.classList.add('ready-to-advance');
      }
    }
  }

  scratchCardBoxes.forEach(function (box) {
    initScratchCard(box);
  });

  if (scratchAllBtn) {
    scratchAllBtn.addEventListener('click', function () {
      if (sfx.cheer) sfx.cheer();
      scratchCardBoxes.forEach(function (box, idx) {
        setTimeout(function () {
          revealCard(box);
        }, idx * 220);
      });
    });
  }

  // Redeem Voucher Buttons
  var redeemVoucherBtns = document.querySelectorAll('.btn-redeem-coupon');
  redeemVoucherBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var cardIndex = btn.getAttribute('data-card');
      btn.textContent = '✓ CLAIMED FOR MAHIMA ⭐';
      btn.classList.add('redeemed');
      btn.disabled = true;
      if (audioCtrl && audioCtrl.sfx && audioCtrl.sfx.cheer) {
        audioCtrl.sfx.cheer();
      }
      fireConfetti(true);

      // Floating celebratory notification toast
      var banner = document.createElement('div');
      banner.textContent = '🎉 Dividend Voucher #' + cardIndex + ' Stamped & Booked for Mahima!';
      banner.style.position = 'fixed';
      banner.style.bottom = '30px';
      banner.style.left = '50%';
      banner.style.transform = 'translateX(-50%) translateY(50px)';
      banner.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      banner.style.color = '#fff';
      banner.style.fontFamily = 'var(--font-cute)';
      banner.style.fontSize = '14px';
      banner.style.fontWeight = '700';
      banner.style.padding = '12px 24px';
      banner.style.borderRadius = '99px';
      banner.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.4)';
      banner.style.zIndex = '2000';
      banner.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      document.body.appendChild(banner);

      setTimeout(function () {
        banner.style.transform = 'translateX(-50%) translateY(0)';
      }, 20);

      setTimeout(function () {
        banner.style.transform = 'translateX(-50%) translateY(80px)';
        banner.style.opacity = '0';
        setTimeout(function () {
          if (banner.parentNode) banner.parentNode.removeChild(banner);
        }, 400);
      }, 3500);
    });
  });

  // =================================================
  // FEATURE 1: 💌 "FLIP THE POLAROID" — 3D FLIP & SECRET NOTES
  // =================================================
  var polaroidCards = document.querySelectorAll('.polaroid-card');
  var photoModal = document.getElementById('photoModal');
  var modalCloseBtn = document.getElementById('modalCloseBtn');
  var modalImg = document.getElementById('modalImg');
  var modalImgWrap = document.getElementById('modalImgWrap');
  var modalCaption = document.getElementById('modalCaption');
  var modalReactBtn = document.getElementById('modalReactBtn');
  var reactCountEl = document.getElementById('reactCount');
  var modalTabPhoto = document.getElementById('modalTabPhoto');
  var modalTabNote = document.getElementById('modalTabNote');
  var modalNoteWrap = document.getElementById('modalNoteWrap');
  var modalNoteWhere = document.getElementById('modalNoteWhere');
  var modalNoteSmile = document.getElementById('modalNoteSmile');
  var modalNoteWhy = document.getElementById('modalNoteWhy');
  var modalNoteHeader = document.getElementById('modalNoteHeader');
  var likes = 1;

  function flipCard(card) {
    if (audioCtrl && audioCtrl.sfx && audioCtrl.sfx.paperWhoosh) {
      audioCtrl.sfx.paperWhoosh();
    }
    card.classList.toggle('is-flipped');
  }

  polaroidCards.forEach(function (card) {
    // Flip buttons
    var flipBtn = card.querySelector('.btn-flip-polaroid');
    var flipBackBtn = card.querySelector('.btn-flip-back');

    if (flipBtn) {
      flipBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        flipCard(card);
      });
    }

    if (flipBackBtn) {
      flipBackBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        flipCard(card);
      });
    }

    // Double-click anywhere to flip
    card.addEventListener('dblclick', function (e) {
      e.stopPropagation();
      flipCard(card);
    });

    // Zoom trigger or clicking image opens modal
    var zoomBtn = card.querySelector('.polaroid-zoom-trigger');
    var imgWrap = card.querySelector('.polaroid-img-wrap');

    function openModalForCard(e) {
      if (e) e.stopPropagation();
      if (sfx.shutter) sfx.shutter();
      var imgSrc = card.getAttribute('data-img');
      var captionText = card.getAttribute('data-caption') || 'Cherished Memory';

      if (modalImg && imgSrc) modalImg.src = imgSrc;
      if (modalCaption) modalCaption.textContent = captionText;

      // Populate note data
      if (modalNoteWhere) modalNoteWhere.textContent = card.getAttribute('data-where') || '';
      if (modalNoteSmile) modalNoteSmile.textContent = card.getAttribute('data-smile') || '';
      if (modalNoteWhy) modalNoteWhy.textContent = card.getAttribute('data-why') || '';
      var noteTitle = card.querySelector('.polaroid-caption');
      if (modalNoteHeader && noteTitle) modalNoteHeader.textContent = noteTitle.textContent + ' ✨';

      // Default to photo view
      switchModalTab('photo');

      if (photoModal) photoModal.classList.add('active');
    }

    if (zoomBtn) {
      zoomBtn.addEventListener('click', openModalForCard);
    }
    if (imgWrap) {
      imgWrap.addEventListener('click', openModalForCard);
    }
  });

  function switchModalTab(tab) {
    if (tab === 'note') {
      if (modalTabNote) modalTabNote.classList.add('active');
      if (modalTabPhoto) modalTabPhoto.classList.remove('active');
      if (modalImgWrap) modalImgWrap.style.display = 'none';
      if (modalNoteWrap) modalNoteWrap.style.display = 'block';
      if (audioCtrl && audioCtrl.sfx && audioCtrl.sfx.paperWhoosh) {
        audioCtrl.sfx.paperWhoosh();
      }
    } else {
      if (modalTabPhoto) modalTabPhoto.classList.add('active');
      if (modalTabNote) modalTabNote.classList.remove('active');
      if (modalImgWrap) modalImgWrap.style.display = 'block';
      if (modalNoteWrap) modalNoteWrap.style.display = 'none';
    }
  }

  if (modalTabPhoto) {
    modalTabPhoto.addEventListener('click', function () {
      switchModalTab('photo');
    });
  }
  if (modalTabNote) {
    modalTabNote.addEventListener('click', function () {
      switchModalTab('note');
    });
  }

  if (modalCloseBtn && photoModal) {
    modalCloseBtn.addEventListener('click', function () {
      if (sfx.click) sfx.click();
      photoModal.classList.remove('active');
    });

    photoModal.addEventListener('click', function (e) {
      if (e.target === photoModal) {
        photoModal.classList.remove('active');
      }
    });
  }

  if (modalReactBtn) {
    modalReactBtn.addEventListener('click', function () {
      likes++;
      if (reactCountEl) reactCountEl.textContent = likes;
      if (audioCtrl && audioCtrl.sfx && audioCtrl.sfx.cheer) {
        audioCtrl.sfx.cheer();
      } else if (sfx.cheer) {
        sfx.cheer();
      }

      // Spawn burst of miniature floating stars & sparkles from button
      var starParticles = ['⭐', '✨', '🌟', '💫', '🎉'];
      for (var f = 0; f < 8; f++) {
        var miniH = document.createElement('span');
        miniH.textContent = starParticles[Math.floor(Math.random() * starParticles.length)];
        miniH.style.position = 'fixed';
        miniH.style.left = (window.innerWidth / 2 + (Math.random() - 0.5) * 120) + 'px';
        miniH.style.top = (window.innerHeight / 2 + (Math.random() - 0.5) * 80) + 'px';
        miniH.style.fontSize = '24px';
        miniH.style.pointerEvents = 'none';
        miniH.style.zIndex = '1100';
        miniH.style.transition = 'all 1s ease-out';
        document.body.appendChild(miniH);

        (function (el) {
          setTimeout(function () {
            el.style.transform = 'translateY(-100px) scale(1.5)';
            el.style.opacity = '0';
          }, 20);
          setTimeout(function () {
            if (el.parentNode) el.parentNode.removeChild(el);
          }, 1100);
        })(miniH);
      }
    });
  }

  var stage4PrevBtn = document.getElementById('stage4PrevBtn');
  var stage4NextBtn = document.getElementById('stage4NextBtn');

  if (stage4PrevBtn) {
    stage4PrevBtn.addEventListener('click', function () {
      if (sfx.click) sfx.click();
      goToStage(3);
    });
  }
  if (stage4NextBtn) {
    stage4NextBtn.addEventListener('click', function () {
      if (sfx.select) sfx.select();
      goToStage(5);
    });
  }

  // =================================================
  // FEATURE 3: 🎆 MAGICAL FIREWORKS & SPARKLER SHOW
  // =================================================
  var finaleSongBtn = document.getElementById('finaleSongBtn');
  var muteBtn = document.getElementById('muteBtn');
  var globalMuteBtn = document.getElementById('globalMuteBtn');
  var globalMuteIcon = document.getElementById('globalMuteIcon');
  var globalMuteText = document.getElementById('globalMuteText');
  var stopFireworksBtn = document.getElementById('stopFireworksBtn');
  var marketQueenModal = document.getElementById('marketQueenModal');
  var queenModalCloseBtn = document.getElementById('queenModalCloseBtn');
  var queenDismissBtn = document.getElementById('queenDismissBtn');
  var queenViewLetterBtn = document.getElementById('queenViewLetterBtn');

  var blowCakeBtn = document.getElementById('blowCakeBtn');
  var cakeFlame = document.getElementById('cakeFlame');
  var smokePuff = document.getElementById('smokePuff');
  var cakeCutBanner = document.getElementById('cakeCutBanner');
  var stage5PrevBtn = document.getElementById('stage5PrevBtn');
  var replayBtn = document.getElementById('replayBtn');
  var fireworksCanvas = document.getElementById('fireworksCanvas');
  var fctx = fireworksCanvas ? fireworksCanvas.getContext('2d') : null;
  var twilightOverlay = document.getElementById('twilightOverlay');
  var marketQueenBanner = document.getElementById('marketQueenBanner');
  var relightCakeBtn = document.getElementById('relightCakeBtn');
  var cakeSparklerCanvas = document.getElementById('cakeSparklerCanvas');
  var sctx = cakeSparklerCanvas ? cakeSparklerCanvas.getContext('2d') : null;

  // Fireworks Engine (Physics particles & rockets)
  var fireworksEngine = {
    active: false,
    particles: [],
    rockets: [],
    lastRocketTime: 0,
    animId: null
  };

  function resizeFireworks() {
    if (!fireworksCanvas) return;
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeFireworks);
  resizeFireworks();

  function launchRocket() {
    if (!fireworksEngine.active) return;
    var x = Math.random() * (window.innerWidth * 0.8) + window.innerWidth * 0.1;
    var targetY = Math.random() * (window.innerHeight * 0.45) + window.innerHeight * 0.12;
    var speed = Math.random() * 3 + 8;
    fireworksEngine.rockets.push({
      x: x,
      y: window.innerHeight,
      targetY: targetY,
      speed: speed,
      color: ['#f59e0b', '#ec4899', '#38bdf8', '#10b981', '#fef08a', '#a855f7'][Math.floor(Math.random() * 6)]
    });

    if (audioCtrl && audioCtrl.sfx && audioCtrl.sfx.fireworkLaunch) {
      audioCtrl.sfx.fireworkLaunch();
    }
  }

  function explodeFirework(x, y, color) {
    var count = Math.floor(Math.random() * 35) + 65;
    var isStar = Math.random() > 0.5;
    for (var i = 0; i < count; i++) {
      var angle, spd;
      if (isStar) {
        var t = (i / count) * Math.PI * 2;
        // 5-pointed starburst geometry
        var r = 1 + 0.55 * Math.cos(5 * t);
        angle = t;
        spd = r * (Math.random() * 2 + 3.2);
      } else {
        angle = Math.random() * Math.PI * 2;
        spd = Math.random() * 6 + 1.5;
      }
      fireworksEngine.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        color: color,
        alpha: 1,
        life: Math.random() * 0.015 + 0.012,
        gravity: 0.06,
        drag: 0.96
      });
    }

    if (audioCtrl && audioCtrl.sfx && audioCtrl.sfx.fireworkExplosion) {
      audioCtrl.sfx.fireworkExplosion();
    }
  }

  function runFireworks() {
    if (!fireworksEngine.active || !fctx) return;
    fctx.globalCompositeOperation = 'destination-out';
    fctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    fctx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    fctx.globalCompositeOperation = 'lighter';

    var now = Date.now();
    if (now - fireworksEngine.lastRocketTime > 850) {
      fireworksEngine.lastRocketTime = now;
      launchRocket();
    }

    // Rockets
    for (var r = fireworksEngine.rockets.length - 1; r >= 0; r--) {
      var rocket = fireworksEngine.rockets[r];
      rocket.y -= rocket.speed;
      // Draw spark trail
      fctx.fillStyle = '#fef08a';
      fctx.fillRect(rocket.x, rocket.y, 3, 7);

      if (rocket.y <= rocket.targetY) {
        explodeFirework(rocket.x, rocket.y, rocket.color);
        fireworksEngine.rockets.splice(r, 1);
      }
    }

    // Explosion Particles
    for (var p = fireworksEngine.particles.length - 1; p >= 0; p--) {
      var pt = fireworksEngine.particles[p];
      pt.vx *= pt.drag;
      pt.vy *= pt.drag;
      pt.vy += pt.gravity;
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.alpha -= pt.life;

      if (pt.alpha <= 0) {
        fireworksEngine.particles.splice(p, 1);
      } else {
        fctx.save();
        fctx.globalAlpha = pt.alpha;
        fctx.fillStyle = pt.color;
        fctx.beginPath();
        fctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
        fctx.fill();
        fctx.restore();
      }
    }

    fireworksEngine.animId = requestAnimationFrame(runFireworks);
  }

  // Sparkler Fountain on Cake
  var sparklerEngine = {
    active: false,
    particles: [],
    animId: null
  };

  function runSparklers() {
    if (!sparklerEngine.active || !sctx || !cakeSparklerCanvas) return;
    sctx.clearRect(0, 0, cakeSparklerCanvas.width, cakeSparklerCanvas.height);

    var w = cakeSparklerCanvas.width;
    var h = cakeSparklerCanvas.height;
    // Map candle wick positions from SVG 200x180 to canvas
    var candleXPercent = [73.5 / 200, 91.5 / 200, 109.5 / 200, 127.5 / 200];
    var candleYPercent = [42 / 180, 38 / 180, 38 / 180, 42 / 180];

    // Spawn sparks
    for (var k = 0; k < 4; k++) {
      var cx = w * candleXPercent[k];
      var cy = h * candleYPercent[k];
      for (var s = 0; s < 3; s++) {
        var ang = -Math.PI / 2 + (Math.random() - 0.5) * 1.3;
        var spd = Math.random() * 5 + 3;
        sparklerEngine.particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          alpha: 1,
          color: Math.random() > 0.3 ? '#fef08a' : '#ffffff',
          size: Math.random() * 2.2 + 1
        });
      }
    }

    // Animate sparks
    for (var i = sparklerEngine.particles.length - 1; i >= 0; i--) {
      var sp = sparklerEngine.particles[i];
      sp.vy += 0.14; // gravity
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.alpha -= 0.045;
      if (sp.alpha <= 0) {
        sparklerEngine.particles.splice(i, 1);
      } else {
        sctx.save();
        sctx.globalAlpha = sp.alpha;
        sctx.fillStyle = sp.color;
        sctx.beginPath();
        sctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        sctx.fill();
        sctx.restore();
      }
    }

    if (Math.random() > 0.65 && audioCtrl && audioCtrl.sfx && audioCtrl.sfx.sparklerCrackle) {
      audioCtrl.sfx.sparklerCrackle();
    }

    sparklerEngine.animId = requestAnimationFrame(runSparklers);
  }

  var celebrationTimer = null;

  function stopGrandCelebration() {
    if (celebrationTimer) {
      clearTimeout(celebrationTimer);
      celebrationTimer = null;
    }
    if (stopFireworksBtn) {
      stopFireworksBtn.style.display = 'none';
    }
    fireworksEngine.active = false;
    if (fireworksEngine.animId) {
      cancelAnimationFrame(fireworksEngine.animId);
      fireworksEngine.animId = null;
    }
    sparklerEngine.active = false;
    if (sparklerEngine.animId) {
      cancelAnimationFrame(sparklerEngine.animId);
      sparklerEngine.animId = null;
    }
    if (fctx && fireworksCanvas) {
      fctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    }
    if (sctx && cakeSparklerCanvas) {
      sctx.clearRect(0, 0, cakeSparklerCanvas.width, cakeSparklerCanvas.height);
    }
    if (twilightOverlay) {
      twilightOverlay.classList.remove('active');
    }
  }

  function openMarketQueenModal() {
    if (marketQueenModal) {
      marketQueenModal.style.display = 'flex';
    }
  }

  function closeMarketQueenModal() {
    if (marketQueenModal) {
      marketQueenModal.style.display = 'none';
    }
  }

  function startGrandCelebration() {
    window.__candlesBlown = true;

    // Show floating button to close fireworks anytime
    if (stopFireworksBtn) {
      stopFireworksBtn.style.display = 'inline-flex';
    }

    // 1. Twilight overlay activates (gentle night sky glow)
    if (twilightOverlay) twilightOverlay.classList.add('active');

    // 2. Spotlight cake
    var stage5 = document.getElementById('stage5');
    if (stage5) stage5.classList.add('celebrating');

    // 3. Extinguish candle flames & release smoke
    if (cakeFlame) cakeFlame.classList.add('blown-out');
    if (smokePuff) smokePuff.classList.add('active');

    // 4. Sparkler fountain canvas
    if (cakeSparklerCanvas) {
      cakeSparklerCanvas.width = cakeSparklerCanvas.offsetWidth || 300;
      cakeSparklerCanvas.height = cakeSparklerCanvas.offsetHeight || 270;
      sparklerEngine.active = true;
      runSparklers();
    }

    // 5. Fullscreen Fireworks Engine
    fireworksEngine.active = true;
    resizeFireworks();
    runFireworks();
    setTimeout(launchRocket, 100);
    setTimeout(launchRocket, 400);
    setTimeout(launchRocket, 700);

    // Auto-close fireworks and sparkler show automatically after 30 seconds
    if (celebrationTimer) clearTimeout(celebrationTimer);
    celebrationTimer = setTimeout(function () {
      stopGrandCelebration();
    }, 30000);

    // 6. Reveal Glowing Golden Market Queen Banner
    setTimeout(function () {
      if (marketQueenBanner) marketQueenBanner.classList.add('active');
      if (cakeCutBanner) cakeCutBanner.classList.add('active');
    }, 900);

    // 7. Confetti bursts & Market Queen Popup Modal
    setTimeout(function () {
      if (audioCtrl && audioCtrl.sfx && audioCtrl.sfx.cheer) {
        audioCtrl.sfx.cheer();
      }
      fireConfetti(true);
      openMarketQueenModal();
    }, 700);

    setTimeout(function () {
      fireConfetti(true);
    }, 1400);

    // Persist state
    try {
      sessionStorage.setItem('mahima_candles_blown', 'true');
      localStorage.setItem('mahima_candles_blown', 'true');
    } catch (e) { }
  }

  function resetCandleCelebration() {
    window.__candlesBlown = false;
    stopGrandCelebration();
    closeMarketQueenModal();

    if (cakeFlame) cakeFlame.classList.remove('blown-out');
    if (smokePuff) smokePuff.classList.remove('active');
    if (marketQueenBanner) marketQueenBanner.classList.remove('active');
    if (cakeCutBanner) cakeCutBanner.classList.remove('active');

    var stage5 = document.getElementById('stage5');
    if (stage5) stage5.classList.remove('celebrating');

    if (blowCakeBtn) {
      blowCakeBtn.textContent = '💨 Make a Wish & Blow the Candles!';
      blowCakeBtn.disabled = false;
    }

    try {
      sessionStorage.removeItem('mahima_candles_blown');
      localStorage.removeItem('mahima_candles_blown');
    } catch (e) { }

    if (audioCtrl && audioCtrl.sfx && audioCtrl.sfx.click) {
      audioCtrl.sfx.click();
    }
  }

  // Global Mute/Unmute Controller (Top-right button)
  function updateMuteButtonUI(isMuted) {
    if (globalMuteBtn) {
      if (isMuted) {
        globalMuteBtn.classList.add('is-muted');
      } else {
        globalMuteBtn.classList.remove('is-muted');
      }
    }
    if (globalMuteIcon) {
      globalMuteIcon.textContent = isMuted ? '🔇' : '🔊';
    }
    if (globalMuteText) {
      globalMuteText.textContent = isMuted ? 'Sound OFF' : 'Sound ON';
    }
    if (muteBtn) {
      muteBtn.textContent = isMuted ? '🔇' : '🔊';
    }
  }

  if (globalMuteBtn) {
    globalMuteBtn.addEventListener('click', function () {
      if (audioCtrl && audioCtrl.toggleMute) {
        var isMuted = audioCtrl.toggleMute();
        updateMuteButtonUI(isMuted);
        if (!isMuted && sfx.click) sfx.click();
      }
    });
  }

  // Fireworks manual close button
  if (stopFireworksBtn) {
    stopFireworksBtn.addEventListener('click', function () {
      stopGrandCelebration();
      if (sfx.click) sfx.click();
    });
  }

  // Market Queen Popup Modal listeners
  if (queenModalCloseBtn) {
    queenModalCloseBtn.addEventListener('click', closeMarketQueenModal);
  }
  if (queenDismissBtn) {
    queenDismissBtn.addEventListener('click', closeMarketQueenModal);
  }
  if (queenViewLetterBtn) {
    queenViewLetterBtn.addEventListener('click', function () {
      closeMarketQueenModal();
      var letterCard = document.querySelector('.special-letter-card');
      if (letterCard) {
        letterCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Song controls
  if (finaleSongBtn) {
    finaleSongBtn.addEventListener('click', function () {
      if (audioCtrl && audioCtrl.toggleSong) {
        audioCtrl.toggleSong();
      }
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', function () {
      if (audioCtrl && audioCtrl.toggleMute) {
        var isMuted = audioCtrl.toggleMute();
        updateMuteButtonUI(isMuted);
      }
    });
  }

  // Interactive Candle Blow / Cake Cut
  if (blowCakeBtn) {
    blowCakeBtn.addEventListener('click', function () {
      if (audioCtrl && audioCtrl.sfx && audioCtrl.sfx.blow) {
        audioCtrl.sfx.blow();
      }
      blowCakeBtn.textContent = '🎂 Candles Blown! Wish Sealed with Magic & Cheer! ✨';
      blowCakeBtn.disabled = true;

      startGrandCelebration();

      if (audioCtrl && audioCtrl.playSong) {
        audioCtrl.playSong();
      }
    });
  }

  if (relightCakeBtn) {
    relightCakeBtn.addEventListener('click', function () {
      resetCandleCelebration();
    });
  }

  if (stage5PrevBtn) {
    stage5PrevBtn.addEventListener('click', function () {
      if (sfx.click) sfx.click();
      goToStage(4);
    });
  }

  var stage5NextBtn = document.getElementById('stage5NextBtn');
  if (stage5NextBtn) {
    stage5NextBtn.addEventListener('click', function () {
      if (sfx.select) sfx.select();
      goToStage(6);
    });
  }

  // =================================================
  // STAGE 6: THANK YOU & CLOSING BELL CONTROLS
  // =================================================
  var stage6PrevBtn = document.getElementById('stage6PrevBtn');
  var replayFromStartBtn = document.getElementById('replayFromStartBtn');
  var closingBellBtn = document.getElementById('closingBellBtn');
  var closingBellToast = document.getElementById('closingBellToast');

  if (stage6PrevBtn) {
    stage6PrevBtn.addEventListener('click', function () {
      if (sfx.click) sfx.click();
      goToStage(5);
    });
  }

  if (closingBellBtn) {
    closingBellBtn.addEventListener('click', function () {
      if (audioCtrl && audioCtrl.marketBell) {
        audioCtrl.marketBell();
      } else if (audioCtrl && audioCtrl.sfx && audioCtrl.sfx.cheer) {
        audioCtrl.sfx.cheer();
      }
      fireConfetti(true);

      if (closingBellToast) {
        closingBellToast.style.display = 'inline-block';
        closingBellToast.style.animation = 'none';
        void closingBellToast.offsetWidth; // trigger reflow
        closingBellToast.style.animation = 'cardEntry 0.5s ease-out';
      }
    });
  }

  // Stage 6 Delivery Card Visibility: Only show if treat was chosen (Yes) and completed
  function updateThankYouDeliveryCardVisibility() {
    var deliveryCard = document.getElementById('thankyouDeliveryCard');
    if (!deliveryCard) return;

    var hasOrdered = false;
    try {
      if (window.__treatOrderPlaced) {
        hasOrdered = true;
      } else {
        var savedTreat = localStorage.getItem('bday_treat_order');
        if (savedTreat) {
          var parsed = JSON.parse(savedTreat);
          if (parsed && parsed.address && parsed.treat) {
            hasOrdered = true;
          }
        }
      }
    } catch (e) { }

    deliveryCard.style.display = hasOrdered ? 'flex' : 'none';
  }
  updateThankYouDeliveryCardVisibility();

  if (replayFromStartBtn) {
    replayFromStartBtn.addEventListener('click', function () {
      resetCandleCelebration();
      window.__treatOrderPlaced = false;
      try {
        localStorage.removeItem('bday_treat_order');
      } catch (e) { }
      updateThankYouDeliveryCardVisibility();
      if (sfx.click) sfx.click();
      goToStage(1);
    });
  }

  // =================================================
  // DOWNLOAD OFFICIAL SHARE CERTIFICATE (CANVAS EXPORT & PREVIEW)
  // =================================================
  var downloadCertBtn = document.getElementById('downloadCertBtn');
  var certPreviewModal = document.getElementById('certPreviewModal');
  var certPreviewImg = document.getElementById('certPreviewImg');
  var certDirectDownloadLink = document.getElementById('certDirectDownloadLink');
  var certModalClose = document.getElementById('certModalClose');

  if (certModalClose && certPreviewModal) {
    certModalClose.addEventListener('click', function () {
      certPreviewModal.hidden = true;
    });
    certPreviewModal.addEventListener('click', function (e) {
      if (e.target === certPreviewModal) certPreviewModal.hidden = true;
    });
  }

  if (downloadCertBtn) {
    downloadCertBtn.addEventListener('click', function () {
      if (sfx.cheer) sfx.cheer();
      fireConfetti(true);

      var canvas = document.createElement('canvas');
      canvas.width = 1600;
      canvas.height = 1100;
      var ctx = canvas.getContext('2d');

      // 1. Background Ivory Parchment
      var bgGrad = ctx.createLinearGradient(0, 0, 1600, 1100);
      bgGrad.addColorStop(0, '#fefdfb');
      bgGrad.addColorStop(0.5, '#fbf8f0');
      bgGrad.addColorStop(1, '#fefbf4');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1600, 1100);

      // Subtle Stock Candlestick Watermark Pattern in background
      ctx.strokeStyle = 'rgba(217, 180, 120, 0.08)';
      ctx.lineWidth = 1;
      for (var x = 80; x < 1520; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 80);
        ctx.lineTo(x, 1020);
        ctx.stroke();
      }

      // 2. Royal Ornate Double Gold Borders
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 6;
      ctx.strokeRect(50, 50, 1500, 1000);

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(62, 62, 1476, 976);

      // Corner Rosettes
      function drawRosette(cx, cy) {
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.fill();
      }
      drawRosette(50, 50);
      drawRosette(1550, 50);
      drawRosette(50, 1050);
      drawRosette(1550, 1050);

      // 3. Header & Issuer
      ctx.textAlign = 'center';
      ctx.font = 'bold 15px "JetBrains Mono", monospace';
      ctx.fillStyle = '#78350f';
      ctx.fillText('★ NATIONAL & GLOBAL HAPPINESS EXCHANGE · SPECIAL BIRTHDAY ISSUE ★', 800, 120);

      ctx.font = '600 13px "JetBrains Mono", monospace';
      ctx.fillStyle = '#92400e';
      ctx.fillText('SERIES 2026 · CERTIFICATE REF: MAHIMA-ATH-100X · ALL-TIME HIGH', 800, 155);

      // Main Title
      ctx.font = 'bold 44px "Fredoka", "Outfit", sans-serif';
      ctx.fillStyle = '#1e1b4b';
      ctx.fillText('OFFICIAL SHARE CERTIFICATE OF APPRECIATION', 800, 220);

      // Attribution
      ctx.font = 'italic 20px "Caveat", cursive';
      ctx.fillStyle = '#b45309';
      ctx.fillText('This is officially awarded and certified unto:', 800, 268);

      // Recipient Name
      ctx.font = 'bold 54px "Fredoka", "Outfit", sans-serif';
      var nameGrad = ctx.createLinearGradient(400, 0, 1200, 0);
      nameGrad.addColorStop(0, '#f59e0b');
      nameGrad.addColorStop(0.5, '#ec4899');
      nameGrad.addColorStop(1, '#8b5cf6');
      ctx.fillStyle = nameGrad;
      ctx.fillText('MAHIMA (THE MARKET EXPERT)', 800, 345);

      // Divider Line
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(350, 380);
      ctx.lineTo(1250, 380);
      ctx.stroke();

      // Certificate Body Text
      ctx.font = '500 20px "Outfit", sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText('Recognized as a True 100-Bagger Friend, Market Guru & Radiant Soul.', 800, 430);
      ctx.fillText('Trading permanently at All-Time Highs with 100% Upper Circuit warmth,', 800, 468);
      ctx.fillText('sharp analytical intellect, unmatched kindness, and inspiring positive energy!', 800, 506);

      // 4. Stock Market Metrics Boxes
      var metrics = [
        { label: 'VALUATION', val: 'PRICELESS 💎' },
        { label: 'DAILY CIRCUIT', val: 'UPPER CIRCUIT 🔒' },
        { label: 'LIFETIME RETURN', val: '+10,000% HAPPINESS 📈' },
        { label: 'ANALYST CONSENSUS', val: 'STRONG BUY FOREVER ⭐' }
      ];

      var boxW = 245, boxH = 82, startX = 250, gap = 20, boxY = 575;
      metrics.forEach(function (m, idx) {
        var bx = startX + idx * (boxW + gap);
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(bx, boxY, boxW, boxH, 12);
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 11px "JetBrains Mono", monospace';
        ctx.fillStyle = '#64748b';
        ctx.fillText(m.label, bx + boxW / 2, boxY + 28);

        ctx.font = 'bold 14px "Fredoka", sans-serif';
        ctx.fillStyle = '#0f172a';
        ctx.fillText(m.val, bx + boxW / 2, boxY + 58);
      });

      // 5. Official Gold Certified Stamp / Seal on Left
      var sealX = 350, sealY = 820;
      ctx.beginPath();
      ctx.arc(sealX, sealY, 62, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(sealX, sealY, 54, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(sealX, sealY, 48, 0, Math.PI * 2);
      ctx.fillStyle = '#fef3c7';
      ctx.fill();

      ctx.fillStyle = '#92400e';
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.fillText('★ 100-BAGGER ★', sealX, sealY - 8);
      ctx.font = 'bold 15px "JetBrains Mono", monospace';
      ctx.fillText('OFFICIAL', sealX, sealY + 12);
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText('CERTIFIED', sealX, sealY + 28);

      // 6. Authorized Signatory on Right
      var sigX = 1250, sigLineY = 820;
      ctx.font = 'bold 36px "Caveat", cursive';
      ctx.fillStyle = '#4338ca';
      ctx.fillText('Your Constant Cheerleader 🌟', sigX, sigLineY - 14);

      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(sigX - 170, sigLineY);
      ctx.lineTo(sigX + 170, sigLineY);
      ctx.stroke();

      ctx.font = 'bold 14px "JetBrains Mono", monospace';
      ctx.fillStyle = '#1e293b';
      ctx.fillText('AUTHORIZED BEST FRIEND & MARKET ADMIRER', sigX, sigLineY + 26);

      ctx.font = '600 12px "JetBrains Mono", monospace';
      ctx.fillStyle = '#64748b';
      ctx.fillText('VALID FOR LIFE · NON-EXPIRING DIVIDENDS', sigX, sigLineY + 46);

      // Generate Data URL (100% Reliable Synchronous PNG)
      var dataUrl = canvas.toDataURL('image/png');

      // 1. Direct Download Trigger
      try {
        var link = document.createElement('a');
        link.download = 'Mahima_Official_100_Bagger_Certificate.png';
        link.href = dataUrl;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        setTimeout(function () {
          if (link.parentNode) link.parentNode.removeChild(link);
        }, 1000);
      } catch (err) {
        console.warn('Direct download attempt:', err);
      }

      // 2. Open Certificate Preview Modal (Guaranteed View & Save on Mobile & Desktop)
      if (certPreviewImg) certPreviewImg.src = dataUrl;
      if (certDirectDownloadLink) certDirectDownloadLink.href = dataUrl;
      if (certPreviewModal) certPreviewModal.hidden = false;

      downloadCertBtn.textContent = '✓ Certificate Ready! Tap to View & Download 📜';
    });
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', function () {
      resetCandleCelebration();
      if (sfx.click) sfx.click();
      goToStage(1);
    });
  }

  // =================================================
  // MASCOT HELPER (SHIN-CHAN / CUTE BEAR)
  // =================================================
  var mascotWidget = document.getElementById('mascotWidget');
  var mascotBubble = document.getElementById('mascotBubble');
  var mascotPhrases = [
    "Happy Birthday Mahima!",
    "The Market's favorite Expert! 📈",
    "Expert ki smile: Upper Circuit! 🔒",
    "Cake khilana zaroori hai, Expert! 🎂",
    "100% Bullish on you, Mahima! 🚀",
    "You are a true 100-Bagger, Expert! 💎",
    "Keep shining and smiling! ✨"
  ];
  var phraseIdx = 0;

  var bubbleTimeout = null;
  if (mascotWidget && mascotBubble) {
    mascotWidget.addEventListener('click', function () {
      if (sfx.cheer) sfx.cheer();
      mascotWidget.style.transform = 'scale(1.15) rotate(-6deg)';
      setTimeout(function () {
        mascotWidget.style.transform = '';
      }, 300);
      phraseIdx = (phraseIdx + 1) % mascotPhrases.length;
      mascotBubble.textContent = mascotPhrases[phraseIdx];

      mascotBubble.classList.add('show');
      clearTimeout(bubbleTimeout);
      bubbleTimeout = setTimeout(function () {
        mascotBubble.classList.remove('show');
      }, 3500);
    });
  }

  // =================================================
  // DISCO ZONE & HEADPHONE DISCLAIMER MODAL
  // =================================================
  var launchDiscoBtn = document.getElementById('launchDiscoBtn');
  var headphoneModal = document.getElementById('headphoneModal');
  var hpModalCloseBtn = document.getElementById('hpModalCloseBtn');
  var hpCancelBtn = document.getElementById('hpCancelBtn');
  var hpProceedBtn = document.getElementById('hpProceedBtn');

  if (launchDiscoBtn && headphoneModal) {
    launchDiscoBtn.addEventListener('click', function () {
      if (sfx.pop) sfx.pop();
      headphoneModal.classList.add('active');
    });
  }

  function closeHeadphoneModal() {
    if (sfx.click) sfx.click();
    if (headphoneModal) headphoneModal.classList.remove('active');
  }

  if (hpModalCloseBtn) hpModalCloseBtn.addEventListener('click', closeHeadphoneModal);
  if (hpCancelBtn) hpCancelBtn.addEventListener('click', closeHeadphoneModal);

  if (headphoneModal) {
    headphoneModal.addEventListener('click', function (e) {
      if (e.target === headphoneModal) {
        closeHeadphoneModal();
      }
    });
  }

  if (hpProceedBtn) {
    hpProceedBtn.addEventListener('click', function () {
      // Pause background birthday song before launching disco
      var bdayAudio = document.getElementById('bdayAudio');
      if (bdayAudio && !bdayAudio.paused) {
        bdayAudio.pause();
      }
    });
  }

  // Support direct stage deep-linking (e.g. returning from disco.html with ?stage=5#stage5)
  try {
    var searchParams = new URLSearchParams(window.location.search);
    var initStage = parseInt(searchParams.get('stage'), 10);
    if (!initStage && window.location.hash) {
      var hashMatch = window.location.hash.match(/stage(\d+)/i);
      if (hashMatch) initStage = parseInt(hashMatch[1], 10);
    }
    if (initStage && initStage >= 1 && initStage <= TOTAL_STAGES) {
      goToStage(initStage);
    }
  } catch (err) { }


  // Ensure initial candle state is glowing & active
  try {
    sessionStorage.removeItem('mahima_candles_blown');
    localStorage.removeItem('mahima_candles_blown');
  } catch (e) { }
  if (cakeFlame) cakeFlame.classList.remove('blown-out');
  if (smokePuff) smokePuff.classList.remove('active');
  if (cakeCutBanner) cakeCutBanner.classList.remove('active');
  if (marketQueenBanner) marketQueenBanner.classList.remove('active');
  if (blowCakeBtn) {
    blowCakeBtn.textContent = '💨 Make a Wish & Blow the Candles!';
    blowCakeBtn.disabled = false;
  }

  console.log('✓ Mahima (Expert) Birthday Site Initialized (Step-by-Step Stock & Cute Theme + Disco Zone)');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMahimaApp);
} else {
  initMahimaApp();
}
