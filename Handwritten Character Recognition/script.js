'use strict';

/* =========================================================
   Configuration
   ========================================================= */
const API_BASE_URL = 'http://127.0.0.1:8000';
const MAX_FILE_SIZE_MB = 5;
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const HISTORY_KEY = 'neuradigit_history';
const THEME_KEY = 'neuradigit_theme';
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* =========================================================
   Toasts
   ========================================================= */
const toastRegion = document.getElementById('toast-region');

function showToast(message, type = 'info', timeout = 5000) {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.setAttribute('role', 'status');
  el.textContent = message;
  toastRegion.appendChild(el);
  const remove = () => {
    el.classList.add('leaving');
    setTimeout(() => el.remove(), 200);
  };
  const timer = setTimeout(remove, timeout);
  el.addEventListener('click', () => { clearTimeout(timer); remove(); });
}

/* =========================================================
   Theme toggle
   ========================================================= */
const themeToggle = document.getElementById('theme-toggle');
const iconMoon = document.getElementById('theme-icon-moon');
const iconSun = document.getElementById('theme-icon-sun');

function applyTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  const isLight = theme === 'light';
  themeToggle.setAttribute('aria-pressed', String(isLight));
  themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
  iconMoon.hidden = isLight;
  iconSun.hidden = !isLight;
}

(function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  applyTheme(saved === 'light' ? 'light' : 'dark');
})();

themeToggle.addEventListener('click', () => {
  const next = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  applyTheme(next);
  try { localStorage.setItem(THEME_KEY, next); } catch (_) { /* storage unavailable */ }
});

/* =========================================================
   API health check
   ========================================================= */
const statusDot = document.getElementById('api-status-dot');
const statusText = document.getElementById('api-status-text');
const modelDeviceEl = document.getElementById('model-device');
const modelLoadedEl = document.getElementById('model-loaded');
const footerApiLink = document.getElementById('footer-api-link');
footerApiLink.href = API_BASE_URL;
footerApiLink.target = '_blank';
footerApiLink.rel = 'noopener';

let apiOnline = false;

async function checkHealth() {
  statusDot.className = 'status-dot checking';
  statusText.textContent = 'Checking API…';
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    apiOnline = data.status === 'healthy';
    statusDot.className = `status-dot ${apiOnline ? 'online' : 'offline'}`;
    statusText.textContent = apiOnline ? 'API connected' : 'API offline';
    modelDeviceEl.textContent = data.device ? data.device.toUpperCase() : '—';
    modelLoadedEl.textContent = data.model_loaded ? 'Yes' : 'No';
  } catch (err) {
    apiOnline = false;
    statusDot.className = 'status-dot offline';
    statusText.textContent = 'API offline';
    modelDeviceEl.textContent = '—';
    modelLoadedEl.textContent = '—';
  }
  updatePredictButtonState();
}

checkHealth();
setInterval(checkHealth, 30000);

/* =========================================================
   Mode tabs (upload / draw)
   ========================================================= */
const tabUpload = document.getElementById('tab-upload');
const tabDraw = document.getElementById('tab-draw');
const panelUpload = document.getElementById('panel-upload');
const panelDraw = document.getElementById('panel-draw');

let activeMode = 'upload'; // 'upload' | 'draw'

function setMode(mode) {
  activeMode = mode;
  const isUpload = mode === 'upload';
  tabUpload.classList.toggle('is-active', isUpload);
  tabDraw.classList.toggle('is-active', !isUpload);
  tabUpload.setAttribute('aria-selected', String(isUpload));
  tabDraw.setAttribute('aria-selected', String(!isUpload));
  panelUpload.classList.toggle('is-active', isUpload);
  panelDraw.classList.toggle('is-active', !isUpload);
  panelUpload.hidden = !isUpload;
  panelDraw.hidden = isUpload;
  updatePredictButtonState();
}

tabUpload.addEventListener('click', () => setMode('upload'));
tabDraw.addEventListener('click', () => setMode('draw'));

/* =========================================================
   Upload + drag & drop
   ========================================================= */
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('file-input');
const previewCard = document.getElementById('preview-card');
const previewImage = document.getElementById('preview-image');
const metaFilename = document.getElementById('meta-filename');
const metaDimensions = document.getElementById('meta-dimensions');
const metaFilesize = document.getElementById('meta-filesize');
const removeImageBtn = document.getElementById('remove-image');

let selectedFile = null;

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function validateFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    showToast('Please choose a PNG, JPG or WEBP image.', 'error');
    return false;
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    showToast(`That file is too large — please keep it under ${MAX_FILE_SIZE_MB} MB.`, 'error');
    return false;
  }
  return true;
}

