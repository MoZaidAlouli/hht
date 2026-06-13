let clearedStages = [];
/* ══════════════════════════════════════════
   OPERATION: HIBA — script.js
   Expanded to 10 visual interactive modules.
   ══════════════════════════════════════════ */

// ── Answers ──
const ANSWERS = {
  1: 'kazanlak',
  2: 'paris',
  3: 'hiba',
  4: 'forever',
  5: 'together',
  6: 'home',
  7: 'always yours',
  8: 'universe',
  9: 'symphony',
  10: 'promise',
  11: 'journey',
  12: 'destiny',
  13: 'eternal',
  14: 'patience',
  15: 'devotion',
  16: 'infinite',
  17: 'cherish',
  18: 'beloved',
  19: 'memories'
};

// Key fragments collected
const KEY_FRAGMENTS = {
  1: 'K4Z',
  2: 'P4R',
  3: 'H1B',
  4: '4EV',
  5: 'T0G',
  6: 'H0M',
  7: 'YRS',
  8: 'UNV',
  9: 'SYM',
  10: 'PRM',
  11: 'JNY',
  12: 'DST',
  13: 'ETN',
  14: 'PAT',
  15: 'DEV',
  16: 'INF',
  17: 'CHS',
  18: 'BLV',
  19: 'MEM'
};

// ── Stage order ──
const STAGE_ORDER = [
  'screen-boot',
  'screen-intro',
  'screen-1', 'screen-2', 'screen-3',
  'screen-4', 'screen-5', 'screen-6',
  'screen-7', 'screen-8', 'screen-9',
  'screen-10', 'screen-11', 'screen-12',
  'screen-13', 'screen-14', 'screen-15',
  'screen-16', 'screen-17', 'screen-18',
  'screen-19', 'screen-20', 'screen-final'
];

// ── Navigate ──
function goTo(screenId) {
  localStorage.setItem('op_hiba_active_screen', screenId);
  // Clean up running intervals / frames
  if (waveAnimFrame) {
    cancelAnimationFrame(waveAnimFrame);
    waveAnimFrame = null;
  }
  if (radioStaticInterval) {
    clearInterval(radioStaticInterval);
    radioStaticInterval = null;
  }
  if (matrixDecodeInterval) {
    clearInterval(matrixDecodeInterval);
    matrixDecodeInterval = null;
  }
  // Morse cleanup
  if (morseTimer) {
    clearInterval(morseTimer);
    morseTimer = null;
  }
  if (morseAudioCtx) {
    try {
      morseAudioCtx.close();
    } catch(e) {}
    morseAudioCtx = null;
  }
  morsePlaying = false;

  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });

  const target = document.getElementById(screenId);
  if (!target) return;
  target.style.display = 'flex';
  target.classList.add('active');
  window.scrollTo(0, 0);

  // Initialize specific screens
  if (screenId === 'screen-3') initRadioTuner();
  if (screenId === 'screen-4') initCaesarSlider();
  if (screenId === 'screen-5') resetPatternLock();
  if (screenId === 'screen-6') initWaveform();
  if (screenId === 'screen-7') initBase64Matrix();
  if (screenId === 'screen-8') initStarMapper();
  if (screenId === 'screen-9') initEqualizer();
  if (screenId === 'screen-10') initMorseCode();
  if (screenId === 'screen-11') initEnigma();
  if (screenId === 'screen-12') initNetworkRouter();
  if (screenId === 'screen-13') initXorManipulator();
  if (screenId === 'screen-14') initLogicCircuit();
  if (screenId === 'screen-15') initVigenere();
  if (screenId === 'screen-16') initSpectrogramFilter();
  if (screenId === 'screen-17') initWordLock();
  if (screenId === 'screen-18') initSumCheck();
  if (screenId === 'screen-19') initLogAuditing();
  if (screenId === 'screen-20') initKeyring();
  if (screenId === 'screen-final') initFinalScreen();
}

// ── Hint ──
function showHint(stage) {
  const el = document.getElementById('hint-' + stage);
  if (el) el.classList.remove('hidden');
}

// ── Check answer ──
function check(stage) {
  const input = document.getElementById('input-' + stage);
  if (!input) return;
  const val = input.value.trim().toLowerCase().replace(/\s+/g, ' ');
  const correct = ANSWERS[stage];

  if (!val) { showError(stage, '> no input detected. try again.'); return; }

  if (val === correct) {
    showSuccess(stage);
  } else {
    const wrongs = {
      1: '> city not found in database. that nickname is tied to a specific city — not a region.',
      2: '> location mismatch. re-examine the street name and the transport system. both point to one city.',
      3: '> identity alias mismatch. tune the radio dial to 104.7 MHz to decrypt the correct name.',
      4: '> decryption error. slide to offset -7 to decode Signal B to find the timeline.',
      5: '> incorrect. read the WhatsApp chat thread. the answer is the final word sent — nothing else.',
      6: '> alignment error. synchronize the waveform sliders to 100% to decrypt the keyword.',
      7: '> payload mismatch. run the decryption engine, copy the output, and type it exactly.',
      8: '> constellation signature mismatch. connect stars 1 to 5 to 1 in order to reveal the word.',
      9: '> frequency mismatch. lock all 5 equalizer channels to match the target percentages.',
      10: '> signal parsing failure. check the morse alphabet. are you sure you translated all characters correctly?',
      11: '> decryption key out of sync. check the rotor alignment.',
      12: '> routing handshake failed. verify you have chosen the route with the lowest latency.',
      13: '> bitwise parity check failed. payload is corrupted.',
      14: '> logic gate state is invalid. output is 0. target is 1.',
      15: '> decryption error. apply the correct alphabetic key to align the shifts.',
      16: '> signal processing failed. adjust filter parameters to isolate the target peak.',
      17: '> alignment lock error. rotate columns to align the middle row.',
      18: '> register checksum invalid. toggle switches to sum exactly 244.',
      19: '> database decryption key mismatch. identify the correct attacker ip.'
    };
    showError(stage, wrongs[stage] || '> incorrect. try again.');
  }
}

// ── Success ──
function showSuccess(stage) {
  if (!clearedStages.includes(stage)) {
    clearedStages.push(stage);
    localStorage.setItem('op_hiba_cleared_stages', JSON.stringify(clearedStages));
  }
  const fb = document.getElementById('feedback-' + stage);
  if (fb) {
    fb.classList.remove('hidden', 'error');
    fb.classList.add('success');
    fb.textContent = '> confirmed. module ' + stage + ' cleared.';
  }

  // Show key fragment
  const kc = document.getElementById('key-' + stage);
  const kv = document.getElementById('kv-' + stage);
  if (kc && kv) {
    kv.textContent = KEY_FRAGMENTS[stage];
    kc.classList.remove('hidden');
  }

  setTimeout(() => {
    const currentIndex = STAGE_ORDER.indexOf('screen-' + stage);
    if (currentIndex !== -1 && currentIndex + 1 < STAGE_ORDER.length) {
      goTo(STAGE_ORDER[currentIndex + 1]);
    }
  }, 1450);
}

// ── Error ──
function showError(stage, msg) {
  const fb = document.getElementById('feedback-' + stage);
  if (fb) {
    fb.classList.remove('hidden', 'success');
    fb.classList.add('error');
    fb.textContent = msg;
  }
}


/* ══════════════════════════════════════════
   MODULE 03 — RADIO TUNER WIDGET
   ══════════════════════════════════════════ */
let radioStaticInterval = null;

function initRadioTuner() {
  const slider = document.getElementById('tuner-slider');
  const freqVal = document.getElementById('freq-val');
  const status = document.getElementById('signal-status');
  if (!slider || !freqVal || !status) return;

  if (radioStaticInterval) clearInterval(radioStaticInterval);
  
  function updateTuner() {
    const val = parseFloat(slider.value).toFixed(1);
    freqVal.textContent = val;
    
    if (Math.abs(val - 104.7) < 0.05) {
      clearInterval(radioStaticInterval);
      status.innerHTML = '› <span class="hl">LOCKED: [DECRYPTED IDENT CODE] › "hiba"</span>';
      status.className = 'signal-status locked';
    } else {
      if (!radioStaticInterval) {
        startStaticInterval();
      }
    }
  }

  function startStaticInterval() {
    radioStaticInterval = setInterval(() => {
      const val = parseFloat(slider.value).toFixed(1);
      if (Math.abs(val - 104.7) >= 0.05) {
        let staticChars = '';
        const pool = '!@#$%^&*()_+{}:"<>?|[];\',./~`';
        for (let i = 0; i < 12; i++) {
          staticChars += pool[Math.floor(Math.random() * pool.length)];
        }
        status.textContent = `› NO SIGNAL: [${staticChars}]`;
        status.className = 'signal-status noise';
      }
    }, 100);
  }

  slider.addEventListener('input', updateTuner);
  updateTuner();
}


