// src/components/AnimatedRoute.jsx
import React from 'react';
import { motion } from 'framer-motion';

// Professional page transition variants
const pageVariants = {
  default: {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98
    },
    in: {
      opacity: 1,
      y: 0,
      scale: 1
    },
    out: {
      opacity: 0,
      y: -20,
      scale: 1.02
    }
  },
  slide: {
    initial: {
      opacity: 0,
      x: 30,
      scale: 0.98
    },
    in: {
      opacity: 1,
      x: 0,
      scale: 1
    },
    out: {
      opacity: 0,
      x: -30,
      scale: 1.02
    }
  },
  fade: {
    initial: {
      opacity: 0,
      scale: 0.95
    },
    in: {
      opacity: 1,
      scale: 1
    },
    out: {
      opacity: 0,
      scale: 1.05
    }
  }
};

// Smooth, professional transition timing
const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4
};
import ErrorBoundary from './ErrorBoundary';

const AnimatedRoute = ({ children, variant = "fade" }) => {
  // Animation variants with faster timing
  const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };
  
  const slideVariants = {
    initial: { x: '100vw' },
    animate: { x: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
    exit: { x: '-100vw', transition: { ease: 'easeInOut', duration: 0.2 } }
  };
  
  // Choose the appropriate variant
  const variants = variant === 'slide' ? slideVariants : fadeVariants;
  
  return (
    <ErrorBoundary
      fallback={({ resetErrorBoundary }) => (
        <div className="shield-route-error">
          <h2>This page encountered an error</h2>
          <p>Something went wrong while loading this section of the application.</p>
          <button className="bw-btn" onClick={resetErrorBoundary}>
            Try Again
          </button>
        </div>
      )}
    >
      <motion.div
        key={window.location.pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="animated-route"
      >
        {children}
      </motion.div>
    </ErrorBoundary>
  );
};

export default AnimatedRoute;