function handleFile(file) {
  if (!validateFile(file)) return;
  selectedFile = file;
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    metaDimensions.textContent = `${img.naturalWidth} × ${img.naturalHeight}px`;
  };
  img.src = url;
  previewImage.src = url;
  metaFilename.textContent = file.name;
  metaFilesize.textContent = formatBytes(file.size);
  previewCard.hidden = false;
  hideResult();
  updatePredictButtonState();
}

dropzone.addEventListener('click', () => fileInput.click());
dropzone.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
});

['dragenter', 'dragover'].forEach((evt) => {
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.classList.add('is-dragover');
  });
});
['dragleave', 'dragend'].forEach((evt) => {
  dropzone.addEventListener(evt, () => dropzone.classList.remove('is-dragover'));
});
dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('is-dragover');
  const file = e.dataTransfer.files && e.dataTransfer.files[0];
  if (file) handleFile(file);
});

fileInput.addEventListener('change', () => {
  const file = fileInput.files && fileInput.files[0];
  if (file) handleFile(file);
});

removeImageBtn.addEventListener('click', () => {
  selectedFile = null;
  fileInput.value = '';
  previewCard.hidden = true;
  hideResult();
  updatePredictButtonState();
});

/* =========================================================
   Draw canvas
   ========================================================= */
const drawCanvas = document.getElementById('draw-canvas');
const drawCtx = drawCanvas.getContext('2d');
const clearCanvasBtn = document.getElementById('clear-canvas');
let hasDrawing = false;
let drawing = false;
let lastPoint = null;

function resetCanvas() {
  drawCtx.fillStyle = '#000';
  drawCtx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);
  drawCtx.strokeStyle = '#fff';
  drawCtx.lineWidth = 16;
  drawCtx.lineCap = 'round';
  drawCtx.lineJoin = 'round';
  hasDrawing = false;
}
resetCanvas();

function getCanvasPoint(e) {
  const rect = drawCanvas.getBoundingClientRect();
  const scaleX = drawCanvas.width / rect.width;
  const scaleY = drawCanvas.height / rect.height;
  const src = e.touches ? e.touches[0] : e;
  return { x: (src.clientX - rect.left) * scaleX, y: (src.clientY - rect.top) * scaleY };
}

function startDraw(e) {
  e.preventDefault();
  drawing = true;
  lastPoint = getCanvasPoint(e);
}
function moveDraw(e) {
  if (!drawing) return;
  e.preventDefault();
  const point = getCanvasPoint(e);
  drawCtx.beginPath();
  drawCtx.moveTo(lastPoint.x, lastPoint.y);
  drawCtx.lineTo(point.x, point.y);
  drawCtx.stroke();
  lastPoint = point;
  hasDrawing = true;
  updatePredictButtonState();
}
function endDraw() { drawing = false; }

drawCanvas.addEventListener('mousedown', startDraw);
drawCanvas.addEventListener('mousemove', moveDraw);
window.addEventListener('mouseup', endDraw);
drawCanvas.addEventListener('touchstart', startDraw, { passive: false });
drawCanvas.addEventListener('touchmove', moveDraw, { passive: false });
drawCanvas.addEventListener('touchend', endDraw);

clearCanvasBtn.addEventListener('click', () => {
  resetCanvas();
  hideResult();
  updatePredictButtonState();
});

/* =========================================================
   Predict button state + submission
   ========================================================= */
const predictBtn = document.getElementById('predict-btn');
const predictBtnLabel = document.getElementById('predict-btn-label');
const loadingStages = document.getElementById('loading-stages');
let isPredicting = false;

function updatePredictButtonState() {
  const hasInput = activeMode === 'upload' ? !!selectedFile : hasDrawing;
  predictBtn.disabled = !hasInput || !apiOnline || isPredicting;
}

async function getBlobForPrediction() {
  if (activeMode === 'upload') return selectedFile;
  return new Promise((resolve) => drawCanvas.toBlob((blob) => resolve(blob), 'image/png'));
}

const STAGE_SEQUENCE = ['upload', 'preprocess', 'cnn', 'confidence'];

function runStageAnimation() {
  loadingStages.hidden = false;
  const stageEls = STAGE_SEQUENCE.map((s) => loadingStages.querySelector(`[data-stage="${s}"]`));
  stageEls.forEach((el) => el.classList.remove('is-active', 'is-done'));
  let i = 0;
  const interval = setInterval(() => {
    if (i > 0) stageEls[i - 1].classList.replace('is-active', 'is-done');
    if (i < stageEls.length) {
      stageEls[i].classList.add('is-active');
      i += 1;
    } else {
      clearInterval(interval);
    }
  }, 420);
  return () => {
    clearInterval(interval);
    stageEls.forEach((el) => { el.classList.remove('is-active'); el.classList.add('is-done'); });
  };
}

