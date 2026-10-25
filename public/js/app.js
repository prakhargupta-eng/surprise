/**
 * app.js - Main Application Controller for Miss Agrawal's Birthday Surprise
 * Stock Market Theme × Cute Pastel Bubu & Dudu Aesthetic
 */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // ================= CONFIGURATION =================
  var NAME = 'Mahima';
  var NICKNAME = 'Expert';
  var TOTAL_STAGES = 5;
  var currentStage = 1;
  // =================================================

  var sfx = (window.BdayAudio && window.BdayAudio.sfx) || window.sfx || {};
  var audioCtrl = window.BdayAudio;
  var fireConfetti = window.fireConfetti || function () {};

  // Ambient floating hearts background generator
  var ambientBg = document.getElementById('ambientBg');
  if (ambientBg) {
    var heartSymbols = ['💖', '🌸', '✨', '🎂', '📈', '🧁', '⭐'];
    for (var h = 0; h < 24; h++) {
      var heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
      heart.style.left = (Math.random() * 95) + 'vw';
      heart.style.animationDelay = (Math.random() * 12) + 's';
      heart.style.animationDuration = (8 + Math.random() * 8) + 's';
      heart.style.fontSize = (16 + Math.random() * 16) + 'px';
      ambientBg.appendChild(heart);
    }
  }

  // =================================================
  // STAGE NAVIGATION CONTROLLER
  // =================================================
  var progressLineFill = document.getElementById('progressLineFill');

  function goToStage(stepNumber) {
    if (stepNumber < 1 || stepNumber > TOTAL_STAGES) return;

    var previousStage = currentStage;
    currentStage = stepNumber;

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
      // Grand Finale: trigger confetti & auto-play song
      fireConfetti(true);
      if (audioCtrl && audioCtrl.playSong) {
        audioCtrl.playSong();
      }
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
      if (sfx.cheer) sfx.cheer();
      fireConfetti();
      if (treatFormContainer) {
        treatFormContainer.classList.add('active');
      }
      treatYesBtn.textContent = 'Awesome! Claiming Treat 🥳';
    });
  }

  // Playful Dodging No Button
  if (treatNoBtn) {
    var dodgeCount = 0;
    var dodgeTexts = [
      'Are you sure? 🥺',
      'No is not allowed! 😜',
      'Upper Circuit locked! 🔒',
      'Cake is mandatory! 🍰',
      '100% Bullish on treats! 📈'
    ];

    function dodgeNoBtn() {
      dodgeCount++;
      if (sfx.click) sfx.click();
      var xOffset = (Math.random() - 0.5) * 160;
      var yOffset = (Math.random() - 0.5) * 80;
      treatNoBtn.style.transform = 'translate(' + xOffset + 'px, ' + yOffset + 'px)';
      treatNoBtn.textContent = dodgeTexts[dodgeCount % dodgeTexts.length];
    }

    treatNoBtn.addEventListener('mouseenter', dodgeNoBtn);
    treatNoBtn.addEventListener('touchstart', dodgeNoBtn, { passive: true });
    treatNoBtn.addEventListener('click', function (e) {
      e.preventDefault();
      dodgeNoBtn();
      alert('Error: "No" is not an available option on your birthday! Please pick your treat! 🎂🥰');
    });
  }

  // Treat Option Selection Cards
  var treatCards = document.querySelectorAll('.treat-option-card');
  treatCards.forEach(function (card) {
    card.addEventListener('click', function () {
      if (sfx.select) sfx.select();
      treatCards.forEach(function (c) { c.classList.remove('selected'); });
      card.classList.add('selected');
      selectedTreatName = card.getAttribute('data-treat') || 'Gourmet Birthday Cake';
    });
  });

  // Save & Download Treat Order (.txt)
  if (saveTreatBtn) {
    saveTreatBtn.addEventListener('click', function () {
      var customNote = (document.getElementById('treatCustomNote') && document.getElementById('treatCustomNote').value.trim()) || 'None specified (Surprise me!)';
      var address = (document.getElementById('treatAddress') && document.getElementById('treatAddress').value.trim()) || 'To be shared or coordinated directly!';
      var now = new Date();
      var timestampStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
      var orderId = 'EXPERT-DIVIDEND-' + Math.floor(100000 + Math.random() * 900000);

      if (sfx.cheer) sfx.cheer();
      fireConfetti(true);

      // Generate Clean Text File Content
      var textContent = [
        '====================================================',
        '       OFFICIAL BIRTHDAY TREAT ORDER TICKET         ',
        '       Issued for Mahima - The Market Expert        ',
        '====================================================',
        '',
        'Order Reference: ' + orderId,
        'Date & Time:     ' + timestampStr,
        'Recipient:       ' + NAME + ' (The Expert)',
        'Account Status:  100% Bullish (Upper Circuit 🔒)',
        '',
        '----------------------------------------------------',
        'SELECTED BIRTHDAY TREAT:',
        '----------------------------------------------------',
        'Item:            ' + selectedTreatName,
        'Special Cravings:' + customNote,
        '',
        '----------------------------------------------------',
        'DELIVERY INSTRUCTIONS / ADDRESS:',
        '----------------------------------------------------',
        address,
        '',
        '----------------------------------------------------',
        'SPECIAL BIRTHDAY CLAUSE:',
        '----------------------------------------------------',
        'This dividend is fully approved with zero deductions!',
        'Guaranteed to be delivered with extra sweetness & joy.',
        '',
        'Happy Birthday Mahima! Wishing you an All-Time High year, Expert! 🎂📈',
        '===================================================='
      ].join('\r\n');

      // Trigger .txt File Download
      try {
        var blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
        var downloadUrl = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'birthday_treat_request_mahima_expert.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
      } catch (err) {
        console.error('Download error:', err);
      }

      // Save to Firebase if available
      var treatData = {
        recipient: NAME,
        orderId: orderId,
        treat: selectedTreatName,
        customNote: customNote,
        address: address,
        date: timestampStr
      };

      if (window.__saveTreat) {
        window.__saveTreat(treatData).catch(function (e) {
          console.log('Firebase save log:', e);
        });
      }

      // Save to LocalStorage
      try {
        localStorage.setItem('bday_treat_order', JSON.stringify(treatData));
      } catch (e) {}

      // Update and Show On-Screen Stamped Receipt
      var rItem = document.getElementById('receiptItem');
      var rNote = document.getElementById('receiptNote');
      var rAddr = document.getElementById('receiptAddress');

      if (rItem) rItem.textContent = selectedTreatName;
      if (rNote) rNote.textContent = customNote;
      if (rAddr) rAddr.textContent = address;

      if (treatReceiptCard) {
        treatReceiptCard.classList.add('active');
        treatReceiptCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      saveTreatBtn.textContent = '✓ Order Saved & Downloaded! 🎉';
      saveTreatBtn.disabled = true;
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
      if (sfx.select) sfx.select();
      goToStage(4);
    });
  }

  // =================================================
  // STAGE 4: PHOTO MEMORY COLLECTION (POLAROIDS & MODAL)
  // =================================================
  var polaroidCards = document.querySelectorAll('.polaroid-card');
  var photoModal = document.getElementById('photoModal');
  var modalCloseBtn = document.getElementById('modalCloseBtn');
  var modalImg = document.getElementById('modalImg');
  var modalCaption = document.getElementById('modalCaption');
  var modalReactBtn = document.getElementById('modalReactBtn');
  var reactCountEl = document.getElementById('reactCount');
  var likes = 1;

  polaroidCards.forEach(function (card) {
    card.addEventListener('click', function () {
      if (sfx.shutter) sfx.shutter();
      var imgSrc = card.getAttribute('data-img');
      var captionText = card.getAttribute('data-caption') || 'Cherished Memory';

      if (modalImg && imgSrc) modalImg.src = imgSrc;
      if (modalCaption) modalCaption.textContent = captionText;
      if (photoModal) photoModal.classList.add('active');
    });
  });

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
      if (sfx.cheer) sfx.cheer();

      // Spawn burst of miniature floating hearts from button
      for (var f = 0; f < 8; f++) {
        var miniH = document.createElement('span');
        miniH.textContent = '💖';
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
  // STAGE 5: GRAND FINALE (SONG, CAKE, CANDLES, LETTER)
  // =================================================
  var finaleSongBtn = document.getElementById('finaleSongBtn');
  var muteBtn = document.getElementById('muteBtn');
  var blowCakeBtn = document.getElementById('blowCakeBtn');
  var cakeFlame = document.getElementById('cakeFlame');
  var smokePuff = document.getElementById('smokePuff');
  var cakeCutBanner = document.getElementById('cakeCutBanner');
  var stage5PrevBtn = document.getElementById('stage5PrevBtn');
  var replayBtn = document.getElementById('replayBtn');

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
        muteBtn.textContent = isMuted ? '🔇' : '🔊';
      }
    });
  }

  // Interactive Candle Blow / Cake Cut
  if (blowCakeBtn) {
    blowCakeBtn.addEventListener('click', function () {
      if (audioCtrl && audioCtrl.sfx && audioCtrl.sfx.blow) {
        audioCtrl.sfx.blow();
      }

      // Extinguish candle flame
      if (cakeFlame) cakeFlame.classList.add('blown-out');
      if (smokePuff) smokePuff.classList.add('active');

      setTimeout(function () {
        if (audioCtrl && audioCtrl.sfx && audioCtrl.sfx.cheer) {
          audioCtrl.sfx.cheer();
        }
        fireConfetti(true);
      }, 400);

      setTimeout(function () {
        fireConfetti(true);
      }, 1000);

      if (cakeCutBanner) {
        cakeCutBanner.classList.add('active');
      }

      blowCakeBtn.textContent = '🎂 Candles Blown! Wish Sealed with Love!';
      blowCakeBtn.disabled = true;

      // Ensure song is playing
      if (audioCtrl && audioCtrl.playSong) {
        audioCtrl.playSong();
      }
    });
  }

  if (stage5PrevBtn) {
    stage5PrevBtn.addEventListener('click', function () {
      if (sfx.click) sfx.click();
      goToStage(4);
    });
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', function () {
      if (sfx.click) sfx.click();
      if (cakeFlame) cakeFlame.classList.remove('blown-out');
      if (smokePuff) smokePuff.classList.remove('active');
      if (cakeCutBanner) cakeCutBanner.classList.remove('active');
      if (blowCakeBtn) {
        blowCakeBtn.textContent = '💨 Make a Wish & Blow the Candles!';
        blowCakeBtn.disabled = false;
      }
      goToStage(1);
    });
  }

  // =================================================
  // MASCOT HELPER (SHIN-CHAN / CUTE BEAR)
  // =================================================
  var mascotWidget = document.getElementById('mascotWidget');
  var mascotBubble = document.getElementById('mascotBubble');
  var mascotPhrases = [
    "Happy Birthday Mahima! 🌸",
    "Dalal Street's favorite Expert! 📈",
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

  console.log('✓ Mahima (Expert) Birthday Site Initialized (Step-by-Step Stock & Cute Theme)');
});
