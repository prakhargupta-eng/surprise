/**
 * confetti.js - Canvas celebratory confetti particles engine
 */
(function (window) {
  'use strict';

  var cc = null;
  var cctx = null;
  var W = window.innerWidth;
  var H = window.innerHeight;
  var confettiColors = ['#ffb3cb', '#ff7aa2', '#f6c667', '#8fe3c8', '#fff4ee', '#c9a7ff', '#fec25b', '#52cbb7'];
  var confetti = [];
  var cRaf = null;
  var reduceMotion = false;

  function init() {
    cc = document.getElementById('confetti');
    if (!cc) return;
    cctx = cc.getContext('2d');
    reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    resize();
    window.addEventListener('resize', resize);
  }

  function resize() {
    if (!cc) return;
    W = window.innerWidth;
    H = window.innerHeight;
    cc.width = W;
    cc.height = H;
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

      if (p.life > p.max || p.y > H + 40) {
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
        cctx.arc(0, 0, p.h, 0, 6.28);
        cctx.fill();
      } else {
        cctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      cctx.restore();
    }

    if (confetti.length) {
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

    var cx = W / 2;
    var cy = H / 2;
    for (var i = 0; i < 220; i++) {
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
        rot: Math.random() * 6.28,
        vr: (Math.random() - 0.5) * 0.4,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        life: 0,
        max: 170 + Math.random() * 80,
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

  document.addEventListener('DOMContentLoaded', init);

  window.BdayConfetti = {
    fireConfetti: fireConfetti,
    fireConfettiOnce: fireConfettiOnce
  };

  window.fireConfettiOnce = fireConfettiOnce;
  window.fireConfetti = fireConfetti;
})(window);
