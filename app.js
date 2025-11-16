const clearBtn = document.querySelector('#clear');

const canvas = document.querySelector('#signature-pad');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.lineWidth = 4;

let isDrawing = false;
let last = {x: 0, y: 0}; //track current mouse
let lastMid = {x: 0, y: 0}; //track end of the previous curve
let direction = true;

function draw(e) {
  if (!isDrawing) return;

  // midpoint between the last real point and the current point
  // gets end of the curve
  const mid = {
    x: (last.x + e.offsetX) / 2,
    y: (last.y + e.offsetY) / 2,
  };

  ctx.beginPath();
  ctx.strokeStyle = '#111';
  ctx.moveTo(lastMid.x, lastMid.y); // Start drawing from the previous mid point / curve
  ctx.quadraticCurveTo(last.x, last.y, mid.x, mid.y); // Move to creating smooth arc
  ctx.stroke();

  last = {x: e.offsetX, y: e.offsetY}; // Update the last real mouse position to the current one
  lastMid = mid; // Update the last midpoint to the current one

  if (ctx.lineWidth >= 6 || ctx.lineWidth <= 2) {
    direction = !direction;
  }

  ctx.lineWidth += direction ? 0.1 : -0.1;

}

function clearSignature() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  last = {x: e.offsetX, y: e.offsetY};
  lastMid = {x: e.offsetX, y: e.offsetY};
})

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);

clearBtn.addEventListener('click', clearSignature);