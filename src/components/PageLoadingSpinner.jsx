// src/components/PageLoadingSpinner.jsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const spinVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

const containerVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    transition: { duration: 0.2 }
  }
};

const PageLoadingSpinner = () => {
  useEffect(() => {
    // Prevent scrolling when loading spinner is visible
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <motion.div
      className="shield-loading-screen"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="shield-loading-title">
        <span className="desktop-text">Loading</span>
        <span className="mobile-text">Loading</span>
      </div>
      <motion.div 
        className="shield-spinner"
        variants={spinVariants}
        animate="animate"
      />
    </motion.div>
  );
};

export default PageLoadingSpinner;