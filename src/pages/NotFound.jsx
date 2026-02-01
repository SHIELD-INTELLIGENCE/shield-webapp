// src/pages/NotFound.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { updateSEO } from "../utils/seoUtils";

export default function NotFound() {
  useEffect(() => {
    updateSEO(
      "404 - Access Denied | SHIELD Intelligence",
      "The page you looking for doesn't exist or you don't have permission to access it.",
    );
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
