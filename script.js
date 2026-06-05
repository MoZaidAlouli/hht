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
  9: 'symphony'
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
  9: 'SYM'
};

// ── Stage order ──
const STAGE_ORDER = [
  'screen-boot',
  'screen-intro',
  'screen-1', 'screen-2', 'screen-3',
  'screen-4', 'screen-5', 'screen-6',
  'screen-7', 'screen-8', 'screen-9',
  'screen-10', 'screen-final'
];

// ── Navigate ──
function goTo(screenId) {
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
  if (screenId === 'screen-10') initKeyring();
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
      9: '> frequency mismatch. lock all 5 equalizer channels to match the target percentages.'
    };
    showError(stage, wrongs[stage] || '> incorrect. try again.');
  }
}

// ── Success ──
function showSuccess(stage) {
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
   MODULE 09 — GRAPHIC EQUALIZER WIDGET
   ══════════════════════════════════════════ */
const eqTargets = {
  0: 70,
  1: 30,
  2: 50,
  3: 80,
  4: 40
};

function initEqualizer() {
  const sliders = document.querySelectorAll('.eq-slider');
  const statusBox = document.getElementById('eq-status-box');
  if (!sliders.length || !statusBox) return;

  statusBox.innerHTML = '<span class="clue-tag">› SYSTEM STATUS</span><br/>Adjust faders until all channels say "LOCKED" (within 5% of their targets). A harmonic word will then decrypt.';

  sliders.forEach(slider => {
    const idx = parseInt(slider.getAttribute('data-idx'));
    const valText = document.getElementById(`eq-val-${idx}`);
    const targetMarker = document.getElementById(`eq-tgt-${idx}`);

    function updateChannel() {
      const val = parseInt(slider.value);
      if (valText) valText.textContent = val + '%';

      const target = eqTargets[idx];
      const matches = Math.abs(val - target) <= 5;

      if (matches) {
        if (targetMarker) {
          targetMarker.textContent = `LOCKED (${target}%)`;
          targetMarker.classList.add('locked');
        }
        if (valText) valText.classList.add('match');
      } else {
        if (targetMarker) {
          targetMarker.textContent = `Target: ${target}%`;
          targetMarker.classList.remove('locked');
        }
        if (valText) valText.classList.remove('match');
      }

      checkEqualizerSync();
    }

    slider.addEventListener('input', updateChannel);
    updateChannel();
  });
}

function checkEqualizerSync() {
  const sliders = document.querySelectorAll('.eq-slider');
  const statusBox = document.getElementById('eq-status-box');
  if (!sliders.length || !statusBox) return;

  let allLocked = true;
  sliders.forEach(slider => {
    const idx = parseInt(slider.getAttribute('data-idx'));
    const val = parseInt(slider.value);
    const target = eqTargets[idx];
    if (Math.abs(val - target) > 5) {
      allLocked = false;
    }
  });

  if (allLocked) {
    statusBox.innerHTML = '<span class="clue-tag">› SIGNAL SECURED</span><br/>Frequencies tuned into harmony. keyword unlocked: <strong class="hl">"symphony"</strong>';
  } else {
    statusBox.innerHTML = '<span class="clue-tag">› SYSTEM STATUS</span><br/>Adjust faders until all channels say "LOCKED" (within 5% of their targets). A harmonic word will then decrypt.';
  }
}


/* ══════════════════════════════════════════
   MODULE 10 — MASTER KEY RING WIDGET
   ══════════════════════════════════════════ */
const keyringCorrectOrder = ['K4Z', 'P4R', 'H1B', '4EV', 'T0G', 'H0M', 'YRS', 'UNV', 'SYM'];
let keyringCurrentSlots = Array(9).fill(null);

function initKeyring() {
  keyringCurrentSlots = Array(9).fill(null);
  
  const container = document.getElementById('keyring-frags-container');
  const resetBtn = document.getElementById('btn-keyring-reset');
  const submitBtn = document.getElementById('btn-keyring-submit');
  const fb = document.getElementById('feedback-10');
  
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
    span.textContent = `MOD-0${stage}: ${val}`;
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

// ── Enter key submit ──
document.addEventListener('keydown', function(e) {
  if (e.key !== 'Enter') return;
  const active = document.querySelector('.screen.active');
  if (!active) return;
  const match = active.id.match(/screen-(\d+)/);
  if (match) {
    const stage = parseInt(match[1]);
    if (stage >= 1 && stage <= 9) check(stage);
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
});