predictBtn.addEventListener('click', async () => {
  if (isPredicting) return;
  const blob = await getBlobForPrediction();
  if (!blob) {
    showToast('Please provide an image first.', 'error');
    return;
  }

  isPredicting = true;
  predictBtn.disabled = true;
  predictBtn.classList.add('is-loading');
  predictBtnLabel.textContent = 'Analyzing…';
  hideResult();
  const finishStages = runStageAnimation();

  try {
    const formData = new FormData();
    const filename = activeMode === 'draw' ? 'drawing.png' : (selectedFile ? selectedFile.name : 'image.png');
    formData.append('file', blob, filename);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    const res = await fetch(`${API_BASE_URL}/predict`, { method: 'POST', body: formData, signal: controller.signal });
    clearTimeout(timer);

    if (!res.ok) {
      let detail = `Prediction failed (status ${res.status}).`;
      try {
        const errBody = await res.json();
        if (errBody && errBody.detail) detail = errBody.detail;
      } catch (_) { /* non-JSON error body */ }
      throw new Error(detail);
    }

    const data = await res.json();
    if (typeof data.prediction !== 'number' || typeof data.confidence !== 'number') {
      throw new Error('Invalid server response.');
    }

    finishStages();
    await sleep(250);
    showResult(data);
    saveHistoryEntry(data);
    showToast('Prediction complete.', 'success', 3000);
  } catch (err) {
    finishStages();
    if (err.name === 'AbortError') {
      showToast('The request timed out. Is the API running?', 'error');
    } else if (err instanceof TypeError) {
      showToast('Network error — check that the API is reachable.', 'error');
    } else {
      showToast(err.message || 'Prediction failed.', 'error');
    }
  } finally {
    isPredicting = false;
    predictBtn.classList.remove('is-loading');
    predictBtnLabel.textContent = 'Predict digit';
    setTimeout(() => { loadingStages.hidden = true; }, 500);
    updatePredictButtonState();
  }
});

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

/* =========================================================
   Result rendering
   ========================================================= */
const resultCard = document.getElementById('result-card');
const resultDigit = document.getElementById('result-digit');
const resultMessage = document.getElementById('result-message');
const ringFill = document.getElementById('ring-fill');
const confidenceValue = document.getElementById('confidence-value');
const confidenceBarFill = document.getElementById('confidence-bar-fill');
const confidenceNote = document.getElementById('confidence-note');

const RING_CIRCUMFERENCE = 2 * Math.PI * 70;

function confidenceMessage(confidence) {
  if (confidence >= 90) return 'Very high model confidence.';
  if (confidence >= 70) return 'Strong model confidence.';
  if (confidence >= 50) return 'Moderate model confidence.';
  return 'Low model confidence.';
}

function hideResult() {
  resultCard.hidden = true;
  ringFill.style.strokeDashoffset = String(RING_CIRCUMFERENCE);
  confidenceBarFill.style.width = '0%';
}

function showResult(data) {
  resultCard.hidden = false;
  resultDigit.textContent = String(data.prediction);
  resultDigit.classList.remove('is-revealing');
  void resultDigit.offsetWidth; // restart animation
  resultDigit.classList.add('is-revealing');
  resultMessage.textContent = data.message || `The predicted digit is ${data.prediction}`;

  const confidence = Math.max(0, Math.min(100, data.confidence));
  confidenceValue.textContent = `${confidence.toFixed(2)}%`;
  confidenceNote.textContent = confidenceMessage(confidence);

  const offset = RING_CIRCUMFERENCE * (1 - confidence / 100);
  requestAnimationFrame(() => {
    ringFill.style.strokeDashoffset = String(offset);
    confidenceBarFill.style.width = `${confidence}%`;
  });

  resultCard.scrollIntoView({ behavior: REDUCED_MOTION ? 'auto' : 'smooth', block: 'nearest' });
}

/* =========================================================
   Prediction history (localStorage)
   ========================================================= */
const historyList = document.getElementById('history-list');
const historyEmpty = document.getElementById('history-empty');
const clearHistoryBtn = document.getElementById('clear-history');

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

