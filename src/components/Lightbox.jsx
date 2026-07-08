import React from "react";
import { createPortal } from "react-dom";
import useEscapeBack from "../utils/useEscapeBack";

export default function Lightbox({ src, alt, onClose }) {
  useEscapeBack(!!src, onClose);

  if (!src) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className="lightbox-overlay" onClick={handleOverlayClick}>
      <div className="lightbox-container">
        <button className="lightbox-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <img src={src} alt={alt || ""} className="lightbox-image" />
      </div>
    </div>,
    document.body,
  );
}
