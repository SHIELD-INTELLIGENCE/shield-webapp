import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { updateSEO } from "../utils/seoUtils";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const INITIAL_FORM = {
  companyName: "",
  contactPerson: "",
  email: "",
  phone: "",
  organizationType: "",
  industry: "",
  companySize: "",
  projectTitle: "",
  projectDescription: "",
  estimatedBudget: "",
  expectedTimeline: "",
  requiredFeatures: "",
  integrations: "",
  existingSystem: "",
  preferredContactMethod: "",
  notes: "",
  acceptedTerms: false,
};

async function submitEnterpriseConsultation(form) {
  await addDoc(collection(db, "enterpriseConsultations"), {
    companyName: form.companyName,
    contactPerson: form.contactPerson,
    email: form.email,
    phone: form.phone,
    organizationType: form.organizationType,
    industry: form.industry,
    companySize: form.companySize,
    projectTitle: form.projectTitle,
    projectDescription: form.projectDescription,
    estimatedBudget: form.estimatedBudget,
    expectedTimeline: form.expectedTimeline,
    requiredFeatures: form.requiredFeatures,
    integrations: form.integrations,
    existingSystem: form.existingSystem,
    preferredContactMethod: form.preferredContactMethod,
    notes: form.notes,
    acceptedTerms: form.acceptedTerms === true,
    status: "pending",
    priority: "medium",
    assignedTo: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

function EnterpriseConsultation() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("shield_enterprise_submitted");
    if (saved === "true") setSubmitted(true);
  }, []);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isFormValid =
    form.companyName.trim() !== "" &&
    form.contactPerson.trim() !== "" &&
    isValidEmail(form.email) &&
    form.phone.trim() !== "" &&
    form.projectTitle.trim() !== "" &&
    form.projectDescription.trim() !== "" &&
    form.acceptedTerms === true;

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const hasError = (field) => {
    if (field === "email")
      return touched.email && !isValidEmail(form.email);
    return touched[field] && String(form[field]).trim() === "";
  };

  useEffect(() => {
    updateSEO(
      "Enterprise Consultation | SHIELD Intelligence",
      "Request enterprise-grade consultation, custom software solutions, and strategic technology planning from SHIELD Intelligence.",
    );
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      className="request-service-page"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.h1 className="form-title" variants={fadeInUp}>
        Enterprise Consultation
      </motion.h1>

      <motion.div className="form-layout" variants={fadeInUp}>
        <div className="form-info-column">
          <div className="form-info-card">
            <h3 className="form-info-title">Why Enterprise Consultation?</h3>
            <ul className="form-info-text">
              <li>
                <strong>Strategic Planning:</strong> Tailored technology
                roadmaps for your organization.
              </li>
              <li>
                <strong>Custom Architecture:</strong> Scalable systems designed
                for your unique needs.
              </li>
              <li>
                <strong>Security-First Approach:</strong> Enterprise-grade
                security from day one.
              </li>
              <li>
                <strong>Dedicated Support:</strong> Direct communication with
                our senior team.
              </li>
            </ul>
          </div>

          <div className="form-info-card" style={{ marginTop: 16 }}>
            <h3 className="form-info-title">Enterprise Plan Features</h3>
            <ul className="form-info-text">
              <li>Fully custom software product built from scratch</li>
              <li>Dedicated project manager & development team</li>
              <li>Custom integrations with existing systems</li>
              <li>Advanced security, compliance & 99.9% uptime SLA</li>
              <li>10 major updates per month + unlimited small changes</li>
              <li>Custom domain, hosting & infrastructure setup</li>
              <li>Ongoing strategic consultation & quarterly reviews</li>
              <li>Build cost & monthly pricing customised to scope</li>
            </ul>
            <p style={{ marginTop: 12, color: "#cbd5e1", fontSize: "0.9rem" }}>
              Fill out the form and our team will reach out within 2-3 business days with a detailed proposal.
            </p>
          </div>
        </div>

        <div className="form-column">
          {submitted ? (
            <div className="form-success-card">
              <h2 className="form-success-title">Consultation Request Submitted</h2>
              <p className="form-success-text">
                Thank you. Our enterprise team will review your request and
                contact you within 2-3 business days.
              </p>
              <button
                className="bw-btn form-success-btn"
                onClick={() => {
                  localStorage.removeItem("shield_enterprise_submitted");
                  setSubmitted(false);
                  setTouched({});
                  setSubmitting(false);
                  setForm(INITIAL_FORM);
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
                  await submitEnterpriseConsultation(form);
                  localStorage.setItem("shield_enterprise_submitted", "true");
                  setSubmitted(true);
                } catch (err) {
                  alert("Submission failed. Please try again.");
                } finally {
                  setSubmitting(false);
                }
              }}
              className="form"
            >
              <h2 className="form-title">Enterprise Consultation Request</h2>
              <hr className="form-divider" />

              <h3 className="form-section-title">Organization Details</h3>

              <label className="form-label">Company / Organization Name</label>
              <input
                className={`form-input ${hasError("companyName") ? "input-error" : ""}`}
                value={form.companyName}
                onBlur={() => handleBlur("companyName")}
                onChange={(e) => updateField("companyName", e.target.value)}
                placeholder="Your company or organization name"
              />

              <label className="form-label">Organization Type</label>
              <select
                className="form-input"
                value={form.organizationType}
                onChange={(e) => updateField("organizationType", e.target.value)}
              >
                <option value="">Select type</option>
                <option value="startup">Startup</option>
                <option value="sme">Small / Medium Enterprise</option>
                <option value="enterprise">Large Enterprise</option>
                <option value="nonprofit">Non-Profit</option>
                <option value="government">Government</option>
                <option value="educational">Educational</option>
                <option value="other">Other</option>
              </select>

              <label className="form-label">Industry</label>
              <input
                className="form-input"
                value={form.industry}
                onChange={(e) => updateField("industry", e.target.value)}
                placeholder="e.g. Fintech, Healthcare, E-commerce"
              />

              <label className="form-label">Company Size</label>
              <select
                className="form-input"
                value={form.companySize}
                onChange={(e) => updateField("companySize", e.target.value)}
              >
                <option value="">Select size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-1000">201-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </select>

              <hr className="form-divider-second" />
              <h3 className="form-section-title">Contact Information</h3>

              <label className="form-label">Contact Person</label>
              <input
                className={`form-input ${hasError("contactPerson") ? "input-error" : ""}`}
                value={form.contactPerson}
                onBlur={() => handleBlur("contactPerson")}
                onChange={(e) => updateField("contactPerson", e.target.value)}
                placeholder="Full name of primary contact"
              />

              <label className="form-label">Email</label>
              <input
                type="email"
                className={`form-input ${hasError("email") ? "input-error" : ""}`}
                value={form.email}
                onBlur={() => handleBlur("email")}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="email@company.com"
              />
              {hasError("email") && (
                <span className="form-error-text">Invalid email address</span>
              )}

              <label className="form-label">Phone</label>
              <input
                type="tel"
                className={`form-input ${hasError("phone") ? "input-error" : ""}`}
                value={form.phone}
                onBlur={() => handleBlur("phone")}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="Phone number with country code"
              />

              <label className="form-label">Preferred Contact Method</label>
              <select
                className="form-input"
                value={form.preferredContactMethod}
                onChange={(e) => updateField("preferredContactMethod", e.target.value)}
              >
                <option value="">Select</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="video">Video Call</option>
                <option value="in-person">In Person</option>
              </select>

              <hr className="form-divider-second" />
              <h3 className="form-section-title">Project Details</h3>

              <label className="form-label">Project Title</label>
              <input
                className={`form-input ${hasError("projectTitle") ? "input-error" : ""}`}
                value={form.projectTitle}
                onBlur={() => handleBlur("projectTitle")}
                onChange={(e) => updateField("projectTitle", e.target.value)}
                placeholder="A short title for your project"
              />

              <label className="form-label">Project Description</label>
              <textarea
                className={`form-textarea ${hasError("projectDescription") ? "input-error" : ""}`}
                rows={5}
                value={form.projectDescription}
                onBlur={() => handleBlur("projectDescription")}
                onChange={(e) => updateField("projectDescription", e.target.value)}
                placeholder="Describe your project, goals, and any specific requirements..."
              />

              <label className="form-label">Required Features</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={form.requiredFeatures}
                onChange={(e) => updateField("requiredFeatures", e.target.value)}
                placeholder="Key features and functionality required"
              />

              <label className="form-label">Integrations Needed</label>
              <textarea
                className="form-textarea"
                rows={2}
                value={form.integrations}
                onChange={(e) => updateField("integrations", e.target.value)}
                placeholder="e.g. payment gateways, third-party APIs, CRMs"
              />

              <label className="form-label">Existing System</label>
              <textarea
                className="form-textarea"
                rows={2}
                value={form.existingSystem}
                onChange={(e) => updateField("existingSystem", e.target.value)}
                placeholder="Describe any existing systems to integrate with or replace"
              />

              <label className="form-label">Estimated Budget</label>
              <select
                className="form-input"
                value={form.estimatedBudget}
                onChange={(e) => updateField("estimatedBudget", e.target.value)}
              >
                <option value="">Select budget range</option>
                <option value="under-1l">Under ₹1,00,000</option>
                <option value="1l-5l">₹1,00,000 - ₹5,00,000</option>
                <option value="5l-10l">₹5,00,000 - ₹10,00,000</option>
                <option value="10l-25l">₹10,00,000 - ₹25,00,000</option>
                <option value="25l+">₹25,00,000+</option>
                <option value="not-sure">Not sure / To be discussed</option>
              </select>

              <label className="form-label">Expected Timeline</label>
              <select
                className="form-input"
                value={form.expectedTimeline}
                onChange={(e) => updateField("expectedTimeline", e.target.value)}
              >
                <option value="">Select timeline</option>
                <option value="urgent">ASAP (Within 1 month)</option>
                <option value="short">1-3 months</option>
                <option value="medium">3-6 months</option>
                <option value="long">6+ months</option>
                <option value="planning">Still planning</option>
              </select>

              <hr className="form-divider-second" />
              <h3 className="form-section-title">Additional Notes</h3>

              <label className="form-label">Notes (Optional)</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder="Any additional information or questions"
              />

              <hr className="form-divider-second" />
              <h3 className="form-section-title">Agreement</h3>

              <label className="terms-label">
                <input
                  type="checkbox"
                  checked={form.acceptedTerms}
                  onChange={(e) => {
                    updateField("acceptedTerms", e.target.checked);
                    handleBlur("acceptedTerms");
                  }}
                />{" "}
                I confirm that the information provided is accurate and I agree to
                be contacted regarding this consultation request.
              </label>
              {touched.acceptedTerms && !form.acceptedTerms && (
                <div className="form-error-text">Required</div>
              )}

              <button
                className={`bw-btn ${!isFormValid || submitting ? "btn-disabled" : ""}`}
                type="submit"
                disabled={!isFormValid || submitting}
              >
                {submitting ? "Submitting..." : "Submit Consultation Request"}
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

export default EnterpriseConsultation;
