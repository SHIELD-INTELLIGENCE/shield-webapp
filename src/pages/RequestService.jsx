import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { updateSEO } from "../utils/seoUtils";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const PLANS = [
  {
    id: "starter",
    name: "Starter Plan",
    buildCost: "₹2,499 - ₹3,999 (one-time)",
    monthlyPrice: "₹599 / month",
    quarterlyOffer: "₹1,499 / 3 months",
    savings: "save ₹300",
    features: [
      "Website / product (basic to medium)",
      "Basic SEO",
      "Hosting included",
      "Domain (.in)",
      "99.99% uptime",
      "1 large commit + 3 small changes",
      "Monthly audits & reports",
      "Support with under 24-hour reply",
    ],
  },
  {
    id: "premium",
    name: "Premium Plan",
    badge: "Most Chosen by Growing Businesses",
    buildCost: "₹4,999 - ₹9,999 (one-time)",
    monthlyPrice: "₹1,999 / month",
    quarterlyOffer: "₹4,999 / 3 months",
    savings: "save ₹1,000",
    highlighted: true,
    features: [
      "Professional Website / product (higher standards)",
      "Advanced SEO",
      "Hosting included",
      "Domain (.in or .com)",
      "99.99% uptime",
      "4 large commits + 6 small changes",
      "Monthly audits & reports",
      "Support with under 24-hour reply",
    ],
  },
  {
    id: "elite",
    name: "Elite Plan",
    buildCost: "₹14,999 - ₹29,999 (one-time)",
    monthlyPrice: "₹4,999 / month",
    quarterlyOffer: "₹13,999 / 3 months",
    savings: "save ₹1,000",
    features: [
      "Enterprise-grade product",
      "Advanced SEO & performance optimization",
      "High-availability hosting",
      "Unlimited small changes",
      "Domain (Your choice)",
      "8 large commits per month",
      "Security hardening & backups",
      "Direct founder involvement",
    ],
  },
];

const INITIAL_FORM_DATA = {
  name: "",
  requesterStatus: "",
  email: "",
  date: "",
  serviceType: "",
  projectReference: "",
  requirements: "",
  plan: "",
  billingCycle: "monthly",
  acceptedTerms: false,
  preferredContact: "",
  otherContacts: "",
};

async function submitServiceRequest(formData) {
  await addDoc(collection(db, "serviceRequests"), {
    name: formData.name,
    requesterStatus: formData.requesterStatus,
    email: formData.email,
    date: formData.date,
    serviceType: formData.serviceType,
    projectReference: formData.projectReference,
    requirements: formData.requirements,
    plan: formData.plan,
    billingCycle: formData.billingCycle,
    acceptedTerms: true,
    preferredContact: formData.preferredContact,
    otherContacts: formData.otherContacts,
    createdAt: serverTimestamp(),
    source: "request-service",
  });
}

