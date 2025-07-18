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
  }, []);

  const login = async () => {
    setError("");
    try {
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

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
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] px-4">
      <div className="w-full max-w-sm space-y-4">
        <h2 className="text-2xl text-center font-semibold text-yellow-500">SHIELD Login</h2>

        <form onSubmit={(e) => { e.preventDefault(); login(); }} autoComplete="off" className="space-y-3">
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

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

        <div style="display: flex; justify-content: center;">
           <button type="submit" className="bw-btn">
            Login
           </button>
        </div>

        </form>
      </div>
    </div>
  );
}
