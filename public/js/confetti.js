/**
 * confetti.js - Canvas celebratory confetti particles engine
 * Fully responsive & dynamically tracks scroll so confetti never gets stuck
 */
(function (window) {
  'use strict';

  var cc = null;
  var cctx = null;
  var W = window.innerWidth || document.documentElement.clientWidth || 1024;
  var H = window.innerHeight || document.documentElement.clientHeight || 768;
  var confettiColors = ['#f59e0b', '#ec4899', '#38bdf8', '#10b981', '#fef08a', '#a855f7', '#fb7185', '#34d399'];
  var confetti = [];
  var cRaf = null;
  var reduceMotion = false;
  var lastScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;

  function init() {
    cc = document.getElementById('confetti');
    if (!cc) return;
    cctx = cc.getContext('2d');
    reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function resize() {
    if (!cc) return;
    W = window.innerWidth || document.documentElement.clientWidth || 1024;
    H = window.innerHeight || document.documentElement.clientHeight || 768;
    cc.width = W;
    cc.height = H;
  }

  // When scrolling, adjust confetti position by the scroll delta so it moves with the page content
  function onScroll() {
    var curScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    var deltaY = curScrollY - lastScrollY;
    lastScrollY = curScrollY;

    if (deltaY !== 0 && confetti.length > 0) {
      for (var i = 0; i < confetti.length; i++) {
        confetti[i].y -= deltaY;
      }
    }
  }

  function confettiLoop() {
    if (!cctx) return;
    cctx.clearRect(0, 0, W, H);

    for (var i = confetti.length - 1; i >= 0; i--) {
      var p = confetti[i];
      p.vx *= 0.985;
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life++;

      // Discard particles that completed their life or scrolled/fell out of viewport
      if (p.life > p.max || p.y > H + 60 || p.y < -120) {
        confetti.splice(i, 1);
        continue;
      }

      cctx.save();
      cctx.translate(p.x, p.y);
      cctx.rotate(p.rot);
      cctx.globalAlpha = p.life > p.max * 0.7 ? Math.max(0, 1 - (p.life - p.max * 0.7) / (p.max * 0.3)) : 1;
      cctx.fillStyle = p.color;

      if (p.circle) {
        cctx.beginPath();
        cctx.arc(0, 0, p.h, 0, Math.PI * 2);
        cctx.fill();
      } else {
        cctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      cctx.restore();
    }

    if (confetti.length > 0) {
      cRaf = requestAnimationFrame(confettiLoop);
    } else {
      cRaf = null;
      cctx.clearRect(0, 0, W, H);
    }
  }

  function fireConfetti(force) {
    if (window.BdayAudio && window.BdayAudio.popSound) {
      window.BdayAudio.popSound();
    }

    if (reduceMotion && !force) return;
    if (!cctx) init();

    lastScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    var cx = W / 2;
    var cy = H / 2;
    for (var i = 0; i < 200; i++) {
      var a = Math.random() * Math.PI * 2;
      var sp = 5 + Math.random() * 14;
      confetti.push({
        x: cx,
        y: cy,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 4,
        g: 0.22 + Math.random() * 0.1,
        w: 6 + Math.random() * 7,
        h: 3 + Math.random() * 5,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.4,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        life: 0,
        max: 160 + Math.random() * 70,
        circle: Math.random() < 0.25
      });
    }

    if (!cRaf) confettiLoop();
  }

  var firedOnce = false;
  function fireConfettiOnce() {
    if (firedOnce) return;
    firedOnce = true;
    fireConfetti();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.BdayConfetti = {
    fireConfetti: fireConfetti,
    fireConfettiOnce: fireConfettiOnce
  };

  window.fireConfettiOnce = fireConfettiOnce;
  window.fireConfetti = fireConfetti;
})(window);
