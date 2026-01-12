import { useState, useEffect } from "react";
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
      "Agent Login | SHIELD Intelligence",
      "Secure login portal for SHIELD Intelligence agents and authorized personnel."
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

    // Basic email validation
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

    // Validate inputs before attempting login
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);

    try {
      await setPersistence(auth, browserLocalPersistence);
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      // Try-catch for Firestore operations
      try {
        const userRef = doc(db, "users", user.email);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, { email: user.email });
        }
      } catch (firestoreError) {
        console.error("Firestore error:", firestoreError);
        // Continue despite Firestore error - user is still logged in
      }

      navigate("/");
    } catch (e) {
      console.error("Login error:", e);

      // Provide more specific error messages based on Firebase error codes
      const errorCode = e.code;
      switch (errorCode) {
        case "auth/user-not-found":
        case "auth/wrong-password":
          setError("Invalid email or password");
          break;
        case "auth/too-many-requests":
          setError("Too many failed login attempts. Please try again later");
          break;
        case "auth/user-disabled":
          setError("This account has been disabled");
          break;
        case "auth/invalid-credential":
          setError("Invalid login credentials");
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

  return (
    <div className="shield-login-wrapper">
      <div className="shield-login-container">
        <h2>SHIELD Login</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}
          autoComplete="on"
          className="shield-login-form"
        >
          {/* Hidden username field improves Chrome/Firefox autofill reliability */}
          <input
            type="text"
            name="username"
            id="username"
            autoComplete="username"
            style={{ position: "absolute", left: "-9999px", top: "auto" }}
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
            aria-required="true"
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
              // Allow Enter to submit when focused in password field
              if (e.key === "Enter") {
                // Prevent double form submissions
                e.preventDefault();
                // Only attempt login when not loading
                if (!isLoading) login();
              }
            }}
            disabled={isLoading}
            required
            aria-label="Password"
            aria-required="true"
            minLength="6"
          />

          {error && (
            <p className="shield-login-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="bw-btn"
            disabled={isLoading}
            style={{
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            {isLoading && (
              <div
                className="shield-spinner"
                style={{
                  width: "1em",
                  height: "1em",
                  border: "0.15em solid var(--shield-black)",
                  borderTop: "0.15em solid transparent",
                  margin: 0,
                }}
              />
            )}
            {isLoading ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