function RequestService() {
  const [isModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({});
  const formRef = useRef(null);

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.requesterStatus.trim() !== "" &&
    isValidEmail(formData.email) &&
    formData.date !== "" &&
    formData.serviceType !== "" &&
    formData.requirements.trim() !== "" &&
    formData.plan !== "" &&
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
    const saved = localStorage.getItem("shield_service_request_submitted");
    if (saved === "true") {
      setSubmitted(true);
    }
  }, []);

  useEffect(() => {
    updateSEO(
      "Request a Service | SHIELD Intelligence",
      "Request secure software development, digital products, and custom technology solutions from SHIELD Intelligence.",
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

  const scrollToForm = () => {
    if (!formRef.current) return;
    requestAnimationFrame(() => {
      formRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const selectPlanWithCycle = (planName, billingCycle) => {
    setFormData((prev) => ({
      ...prev,
      plan: planName,
      billingCycle,
    }));
    setTouched((prev) => ({
      ...prev,
      plan: true,
    }));
    scrollToForm();
  };

  return (
    <motion.div
      className="request-service-page"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.h1 className="form-title" variants={fadeInUp}>
        Request a Service
      </motion.h1>

      {/* Pricing Plans Section */}
      <motion.div className="pricing-plans-section" variants={fadeInUp}>
        <h2 className="pricing-plans-title">Choose Your Plan</h2>
        <p className="pricing-plans-subtitle">
          Select a plan that fits your needs
        </p>

        <div className="pricing-plans-grid">
          {PLANS.map((plan) => {
            const isSelectedPlan = formData.plan === plan.name;
            const monthlySelected = isSelectedPlan && formData.billingCycle === "monthly";
            const quarterlySelected =
              isSelectedPlan && formData.billingCycle === "quarterly";

            return (
              <div
                key={plan.id}
                className={`pricing-plan-card ${plan.highlighted ? "highlighted" : ""} ${
                  isSelectedPlan ? "selected" : ""
                }`}
              >
                <div className="pricing-plan-header">
                  <h3 className="pricing-plan-name">{plan.name}</h3>
                  {plan.badge && <p className="pricing-plan-badge">{plan.badge}</p>}
                  <p className="pricing-plan-build-cost">Build Cost: {plan.buildCost}</p>
                  <p className="pricing-plan-monthly">{plan.monthlyPrice}</p>
                  <div className="pricing-plan-offer">
                    Special: {plan.quarterlyOffer} ({plan.savings})
                  </div>
                </div>

                <ul className="pricing-plan-features">
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>

                <div className="pricing-plan-actions">
                  <button
                    type="button"
                    className="pricing-plan-button"
                    onClick={() => selectPlanWithCycle(plan.name, "monthly")}
                  >
                    {monthlySelected ? "Monthly Selected" : "Choose Monthly"}
                  </button>
                  <button
                    type="button"
                    className="pricing-plan-button"
                    onClick={() => selectPlanWithCycle(plan.name, "quarterly")}
                  >
                    {quarterlySelected ? "Special Offer Selected" : "Choose Special Offer"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      <motion.div className="form-layout" variants={fadeInUp} ref={formRef}>
        {/* Left: Content Column */}
        <div className="form-info-column">
          <div className="form-info-card">
            <h3 className="form-info-title">Current Services</h3>
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
                  localStorage.removeItem("shield_service_request_submitted");
                  setSubmitted(false);
                  setTouched({});
                  setSubmitting(false);
                  setFormData(INITIAL_FORM_DATA);
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
                  localStorage.setItem("shield_service_request_submitted", "true");
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
                className={`form-input ${hasError("name") ? "input-error" : ""}`}
                value={formData.name}
                onBlur={() => handleBlur("name")}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Full Name"
              />

              <label className="form-label">Status</label>
              <input
                className={`form-input ${hasError("requesterStatus") ? "input-error" : ""}`}
                value={formData.requesterStatus}
                onBlur={() => handleBlur("requesterStatus")}
                onChange={(e) => updateField("requesterStatus", e.target.value)}
                placeholder="Student, Professional, etc."
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

              <label className="form-label">Other Contacts (Optional)</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={formData.otherContacts}
                onChange={(e) => updateField("otherContacts", e.target.value)}
                placeholder="Provide additional contact details, if any (e.g., alternate phone, email, etc.)"
              />
              <label className="form-label">Date</label>
              <input
                type="date"
                className={`form-input ${hasError("date") ? "input-error" : ""}`}
                value={formData.date}
                onBlur={() => handleBlur("date")}
                onChange={(e) => updateField("date", e.target.value)}
              />

              <hr className="form-divider-second" />
              <h3 className="form-section-title">Service Details</h3>
              <label className="form-label">Service Type</label>
              <select
                className={`form-input ${hasError("serviceType") ? "input-error" : ""}`}
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
                placeholder="Explain your request clearly... or write 'To be discussed' if you want to discuss details later."
              />

              <hr className="form-divider-second" />
              <h3 className="form-section-title">Plan & Contact</h3>
              <label className="form-label">Selected Plan</label>
              <select
                className={`form-input ${
                  hasError("plan") ? "input-error" : ""
                }`}
                value={formData.plan}
                onBlur={() => handleBlur("plan")}
                onChange={(e) => {
                  const selectedPlan = e.target.value;
                  updateField("plan", selectedPlan);
                  if (selectedPlan === "To be discussed") {
                    updateField("billingCycle", "");
                  } else if (!formData.billingCycle) {
                    updateField("billingCycle", "monthly");
                  }
                }}
              >
                <option value="">Select a Plan</option>
                {PLANS.map((plan) => (
                  <option key={plan.id} value={plan.name}>
                    {plan.name}
                  </option>
                ))}
                <option>To be discussed</option>
              </select>

              <label className="form-label">Billing Cycle</label>
              <select
                className="form-input"
                value={formData.billingCycle}
                onChange={(e) => updateField("billingCycle", e.target.value)}
                disabled={formData.plan === "" || formData.plan === "To be discussed"}
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly (Special Offer)</option>
              </select>

              <label className="form-label">Preferred Contact Method</label>
              <select
                className={`form-input ${hasError("preferredContact") ? "input-error" : ""}`}
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
                <div className="form-error-text">Required</div>
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
