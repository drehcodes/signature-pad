# MySignature - Signature Pad App

## Features

- Smooth signature drawing using quadratic Bézier curves
- Natural pen-like effect
- Adjustable stroke width
- Light/Dark modes
- Clear and start over easily
- Export signature as a transparent PNG
- Fully responsive

## How it works

The app uses an HTML <canvas> to draw smooth, natural-looking strokes. As you move the mouse, each point is stored and connected using midpoints and quadratic Bézier curves for a handwriting feel. A small wobble is added to the stroke width to mimic pen pressure. When the width or theme changes, all saved strokes are redrawn instantly. Finally, the canvas can be exported as a transparent PNG.