function renderHistory() {
  const entries = loadHistory();
  historyList.querySelectorAll('.history-item').forEach((el) => el.remove());
  historyEmpty.hidden = entries.length > 0;
  entries.slice(0, 12).forEach((entry) => {
    const li = document.createElement('li');
    li.className = 'history-item';
    const time = new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    li.innerHTML = `<span class="history-digit"></span><span class="history-conf"></span><span class="history-time"></span>`;
    li.querySelector('.history-digit').textContent = entry.digit;
    li.querySelector('.history-conf').textContent = `${entry.confidence.toFixed(1)}%`;
    li.querySelector('.history-time').textContent = time;
    historyList.appendChild(li);
  });
}

function saveHistoryEntry(data) {
  try {
    const entries = loadHistory();
    entries.unshift({ digit: data.prediction, confidence: data.confidence, timestamp: Date.now() });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, 30)));
    renderHistory();
  } catch (_) { /* storage unavailable */ }
}

clearHistoryBtn.addEventListener('click', () => {
  try { localStorage.removeItem(HISTORY_KEY); } catch (_) { /* storage unavailable */ }
  renderHistory();
});

renderHistory();

/* =========================================================
   Scroll reveal (architecture nodes + steps)
   ========================================================= */
const revealTargets = document.querySelectorAll('.arch-node, .step-item');
if ('IntersectionObserver' in window && !REDUCED_MOTION) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('is-visible'), idx * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  revealTargets.forEach((el) => observer.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add('is-visible'));
}

/* =========================================================
   Background particle network
   ========================================================= */
(function initParticles() {
  const canvas = document.getElementById('bg-particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width, height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.min(70, Math.floor((width * height) / 22000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);
    const isLight = document.body.getAttribute('data-theme') === 'light';
    const dotColor = isLight ? '76, 141, 255' : '139, 158, 255';
    const lineColor = isLight ? '76, 141, 255' : '139, 158, 255';

    particles.forEach((p) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    });

    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const a = particles[i], b = particles[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 130) {
          ctx.strokeStyle = `rgba(${lineColor}, ${0.12 * (1 - dist / 130)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    particles.forEach((p) => {
      ctx.fillStyle = `rgba(${dotColor}, 0.55)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
      ctx.fill();
    });

    if (!REDUCED_MOTION) requestAnimationFrame(step);
  }

  resize();
  createParticles();
  window.addEventListener('resize', () => { resize(); createParticles(); });
  step();
})();

/* =========================================================
   Hero neural network animation
   ========================================================= */
(function initNeuralHero() {
  const canvas = document.getElementById('neural-canvas');
  const ctx = canvas.getContext('2d');
  let layers = [];
  let width, height;
  let pulses = [];

  function layout() {
    const rect = canvas.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
    const layerSizes = [4, 6, 6, 3];
    layers = layerSizes.map((count, li) => {
      const x = (width / (layerSizes.length - 1)) * li;
      return Array.from({ length: count }, (_, ni) => ({
        x,
        y: (height / (count + 1)) * (ni + 1),
      }));
    });
    pulses = [];
  }

  function spawnPulse() {
    if (layers.length < 2) return;
    const li = Math.floor(Math.random() * (layers.length - 1));
    const from = layers[li][Math.floor(Math.random() * layers[li].length)];
    const to = layers[li + 1][Math.floor(Math.random() * layers[li + 1].length)];
    pulses.push({ from, to, t: 0, speed: 0.012 + Math.random() * 0.012 });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const isLight = document.body.getAttribute('data-theme') === 'light';
    const nodeColor = isLight ? '#4c8dff' : '#8b9eff';
    const lineColor = isLight ? 'rgba(76,141,255,0.18)' : 'rgba(139,158,255,0.16)';

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;
    for (let li = 0; li < layers.length - 1; li += 1) {
      layers[li].forEach((a) => {
        layers[li + 1].forEach((b) => {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        });
      });
    }

    pulses.forEach((p) => { p.t += p.speed; });
    pulses = pulses.filter((p) => p.t < 1);
    pulses.forEach((p) => {
      const x = p.from.x + (p.to.x - p.from.x) * p.t;
      const y = p.from.y + (p.to.y - p.from.y) * p.t;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, 6);
      grad.addColorStop(0, isLight ? 'rgba(139,92,246,0.9)' : 'rgba(34,211,238,0.95)');
      grad.addColorStop(1, 'rgba(34,211,238,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    layers.forEach((layer) => {
      layer.forEach((n) => {
        ctx.fillStyle = nodeColor;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    });

    if (Math.random() < 0.06) spawnPulse();
    if (!REDUCED_MOTION) requestAnimationFrame(draw);
  }

  layout();
  window.addEventListener('resize', layout);
  draw();
})();
