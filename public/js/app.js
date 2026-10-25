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
  window.__currentStage = 1;
  // =================================================

  
  var sfx = (window.BdayAudio && window.BdayAudio.sfx) || window.sfx || {};
  var audioCtrl = window.BdayAudio;
  var fireConfetti = window.fireConfetti || function () { };

  // Ambient floating hearts background generator
  var ambientBg = document.getElementById('ambientBg');
  if (ambientBg) {
    var heartSymbols = ['💖', ' ', '✨', '🎂', '📈', '🧁', '⭐'];
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
        a.download = 'mahima_birthday_treat_request.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
      } catch (err) {
        console.error('Download error:', err);
      }

      // Save to Firebase with 'mahima' prefix
      var treatData = {
        recipient: NAME + ' (The Expert)',
        orderId: orderId,
        treat: selectedTreatName,
        customNote: customNote,
        address: address,
        date: timestampStr,
        fileName: 'mahima_birthday_treat_' + Date.now() + '.txt',
        fileContent: textContent
      };

      if (window.__saveTreat) {
        window.__saveTreat(treatData, textContent).catch(function (e) {
          console.log('Firebase save log:', e);
        });
      }

      // Save to LocalStorage
      try {
        localStorage.setItem('bday_treat_order', JSON.stringify(treatData));
      } catch (e) { }

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

      // Extinguish candle flame and persist state so returning from disco mode keeps candles blown
      try {
        sessionStorage.setItem('mahima_candles_blown', 'true');
        localStorage.setItem('mahima_candles_blown', 'true');
      } catch (e) {}
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

      blowCakeBtn.textContent = '🎂 Candles Blown! Wish Sealed with Magic & Cheer! ✨';
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
      try {
        sessionStorage.removeItem('mahima_candles_blown');
        localStorage.removeItem('mahima_candles_blown');
      } catch (e) {}
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

  
  // Restore candle blown state if previously celebrated (e.g. returning from disco.html)
  function restoreCandleState() {
    try {
      if (sessionStorage.getItem('mahima_candles_blown') === 'true' || localStorage.getItem('mahima_candles_blown') === 'true') {
        if (cakeFlame) cakeFlame.classList.add('blown-out');
        if (smokePuff) smokePuff.classList.add('active');
        if (cakeCutBanner) cakeCutBanner.classList.add('active');
        if (blowCakeBtn) {
          blowCakeBtn.textContent = '🎂 Candles Blown! Wish Sealed with Magic & Cheer! ✨';
          blowCakeBtn.disabled = true;
        }
      }
    } catch (e) {}
  }
  restoreCandleState();

  console.log('✓ Mahima (Expert) Birthday Site Initialized (Step-by-Step Stock & Cute Theme + Disco Zone)');
});
