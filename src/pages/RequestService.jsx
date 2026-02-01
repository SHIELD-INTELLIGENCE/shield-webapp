import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { updateSEO } from "../utils/seoUtils";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

async function submitServiceRequest(formData) {
  await addDoc(collection(db, "serviceRequests"), {
    name: formData.name,
    education: formData.education,
    email: formData.email,
    date: formData.date,
    serviceType: formData.serviceType,
    projectReference: formData.projectReference,
    requirements: formData.requirements,
    budget: formData.budget,
    acceptedTerms: true,
    preferredContact: formData.preferredContact,
    createdAt: serverTimestamp(),
    source: "request-service",
  });
}

function RequestService() {
  const [isModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({}); // Track visited fields

  const [formData, setFormData] = useState({
    name: "",
    education: "",
    email: "",
    date: "",
    serviceType: "",
    projectReference: "",
    requirements: "",
    budget: "",
    acceptedTerms: false,
    preferredContact: "",
  });

  // Validation Helpers
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.education.trim() !== "" &&
    isValidEmail(formData.email) &&
    formData.date !== "" &&
    formData.serviceType !== "" &&
    formData.requirements.trim() !== "" &&
    formData.budget !== "" &&
    formData.preferredContact !== "" &&
    formData.acceptedTerms === true;

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const hasError = (field) => {
    if (field === "email")
      return touched.email && !isValidEmail(formData.email);
    if (field === "acceptedTerms")
      return touched.acceptedTerms && !formData.acceptedTerms;
    return touched[field] && String(formData[field]).trim() === "";
  };

  const getInputStyle = (field) => ({
    border: hasError(field)
      ? "1px solid #ff6b6b"
      : "1px solid rgba(255,255,255,0.08)",
    outline: "none",
    transition: "border 0.3s ease",
  });

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

  useEffect(() => {
    updateSEO(
      "Request a Service | SHIELD Intelligence",
      "Request secure software development, digital products, and custom technology solutions from SHIELD Intelligence.",
    );
  }, []);

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
        Request a Service
      </motion.h1>

      <motion.div className="form-layout" variants={fadeInUp}>
        {/* Left: Content Column */}
        <div className="form-info-column">
          <div className="form-info-card">
            <h3 form-info-title>Current Services</h3>
            <ul className="form-info-text">
              <li>
                <strong>Software Development:</strong> Custom websites, web
                applications, and digital tools.
              </li>
              <li>
                <strong>Security-Oriented Products:</strong> Privacy-focused
                tools and authentication systems.
              </li>
              <li>
                <strong>Technical Consultation:</strong> Project planning and
                system design.
              </li>
            </ul>
          </div>

          <div className="form-info-card">
            <h2 className="form-info-title">Future Capabilities</h2>
            <p className="form-info-text">
              Physical protection services and private intelligence operations
              are planned for the future and not currently active.
            </p>
          </div>
        </div>

        {/* Right: Form Column */}
        <div className="form-column">
          {submitted ? (
            <div className="form-success-card">
              <h2 className="form-success-title">Request Submitted</h2>
              <p className="form-success-text">
                Your request has been sent. We will contact you shortly.
              </p>
              <button
                className="bw-btn form-success-btn"
                onClick={() => {
                  setSubmitted(false);
                  setTouched({});
                  setFormData({
                    name: "",
                    education: "",
                    email: "",
                    date: "",
                    serviceType: "",
                    projectReference: "",
                    requirements: "",
                    budget: "",
                    acceptedTerms: false,
                    preferredContact: "",
                  });
                }}
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (submitting || !isFormValid) return;
                try {
                  setSubmitting(true);
                  await submitServiceRequest(formData);
                  setSubmitted(true);
                } catch (err) {
                  alert("Submission failed. Please try again.");
                } finally {
                  setSubmitting(false);
                }
              }}
              className="form"
            >
              <h2 className="form-title">Service Request Form</h2>
              <hr className="form-divider" />

              <h3 className="form-section-title">Contact Information</h3>
              <label className="form-label">Name of Requester</label>
              <input
                className="form-input"
                style={getInputStyle("name")}
                value={formData.name}
                onBlur={() => handleBlur("name")}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Full Name"
              />

              <label className="form-label">Class / Section / Status</label>
              <input
                className="form-input"
                style={getInputStyle("education")}
                value={formData.education}
                onBlur={() => handleBlur("education")}
                onChange={(e) => updateField("education", e.target.value)}
                placeholder="(If you are a student, mention your class, section, and school name.
If not, write “Not applicable”.)"
              />

              <label className="form-label">Contact Email</label>
              <input
                type="email"
                className={`form-input ${
                  hasError("email") ? "input-error" : ""
                }`}
                value={formData.email}
                onBlur={() => handleBlur("email")}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="email@example.com"
              />
              {hasError("email") && (
                <span className="form-error-text">Invalid email address</span>
              )}

              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                style={getInputStyle("date")}
                value={formData.date}
                onBlur={() => handleBlur("date")}
                onChange={(e) => updateField("date", e.target.value)}
              />

              <hr className="form-divider-second" />
              <h3 className="form-section-title">Service Details</h3>
              <label className="form-label">Service Type</label>
              <select
                className="form-input"
                style={getInputStyle("serviceType")}
                value={formData.serviceType}
                onBlur={() => handleBlur("serviceType")}
                onChange={(e) => updateField("serviceType", e.target.value)}
              >
                <option value="">Select</option>
                <option>Software Development</option>
                <option>Cybersecurity</option>
                <option>Digital Product Development</option>
                <option>Technical Consultation & Planning</option>
                <option>Other</option>
              </select>

              <label className="form-label">Project Name / Reference</label>
              <input
                className="form-input"
                value={formData.projectReference}
                onChange={(e) =>
                  updateField("projectReference", e.target.value)
                }
                placeholder="Optional"
              />

              <label className="form-label">Request Details</label>
              <textarea
                className={`form-textarea ${
                  hasError("requirements") ? "input-error" : ""
                }`}
                rows={5}
                value={formData.requirements}
                onBlur={() => handleBlur("requirements")}
                onChange={(e) => updateField("requirements", e.target.value)}
                placeholder="Explain your request clearly..."
              />

              <hr className="form-divider-second" />
              <h3 className="form-section-title">Budget & Contact</h3>
              <label className="form-label">Budget Range</label>
              <select
                className={`form-input ${
                  hasError("budget") ? "input-error" : ""
                }`}
                value={formData.budget}
                onBlur={() => handleBlur("budget")}
                onChange={(e) => updateField("budget", e.target.value)}
              >
                <option value="">Select</option>
                <option>₹1,000 – ₹3,000 (For Individuals)</option>
                <option>₹5,000 – ₹7,000 (Small scale)</option>
                <option>₹10,000+50, (Advanced/Large Scale)</option>
                <option>To be discussed</option>
              </select>

              <label className="form-label">Preferred Contact Method</label>
              <select
                className="form-input"
                style={getInputStyle("preferredContact")}
                value={formData.preferredContact}
                onBlur={() => handleBlur("preferredContact")}
                onChange={(e) =>
                  updateField("preferredContact", e.target.value)
                }
              >
                <option value="">Select</option>
                <option>Email</option>
                <option>Phone (If Provided)</option>
                <option>In Person (If Possible)</option>
              </select>

              <hr className="form-divider-second" />
              <h3 className="form-section-title">Agreement</h3>
              <label className="terms-label">
                <input
                  type="checkbox"
                  checked={formData.acceptedTerms}
                  onChange={(e) => {
                    updateField("acceptedTerms", e.target.checked);
                    handleBlur("acceptedTerms");
                  }}
                />{" "}
              I have read and accept the{" "}
                <a href="/terms" className="terms-link">
                  Terms and Conditions
                </a>
              </label>
              {hasError("acceptedTerms") && (
                <div className="form-error-text">
                  Required
                </div>
              )}
              <button
                className={`bw-btn ${
                  !isFormValid || submitting ? "btn-disabled" : ""
                }`}
                type="submit"
                disabled={!isFormValid || submitting}
              >
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
               {!isFormValid && (
                <p className="form-error-summary">
                  * Please complete all required fields correctly.
                </p>
              )}
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default RequestService;
