import { useEffect, useRef } from "react";

export default function useEscapeBack(active, onClose) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current?.();
      }
    };

    window.history.pushState(null, "");
    window.addEventListener("keydown", handleKeyDown);

    const handlePopState = () => {
      window.history.pushState(null, "");
      onCloseRef.current?.();
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [active]);
}
