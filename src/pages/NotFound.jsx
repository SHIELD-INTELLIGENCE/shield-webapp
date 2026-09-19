// src/pages/NotFound.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { updateSEO, setRobotsNoIndex, removeCanonical } from "../utils/seoUtils";

export default function NotFound() {
  useEffect(() => {
    updateSEO(
      "404 - Page Not Found | SHIELD Intelligence",
      "The page you are looking for does not exist on SHIELD Intelligence.",
    );
    // 404 must not be indexed and must not advertise a canonical as indexable
    setRobotsNoIndex('noindex, follow');
    removeCanonical();
    return () => {
      // cleanup robots tag when leaving 404 (SPA navigation)
      const tag = document.querySelector('meta[name="robots"]');
      if (tag && tag.getAttribute('content') === 'noindex, follow') {
        // Only remove if it is the 404 tag and no other noindex is intended
        // Legal pages manage their own tags, so check id
        if (!tag.id) tag.remove();
      }
    };
  }, []);

  return (
    <div className="notfound-page">
      <h1 className="notfound-title">404 — SHIELD Access Denied</h1>
      <p className="notfound-text">
        The page you’re looking for doesn’t exist.
      </p>
      <Link to="/" className="notfound-link">
        Return to SHIELD Main Console
      </Link>
    </div>
  );
}
