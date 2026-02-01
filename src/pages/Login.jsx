import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { updateSEO } from "../utils/seoUtils";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    updateSEO(
      "User Login | SHIELD Intelligence",
      "Secure login portal for SHIELD Intelligence authorized personnel.",
    );

    onAuthStateChanged(auth, (user) => {
      if (user) navigate("/");
    });
  }, [navigate]);

  const validateInputs = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!password) {
      setError("Password is required");
      return false;
    }

    return true;
  };

  const login = async () => {
    setError("");
    if (!validateInputs()) return;

    setIsLoading(true);

    try {
      await setPersistence(auth, browserLocalPersistence);
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      try {
        const userRef = doc(db, "users", user.email);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          await setDoc(userRef, { email: user.email });
        }
      } catch (firestoreError) {
        console.error("Firestore error:", firestoreError);
      }

      navigate("/");
    } catch (e) {
      switch (e.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setError("Invalid login credentials. Please try again");
          break;
        case "auth/too-many-requests":
          setError("Too many failed attempts. Please try again later");
          break;
        case "auth/user-disabled":
          setError("This account has been disabled");
          break;
        case "auth/network-request-failed":
          setError("Network error. Please check your connection");
          break;
        default:
          setError("Login failed. Please try again");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      className="shield-login-wrapper"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.div className="shield-login-container" variants={fadeInUp}>
        <h2>SHIELD Login</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}
          autoComplete="on"
          className="shield-login-form"
        >
          {/* Autofill helper */}
          <input
            type="text"
            name="username"
            autoComplete="username"
            className="hidden-autofill-input"
            tabIndex={-1}
            aria-hidden="true"
          />

          <input
            className="shield-clean-input"
            placeholder="Email"
            type="email"
            name="email"
            autoComplete="username email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
            aria-label="Email"
          />

          <input
            className="shield-clean-input"
            placeholder="Password"
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isLoading) {
                e.preventDefault();
                login();
              }
            }}
            disabled={isLoading}
            required
            aria-label="Password"
            minLength={6}
          />

          {error && (
            <p className="shield-login-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className={`bw-btn login-btn ${isLoading ? "login-btn-loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading && <span className="login-spinner" />}
            {isLoading ? "Authenticating..." : "Login"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