/* ══════════════════════════════════════════
   MODULE 04 — CAESAR SHIFTER WIDGET
   ══════════════════════════════════════════ */
function initCaesarSlider() {
  const slider = document.getElementById('caesar-slider');
  const offsetA = document.getElementById('shift-offset-a');
  const offsetB = document.getElementById('shift-offset-b');
  if (!slider) return;

  const originalLettersA = ['O', 'D', 'Q', 'H'];
  const originalLettersB = ['M', 'V', 'Y', 'L', 'C', 'L', 'Y'];
  const boxesA = document.querySelectorAll('#letters-a .cl-shifted');
  const boxesB = document.querySelectorAll('#letters-b .cl-shifted');

  function shiftChar(char, shift) {
    let code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      let shifted = code + shift;
      if (shifted < 65) shifted += 26;
      if (shifted > 90) shifted -= 26;
      return String.fromCharCode(shifted);
    }
    return char;
  }

  function updateCaesar() {
    const shift = parseInt(slider.value);
    offsetA.textContent = (shift >= 0 ? '+' : '') + shift;
    offsetB.textContent = (shift >= 0 ? '+' : '') + shift;

    boxesA.forEach((box, idx) => {
      const orig = originalLettersA[idx];
      const shifted = shiftChar(orig, shift);
      box.textContent = shifted;
      if (shift === -3) {
        box.classList.add('match');
      } else {
        box.classList.remove('match');
      }
    });

    boxesB.forEach((box, idx) => {
      const orig = originalLettersB[idx];
      const shifted = shiftChar(orig, shift);
      box.textContent = shifted;
      if (shift === -7) {
        box.classList.add('match');
      } else {
        box.classList.remove('match');
      }
    });
  }

  slider.addEventListener('input', updateCaesar);
  updateCaesar();
}


/* ══════════════════════════════════════════
   MODULE 05 — PATTERN LOCK SCREEN
   ══════════════════════════════════════════ */
let activeNode = null;
let drawnSegments = [];
let currentMousePos = null;

function getNodeCenter(idx) {
  const row = Math.floor(idx / 3);
  const col = idx % 3;
  return {
    x: 40 + col * 80,
    y: 40 + row * 80
  };
}

function redrawPatternCanvas() {
  const canvas = document.getElementById('pattern-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.strokeStyle = '#00e5a0';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  drawnSegments.forEach(seg => {
    const [a, b] = seg.split('-').map(Number);
    const posA = getNodeCenter(a);
    const posB = getNodeCenter(b);
    ctx.beginPath();
    ctx.moveTo(posA.x, posA.y);
    ctx.lineTo(posB.x, posB.y);
    ctx.stroke();
  });

  // Draw current line to finger/cursor
  if (activeNode !== null && currentMousePos) {
    const posA = getNodeCenter(activeNode);
    ctx.strokeStyle = 'rgba(0, 229, 160, 0.4)';
    ctx.beginPath();
    ctx.moveTo(posA.x, posA.y);
    ctx.lineTo(currentMousePos.x, currentMousePos.y);
    ctx.stroke();
  }
}

