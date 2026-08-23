type PointerHold = { isHeld: () => boolean; stop: () => void };

/**
 * tracks whether a finger or button is currently down, so automatic scrolling can wait for the
 * reader to let go instead of taking the scroll away mid-gesture
 */
export function watchPointerHold(onRelease: () => void): PointerHold {
  let touchHeld = false;
  let pointerHeld = false;

  const holdTouch = () => {
    touchHeld = true;
  };
  const releaseTouch = () => {
    touchHeld = false;
    onRelease();
  };
  // the browser fires pointercancel once a touch becomes a scroll, so only mice count here
  const holdPointer = (event: PointerEvent) => {
    if (event.pointerType !== 'touch') pointerHeld = true;
  };
  const releasePointer = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return;
    pointerHeld = false;
    onRelease();
  };

  window.addEventListener('touchstart', holdTouch, { passive: true, capture: true });
  window.addEventListener('touchend', releaseTouch, { passive: true, capture: true });
  window.addEventListener('touchcancel', releaseTouch, { passive: true, capture: true });
  window.addEventListener('pointerdown', holdPointer, { passive: true, capture: true });
  window.addEventListener('pointerup', releasePointer, { passive: true, capture: true });
  window.addEventListener('pointercancel', releasePointer, { passive: true, capture: true });

  return {
    isHeld: () => touchHeld || pointerHeld,
    stop: () => {
      window.removeEventListener('touchstart', holdTouch, true);
      window.removeEventListener('touchend', releaseTouch, true);
      window.removeEventListener('touchcancel', releaseTouch, true);
      window.removeEventListener('pointerdown', holdPointer, true);
      window.removeEventListener('pointerup', releasePointer, true);
      window.removeEventListener('pointercancel', releasePointer, true);
    },
  };
}
