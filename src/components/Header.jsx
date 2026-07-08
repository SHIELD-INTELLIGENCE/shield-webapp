import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Header({ user, onLogout }) {
  const [showMenu, setShowMenu] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (!user?.email) { setUserRole(null); return; }
    (async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.email));
        if (snap.exists()) setUserRole(snap.data().role);
      } catch { /* ignore */ }
    })();
  }, [user]);
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
      <NavLink to="/who-we-are" className={getNavLinkClass} onClick={closeMenu}>
        Who We Are
      </NavLink>
      <NavLink to="/our-work" className={getNavLinkClass} onClick={closeMenu}>
        Our Work
      </NavLink>
      <NavLink to="/request-service" className={getNavLinkClass} onClick={closeMenu}>
        Request a Service
      </NavLink>
      <NavLink to="/enterprise-consultation" className={getNavLinkClass} onClick={closeMenu}>
        Enterprise
      </NavLink>
      <NavLink to="/join-us" className={getNavLinkClass} onClick={closeMenu}>
        Join Us
      </NavLink>

      {user ? (
        <>
          {userRole === "admin" ? (
            <a
              className="nav-link"
              href={process.env.ADMIN_URL || "https://shielddashboard.netlify.app"}
              onClick={closeMenu}
            >
              Admin Panel
            </a>
          ) : (
            <NavLink to="/dashboard" className={getNavLinkClass} onClick={closeMenu}>
              Dashboard
            </NavLink>
          )}
          <button
            className="nav-link nav-link-button"
            onClick={() => {
              closeMenu();
              onLogout?.();
            }}
          >
            Logout
          </button>
        </>
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
            <img src="/logo.png" alt="" className="brand-logo" />
            <div className="brand-text">
              <motion.div className="logo" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                SHIELD Intelligence
              </motion.div>
              <div className="tagline">
                Securing Tomorrow with Strategic Intelligence.
              </div>
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
                    Securing Tomorrow with Strategic Intelligence.
                  </div>
                </div>
                <button className="mobile-drawer-close" onClick={() => setShowMenu(false)}>✕</button>
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
