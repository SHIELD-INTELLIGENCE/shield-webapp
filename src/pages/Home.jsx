import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="home-hero-bw">
      <div className="home-hero-content-bw">
        <div className="logo-container">
          <img src={logo} alt="SHIELD Logo" className="logo" />
        </div>
        <h1>WELCOME TO <span className="bw-highlight">SHIELD</span></h1>
        <p>Your premier private intelligence & security organization</p>
        <div className="home-buttons">
          <Link to="/hire-agent" className="bw-btn">Hire an Agent</Link>
          <Link to="/join-us" className="bw-btn outline">Join Us</Link>
        </div>
      </div>

      {!user && (
        <section className="private-access-section" style={{
          marginTop: '3rem',
          padding: '2rem',
          backgroundColor: 'rgba(0,0,0,0.7)',
          border: '2px dashed rgba(252, 211, 77, 0.6)',
          borderRadius: '1rem',
          boxShadow: '0 0 16px rgba(252, 211, 77, 0.3)',
          textAlign: 'center',
          maxWidth: '900px',
        }}>
          <h2 style={{ color: 'rgba(252, 211, 77, 1)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Restricted Tools
          </h2>
          <p style={{ color: '#ccc', fontSize: '1rem', marginTop: '0.5rem' }}>
            Some of our most advanced resources — including encrypted communication, agent-only portals, and our <span style={{ color: '#fcd34d' }}>morse & encoder tools</span> — are secured and accessible only to authorized SHIELD personnel.
          </p>
          <p style={{ color: '#999', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Please contact HQ for credentials if you are part of our operations.
          </p>
        </section>
      )}

      {/* ✅ Show actual tools if logged in */}
      {user && (
        <section className="private-access-section" style={{
          marginTop: '3rem',
          padding: '2rem',
          backgroundColor: 'rgba(0,0,0,0.7)',
          border: '2px dashed rgba(252, 211, 77, 0.6)',
          borderRadius: '1rem',
          boxShadow: '0 0 16px rgba(252, 211, 77, 0.3)',
          textAlign: 'center',
          maxWidth: '900px',
        }}>
          <h2 style={{
            color: 'rgba(252, 211, 77, 1)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '1rem'
          }}>
            Agent-Only Tools
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <a href="https://sm.shieldintelligence.in" target="_blank" rel="noopener noreferrer" className="bw-btn">
              Strategic Messaging Terminal
            </a>
            <a href="https://morse.shieldintelligence.in" target="_blank" rel="noopener noreferrer" className="bw-btn outline">
              Morse Encoder Access
            </a>
          </div>
        </section>
      )}

      {/* Public Resources */}
      <section className="public-links-section" style={{
        marginTop: '3rem',
        padding: '2rem',
        backgroundColor: 'rgba(0,0,0,0.7)',
        border: '2px solid var(--shield-accent)',
        borderRadius: '1rem',
        boxShadow: '0 0 20px var(--shield-glow)',
        maxWidth: '900px',
        textAlign: 'center',
      }}>
        <h2 style={{ color: 'var(--shield-accent)', marginBottom: '1rem' }}>Public Resources</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 1.8, color: '#ccc' }}>
          <li><a href="https://aidiaryapp.netlify.app" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--shield-accent)' }}>AIDIARY App</a></li>
          <li><a href="https://shieldintelligence.in" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--shield-accent)' }}>Main Website</a></li>
          <li><a href="https://employees.shieldintelligence.in" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--shield-accent)' }}>Employee Directory</a></li>
          <li><a href="https://download.shieldintelligence.in" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--shield-accent)' }}>Download App (APK)</a></li>
          <li><a href="https://wanted.shieldintelligence.in" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--shield-accent)' }}>Wanted List</a></li>
        </ul>
      </section>

      {/* Contact Section */}
      <div className="contact-section">
        <h2>Contact Us</h2>
        <p>Email: shield@shieldintelligence.in</p>
        <p>X: 0_SHIELD_0</p>
        <p>Instagram: shield_private</p>
        <p>Facebook: SHIELD Intelligence</p>
      </div>

      {/* Footer */}
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
