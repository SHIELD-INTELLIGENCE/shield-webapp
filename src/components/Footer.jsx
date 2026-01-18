import React from "react";
import { Link } from "react-router-dom";

export default function Footer({ user }) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-brand">SHIELD Intelligence</div>
            <div className="footer-tagline">
              Securing Towmorrow with Stategic Intelligence.
            </div>
            <div className="footer-note">
            Building secure software, authentication tools, and privacy-focused digital systems.
            </div>
          </div>

          <div className="footer-col">
            <div className="footer-heading">Explore</div>
            <Link className="footer-link" to="/">Home</Link>
            <Link className="footer-link" to="/about">About</Link>
            <Link className="footer-link" to="/join-us">Join Us</Link>
            <Link className="footer-link" to="/request-service">Request a Service</Link>
            {user ? (
              <Link className="footer-link" to="/feeds">My Feeds</Link>
            ) : (
              <Link className="footer-link" to="/login">Login</Link>
            )}
          </div>

          <div className="footer-col">
            <div className="footer-heading">Contact</div>
            <a className="footer-link" href="mailto:shield@shieldintelligence.in">
              shield@shieldintelligence.in
            </a>
            <a className="footer-link" href="https://x.com/0_SHIELD_0" target="_blank" rel="noopener noreferrer">
              X (Twitter)
            </a>
            <a className="footer-link" href="https://instagram.com/shield_private" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a className="footer-link" href="https://www.facebook.com/people/Shield-Intelligence/pfbid0K5nsekxw2ifc2SSUmWPUMgniDb3CDuTs888UiRt2WSss1rARFkHYUFS9jMBBGMCrl/" target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
            <span className="footer-link">Discord: shield_intelligence</span>
          </div>

          <div className="footer-col">
            <div className="footer-heading">Legal</div>
            <Link className="footer-link" to="/terms">Service Terms</Link>
            <Link className="footer-link" to="/join-us-terms">Join Us Terms</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-divider" />
          <div className="footer-bottom-row">
            <div className="footer-copyright">
              © {year} SHIELD Intelligence. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