function resetPatternLock() {
  activeNode = null;
  drawnSegments = [];
  currentMousePos = null;
  
  document.querySelectorAll('.pattern-node').forEach(node => {
    node.classList.remove('active', 'error');
  });

  const canvas = document.getElementById('pattern-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  document.getElementById('m5-lock-wrapper').classList.remove('hidden');
  document.getElementById('m5-chat-wrapper').classList.add('hidden');
  document.getElementById('m5-title').textContent = "Unlock Chat Logs";
  
  const fb = document.getElementById('feedback-5');
  if (fb) fb.classList.add('hidden');
}

function handlePatternMove(clientX, clientY) {
  if (activeNode === null) return;
  const canvas = document.getElementById('pattern-canvas');
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  currentMousePos = {
    x: clientX - rect.left,
    y: clientY - rect.top
  };

  const el = document.elementFromPoint(clientX, clientY);
  if (!el) {
    redrawPatternCanvas();
    return;
  }
  const nodeEl = el.closest('.pattern-node');
  if (!nodeEl) {
    redrawPatternCanvas();
    return;
  }
  const j = parseInt(nodeEl.getAttribute('data-index'));
  if (j === activeNode) {
    redrawPatternCanvas();
    return;
  }
  
  // Try connecting activeNode -> j
  const segment = Math.min(activeNode, j) + '-' + Math.max(activeNode, j);
  const validSegments = ["0-3", "3-6", "3-4", "4-5", "2-5", "5-8"];
  
  if (validSegments.includes(segment)) {
    if (!drawnSegments.includes(segment)) {
      drawnSegments.push(segment);
    }
    document.querySelector(`.pattern-node[data-index="${activeNode}"]`).classList.add('active');
    document.querySelector(`.pattern-node[data-index="${j}"]`).classList.add('active');
    activeNode = j;
    
    // Check win condition
    if (drawnSegments.length === 6) {
      activeNode = null;
      currentMousePos = null;
      triggerPatternSuccess();
    }
  } else {
    // If they connect something invalid, clear and trigger error
    activeNode = null;
    currentMousePos = null;
    triggerPatternError();
  }
  redrawPatternCanvas();
}

function triggerPatternSuccess() {
  document.querySelectorAll('.pattern-node').forEach(node => node.classList.add('active'));
  setTimeout(() => {
    unlockChatLogs();
  }, 500);
}

function triggerPatternError() {
  document.querySelectorAll('.pattern-node.active').forEach(node => {
    node.classList.remove('active');
    node.classList.add('error');
  });
  
  const canvas = document.getElementById('pattern-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#ff4d4d';
    redrawPatternCanvas();
  }

  setTimeout(() => {
    resetPatternLock();
  }, 800);
}

function unlockChatLogs() {
  document.getElementById('m5-lock-wrapper').classList.add('hidden');
  document.getElementById('m5-chat-wrapper').classList.remove('hidden');
  document.getElementById('m5-title').textContent = "MODULE 05 / 10 — COMMUNICATION INTERCEPT";
  
  loadWhatsAppThread();
}

const chatMessages = [
  { sender: 'them', text: 'still awake?', time: '00:11' },
  { sender: 'me', text: 'always.', time: '00:13' },
  { sender: 'them', text: 'I was thinking about something you said last week', time: '00:14' },
  { sender: 'me', text: 'which part', time: '00:15' },
  { sender: 'them', text: 'the part where you said distance doesn\'t change how you feel', time: '00:16' },
  { sender: 'them', text: 'do you actually believe that or do you just say it', time: '00:16' },
  { sender: 'me', text: 'I believe it.', time: '00:18' },
  { sender: 'them', text: 'even on the bad days', time: '00:19' },
  { sender: 'me', text: 'especially on the bad days. that\'s when I\'m most sure.', time: '00:21' },
  { sender: 'them', text: 'I don\'t know how you do that', time: '00:22' },
  { sender: 'me', text: 'do what', time: '00:23' },
  { sender: 'them', text: 'stay so certain about everything', time: '00:23' },
  { sender: 'me', text: 'I\'m not certain about everything.<br/>just about this.', time: '00:25' },
  { sender: 'them', text: 'what if things change', time: '00:27' },
  { sender: 'me', text: 'things change. people change. I know.<br/>this doesn\'t.', time: '00:29' },
  { sender: 'them', text: 'you sound very sure of that', time: '00:30' },
  { sender: 'me', text: 'I am.', time: '00:31' },
  { sender: 'them', text: 'will you still feel this way next year', time: '00:33' },
  { sender: 'me', text: 'and the year after that.', time: '00:34' },
  { sender: 'them', text: 'promise?', time: '00:35' },
  { sender: 'me', text: 'you don\'t need a promise.<br/>you already know.', time: '00:36' },
  { sender: 'them', text: 'still. say it.', time: '00:37' },
  { sender: 'me', text: '[DECRYPTING...] together. ✓✓', time: '00:38' }
];

function loadWhatsAppThread() {
  const container = document.getElementById('chat-thread-container');
  if (!container) return;

  const header = container.querySelector('.chat-label');
  container.innerHTML = '';
  if (header) container.appendChild(header);

  let idx = 0;
  function addNextMsg() {
    if (idx >= chatMessages.length) return;
    const msg = chatMessages[idx];
    
    const wrapper = document.createElement('div');
    wrapper.className = `chat-msg ${msg.sender}`;
    
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${msg.sender}-bubble`;
    bubble.innerHTML = msg.text;
    
    const meta = document.createElement('div');
    meta.className = 'chat-meta';
    meta.textContent = msg.time;
    
    wrapper.appendChild(bubble);
    wrapper.appendChild(meta);
    container.appendChild(wrapper);
    
    container.scrollTop = container.scrollHeight;
    
    idx++;
    setTimeout(addNextMsg, idx === chatMessages.length - 1 ? 1400 : 700);
  }

  setTimeout(addNextMsg, 400);
}

// Bind pattern lock events
window.addEventListener('DOMContentLoaded', () => {
  const nodes = document.querySelectorAll('.pattern-node');
  nodes.forEach(node => {
    const onStart = (e) => {
      const activeScreen = document.querySelector('.screen.active');
      if (!activeScreen || activeScreen.id !== 'screen-5') return;
      
      e.preventDefault();
      activeNode = parseInt(node.getAttribute('data-index'));
      node.classList.add('active');
      const touch = e.touches ? e.touches[0] : e;
      const rect = document.getElementById('pattern-canvas').getBoundingClientRect();
      currentMousePos = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
      redrawPatternCanvas();
    };

    node.addEventListener('mousedown', onStart);
    node.addEventListener('touchstart', onStart, { passive: false });
  });

  window.addEventListener('mousemove', (e) => {
    if (activeNode !== null) handlePatternMove(e.clientX, e.clientY);
  });
  window.addEventListener('touchmove', (e) => {
    if (activeNode !== null) {
      e.preventDefault();
      handlePatternMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: false });

  window.addEventListener('mouseup', () => {
    if (activeNode !== null) {
      activeNode = null;
      currentMousePos = null;
      redrawPatternCanvas();
    }
  });
  window.addEventListener('touchend', () => {
    if (activeNode !== null) {
      activeNode = null;
      currentMousePos = null;
      redrawPatternCanvas();
    }
  });
});


/* ══════════════════════════════════════════
   MODULE 06 — WAVEFORM ALIGNMENT WIDGET
   ══════════════════════════════════════════ */
let waveAnimFrame = null;

function initWaveform() {
  const canvas = document.getElementById('waveform-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  
  const phaseSlider = document.getElementById('wave-phase');
  const freqSlider = document.getElementById('wave-freq');
  const ampSlider = document.getElementById('wave-amp');
  
  const valPhase = document.getElementById('val-phase');
  const valFreq = document.getElementById('val-freq');
  const valAmp = document.getElementById('val-amp');
  const syncValTxt = document.getElementById('sync-val');
  const statusBox = document.getElementById('waveform-status-box');

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const userPhase = parseInt(phaseSlider.value);
    const userFreq = parseInt(freqSlider.value);
    const userAmp = parseInt(ampSlider.value);
    
    valPhase.textContent = userPhase;
    valFreq.textContent = userFreq;
    valAmp.textContent = userAmp;

    // Target parameters
    const targetPhase = 180;
    const targetFreq = 30;
    const targetAmp = 50;

    // Calc alignment percentage
    const diffPhase = Math.abs(userPhase - targetPhase) / 180;
    const diffFreq = Math.abs(userFreq - targetFreq) / 30;
    const diffAmp = Math.abs(userAmp - targetAmp) / 50;
    
    let sync = 1 - (diffPhase * 0.45 + diffFreq * 0.4 + diffAmp * 0.15);
    if (sync < 0) sync = 0;
    let syncPct = Math.round(sync * 100);
    
    const isSynced = syncPct >= 96;
    if (isSynced) {
      syncPct = 100;
      syncValTxt.textContent = "100% LOCKED";
      syncValTxt.className = "sync-val synced";
      statusBox.innerHTML = '<span class="clue-tag">› SIGNAL SECURED</span><br/>Voice signature matched. Decrypted payload: <strong class="hl">"home"</strong>';
    } else {
      syncValTxt.textContent = syncPct + "%";
      syncValTxt.className = "sync-val";
      statusBox.innerHTML = '<span class="clue-tag">› MISSION DIRECTIVE</span><br/>Adjust the Phase, Frequency, and Amplitude sliders until the sync percentage is 95% or higher. The voice memo will then decode.';
    }

    const t = Date.now() * 0.005;

    // Reference Wave (Green)
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0, 229, 160, 0.3)';
    ctx.lineWidth = 2.5;
    for (let x = 0; x < canvas.width; x++) {
      const angle = (x / canvas.width) * targetFreq * Math.PI * 2 + (targetPhase * Math.PI / 180) + t;
      const y = canvas.height / 2 + Math.sin(angle) * targetAmp;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // User Wave (Blue or locked Green)
    ctx.beginPath();
    ctx.strokeStyle = isSynced ? 'rgba(0, 229, 160, 0.85)' : 'rgba(61, 158, 255, 0.8)';
    ctx.lineWidth = 2.5;
    for (let x = 0; x < canvas.width; x++) {
      const angle = (x / canvas.width) * userFreq * Math.PI * 2 + (userPhase * Math.PI / 180) + t;
      const y = canvas.height / 2 + Math.sin(angle) * userAmp;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    waveAnimFrame = requestAnimationFrame(draw);
  }

  if (waveAnimFrame) cancelAnimationFrame(waveAnimFrame);
  draw();

  window.addEventListener('resize', () => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  });
}


/* ══════════════════════════════════════════
   MODULE 07 — BASE64 MATRIX DECRYPTOR
   ══════════════════════════════════════════ */
let matrixDecodeInterval = null;

function initBase64Matrix() {
  const display = document.getElementById('matrix-decode-display');
  const progress = document.getElementById('matrix-decode-progress');
  const btn = document.getElementById('btn-run-matrix-decode');
  if (!display || !progress || !btn) return;

  display.textContent = "SYSTEM_IDLE: AWAITING_DECRYPTION";
  display.classList.remove('decrypted');
  progress.textContent = "";
  btn.disabled = false;

  btn.onclick = () => {
    btn.disabled = true;
    let ticks = 0;
    const targetString = "always yours";
    const finalText = "always yours";

    matrixDecodeInterval = setInterval(() => {
      ticks++;
      
      // Generate tumbling garbage text
      let tumbling = "";
      const pool = "!@#$%^&*()_+{}[]:;<>?,./";
      for (let i = 0; i < targetString.length; i++) {
        if (Math.random() < (ticks / 15)) {
          tumbling += targetString[i];
        } else {
          tumbling += pool[Math.floor(Math.random() * pool.length)];
        }
      }
      
      display.textContent = tumbling.toUpperCase();
      progress.textContent = `DECRYPTING CORE BLOCKS... ${Math.round((ticks / 15) * 100)}%`;

      if (ticks >= 15) {
        clearInterval(matrixDecodeInterval);
        display.textContent = finalText.toUpperCase();
        display.classList.add('decrypted');
        progress.textContent = "DECRYPTION COMPLETE. DECRYPTED IDENTIFIER SECURED.";
      }
    }, 90);
  };
}


/* ══════════════════════════════════════════
   MODULE 08 — STAR CONSTELLATION MAPPER
   ══════════════════════════════════════════ */
const starExpectedSequence = [0, 1, 3, 4, 2, 0];
const starPoints = [
  { x: 120, y: 30 },  // 0: Polaris
  { x: 50, y: 90 },   // 1: Rigel
  { x: 190, y: 90 },  // 2: Vega
  { x: 80, y: 180 },  // 3: Sirius
  { x: 160, y: 180 }  // 4: Capella
];
let starHistory = [];
let starCompleted = false;

function getStarPos(idx) {
  return starPoints[idx];
}

function redrawStarCanvas() {
  const canvas = document.getElementById('star-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (starHistory.length < 2) return;

  ctx.strokeStyle = starCompleted ? '#00e5a0' : '#3d9eff';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.shadowBlur = 10;
  ctx.shadowColor = starCompleted ? '#00e5a0' : '#3d9eff';

  ctx.beginPath();
  starHistory.forEach((starIdx, idx) => {
    const pos = getStarPos(starIdx);
    if (idx === 0) ctx.moveTo(pos.x, pos.y);
    else ctx.lineTo(pos.x, pos.y);
  });
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function initStarMapper() {
  starHistory = [];
  starCompleted = false;

  const canvas = document.getElementById('star-canvas');
  const container = document.getElementById('star-nodes-layer');
  const statusBox = document.getElementById('star-status-box');
  if (!canvas || !container || !statusBox) return;

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  statusBox.innerHTML = '<span class="clue-tag">› MISSION NOTE</span><br/>Click the stars in order of their label numbers (1 ➔ 2 ➔ 3 ➔ 4 ➔ 5 ➔ 1). Connecting them correctly will reveal the passcode.';

  document.querySelectorAll('.star-node').forEach(node => {
    node.classList.remove('selected', 'glow');
    
    // Bind click listener
    node.onclick = () => {
      if (starCompleted) return;
      const idx = parseInt(node.getAttribute('data-star'));

      if (starHistory.length === 0) {
        if (idx === 0) {
          starHistory.push(idx);
          node.classList.add('selected');
          redrawStarCanvas();
        } else {
          flashStarsError();
        }
      } else {
        const last = starHistory[starHistory.length - 1];
        // Find expected next star
        const expectedNextIdx = starHistory.length;
        const expectedVal = starExpectedSequence[expectedNextIdx];

        if (idx === expectedVal) {
          starHistory.push(idx);
          node.classList.add('selected');
          redrawStarCanvas();

          if (idx === 0 && starHistory.length === 6) {
            starCompleted = true;
            document.querySelectorAll('.star-node').forEach(n => {
              n.classList.remove('selected');
              n.classList.add('glow');
            });
            redrawStarCanvas();
            statusBox.innerHTML = '<span class="clue-tag">› CONSTELLATION LOCKED</span><br/>Signal aligned. pass-phrase unlocked: <strong class="hl">"universe"</strong>';
          }
        } else {
          flashStarsError();
        }
      }
    };
  });
}

function flashStarsError() {
  const statusBox = document.getElementById('star-status-box');
  if (statusBox) {
    statusBox.innerHTML = '<span class="clue-tag" style="color:var(--red);">› ALIGNMENT ERROR</span><br/>Line broke. Resetting connection mapping. Try again.';
  }

  document.querySelectorAll('.star-node').forEach(node => {
    node.classList.remove('selected');
    node.classList.add('glow');
    node.style.transform = 'translate(-50%, -50%) scale(1.1)';
  });
  
  setTimeout(() => {
    document.querySelectorAll('.star-node').forEach(node => {
      node.classList.remove('glow');
      node.style.transform = 'translate(-50%, -50%) scale(1)';
    });
    starHistory = [];
    starCompleted = false;
    redrawStarCanvas();
  }, 600);
}


/* ══════════════════════════════════════════
   MODULE 10 — MORSE CODE TRANSCEIVER
   ══════════════════════════════════════════ */
let morsePlaying = false;
let morseTimer = null;
let morseAudioCtx = null;
let morseAudioEnabled = false;
let morseWPM = 12;
let morseIndex = 0;
let morseTimeline = [];
let morseOscillator = null;
let morseGainNode = null;

function buildMorseTimeline() {
  morseTimeline = [];
  const word = "promise";
  const morseMap = {
    'p': '.--.', 'r': '.-.', 'o': '---', 'm': '--', 'i': '..', 's': '...', 'e': '.'
  };
  for (let c of word) {
    const symbols = morseMap[c];
    for (let i = 0; i < symbols.length; i++) {
      const symbol = symbols[i];
      const units = (symbol === '.') ? 1 : 3;
      morseTimeline.push({ state: true, units: units });
      // element spacing
      if (i < symbols.length - 1) {
        morseTimeline.push({ state: false, units: 1 });
      }
    }
    // character spacing
    morseTimeline.push({ state: false, units: 3 });
  }
  // word loop spacing
  morseTimeline.push({ state: false, units: 7 });
}

function startMorseBeep() {
  if (!morseAudioCtx) {
    morseAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (morseAudioCtx.state === 'suspended') {
    morseAudioCtx.resume();
  }
  stopMorseBeep();

  morseOscillator = morseAudioCtx.createOscillator();
  morseGainNode = morseAudioCtx.createGain();

  morseOscillator.type = 'sine';
  morseOscillator.frequency.value = 800;

  morseGainNode.gain.setValueAtTime(0.0, morseAudioCtx.currentTime);
  morseGainNode.gain.linearRampToValueAtTime(0.08, morseAudioCtx.currentTime + 0.01);

  morseOscillator.connect(morseGainNode);
  morseGainNode.connect(morseAudioCtx.destination);
  morseOscillator.start();
}

function stopMorseBeep() {
  if (morseOscillator) {
    try {
      if (morseGainNode && morseAudioCtx) {
        morseGainNode.gain.setValueAtTime(morseGainNode.gain.value, morseAudioCtx.currentTime);
        morseGainNode.gain.linearRampToValueAtTime(0.0, morseAudioCtx.currentTime + 0.01);
      }
      const osc = morseOscillator;
      setTimeout(() => {
        try { osc.stop(); osc.disconnect(); } catch(e) {}
      }, 15);
    } catch(e) {}
    morseOscillator = null;
  }
}

function setMorseIndicator(state) {
  const light = document.getElementById('morse-light');
  if (light) {
    if (state) light.classList.add('active');
    else light.classList.remove('active');
  }
  if (state && morseAudioEnabled) {
    startMorseBeep();
  } else {
    stopMorseBeep();
  }
}

function playNextMorseStep() {
  if (!morsePlaying) {
    setMorseIndicator(false);
    return;
  }
  const step = morseTimeline[morseIndex];
  const unitTime = 1200 / morseWPM;
  const duration = step.units * unitTime;

  setMorseIndicator(step.state);

  morseIndex = (morseIndex + 1) % morseTimeline.length;
  morseTimer = setTimeout(playNextMorseStep, duration);
}

function initMorseCode() {
  morsePlaying = false;
  morseAudioEnabled = false;
  morseWPM = 12;
  morseIndex = 0;
  
  if (morseTimer) clearTimeout(morseTimer);
  setMorseIndicator(false);
  buildMorseTimeline();

  const playBtn = document.getElementById('btn-morse-play-pause');
  const audioBtn = document.getElementById('btn-morse-audio-toggle');
  const slider = document.getElementById('morse-speed-slider');
  const wpmTxt = document.getElementById('morse-wpm-txt');

  if (playBtn) {
    playBtn.textContent = "PLAY TRANSMISSION";
    playBtn.onclick = () => {
      morsePlaying = !morsePlaying;
      if (morsePlaying) {
        playBtn.textContent = "PAUSE TRANSMISSION";
        playBtn.classList.add('active');
        playNextMorseStep();
      } else {
        playBtn.textContent = "PLAY TRANSMISSION";
        playBtn.classList.remove('active');
        if (morseTimer) clearTimeout(morseTimer);
        setMorseIndicator(false);
      }
    };
  }

  if (audioBtn) {
    audioBtn.textContent = "ENABLE AUDIO (BEEP)";
    audioBtn.classList.remove('active');
    audioBtn.onclick = () => {
      morseAudioEnabled = !morseAudioEnabled;
      if (morseAudioEnabled) {
        audioBtn.textContent = "DISABLE AUDIO (BEEP)";
        audioBtn.classList.add('active');
        // trigger context creation
        if (!morseAudioCtx) {
          morseAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
      } else {
        audioBtn.textContent = "ENABLE AUDIO (BEEP)";
        audioBtn.classList.remove('active');
        stopMorseBeep();
      }
    };
  }

  if (slider && wpmTxt) {
    slider.value = 12;
    wpmTxt.textContent = "12 WPM";
    slider.oninput = () => {
      morseWPM = parseInt(slider.value);
      wpmTxt.textContent = morseWPM + " WPM";
    };
  }
}


/* ══════════════════════════════════════════
   MODULE 11 — ENIGMA ROTOR SIMULATOR
   ══════════════════════════════════════════ */
let rotorValues = [0, 0, 0]; // 0-25 offset

function initEnigma() {
  rotorValues = [0, 0, 0];
  updateEnigmaUI();
}

function rotateRotor(idx, dir) {
  rotorValues[idx] = (rotorValues[idx] + dir + 26) % 26;
  updateEnigmaUI();
}

function updateEnigmaUI() {
  for (let i = 0; i < 3; i++) {
    const el = document.getElementById(`rotor-${i}-val`);
    if (el) el.textContent = String.fromCharCode(65 + rotorValues[i]);
  }
  updateEnigmaDecryption();
}

function updateEnigmaDecryption() {
  const s1 = rotorValues[0] - 9; // J is 9
  const s2 = rotorValues[1] - 13; // N is 13
  const s3 = rotorValues[2] - 24; // Y is 24

  const targetWord = "journey";
  let output = "";
  for (let i = 0; i < targetWord.length; i++) {
    const targetCode = targetWord.charCodeAt(i) - 97;
    let shift = 0;
    if (i === 0 || i === 1) shift = s1;
    else if (i === 2 || i === 3) shift = s2;
    else shift = s3;

    let shiftedCode = (targetCode + shift) % 26;
    if (shiftedCode < 0) shiftedCode += 26;
    output += String.fromCharCode(97 + shiftedCode);
  }

  const display = document.getElementById('enigma-decrypted-val');
  if (display) {
    display.textContent = output.toUpperCase();
    if (s1 === 0 && s2 === 0 && s3 === 0) {
      display.classList.add('match');
    } else {
      display.classList.remove('match');
    }
  }
}


/* ══════════════════════════════════════════
   MODULE 12 — NETWORK ROUTING PATHFINDER
   ══════════════════════════════════════════ */
const routerConnections = [
  { from: 'S', to: 'A', weight: 12 },
  { from: 'S', to: 'B', weight: 25 },
  { from: 'A', to: 'B', weight: 8 },
  { from: 'A', to: 'C', weight: 15 },
  { from: 'B', to: 'D', weight: 14 },
  { from: 'C', to: 'D', weight: 10 },
  { from: 'C', to: 'T', weight: 35 },
  { from: 'D', to: 'T', weight: 11 }
];
const routerNodeCoords = {
  'S': { x: 30, y: 100 },
  'A': { x: 110, y: 40 },
  'B': { x: 110, y: 160 },
  'C': { x: 200, y: 40 },
  'D': { x: 200, y: 160 },
  'T': { x: 270, y: 100 }
};
let routerSelectedPath = ['S'];
let routerCurrentLatency = 0;
let routerCompleted = false;

function initNetworkRouter() {
  routerSelectedPath = ['S'];
  routerCurrentLatency = 0;
  routerCompleted = false;

  const msg = document.getElementById('route-status-msg');
  if (msg) {
    msg.textContent = "Awaiting routing path selection...";
    msg.className = "router-status-msg";
  }

  updateRouteNodeButtons();
  drawRouterNetwork();
}

function resetNetworkRouter() {
  initNetworkRouter();
}

function drawRouterNetwork() {
  const canvas = document.getElementById('router-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  routerConnections.forEach(conn => {
    const p1 = routerNodeCoords[conn.from];
    const p2 = routerNodeCoords[conn.to];

    let isActive = false;
    for (let i = 0; i < routerSelectedPath.length - 1; i++) {
      if ((routerSelectedPath[i] === conn.from && routerSelectedPath[i+1] === conn.to) ||
          (routerSelectedPath[i] === conn.to && routerSelectedPath[i+1] === conn.from)) {
        isActive = true;
        break;
      }
    }

    ctx.beginPath();
    ctx.strokeStyle = isActive ? (routerCompleted ? '#00e5a0' : '#3d9eff') : '#1e2535';
    ctx.lineWidth = isActive ? 4 : 2;
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;

    ctx.fillStyle = '#0a0c10';
    ctx.fillRect(midX - 18, midY - 6, 36, 12);

    ctx.fillStyle = isActive ? (routerCompleted ? '#00e5a0' : '#3d9eff') : '#5a6478';
    ctx.font = '9px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${conn.weight}ms`, midX, midY);
  });
}

