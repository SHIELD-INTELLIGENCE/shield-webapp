import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase"; // <- make sure you export `db` too
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save to Firestore if not present
      const userRef = doc(db, "users", user.email); // use email as ID
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, { email: user.email });
      }

      window.location.href = "/"; // go to home
    } catch (e) {
      alert("Login failed: " + e.message);
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto space-y-4">
      <h2 className="text-xl font-bold">Agent Login</h2>
      <input
        className="border p-2 w-full"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 w-full"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="bg-blue-500 text-white p-2 w-full" onClick={login}>
        Login
      </button>
    </div>
  );
}
