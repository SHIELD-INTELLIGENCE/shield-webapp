// src/pages/Feeds.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, onSnapshot, doc, updateDoc, FirestoreError } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Feeds() {
  const navigate = useNavigate();
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    let unsubFirestore = null;

    const unsubAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
        return;
      }
      
      try {
        const q = query(
          collection(db, "feeds"),
          where("assignedTo", "array-contains", user.email)
        );

        setLoading(true);
        setError(null);

        unsubFirestore = onSnapshot(
          q, 
          (snapshot) => {
            setFeeds(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
          },
          (err) => {
            console.error("Firestore query error:", err);
            setError("Failed to load your feeds. Please refresh the page or try again later.");
            setLoading(false);
          }
        );
      } catch (err) {
        console.error("Error setting up Firestore listener:", err);
        setError("An error occurred while connecting to the database.");
        setLoading(false);
      }
    }, (authError) => {
      console.error("Auth state error:", authError);
      setError("Authentication error. Please try logging in again.");
      setLoading(false);
    });

    return () => {
      if (unsubFirestore) unsubFirestore();
      unsubAuth();
    };
  }, [navigate]);

  const markAsDone = async (feedId) => {
    setUpdating(true);
    setUpdateError(null);
    
    try {
      const ref = doc(db, "feeds", feedId);
      await updateDoc(ref, { status: "done" });
      // Success is handled by the snapshot listener
    } catch (err) {
      console.error("Error updating feed:", err);
      setUpdateError("Failed to update feed status. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4" style={{ padding: '0 1rem' }}>Your Feeds</h2>
      
      {loading ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: '2rem'
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'var(--shield-accent)',
            textShadow: '0 0 20px var(--shield-glow)',
            letterSpacing: '1px'
          }}>
            Loading Feeds...
          </div>
          <div className="shield-spinner" style={{
            width: '3em',
            height: '3em',
            border: '0.3em solid var(--shield-accent)',
            borderTop: '0.3em solid transparent'
          }}></div>
        </div>
      ) : error ? (
        <div className="error-container" role="alert">
          <p className="error-message">{error}</p>
          <button 
            className="bw-btn mt-2" 
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      ) : feeds.length === 0 ? (
        <p className="text-2xl mb-4" style={{ padding: '0 1rem' }}>No messages assigned to you.</p>
      ) : (
        <div>
          {updateError && (
            <div className="update-error-message mb-4" role="alert">
              {updateError}
              <button 
                className="ml-2 close-btn" 
                onClick={() => setUpdateError(null)}
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          )}
          
          {feeds.map((feed) => (
            <div key={feed.id} className="feed-card">
              <h3>{feed.title}</h3>
              <p>{feed.body}</p>
              {(() => {
                const s = (feed.status || '').toString().toLowerCase();
                let statusClass = 'feed-status';
                if (['new', 'pending'].includes(s)) statusClass += ' feed-status--pending';
                else if (['in-progress', 'progress', 'working'].includes(s)) statusClass += ' feed-status--in-progress';
                else if (['done', 'completed', 'resolved'].includes(s)) statusClass += ' feed-status--done';
                else if (['failed', 'error', 'blocked'].includes(s)) statusClass += ' feed-status--failed';
                else statusClass += ' feed-status--pending';
                return <div className={statusClass}>Status: {feed.status}</div>;
              })()}
              {feed.status !== "done" && (
                <button 
                  className="bw-btn mt-2" 
                  onClick={() => markAsDone(feed.id)}
                  disabled={updating}
                  aria-busy={updating}
                >
                  {updating ? 'Updating...' : 'Mark as Done'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
