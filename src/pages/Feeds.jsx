// src/pages/Feeds.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Feeds() {
  const navigate = useNavigate();
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      } else {
        const q = query(
          collection(db, "feeds"),
          where("assignedTo", "array-contains", user.email)
        );

        const unsub = onSnapshot(q, (snapshot) => {
          setFeeds(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
          setLoading(false);
        });

        return () => unsub();
      }
    });

    return () => unsubAuth();
  }, [navigate]);

  const markAsDone = async (feedId) => {
    const ref = doc(db, "feeds", feedId);
    await updateDoc(ref, { status: "done" });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Your Feeds</h2>
      {loading ? (
        <div className="shield-loading-screen">
          <div className="shield-loading-title">
            <span className="desktop-text">Loading</span>
            <span className="mobile-text">Loading</span>
          </div>
          <div className="shield-spinner"></div>
        </div>
      ) : feeds.length === 0 ? (
        <p>No messages assigned to you.</p>
      ) : (
        feeds.map((feed) => (
          <div key={feed.id} className="feed-card">
            <h3>{feed.title}</h3>
            <p>{feed.body}</p>
            <small>Status: {feed.status}</small>
            {feed.status !== "done" && (
              <button className="bw-btn mt-2" onClick={() => markAsDone(feed.id)}>
                Mark as Done
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
