import React from 'react';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-hero-bw">
      <div className="home-hero-content-bw">
        <div className="logo-container">
          <img src={logo} alt="SHIELD Logo" className="logo" />
        </div>
        <h1>🛡 WELCOME TO <span className="bw-highlight">SHIELD</span></h1>
        <p>Your premier private intelligence & security organization</p>
        <div className="home-buttons">
          <Link to="/hire-agent" className="bw-btn">Hire an Agent</Link>
          <Link to="/join-us" className="bw-btn outline">Join Us</Link>
        </div>
      </div>

      <div className="contact-section">
        <h2>Contact Us</h2>
        <p>Email: shield@shieldintelligence.in</p>
        <p>X: 0_SHIELD_0</p>
        <p>Instagram: shield_private</p>
        <p>Facebook: SHIELD Intelligence</p>
      </div>

      {/* Nice-looking footer with T&C */}
      <div style={{
        borderTop: '1px solid #ccc',
        marginTop: '40px',
        padding: '20px 0',
        textAlign: 'center',
        fontSize: '0.9rem',
        color: '#666'
      }}>
        &copy; 2025 SHIELD — All rights reserved.<br />
        <Link to="/terms" style={{
          color: '#333',
          textDecoration: 'underline',
          marginTop: '10px',
          display: 'inline-block'
        }}>
          Terms & Conditions
        </Link>
      </div>
    </div>
  );
}

export default Home;
