/**
 * Injected into the page when Sig is clicked. Finds canvas, simulates
 * pointer/mouse events to draw an S shape so the signature pad library
 * registers real input and enables the Next button.
 */
(function () {
  var XPATH = '/html/body/div[10]/div[3]/div/div[2]/div/div/div[2]/div/canvas';

  function findCanvas() {
    try {
      var result = document.evaluate(XPATH, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      var canvas = result.singleNodeValue;
      if (canvas && canvas.tagName === 'CANVAS') return canvas;
    } catch (e) {
      console.warn('[Hidden Talents] XPath lookup failed:', e);
    }
    var canvases = document.querySelectorAll('canvas');
    return canvases.length > 0 ? canvases[canvases.length - 1] : null;
  }

  function sampleBezier(p0x, p0y, cp1x, cp1y, cp2x, cp2y, p1x, p1y, steps) {
    var pts = [];
    for (var i = 0; i <= steps; i++) {
      var t = i / steps;
      var u = 1 - t;
      var x = u * u * u * p0x + 3 * u * u * t * cp1x + 3 * u * t * t * cp2x + t * t * t * p1x;
      var y = u * u * u * p0y + 3 * u * u * t * cp1y + 3 * u * t * t * cp2y + t * t * t * p1y;
      pts.push({ x: x, y: y });
    }
    return pts;
  }

  function firePointerAndMouse(canvas, type, cx, cy) {
    var rect = canvas.getBoundingClientRect();
    var clientX = rect.left + cx * (rect.width / canvas.width);
    var clientY = rect.top + cy * (rect.height / canvas.height);
    var common = {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: clientX,
      clientY: clientY,
      screenX: clientX,
      screenY: clientY,
      button: 0,
      buttons: type === 'mouseup' ? 0 : 1
    };
    var pointerType = type.replace('mouse', 'pointer');
    canvas.dispatchEvent(new PointerEvent(pointerType, Object.assign({}, common, {
      pointerId: 1,
      pointerType: 'mouse',
      isPrimary: true,
      pressure: type === 'mouseup' ? 0 : 0.5
    })));
    canvas.dispatchEvent(new MouseEvent(type, common));
  }

  function simulateDrawOnCanvas(canvas) {
    var W = canvas.width;
    var H = canvas.height;

    // S drawn in a centered box, 28% of the shorter dimension
    var size = Math.min(W, H) * 0.28;
    var cx = W / 2;
    var cy = H / 2;

    // Normalize: n(0..1) → canvas pixel inside the box
    function nx(v) { return cx - size / 2 + v * size; }
    function ny(v) { return cy - size / 2 + v * size; }

    // A classic S is two mirrored C-curves stacked vertically.
    //
    // Top arc (backwards C): starts top-right, sweeps left and down to center-left
    //   P0  = (0.72, 0.08)   — top-right
    //   CP1 = (0.20, -0.05)  — pull hard left & slightly above (rounds the top)
    //   CP2 = (0.05, 0.40)   — pull left-center
    //   P1  = (0.50, 0.48)   — center
    //
    // Bottom arc (C): starts center, sweeps right and down to bottom-left
    //   P0  = (0.50, 0.48)   — center (same as P1 above)
    //   CP1 = (0.95, 0.56)   — pull hard right & slightly below center
    //   CP2 = (0.80, 1.05)   — pull right & slightly past bottom (rounds the bottom)
    //   P1  = (0.28, 0.92)   — bottom-left

    var STEPS = 25;
    var curve1 = sampleBezier(
      nx(0.72), ny(0.08),
      nx(0.20), ny(-0.05),
      nx(0.05), ny(0.40),
      nx(0.50), ny(0.48),
      STEPS
    );
    var curve2 = sampleBezier(
      nx(0.50), ny(0.48),
      nx(0.95), ny(0.56),
      nx(0.80), ny(1.05),
      nx(0.28), ny(0.92),
      STEPS
    );
    curve2.shift(); // avoid duplicate midpoint
    var allPts = curve1.concat(curve2);

    var DELAY_MS = 8;
    var idx = 0;

    firePointerAndMouse(canvas, 'mousedown', allPts[0].x, allPts[0].y);
    idx = 1;

    function nextMove() {
      if (idx < allPts.length) {
        firePointerAndMouse(canvas, 'mousemove', allPts[idx].x, allPts[idx].y);
        idx++;
        setTimeout(nextMove, DELAY_MS);
      } else {
        var last = allPts[allPts.length - 1];
        firePointerAndMouse(canvas, 'mouseup', last.x, last.y);
        console.log('[Hidden Talents] Finished simulated S draw (' + allPts.length + ' points)');
      }
    }
    setTimeout(nextMove, DELAY_MS);
  }

  console.log('[Hidden Talents] Injected draw running');
  var canvas = findCanvas();
  if (!canvas) {
    console.warn('[Hidden Talents] No canvas found.');
    return;
  }

  firePointerAndMouse(canvas, 'mousedown', canvas.width / 2, canvas.height / 2);
  firePointerAndMouse(canvas, 'mouseup', canvas.width / 2, canvas.height / 2);

  setTimeout(function () {
    simulateDrawOnCanvas(canvas);
  }, 50);
})();
