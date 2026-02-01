import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { updateSEO } from "../utils/seoUtils";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

async function submitToFirebase(formData) {
  await addDoc(collection(db, "joinApplications"), {
    fullName: formData.fullName,
    email: formData.email,
    contact: formData.contact,
    dob: formData.dob,
    education: formData.education,
    interests: formData.interests,
    reason: formData.reason,
    is13Plus: formData.is13Plus,
    acceptedTerms: true,
    createdAt: serverTimestamp(),
    source: "join-us",
  });
}

function JoinUs() {
  useEffect(() => {
    updateSEO(
      "Join SHIELD Intelligence | Build, Learn, and Contribute",
      "Apply to join SHIELD Intelligence as a student or contributor.",
    );
  }, []);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isModalOpen] = useState(false);

  // 1. ADDED: Touched state to track which fields user has visited
  const [touched, setTouched] = useState({});

  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    email: "",
    contact: "",
    is13Plus: "",
    education: "",
    interests: [],
    acceptedTerms: false,
    reason: "",
  });

  const INTEREST_OPTIONS = [
    "Software Development",
    "Web & Application Development",
    "Cybersecurity",
    "Cryptography",
    "Technology Research",
    "System Design & Engineering",
    "Strategy & Planning",
    "Communication Systems",
    "Leadership & Team Coordination",
    "Codebreaking & Logical Analysis",
    "Physical Protection & Security (future division)",
    "Private Intelligence Services (future division)",
  ];

  // Helper: Regex for email
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Check validity for individual fields
  const isEmailValid = isValidEmail(formData.email);
  const isNameValid = formData.fullName.trim().length >= 2;
  const isContactValid = formData.contact.trim() !== "";
  const isDobValid = formData.dob !== "";
  const isEducationValid = formData.education.trim() !== "";
  const isReasonValid = formData.reason.trim() !== "";
  const isInterestsValid = formData.interests.length > 0;
  const is13PlusValid = formData.is13Plus !== "";
  const isTermsValid = formData.acceptedTerms === true;

  // Global Form Validity
  const isFormValid =
    isNameValid &&
    isEmailValid &&
    isContactValid &&
    isDobValid &&
    isEducationValid &&
    isInterestsValid &&
    isReasonValid &&
    is13PlusValid &&
    isTermsValid;

  // 2. HELPER: Determine if we should show error style
  // Returns true if field has been touched AND is invalid
  const hasError = (field) => {
    // Special handling for email because it has a regex check
    if (field === "email") {
      return touched.email && !isEmailValid;
    }
    // Generic check for empty fields
    const value = formData[field];
    if (Array.isArray(value)) return touched[field] && value.length === 0;
    if (typeof value === "string") return touched[field] && value.trim() === "";
    return false;
  };

  function updateField(field, value) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // 4. HANDLER: Mark field as touched on Blur
  const handleBlur = (field) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  useEffect(() => {
    const saved = localStorage.getItem("shield_join_form_submitted");
    if (saved === "true") {
      setSubmitted(true);
    }
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

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
        delayChildren: 0.2
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.h1 className="form-title" variants={fadeInUp}>
        Join SHIELD Intelligence
      </motion.h1>

      <motion.div className="form-layout" variants={fadeInUp}>
        {/* Left: Content (Unchanged) */}
        <div className="form-info-column">
          <div className="form-info-card">
            <h2 className="form-info-title">Why Join SHIELD Intelligence?</h2>
            <p className="form-info-text">
              SHIELD Intelligence is a growing, technology-focused organization
              working on secure software, digital products, and
              privacy-conscious systems.
            </p>
            {/* ... Content truncated for brevity ... */}
            <p className="form-info-text">
              Please read our{" "}
              <Link to="/join-us-terms">Terms & Conditions</Link> before
              applying.
            </p>
          </div>
          <div className="form-info-card">
            <h3 className="form-info-title">Areas You Can Work In</h3>

            <ul className="form-info-list">
              <li>
                <strong>Software & Web Development:</strong> Help build
                websites, dashboards, internal tools, and custom applications.
              </li>
              <li>
                <strong>Product Development:</strong> Contribute to
                security-focused products such as authentication tools and
                privacy-oriented applications.
              </li>
              <li>
                <strong>System Design & Research:</strong> Explore technologies,
                frameworks, and approaches used in building dependable and
                secure systems.
              </li>
              <li>
                <strong>Future Divisions (Planned):</strong> Physical protection
                services and private intelligence operations (not active yet,
                training and groundwork only).
              </li>
            </ul>

            <p className="form-info-text form-info-text-spaced">
              You do not need prior professional experience to apply. What
              matters most is curiosity, willingness to learn, responsibility,
              and the ability to take work seriously—especially when dealing
              with sensitive systems or information.
            </p>
          </div>
        </div>

        {/* Right: Form Column */}
        <div className="form-column">
          {submitted ? (
            <div className="form-success-card">
              <h2 className="form-success-title">Application Submitted</h2>
              <p className="form-success-text">
                Your form has been sent to <strong>SHIELD Intelligence</strong>.
              </p>
              <button
                className="bw-btn form-success-btn"
                onClick={() => {
                  localStorage.removeItem("shield_join_form_submitted");
                  setSubmitted(false);
                  setSubmitting(false);
                  setFormData({
                    fullName: "",
                    dob: "",
                    email: "",
                    contact: "",
                    is13Plus: "",
                    education: "",
                    interests: [],
                    acceptedTerms: false,
                    reason: "",
                  });
                  setTouched({}); // Reset touched state
                }}
              >
                Submit Another Response
              </button>
            </div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (submitting || !isFormValid) return;
                try {
                  setSubmitting(true);
                  await submitToFirebase(formData);
                  localStorage.setItem("shield_join_form_submitted", "true");
                  setSubmitted(true);
                } catch (err) {
                  console.error("Submission failed:", err);
                  alert("Submission failed. Please try again.");
                } finally {
                  setSubmitting(false);
                }
              }}
              className="form"
            >
              <h2 className="form-title">Application Form</h2>
              <hr className="form-divider" />

              <h3 className="form-section-title">Personal Information</h3>
              {/* Full Name */}
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                onBlur={() => handleBlur("fullName")} // Mark touched on leave
                className={`form-input ${hasError("fullName") ? "input-error" : ""}`} // Apply dynamic border
                placeholder="Required"
              />

              {/* Email - With Specific Error Message */}
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                className={`form-input ${hasError("email") ? "input-error" : ""}`}
                placeholder="Required"
              />
              {/* Specific Email Error Text */}
              {touched.email && !isEmailValid && (
                <div className="form-error-text">
                  Please enter a valid email address (e.g., name@example.com)
                </div>
              )}

              {/* Contact */}
              <label className="form-label">
                Contact / Identity Handle (Instagram / Discord ID / Phone)
              </label>
              <input
                type="text"
                value={formData.contact}
                onChange={(e) => updateField("contact", e.target.value)}
                onBlur={() => handleBlur("contact")}
                className={`form-input ${hasError("contact") ? "input-error" : ""}`}
                placeholder="Required"
              />

              {/* DOB */}
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => updateField("dob", e.target.value)}
                onBlur={() => handleBlur("dob")}
                className={`form-input ${hasError("dob") ? "input-error" : ""}`}
              />

              <hr className="form-divider-second" />
              <h3 className="form-section-title">Education & Interests</h3>
              {/* Education */}
              <label className="form-label">Current Education / Level</label>
              <input
                type="text"
                value={formData.education}
                onChange={(e) => updateField("education", e.target.value)}
                onBlur={() => handleBlur("education")}
                className={`form-input ${hasError("education") ? "input-error" : ""}`}
                placeholder="e.g. Class 8, High School... (Required)"
              />

              {/* Interests */}
              <label className="form-label">
                Areas of Interest{" "}
                <span className="form-hint">(Select at least one)</span>
              </label>

              {/* Checkbox Box*/}
              <div
                className={hasError("interests") ? "field-error" : ""}
                onBlur={() => handleBlur("interests")}
              >
                {INTEREST_OPTIONS.map((interest) => (
                  <label key={interest} className="checkbox-label">
                    <input
                      type="checkbox"
                      className="checkboxes"
                      checked={formData.interests.includes(interest)}
                      onChange={(e) => {
                        handleBlur("interests"); // Mark touched immediately on click
                        if (e.target.checked) {
                          updateField("interests", [
                            ...formData.interests,
                            interest,
                          ]);
                        } else {
                          updateField(
                            "interests",
                            formData.interests.filter((i) => i !== interest),
                          );
                        }
                      }}
                    />{" "}
                    {interest}
                  </label>
                ))}
              </div>
              {touched.interests && !isInterestsValid && (
                <div className="form-error-text">
                  * Please select at least one area of interest.
                </div>
              )}

              <hr className="form-divider-second" />
              <h3 className="form-section-title">Application Details</h3>
              {/* Reason */}
              <label className="form-label">
                Why do you want to join SHIELD?
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => updateField("reason", e.target.value)}
                onBlur={() => handleBlur("reason")}
                className={`form-textarea ${hasError("reason") ? "input-error" : ""}`}
                placeholder="Please describe your motivation... (Required)"
                rows={6}
              />

              {/* 13+ Radio */}
              <label className="form-label">
                Are you 13 years of age or older?
              </label>
              <div
                className={hasError("is13Plus") ? "field-error" : ""}
                onBlur={() => handleBlur("is13Plus")}
              >
                <label className="radio-label">
                  <input
                    type="radio"
                    name="is13Plus"
                    value="Yes"
                    checked={formData.is13Plus === "Yes"}
                    onChange={(e) => {
                      updateField("is13Plus", e.target.value);
                      handleBlur("is13Plus");
                    }}
                  />{" "}
                  Yes
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="is13Plus"
                    value="No"
                    checked={formData.is13Plus === "No"}
                    onChange={(e) => {
                      updateField("is13Plus", e.target.value);
                      handleBlur("is13Plus");
                    }}
                  />{" "}
                  No
                </label>
              </div>

              <hr className="form-divider-second" />
              <h3 className="form-section-title">Agreement</h3>
              {/* Terms */}
              <label className="terms-label">
                <input
                  type="checkbox"
                  className="checkboxes"
                  checked={formData.acceptedTerms}
                  onChange={(e) =>
                    updateField("acceptedTerms", e.target.checked)
                  }
                />{" "}
                I have read and accept the{" "}
                <a href="/join-us-terms" className="terms-link">
                  Terms and Conditions
                </a>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                className={`bw-btn ${!isFormValid || submitting ? "btn-disabled" : ""}`}
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>

              {!isFormValid && (
                <p className="form-error-summary">
                  * Please complete all required fields correctly to submit.
                </p>
              )}
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default JoinUs;
