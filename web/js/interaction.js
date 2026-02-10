// ======== Interaction ========

function setupInteraction(canvas) {
  const state = { tiltX: CONFIG.tiltX, tiltY: 0, spinZ: 0, autoRotate: true, spinOffset: 0, tiltXBase: CONFIG.tiltX, timeOffset: 0 };
  let dragging = false, lastMX, lastMY;

  canvas.addEventListener('mousedown', e => {
    dragging = true; lastMX = e.clientX; lastMY = e.clientY;
    state.autoRotate = false;
  });
  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    state.tiltY += (e.clientX - lastMX) * 0.007;
    state.tiltX += (e.clientY - lastMY) * 0.007;
    state.tiltX = Math.max(-Math.PI/2, Math.min(Math.PI/2, state.tiltX));
    lastMX = e.clientX; lastMY = e.clientY;
  });
  window.addEventListener('mouseup', () => {
    dragging = false;
    state.autoRotate = true;
    state.spinOffset = state.spinZ;
    state.tiltXBase = state.tiltX;
    state.timeOffset = performance.now() * 0.001;
  });

  return state;
}