function clickRouteNode(nodeId) {
  if (routerCompleted) return;

  const lastNode = routerSelectedPath[routerSelectedPath.length - 1];
  if (nodeId === lastNode) return;

  const conn = routerConnections.find(c => 
    (c.from === lastNode && c.to === nodeId) || (c.from === nodeId && c.to === lastNode)
  );

  if (!conn) {
    const msg = document.getElementById('route-status-msg');
    if (msg) {
      msg.textContent = `› Link error: Node ${lastNode} is not linked to Node ${nodeId}.`;
      msg.className = "router-status-msg error-text";
    }
    return;
  }

  routerSelectedPath.push(nodeId);
  routerCurrentLatency += conn.weight;

  updateRouteNodeButtons();
  drawRouterNetwork();

  const msg = document.getElementById('route-status-msg');
  if (nodeId === 'T') {
    if (routerCurrentLatency === 45) { // S-A-B-D-T
      routerCompleted = true;
      if (msg) {
        msg.innerHTML = '› <span class="hl">ROUTE ENCRYPTED CHANNEL SECURED › "destiny"</span>';
        msg.className = "router-status-msg success-text";
      }
      updateRouteNodeButtons();
      drawRouterNetwork();
    } else {
      if (msg) {
        msg.textContent = `› ROUTE TIMEOUT: Latency ${routerCurrentLatency}ms exceeds threshold. Resetting...`;
        msg.className = "router-status-msg error-text";
      }
      setTimeout(resetNetworkRouter, 1200);
    }
  } else {
    if (msg) {
      msg.textContent = `› Packet at node ${nodeId}. Current latency: ${routerCurrentLatency}ms.`;
      msg.className = "router-status-msg";
    }
  }
}

