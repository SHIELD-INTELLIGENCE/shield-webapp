// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      color: '#caa94c',
      fontFamily: 'Roboto, sans-serif',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '4rem' }}>404 — SHIELD Access Denied</h1>
      <p style={{ fontSize: '1.5rem' }}>The page you’re looking for doesn’t exist.</p>
      <Link to="/" style={{ color: '#fafafa', marginTop: '20px' }}>
        Return to SHIELD Main Console
      </Link>
    </div>
  );
}