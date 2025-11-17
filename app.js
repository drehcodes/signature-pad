const clearBtn = document.querySelector('#clear');
const widthInput = document.querySelector('#width');

const canvas = document.querySelector('#signature-pad');
const ctx = canvas.getContext('2d');

const dpr = window.devicePixelRatio || 1; //make lines sharp
const rect = canvas.getBoundingClientRect(); //fits into user screen size

//improve retina screens
canvas.width = rect.width * dpr;
canvas.height = rect.height * dpr;

ctx.scale(dpr, dpr);

ctx.lineJoin = 'round';
ctx.lineCap = 'round';

// get user choice of width in slider
let baseWidth = Number(widthInput.value);

let wobblePhase = 0;
const wobbleSpeed = 0.2;
const wobbleAmpFactor = 0.2;

let isDrawing = false;
let last = { x: 0, y: 0 };      // last real mouse point
let lastMid = { x: 0, y: 0 };   // last midpoint

// Track strokes paths
let strokes = [];        // all finished strokes
let currentStroke = [];  // stroke being drawn right now

function draw(e) {
  if (!isDrawing) return;

  const x = e.offsetX;
  const y = e.offsetY;

  // Save this point into the current stroke so we can redraw later
  currentStroke.push({ x, y });

  // Midpoint between last real point and current real point
  const mid = {
    x: (last.x + x) / 2,
    y: (last.y + y) / 2,
  };

  //Controll width
  wobblePhase += wobbleSpeed; // advance phase a bit every segment
  const maxWobble = baseWidth * wobbleAmpFactor; // e.g. 25% of base
  const wobbleOffset = Math.sin(wobblePhase) * maxWobble;
  const finalWidth = baseWidth + wobbleOffset;
  ctx.lineWidth = Math.max(0.5, finalWidth);

  ctx.beginPath();
  ctx.strokeStyle = '#111';
  // Start at the end of the previous curve
  ctx.moveTo(lastMid.x, lastMid.y);
  // Smooth curve: bends through `last`, ends at `mid`
  ctx.quadraticCurveTo(last.x, last.y, mid.x, mid.y);
  ctx.stroke();

  // Update smoothing state for the next frame
  last = { x, y };
  lastMid = mid;
}

// Redraw all strokes (used when width changes)
function redrawAllStrokes() {
  // Clear entire canvas (use internal resolution)
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#111';
  ctx.lineWidth = baseWidth; // use current slider value

  // Helper to replay one stroke with the same smoothing logic
  const replayStroke = (stroke) => {
    if (stroke.length < 2) return;

    // Reset smoothing state for this stroke
    let lastPoint = stroke[0];
    let lastMidPoint = stroke[0];

    for (let i = 1; i < stroke.length; i++) {
      const p = stroke[i];

      const mid = {
        x: (lastPoint.x + p.x) / 2,
        y: (lastPoint.y + p.y) / 2,
      };

      ctx.beginPath();
      ctx.moveTo(lastMidPoint.x, lastMidPoint.y);
      ctx.quadraticCurveTo(lastPoint.x, lastPoint.y, mid.x, mid.y);
      ctx.stroke();

      lastPoint = p;
      lastMidPoint = mid;
    }
  };

  // Redraw all finished strokes
  strokes.forEach(replayStroke);

  if (currentStroke.length > 1) {
    replayStroke(currentStroke);
  }
}

// Events
canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;

  const x = e.offsetX;
  const y = e.offsetY;

  // Start a new stroke
  currentStroke = [];
  currentStroke.push({ x, y });

  // Initialize smoothing state
  last = { x, y };
  lastMid = { x, y };

  wobblePhase = 0;
});

canvas.addEventListener('mousemove', draw);

function finishStroke() {
  if (!isDrawing) return;
  isDrawing = false;

  // Save the stroke if it has more than 1 point
  if (currentStroke.length > 1) {
    strokes.push(currentStroke);
  }
  currentStroke = [];
}

canvas.addEventListener('mouseup', finishStroke);
canvas.addEventListener('mouseout', finishStroke);

function clearSignature() {
  strokes = [];
  currentStroke = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

clearBtn.addEventListener('click', clearSignature);

function handleWidthChange() {
  baseWidth = Number(this.value);
  // When width changes, redraw everything using the new width
  redrawAllStrokes();
}

widthInput.addEventListener('input', handleWidthChange);
widthInput.addEventListener('change', handleWidthChange);