function updateRouteNodeButtons() {
  document.querySelectorAll('.r-node').forEach(btn => {
    const node = btn.id.substring(3);
    if (routerSelectedPath.includes(node)) {
      btn.classList.add('active');
      if (routerCompleted) {
        btn.classList.add('glow');
      }
    } else {
      btn.classList.remove('active', 'glow');
    }
  });

  const pathList = document.getElementById('route-path-list');
  const latencyVal = document.getElementById('route-latency-val');
  if (pathList) pathList.textContent = routerSelectedPath.join(' ➔ ');
  if (latencyVal) latencyVal.textContent = `${routerCurrentLatency} ms`;
}


/* ══════════════════════════════════════════
   MODULE 13 — XOR BITWISE MANIPULATOR
   ══════════════════════════════════════════ */
let xorKey = 0; // 0-255
const xorCiphertext = [0x0F, 0x16, 0x0F, 0x18, 0x04, 0x0B, 0x06];

function initXorManipulator() {
  xorKey = 0;
  updateXorUI();
}

function toggleXorBit(bitIdx) {
  xorKey ^= (1 << bitIdx);
  updateXorUI();
}

function updateXorUI() {
  const decEl = document.getElementById('xor-key-dec');
  const hexEl = document.getElementById('xor-key-hex');
  if (decEl) decEl.textContent = xorKey;
  if (hexEl) hexEl.textContent = '0x' + xorKey.toString(16).toUpperCase().padStart(2, '0');

  for (let i = 0; i < 8; i++) {
    const bitBtn = document.getElementById(`bit-${i}`);
    if (bitBtn) {
      const bitVal = (xorKey >> i) & 1;
      bitBtn.innerHTML = `${bitVal}<span class="bit-sub">B${i}</span>`;
      if (bitVal === 1) {
        bitBtn.classList.add('active');
      } else {
        bitBtn.classList.remove('active');
      }
    }
  }

  updateXorDecryption();
}

