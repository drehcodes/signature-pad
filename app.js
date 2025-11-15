const canvas = document.querySelector('#signature-pad');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.heigth = window.innerHeight;
ctx.lineJoin = 'round'
ctx.lineCap = 'round'
ctx.lineWidth = 10;

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let direction = true;

function draw(e) {
  if (!isDrawing) return;

  const midX = (lastX + e.offsetX) / 2;
  const midY = (lastY + e.offsetY) / 2;

  ctx.beginPath();
  ctx.strokeStyle = '#111';
  ctx.moveTo(lastX, lastY) // Start from
  ctx.quadraticCurveTo(e.offsetX, e.offsetY, midX, midY); // Move to
  ctx.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY]

  if (ctx.lineWidth >= 10 || ctx.lineWidth <= 1) {
    direction = !direction;
  }

  if (direction) {
    ctx.lineWidth++;
  } else {
    ctx.lineWidth--;
  }
}

canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY]
})

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);