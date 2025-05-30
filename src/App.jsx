import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import JoinUs from './pages/JoinUs';
import HireAgent from './pages/HireAgent';
import Terms from './pages/Terms';
import JoinUsTerms from './pages/JoinUsTerms'
function App() {
  return (
    <Router>
      <nav className="navbar">
        <div className="nav-links">
          <Link to="/" className="nav-btn">Home</Link>
          <Link to="/about" className="nav-btn">About</Link>
          <Link to="/join-us" className="nav-btn">Join Us</Link>
          <Link to="/hire-agent" className="nav-btn">Hire an Agent</Link>

        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/join-us" element={<JoinUs />} />
        <Route path="/hire-agent" element={<HireAgent />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/join-us-terms" element={<JoinUsTerms />} />
      </Routes>
    </Router>
  );
}

export default App;
