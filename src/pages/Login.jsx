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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) navigate("/");
    });
  }, [navigate]);

  const login = async () => {
    setError("");
    try {
      await setPersistence(auth, browserLocalPersistence);
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      const userRef = doc(db, "users", user.email);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, { email: user.email });
      }

      navigate("/");
    } catch (e) {
      setError("Login failed. Invalid credentials.");
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
          autoComplete="off"
          className="shield-login-form"
        >
          <input
            className="shield-clean-input"
            placeholder="Email"
            type="email"
            name="email"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="shield-clean-input"
            placeholder="Password"
            type="password"
            name="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="shield-login-error">{error}</p>}

          <button type="submit" className="bw-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
