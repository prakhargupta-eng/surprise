/**
 * audio.js - Web Audio synthesizer & Birthday soundtrack controller
 * Supports Stock Market Opening Bell, celebratory pops, chimes, and happy_birthday.mp3
 */
(function (window) {
  'use strict';

  var actx = null;
  var muted = false;
  var songAudio = new Audio('happy_birthday.mp3');
  var isSongPlaying = false;

  songAudio.loop = true;
  songAudio.preload = 'auto';

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
      g.gain.setValueAtTime(0.8, t);
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
      og.gain.setValueAtTime(0.6, t);
      og.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      o.connect(og);
      og.connect(actx.destination);
      o.start(t);
      o.stop(t + 0.25);

      [784, 988, 1175, 1568].forEach(function (f, i) {
        var os = actx.createOscillator();
        var gg = actx.createGain();
        var s = t + 0.1 + i * 0.08;
        os.type = 'triangle';
        os.frequency.value = f;
        gg.gain.setValueAtTime(0.0001, s);
        gg.gain.exponentialRampToValueAtTime(0.2, s + 0.02);
        gg.gain.exponentialRampToValueAtTime(0.0001, s + 0.45);
        os.connect(gg);
        gg.connect(actx.destination);
        os.start(s);
        os.stop(s + 0.5);
      });
    } catch (e) {}
  }

  // Stock Market Opening Bell sound
  function marketBell() {
    ensureAudio();
    [880, 1108, 1318, 1760].forEach(function (f, i) {
      tone(f, 1.4, 'sine', 0.22, i * 0.04);
      tone(f * 1.5, 0.9, 'triangle', 0.1, i * 0.04);
    });
  }

  var sfx = {
    click: function () {
      tone(660, 0.07, 'triangle', 0.16);
      tone(990, 0.09, 'triangle', 0.12, 0.04);
    },
    select: function () {
      tone(523, 0.08, 'sine', 0.2);
      tone(659, 0.1, 'sine', 0.18, 0.05);
      tone(784, 0.12, 'sine', 0.15, 0.1);
    },
    bell: marketBell,
    pop: popSound,
    shutter: function () {
      noise(0.05, 0.35, 2500);
      setTimeout(function () {
        noise(0.07, 0.25, 1500);
      }, 90);
    },
    blow: function () {
      noise(0.4, 0.3, 800);
      tone(440, 0.3, 'sine', 0.1);
    },
    cheer: function () {
      [523, 659, 784, 1046, 1318].forEach(function (f, i) {
        tone(f, 0.35, 'sine', 0.18, i * 0.06);
      });
    }
  };

  function updateSongUIs() {
    var disc = document.getElementById('vinylDisc');
    var btn = document.getElementById('finaleSongBtn');
    if (disc) {
      if (isSongPlaying) {
        disc.classList.add('playing');
      } else {
        disc.classList.remove('playing');
      }
    }
    if (btn) {
      btn.textContent = isSongPlaying ? '⏸' : '▶';
    }
  }

  function playSong() {
    ensureAudio();
    songAudio.play().then(function () {
      isSongPlaying = true;
      updateSongUIs();
    }).catch(function (err) {
      console.log('Audio autoplay prevented, user interaction required:', err);
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

  function toggleMute() {
    muted = !muted;
    songAudio.muted = muted;
    return muted;
  }

  function isPlaying() {
    return isSongPlaying;
  }

  window.BdayAudio = {
    sfx: sfx,
    tone: tone,
    marketBell: marketBell,
    popSound: popSound,
    playSong: playSong,
    pauseSong: pauseSong,
    toggleSong: toggleSong,
    toggleMute: toggleMute,
    isPlaying: isPlaying,
    updateSongUIs: updateSongUIs
  };

  window.sfx = sfx;
})(window);
