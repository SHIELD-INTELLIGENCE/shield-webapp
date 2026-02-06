import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

export default function Header({ user, onLogout }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      const nextIsMobile = window.innerWidth < 768;
      setIsMobile(nextIsMobile);
      if (!nextIsMobile) setShowMenu(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!showMenu) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") setShowMenu(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const getNavLinkClass = ({ isActive }) =>
    `nav-link${isActive ? " active" : ""}`;

  const NavLinks = () => (
    <>
      <NavLink to="/" className={getNavLinkClass} onClick={closeMenu} end>
        Home
      </NavLink>
      <NavLink to="/about" className={getNavLinkClass} onClick={closeMenu}>
        About
      </NavLink>
      <NavLink to="/request-service" className={getNavLinkClass} onClick={closeMenu}>
        Request a Service
      </NavLink>
      <NavLink to="/join-us" className={getNavLinkClass} onClick={closeMenu}>
        Join Us
      </NavLink>

      {user && (
        <NavLink to="/feeds" className={getNavLinkClass} onClick={closeMenu}>
          My Feeds
        </NavLink>
      )}

      {user ? (
        <button
          className="nav-link nav-link-button"
          onClick={() => {
            closeMenu();
            onLogout?.();
          }}
        >
          Logout
        </button>
      ) : (
        <NavLink to="/login" className={getNavLinkClass} onClick={closeMenu}>
          Login
        </NavLink>
      )}
    </>
  );

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">Skip to content</a>

      <nav className="navbar" aria-label="Primary">
        <div className="nav-inner">
          <Link to="/" className="brand" onClick={closeMenu}>
            <motion.div className="logo" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              SHIELD Intelligence
            </motion.div>
            <div className="tagline">
              Securing Towmorrow with Stategic Intelligence.
            </div>
          </Link>
    
          <motion.button
            className="hamburger"
            aria-label={showMenu ? "Close menu" : "Open menu"}
            aria-expanded={showMenu}
            aria-controls="mobile-nav-drawer"
            onClick={() => setShowMenu(prev => !prev)}
          >
            ☰
          </motion.button>

          {!isMobile && <div className="nav-links"><NavLinks /></div>}
        </div>
      </nav>

      <AnimatePresence>
        {isMobile && showMenu && (
          <motion.div
            className="mobile-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMenu(false)}
          >
            <motion.aside
              className="mobile-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mobile-drawer-head">
                <div>
                  <div className="mobile-drawer-logo">SHIELD Intelligence</div>
                  <div className="mobile-drawer-tagline">
                    Securing Towmorrow with Stategic Intelligence.
                  </div>
                </div>
                <button onClick={() => setShowMenu(false)}>✕</button>
              </div>

              <div className="mobile-drawer-links">
                <NavLinks />
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