function updateXorDecryption() {
  const decrypted = xorCiphertext.map(b => b ^ xorKey);
  const plainText = decrypted.map(b => (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.').join('');

  const display = document.getElementById('xor-output-val');
  if (display) {
    display.textContent = plainText.toUpperCase();
    if (plainText === "eternal") {
      display.classList.add('match');
    } else {
      display.classList.remove('match');
    }
  }
}


/* ══════════════════════════════════════════
   MODULE 14 — LOGIC GATE ANALYZER
   ══════════════════════════════════════════ */
let logicInputs = { A: 0, B: 0, C: 0, D: 0 };

function initLogicCircuit() {
  logicInputs = { A: 0, B: 0, C: 0, D: 0 };
  updateLogicUI();
}

function toggleLogicInput(inputName) {
  logicInputs[inputName] = logicInputs[inputName] === 1 ? 0 : 1;
  updateLogicUI();
}

function updateLogicUI() {
  for (const name in logicInputs) {
    const btn = document.getElementById(`lswitch-${name}`);
    if (btn) {
      btn.textContent = logicInputs[name];
      if (logicInputs[name] === 1) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  }

  // Gates logic evaluation
  const E = (logicInputs.A && logicInputs.B) ? 1 : 0;
  const F = (!logicInputs.C) ? 1 : 0;
  const G = (E && F) ? 1 : 0;
  const H = (G && logicInputs.D) ? 1 : 0;

  updateGateNodeUI('E', E);
  updateGateNodeUI('F', F);
  updateGateNodeUI('G', G);
  updateGateNodeUI('H', H);

  const stateMsg = document.getElementById('logic-lock-state');
  const statusBox = document.getElementById('logic-status-msg');
  if (stateMsg && statusBox) {
    if (H === 1) {
      stateMsg.textContent = 'CONFIRMED (1)';
      stateMsg.className = 'green-text';
      statusBox.innerHTML = 'OVERRIDE STATUS: <strong class="green-text" id="logic-lock-state">CONFIRMED (1)</strong> › KEYWORD: <strong class="hl">"patience"</strong>';
    } else {
      stateMsg.textContent = 'LOCKED (0)';
      stateMsg.className = 'red-text';
      statusBox.innerHTML = 'OVERRIDE STATUS: <strong class="red-text" id="logic-lock-state">LOCKED (0)</strong>';
    }
  }
}

function updateGateNodeUI(gateId, val) {
  const node = document.getElementById(`lg-node-${gateId}`);
  const valEl = document.getElementById(`lg-val-${gateId}`);
  if (node && valEl) {
    valEl.textContent = val;
    if (val === 1) {
      node.classList.add('active');
    } else {
      node.classList.remove('active');
    }
  }
}


/* ══════════════════════════════════════════
   MODULE 15 — OVERRIDE KEY RING WIDGET
   ══════════════════════════════════════════ */
const keyringCorrectOrder = ['K4Z', 'P4R', 'H1B', '4EV', 'T0G', 'H0M', 'YRS', 'UNV', 'SYM', 'PRM', 'JNY', 'DST', 'ETN', 'PAT', 'DEV', 'INF', 'CHS', 'BLV', 'MEM'];
let keyringCurrentSlots = Array(19).fill(null);

function initKeyring() {
  keyringCurrentSlots = Array(19).fill(null);
  
  const container = document.getElementById('keyring-frags-container');
  const resetBtn = document.getElementById('btn-keyring-reset');
  const submitBtn = document.getElementById('btn-keyring-submit');
  const fb = document.getElementById('feedback-20');
  
  if (!container || !resetBtn || !submitBtn || !fb) return;

  fb.classList.add('hidden');
  submitBtn.disabled = true;

  // Shuffle fragment values for display buttons
  const frags = [...keyringCorrectOrder].sort(() => Math.random() - 0.5);

  container.innerHTML = '';
  frags.forEach(val => {
    const btn = document.createElement('button');
    btn.className = 'key-frag-btn';
    btn.textContent = val;
    btn.setAttribute('data-val', val);
    
    btn.addEventListener('click', () => {
      if (btn.classList.contains('selected')) return;

      const nextEmpty = keyringCurrentSlots.indexOf(null);
      if (nextEmpty !== -1) {
        keyringCurrentSlots[nextEmpty] = val;
        btn.classList.add('selected');
        btn.disabled = true;
        updateKeyringUI();
      }
    });
    
    container.appendChild(btn);
  });

  // Slot click resets that slot
  document.querySelectorAll('.keyring-slot').forEach(slot => {
    slot.onclick = null; // Unbind previous
    slot.addEventListener('click', () => {
      const idx = parseInt(slot.getAttribute('data-index'));
      const val = keyringCurrentSlots[idx];
      if (val !== null) {
        keyringCurrentSlots[idx] = null;
        
        const btn = container.querySelector(`.key-frag-btn[data-val="${val}"]`);
        if (btn) {
          btn.classList.remove('selected');
          btn.disabled = false;
        }
        
        updateKeyringUI();
      }
    });
  });

  resetBtn.onclick = null;
  resetBtn.addEventListener('click', () => {
    keyringCurrentSlots.fill(null);
    container.querySelectorAll('.key-frag-btn').forEach(btn => {
      btn.classList.remove('selected');
      btn.disabled = false;
    });
    updateKeyringUI();
    fb.classList.add('hidden');
  });

  submitBtn.onclick = () => {
    const isCorrect = keyringCurrentSlots.every((val, idx) => val === keyringCorrectOrder[idx]);
    if (isCorrect) {
      fb.classList.remove('hidden', 'error');
      fb.classList.add('success');
      fb.textContent = '› OVERRIDE CONFIRMED. DECRYPTION KEY RING SECURED. LOADING TRANSMISSION DECK...';
      
      setTimeout(() => {
        goTo('screen-final');
      }, 1600);
    } else {
      fb.classList.remove('hidden', 'success');
      fb.classList.add('error');
      fb.textContent = '› INTEGRITY CHECK FAILED: SEQUENCE OUT OF CHRONOLOGICAL ORDER. RE-ARRANGE.';
    }
  };

  updateKeyringUI();
}

function updateKeyringUI() {
  const submitBtn = document.getElementById('btn-keyring-submit');
  
  keyringCurrentSlots.forEach((val, idx) => {
    const slot = document.querySelector(`.keyring-slot[data-index="${idx}"]`);
    const valEl = slot ? slot.querySelector('.slot-val') : null;
    
    if (slot && valEl) {
      if (val !== null) {
        valEl.textContent = val;
        slot.classList.add('filled');
      } else {
        valEl.textContent = '???';
        slot.classList.remove('filled');
      }
    }
  });

  const isFilled = !keyringCurrentSlots.includes(null);
  if (submitBtn) submitBtn.disabled = !isFilled;
}


/* ══════════════════════════════════════════
   FINAL SCREEN & DECORATIONS
   ══════════════════════════════════════════ */
function initFinalScreen() {
  initRain();
  buildFinalKeys();
}

function buildFinalKeys() {
  const row = document.getElementById('final-keys-display');
  if (!row) return;
  row.innerHTML = '';
  Object.entries(KEY_FRAGMENTS).forEach(([stage, val]) => {
    const span = document.createElement('span');
    span.className = 'fk';
    const prefix = parseInt(stage) < 10 ? 'MOD-0' : 'MOD-';
    span.textContent = `${prefix}${stage}: ${val}`;
    span.style.animationDelay = (parseInt(stage) * 0.1) + 's';
    row.appendChild(span);
  });
}

function initMatrix() {
  const canvas = document.getElementById('matrixCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ';
  const fontSize = 13;
  const cols = Math.floor(canvas.width / fontSize);
  const drops = Array(cols).fill(1);

  function draw() {
    ctx.fillStyle = 'rgba(10, 12, 16, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00e5a0';
    ctx.font = fontSize + 'px JetBrains Mono, monospace';
    drops.forEach((y, i) => {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * fontSize, y * fontSize);
      if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }

  setInterval(draw, 60);

  window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

function initRain() {
  const container = document.getElementById('finalRain');
  if (!container) return;
  container.innerHTML = '';

  const chars = ['0','1','L','O','V','E','H','I','B','A','♥','◆','▲','✦'];
  for (let i = 40; i > 0; i--) {
    const drop = document.createElement('div');
    drop.className = 'rain-drop';
    drop.textContent = chars[Math.floor(Math.random() * chars.length)];
    drop.style.left = Math.random() * 100 + 'vw';
    drop.style.animationDuration = (4 + Math.random() * 8) + 's';
    drop.style.animationDelay = (Math.random() * 8) + 's';
    drop.style.opacity = (0.1 + Math.random() * 0.4).toString();
    container.appendChild(drop);
  }
}


/* ══════════════════════════════════════════
   MODULE 09 — restored GRAPHIC EQUALIZER WIDGET
   ══════════════════════════════════════════ */
const eqTargets = [70, 30, 50, 80, 40];

function initEqualizer() {
  const sliders = document.querySelectorAll('.eq-slider');
  sliders.forEach(slider => {
    slider.oninput = () => {
      const idx = parseInt(slider.getAttribute('data-idx'));
      const val = parseInt(slider.value);
      const valTxt = document.getElementById('eq-val-' + idx);
      if (valTxt) valTxt.textContent = val + '%';
      const target = eqTargets[idx];
      const targetMarker = document.getElementById('eq-tgt-' + idx);
      if (Math.abs(val - target) <= 5) {
        if (valTxt) valTxt.classList.add('match');
        if (targetMarker) targetMarker.classList.add('locked');
      } else {
        if (valTxt) valTxt.classList.remove('match');
        if (targetMarker) targetMarker.classList.remove('locked');
      }
      checkEqualizerSync();
    };
  });
  // Explicit init — don't rely on dispatchEvent
  sliders.forEach(slider => {
    const idx = parseInt(slider.getAttribute('data-idx'));
    const val = parseInt(slider.value);
    const valTxt = document.getElementById('eq-val-' + idx);
    const target = eqTargets[idx];
    const targetMarker = document.getElementById('eq-tgt-' + idx);
    if (valTxt) {
      valTxt.textContent = val + '%';
      if (Math.abs(val - target) <= 5) valTxt.classList.add('match');
      else valTxt.classList.remove('match');
    }
    if (targetMarker) {
      if (Math.abs(val - target) <= 5) targetMarker.classList.add('locked');
      else targetMarker.classList.remove('locked');
    }
  });
  checkEqualizerSync();
}

function checkEqualizerSync() {
  const sliders = document.querySelectorAll('.eq-slider');
  let allMatched = true;
  sliders.forEach(slider => {
    const idx = parseInt(slider.getAttribute('data-idx'));
    const val = parseInt(slider.value);
    if (Math.abs(val - eqTargets[idx]) > 5) {
      allMatched = false;
    }
  });

  const statusBox = document.getElementById('eq-status-box');
  if (statusBox) {
    if (allMatched) {
      statusBox.innerHTML = '<span class="clue-tag" style="color:var(--green)">› SIGNAL SECURED</span><br/>Harmonic resonance secured. Decrypted payload: <strong class="hl">"symphony"</strong>';
    } else {
      statusBox.innerHTML = '<span class="clue-tag">› SYSTEM STATUS</span><br/>Adjust faders until all channels say "LOCKED" (within 5% of their targets). A harmonic word will then decrypt.';
    }
  }
}

/* ══════════════════════════════════════════
   MODULE 15 — VIGENERE DECRYPTION DECK
   ══════════════════════════════════════════ */
function initVigenere() {
  const keyInput = document.getElementById('vig-key-input');
  if (!keyInput) return;
  keyInput.value = '';

  const ciphertext = "OSQSEWJR";
  
  function updateVigenere() {
    const key = keyInput.value.toLowerCase().replace(/[^a-z]/g, '');
    const cards = document.querySelectorAll('.vig-plain-val');
    const shiftCards = document.querySelectorAll('.vig-shift-val');

    for (let i = 0; i < ciphertext.length; i++) {
      const cChar = ciphertext[i];
      let shift = 0;
      if (key.length > 0) {
        const keyChar = key[i % key.length];
        shift = keyChar.charCodeAt(0) - 97;
      }

      // Calculate decrypted character
      let code = cChar.charCodeAt(0);
      let pCode = code - shift;
      if (pCode < 65) pCode += 26;
      const pChar = String.fromCharCode(pCode);

      const shiftEl = document.getElementById('vig-shift-' + i);
      const plainEl = document.getElementById('vig-plain-' + i);

      if (shiftEl) shiftEl.textContent = '+' + shift;
      if (plainEl) {
        plainEl.textContent = pChar;
        if (key === 'love') {
          plainEl.classList.add('match');
        } else {
          plainEl.classList.remove('match');
        }
      }
    }
  }

  keyInput.addEventListener('input', updateVigenere);
  updateVigenere();
}

/* ══════════════════════════════════════════
   MODULE 16 — SPECTROGRAM PEAK FILTER
   ══════════════════════════════════════════ */
function initSpectrogramFilter() {
  const canvas = document.getElementById('spectrogram-canvas');
  const freqSlider = document.getElementById('spec-freq-slider');
  const widthSlider = document.getElementById('spec-width-slider');
  const freqVal = document.getElementById('spec-val-freq');
  const widthVal = document.getElementById('spec-val-width');
  const statusBox = document.getElementById('spec-status-box');

  if (!canvas || !freqSlider || !widthSlider) return;

  const ctx = canvas.getContext('2d');
  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const freq = parseInt(freqSlider.value);
    const width = parseInt(widthSlider.value);

    freqVal.textContent = freq + ' Hz';
    widthVal.textContent = width + ' Hz';

    // Draw white noise waveform (simulated)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x += 3) {
      const y = canvas.height * 0.7 + (Math.random() - 0.5) * 15;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw target peak (420 Hz, located around x = 420px map)
    const targetFreq = 420;
    const isMatched = Math.abs(freq - targetFreq) <= 10 && width <= 30;

    // Draw signal peak
    ctx.beginPath();
    ctx.strokeStyle = isMatched ? 'rgba(0, 229, 160, 0.8)' : 'rgba(61, 158, 255, 0.3)';
    ctx.lineWidth = 2;
    for (let x = 0; x < canvas.width; x++) {
      // Map x coordinate (0 to width) to frequency (100 to 800)
      const f = 100 + (x / canvas.width) * 700;
      // Normal distribution around targetFreq
      const dist = Math.abs(f - targetFreq);
      const peakHeight = Math.exp(-Math.pow(dist / 15, 2)) * 80;
      const noise = (Math.random() - 0.5) * 5;
      const y = canvas.height * 0.8 - peakHeight + noise;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw Bandpass filter window (shaded rectangle)
    const startX = ((freq - width/2 - 100) / 700) * canvas.width;
    const endX = ((freq + width/2 - 100) / 700) * canvas.width;
    ctx.fillStyle = isMatched ? 'rgba(0, 229, 160, 0.08)' : 'rgba(61, 158, 255, 0.05)';
    ctx.fillRect(startX, 0, endX - startX, canvas.height);
    
    // Draw filter edges
    ctx.strokeStyle = isMatched ? 'rgba(0, 229, 160, 0.4)' : 'rgba(61, 158, 255, 0.2)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(startX, 0); ctx.lineTo(startX, canvas.height);
    ctx.moveTo(endX, 0); ctx.lineTo(endX, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    if (isMatched) {
      statusBox.innerHTML = '<span class="clue-tag" style="color:var(--green)">› FILTER LOCKED</span><br/>Peak isolated at 420 Hz. Decrypted payload: <strong class="hl">"infinite"</strong>';
      statusBox.className = 'clue-block locked-signal';
    } else {
      statusBox.innerHTML = '<span class="clue-tag">› FILTER STATUS</span><br/>SIGNAL IS UNSTABLE. ADJUST FILTER PARAMETERS.';
      statusBox.className = 'clue-block';
    }

    requestAnimationFrame(draw);
  }

  freqSlider.addEventListener('input', draw);
  widthSlider.addEventListener('input', draw);
  draw();
}

/* ══════════════════════════════════════════
/* ══════════════════════════════════════════
   MODULE 17 — CIPHER DIAL LOCK
   ══════════════════════════════════════════ */
const dialLetters = [
  ['X', 'M', 'C', 'P', 'Y', 'B'],   // target: C (index 2)
  ['Q', 'F', 'T', 'H', 'R', 'N'],   // target: H (index 3)
  ['D', 'E', 'A', 'S', 'U', 'N'],   // target: E (index 1)
  ['K', 'G', 'Z', 'V', 'R', 'I'],   // target: R (index 4)  -- wait, R is at index 4? no: K G Z V R I -> R=4 ✓
  ['W', 'N', 'L', 'T', 'I', 'D'],   // target: I (index 4)
  ['A', 'O', 'Y', 'F', 'S', 'Q'],   // target: S (index 4)
  ['V', 'Z', 'M', 'B', 'K', 'H']    // target: H (index 5)
];
let dialIndices = [0, 0, 0, 0, 0, 0, 0];

function initWordLock() {
  dialIndices = [0, 0, 0, 0, 0, 0, 0];

  const grid = document.getElementById('diallock-grid');
  if (!grid) return;
  grid.innerHTML = '';

  dialLetters.forEach((letters, col) => {
    const dial = document.createElement('div');
    dial.className = 'dial-tile';
    dial.id = 'dial-' + col;
    dial.setAttribute('data-col', col);

    const hint = document.createElement('div');
    hint.className = 'dial-hint';
    hint.textContent = '▲ click ▼';

    const letter = document.createElement('div');
    letter.className = 'dial-letter';
    letter.id = 'dial-letter-' + col;
    letter.textContent = letters[0];

    const counter = document.createElement('div');
    counter.className = 'dial-counter';
    counter.id = 'dial-counter-' + col;
    counter.textContent = '1 / ' + letters.length;

    dial.appendChild(hint);
    dial.appendChild(letter);
    dial.appendChild(counter);

    // Left-click: advance forward
    dial.addEventListener('click', (e) => {
      e.preventDefault();
      stepDial(col, 1);
    });

    // Right-click: go backward
    dial.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      stepDial(col, -1);
    });

    grid.appendChild(dial);
  });

  updateDialStatus();
}

function stepDial(col, dir) {
  const len = dialLetters[col].length;
  dialIndices[col] = (dialIndices[col] + dir + len) % len;

  const letterEl = document.getElementById('dial-letter-' + col);
  const counterEl = document.getElementById('dial-counter-' + col);
  const dialEl = document.getElementById('dial-' + col);

  if (letterEl) letterEl.textContent = dialLetters[col][dialIndices[col]];
  if (counterEl) counterEl.textContent = (dialIndices[col] + 1) + ' / ' + dialLetters[col].length;

  // Flash animation
  if (dialEl) {
    dialEl.classList.add('dial-flash');
    setTimeout(() => dialEl.classList.remove('dial-flash'), 180);
  }

  updateDialStatus();
}

function updateDialStatus() {
  const currentWord = dialIndices.map((idx, col) => dialLetters[col][idx]).join('').toLowerCase();
  const statusBox = document.getElementById('diallock-status-box');

  document.querySelectorAll('.dial-tile').forEach((tile, col) => {
    const letter = dialLetters[col][dialIndices[col]];
    const target = 'CHERISH'[col];
    if (letter === target) {
      tile.classList.add('locked');
    } else {
      tile.classList.remove('locked');
    }
  });

  if (statusBox) {
    if (currentWord === 'cherish') {
      statusBox.innerHTML = 'STATUS: <strong class="green-text">ALL DIALS LOCKED</strong> › PASSCODE: <strong class="hl">"cherish"</strong>';
      statusBox.className = 'diallock-status locked';
    } else {
      statusBox.innerHTML = 'STATUS: LOCK CONSOLE ENGAGED';
      statusBox.className = 'diallock-status';
    }
  }
}

/* ══════════════════════════════════════════
   MODULE 18 — BINARY SUM CHECK REGISTER
   ══════════════════════════════════════════ */
const scWeights = [14, 25, 39, 52, 68, 85, 99, 120];
let scStates = Array(8).fill(0);

function initSumCheck() {
  scStates = Array(8).fill(0);
  updateSumCheckUI();
}

function toggleSumCheckNode(idx) {
  scStates[idx] = scStates[idx] === 1 ? 0 : 1;
  updateSumCheckUI();
}

function updateSumCheckUI() {
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    const node = document.getElementById('sc-node-' + i);
    const btn = document.getElementById('sc-btn-' + i);
    if (node && btn) {
      btn.textContent = scStates[i];
      if (scStates[i] === 1) {
        node.classList.add('active');
        sum += scWeights[i];
      } else {
        node.classList.remove('active');
      }
    }
  }

  const totalVal = document.getElementById('sc-total-val');
  const statusBox = document.getElementById('sumcheck-status-box');
  
  if (totalVal) {
    totalVal.textContent = sum + ' / 244';
    if (sum === 244) {
      totalVal.classList.add('matched');
    } else {
      totalVal.classList.remove('matched');
    }
  }

  if (statusBox) {
    if (sum === 244) {
      statusBox.innerHTML = 'DECRYPT STATUS: <strong class="green-text">REGISTER CHECKSUM SECURED</strong> › KEYWORD: <strong class="hl">"beloved"</strong>';
      statusBox.className = 'sumcheck-status success';
    } else {
      statusBox.innerHTML = 'STATUS: WAITING FOR COMBINATORIAL INPUT';
      statusBox.className = 'sumcheck-status';
    }
  }
}

/* ══════════════════════════════════════════
   MODULE 19 — SQL INJECTION LOG FORENSICS
   ══════════════════════════════════════════ */
const serverLogPool = [
  '192.168.12.42 - - [12/Jun/2026:14:10:01] "GET /robots.txt HTTP/1.1" 200 42',
  '192.168.12.42 - - [12/Jun/2026:14:10:05] "GET /admin/login.php HTTP/1.1" 404 152',
  '192.168.12.42 - - [12/Jun/2026:14:10:15] "GET /wp-admin/ HTTP/1.1" 404 152',
  '192.168.12.42 - - [12/Jun/2026:14:11:00] "GET /config.json HTTP/1.1" 404 152',
  '10.105.2.18 - - [12/Jun/2026:14:12:02] "POST /login HTTP/1.1" 401 240 "user=admin&pass=12345"',
  '10.105.2.18 - - [12/Jun/2026:14:12:15] "POST /login HTTP/1.1" 401 240 "user=admin&pass=admin123"',
  '10.105.2.18 - - [12/Jun/2026:14:12:30] "POST /login HTTP/1.1" 401 240 "user=admin&pass=password"',
  '10.105.2.18 - - [12/Jun/2026:14:13:01] "POST /login HTTP/1.1" 401 240 "user=root&pass=root"',
  '10.105.2.18 - - [12/Jun/2026:14:13:20] "POST /login HTTP/1.1" 403 125 "user=admin&pass=guest"',
  '172.16.5.99 - - [12/Jun/2026:14:14:02] "GET /items?cat=1 HTTP/1.1" 200 320',
  "172.16.5.99 - - [12/Jun/2026:14:14:15] \"GET /items?cat=1' HTTP/1.1\" 500 1485 \"SQL syntax error near ''' at line 1\"",
  "172.16.5.99 - - [12/Jun/2026:14:15:00] \"GET /items?cat=1' UNION SELECT null,null -- HTTP/1.1\" 200 320",
  "172.16.5.99 - - [12/Jun/2026:14:15:25] \"GET /items?cat=1' UNION SELECT username,password FROM users -- HTTP/1.1\" 200 8420",
  "172.16.5.99 - - [12/Jun/2026:14:16:10] \"GET /items?cat=1' UNION SELECT flag,secret FROM secrets -- HTTP/1.1\" 200 5200",
  '192.168.1.10 - - [12/Jun/2026:14:17:05] "GET /index.html HTTP/1.1" 200 3820',
  '192.168.1.10 - - [12/Jun/2026:14:17:10] "GET /style.css HTTP/1.1" 200 12500',
  '192.168.1.10 - - [12/Jun/2026:14:17:15] "GET /logo.png HTTP/1.1" 200 48000',
  '10.105.2.18 - - [12/Jun/2026:14:18:00] "POST /login HTTP/1.1" 401 240 "user=guest&pass=guest"',
  '192.168.12.42 - - [12/Jun/2026:14:20:00] "GET /.git/config HTTP/1.1" 404 152',
  '172.16.5.99 - - [12/Jun/2026:14:21:05] "POST /admin/login HTTP/1.1" 302 0 "user=admin&pass=$2y$12$K1d..."'
];

function initLogAuditing() {
  const searchInput = document.getElementById('log-search-input');
  const ipInput = document.getElementById('attacker-ip-input');
  const decryptStatus = document.getElementById('forensics-status-box');
  
  if (searchInput) searchInput.value = '';
  if (ipInput) ipInput.value = '';
  if (decryptStatus) {
    decryptStatus.textContent = 'AWAITING CORRECT ATTACKER IP CORRELATION KEY...';
    decryptStatus.className = 'forensics-decrypt-status';
  }

  filterForensicLogs();
}

function filterForensicLogs() {
  const searchInput = document.getElementById('log-search-input');
  const terminal = document.getElementById('log-terminal-output');
  if (!terminal) return;

  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  terminal.innerHTML = '';

  serverLogPool.forEach(line => {
    if (!query || line.toLowerCase().includes(query)) {
      const div = document.createElement('div');
      div.className = 'log-line';
      
      // Syntax highlighting for logs
      if (line.includes(' 200 ')) {
        if (line.includes('UNION') || line.includes('SELECT')) {
          div.className += ' hl-success'; // Intrusion exfil success
        }
      } else if (line.includes(' 500 ')) {
        div.className += ' hl-danger';
      } else if (line.includes(' 401 ') || line.includes(' 403 ')) {
        div.className += ' hl-warn';
      }
      
      div.textContent = line;
      terminal.appendChild(div);
    }
  });
}

function decryptLogPayload() {
  const ipInput = document.getElementById('attacker-ip-input');
  const statusBox = document.getElementById('forensics-status-box');
  
  if (!ipInput || !statusBox) return;

  const val = ipInput.value.trim();
  if (val === '172.16.5.99') {
    statusBox.textContent = 'DECRYPTING CORE DUMP PACKET...';
    statusBox.className = 'forensics-decrypt-status success';
    
    setTimeout(() => {
      statusBox.innerHTML = 'CORRELATION KEY VALIDATED! PAYLOAD RESOLVED: <strong class="hl">"memories"</strong>';
    }, 1200);
  } else {
    statusBox.textContent = 'DECRYPTION FAILURE: INVALID CORRELATION KEY IP HASH.';
    statusBox.className = 'forensics-decrypt-status error-text';
  }
}

function resetProgress() {
  if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
    localStorage.removeItem('op_hiba_cleared_stages');
    localStorage.removeItem('op_hiba_active_screen');
    window.location.reload();
  }
}


// ── Enter key submit ──
document.addEventListener('keydown', function(e) {
  if (e.key !== 'Enter') return;
  const active = document.querySelector('.screen.active');
  if (!active) return;
  const match = active.id.match(/screen-(\d+)/);
  if (match) {
    const stage = parseInt(match[1]);
    if (stage >= 1 && stage <= 19) check(stage);
  }
});

// ── Init boot ──
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.screen').forEach(s => {
    if (!s.classList.contains('active')) {
      s.style.display = 'none';
    }
  });
  initMatrix();

  // Load progress
  const savedStages = localStorage.getItem('op_hiba_cleared_stages');
  if (savedStages) {
    try {
      clearedStages = JSON.parse(savedStages);
      clearedStages.forEach(stage => {
        const input = document.getElementById('input-' + stage);
        if (input) input.value = ANSWERS[stage];
        const kc = document.getElementById('key-' + stage);
        const kv = document.getElementById('kv-' + stage);
        if (kc && kv) {
          kv.textContent = KEY_FRAGMENTS[stage];
          kc.classList.remove('hidden');
        }
      });
    } catch (e) {
      console.error("Error restoring stages progress", e);
    }
  }

  const savedScreen = localStorage.getItem('op_hiba_active_screen');
  if (savedScreen && savedScreen !== 'screen-boot') {
    goTo(savedScreen);
  } else {
    goTo('screen-boot');
  }
});
