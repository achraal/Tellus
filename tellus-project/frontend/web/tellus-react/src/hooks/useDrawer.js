import { useEffect } from "react";
import { lockBodyScroll } from "../lib/scrollLock.js";

export function useDrawer(open, drawerRef, toggleRef, onClose) {
  useEffect(() => {
    if (!open) return;
    const drawer = drawerRef.current;
    const toggle = toggleRef.current;
    const unlock = lockBodyScroll();
    const focusable = () =>
      [
        ...drawer.querySelectorAll(
          'a[href], button, select, input, [tabindex="0"]',
        ),
      ].filter((el) => !el.disabled && el.getClientRects().length);
    focusable()[0]?.focus();
    const handleKey = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key !== "Tab") return;
      const elements = focusable();
      const first = elements[0];
      const last = elements.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    drawer.addEventListener("keydown", handleKey);
    return () => {
      drawer.removeEventListener("keydown", handleKey);
      unlock();
      if (toggle?.isConnected && !document.querySelector("dialog[open]"))
        toggle.focus();
    };
  }, [open, drawerRef, toggleRef, onClose]);
}
