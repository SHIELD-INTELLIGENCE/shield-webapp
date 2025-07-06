import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = doc(db, "users", user.email);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, { email: user.email });
      }

      window.location.href = "/";
    } catch (e) {
      setError("Access denied. Verify credentials or contact SHIELD Admin.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-20 bg-[#2a2a2a] rounded-xl border border-yellow-600 shadow-xl space-y-4">
      <h2 className="text-2xl font-bold text-center text-yellow-500 tracking-wider">
        AGENT LOGIN
      </h2>

      <input
        className="w-full p-2 bg-[#1a1a1a] text-white border border-yellow-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full p-2 bg-[#1a1a1a] text-white border border-yellow-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && (
        <div className="text-sm text-red-400 bg-[#1a1a1a] p-2 rounded border border-red-500">
          {error}
        </div>
      )}

      <button
        className="w-full bw-btn"
        onClick={login}
      >
        Authenticate
      </button>
    </div>
  );
}
