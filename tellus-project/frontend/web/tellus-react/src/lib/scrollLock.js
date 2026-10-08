let locks = 0;
let previousOverflow;

// Dialogs can open as the navigation drawer closes. Share a lock so one
// overlay's cleanup cannot re-enable scrolling underneath another overlay.
export function lockBodyScroll() {
  if (locks++ === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--locks === 0) document.body.style.overflow = previousOverflow;
  };
}
