/**
 * audio.js - Web Audio synthesizer and birthday soundtrack controller
 */
(function (window) {
  'use strict';

  var actx = null;
  var muted = false;
  var songAudio = new Audio('happy_birthday.mp3');
  var isSongPlaying = false;

  function ensureAudio() {
    if (muted) return false;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') {
        actx.resume();
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  function tone(freq, dur, type, vol, delay) {
    if (!ensureAudio()) return;
    var t = actx.currentTime + (delay || 0);
    var o = actx.createOscillator();
    var g = actx.createGain();
    o.type = type || 'sine';
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.15, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(actx.destination);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  function noise(dur, vol, hpFreq) {
    if (!ensureAudio()) return;
    var len = Math.floor(actx.sampleRate * dur);
    var buf = actx.createBuffer(1, len, actx.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
    }
    var s = actx.createBufferSource();
    s.buffer = buf;
    var f = actx.createBiquadFilter();
    f.type = 'highpass';
    f.frequency.value = hpFreq || 2000;
    var g = actx.createGain();
    g.gain.value = vol || 0.3;
    s.connect(f);
    f.connect(g);
    g.connect(actx.destination);
    s.start();
  }

  function popSound() {
    try {
      if (!ensureAudio()) return;
      var t = actx.currentTime;
      var len = Math.floor(actx.sampleRate * 0.35);
      var buf = actx.createBuffer(1, len, actx.sampleRate);
      var d = buf.getChannelData(0);
      for (var i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
      }
      var src = actx.createBufferSource();
      src.buffer = buf;
      var hp = actx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 900;
      var g = actx.createGain();
      g.gain.setValueAtTime(0.9, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      src.connect(hp);
      hp.connect(g);
      g.connect(actx.destination);
      src.start(t);

      var o = actx.createOscillator();
      var og = actx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(180, t);
      o.frequency.exponentialRampToValueAtTime(50, t + 0.15);
      og.gain.setValueAtTime(0.7, t);
      og.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      o.connect(og);
      og.connect(actx.destination);
      o.start(t);
      o.stop(t + 0.25);

      [784, 988, 1175, 1568].forEach(function (f, i) {
        var os = actx.createOscillator();
        var gg = actx.createGain();
        var s = t + 0.12 + i * 0.09;
        os.type = 'triangle';
        os.frequency.value = f;
        gg.gain.setValueAtTime(0.0001, s);
        gg.gain.exponentialRampToValueAtTime(0.25, s + 0.02);
        gg.gain.exponentialRampToValueAtTime(0.0001, s + 0.5);
        os.connect(gg);
        gg.connect(actx.destination);
        os.start(s);
        os.stop(s + 0.55);
      });
    } catch (e) {}
  }

  var sfx = {
    click: function () {
      tone(660, 0.08, 'triangle', 0.18);
      tone(990, 0.1, 'triangle', 0.12, 0.05);
    },
    type: function () {
      tone(1800 + Math.random() * 400, 0.03, 'square', 0.04);
    },
    select: function () {
      tone(520, 0.07, 'sine', 0.2);
      tone(780, 0.09, 'sine', 0.15, 0.05);
    },
    wish: function () {
      tone(659, 0.35, 'sine', 0.16);
      tone(880, 0.5, 'sine', 0.14, 0.12);
    },
    shutter: function () {
      noise(0.05, 0.4, 2500);
      setTimeout(function () {
        noise(0.07, 0.3, 1500);
      }, 90);
    },
    thud: function () {
      tone(110, 0.18, 'sine', 0.3);
    },
    candle: function () {
      tone(1400, 0.08, 'triangle', 0.12);
    },
    light: function () {
      noise(0.25, 0.12, 3000);
      tone(1200, 0.15, 'sine', 0.1);
    },
    cheer: function () {
      [523, 659, 784, 1046].forEach(function (f, i) {
        tone(f, 0.3, 'sine', 0.15, i * 0.07);
      });
    },
    error: function () {
      tone(220, 0.22, 'sawtooth', 0.25);
    },
    popSound: popSound
  };

  function updateSongUIs() {
    var btns = [
      { textEl: document.getElementById('songBtnText'), vizEl: document.getElementById('audioVisualizer') },
      { textEl: document.getElementById('expiredSongBtnText'), vizEl: document.getElementById('expiredAudioVisualizer') }
    ];

    btns.forEach(function (item) {
      if (item.textEl) {
        item.textEl.textContent = isSongPlaying ? '⏸ Pause song' : '▶ Play birthday song';
      }
      if (item.vizEl) {
        if (isSongPlaying) {
          item.vizEl.classList.add('playing');
        } else {
          item.vizEl.classList.remove('playing');
        }
      }
    });
  }

  function playSong() {
    songAudio.play().then(function () {
      isSongPlaying = true;
      updateSongUIs();
    }).catch(function (err) {
      console.log('Audio playback waiting for interaction or autoplay policy:', err);
    });
  }

  function pauseSong() {
    songAudio.pause();
    isSongPlaying = false;
    updateSongUIs();
  }

  function toggleSong() {
    if (isSongPlaying) {
      pauseSong();
    } else {
      playSong();
    }
  }

  songAudio.addEventListener('ended', function () {
    isSongPlaying = false;
    songAudio.currentTime = 0;
    updateSongUIs();
  });

  function toggleMute() {
    muted = !muted;
    songAudio.muted = muted;
    return muted;
  }

  function isMuted() {
    return muted;
  }

  window.BdayAudio = {
    sfx: sfx,
    tone: tone,
    noise: noise,
    popSound: popSound,
    ensureAudio: ensureAudio,
    toggleMute: toggleMute,
    isMuted: isMuted,
    playSong: playSong,
    pauseSong: pauseSong,
    toggleSong: toggleSong,
    updateSongUIs: updateSongUIs
  };

  // Global shorthand for compatibility
  window.sfx = sfx;
})(window);
