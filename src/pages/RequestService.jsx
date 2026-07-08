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
      "Static Website / Basic Landing Page",
      "Basic SEO",
      "Hosting included",
      "Domain (.in)",
      "Reliable hosting and monitoring",
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
      "Advanced SEO with google prescence",
      "Hosting included",
      "Domain (.in or .com)",
      "Reliable hosting and monitoring",
      "4 major updates + 6 small changes",
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
      "Advanced SEO with google prescence & performance optimization",
      "High-availability hosting",
      "Unlimited small changes",
      "Domain (Your choice)",
      "8 major updates per month",
      "Security hardening & backups",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise Plan",
    badge: "Custom Solutions",
    buildCost: "Custom (To be discussed)",
    monthlyPrice: "Custom pricing",
    quarterlyOffer: "Custom pricing",
    savings: "negotiated",
    highlighted: false,
    features: [
      "Fully custom software product",
      "Dedicated project manager & development team",
      "Custom integrations with existing systems",
      "Advanced security & compliance",
      "10 major updates per month + unlimited small changes",
      "99.9% uptime SLA with priority support",
      "Custom domain, hosting, and infrastructure",
      "Ongoing consultation & strategic planning",
      "Quarterly business reviews & roadmap planning",
    ],
  },
];

const INITIAL_FORM_DATA = {
  name: "",
  email: "",
  date: "",
  projectReference: "",
  requirements: "",
  plan: "",
  billingCycle: "monthly",
  acceptedTerms: false,
  country: "",
  billingName: "",
  currency: "INR",
  preferredContact: "",
  otherContacts: "",
};

async function submitServiceRequest(formData) {
  await addDoc(collection(db, "serviceRequests"), {
    name: formData.name,
    email: formData.email,
    date: formData.date,
    projectReference: formData.projectReference,
    requirements: formData.requirements,
    plan: formData.plan,
    billingCycle: formData.billingCycle,
    acceptedTerms: formData.acceptedTerms === true,
    country: formData.country,
    billingName: formData.billingName || null,
    currency: formData.currency,
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
  const comparisonRef = useRef(null);

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isFormValid =
    formData.name.trim() !== "" &&
    isValidEmail(formData.email) &&
    formData.date !== "" &&
    formData.country.trim() !== "" &&
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

  const scrollToComparison = () => {
    if (!comparisonRef.current) return;
    requestAnimationFrame(() => {
      comparisonRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
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

        <p className="pricing-plans-disclaimer">
          Final build pricing depends on project scope, complexity, integrations,
          and hosting requirements. All pricing shown is indicative and subject
          to review.
        </p>

        <div className="pricing-plans-advantage" role="note" aria-label="First month free notice">
          <span className="pricing-plans-advantage-label">Exclusive advantage</span>
          <p className="pricing-plans-advantage-text">
            First month is <span className="pricing-plans-advantage-emphasis">FREE</span> if SHIELD builds your website <span className="pricing-plans-advantage-emphasis">from scratch</span>. <span className="pricing-plans-advantage-muted">Not applicable for pre-built projects.</span>
          </p>
        </div>

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

          <div className="pricing-comparison-btn-wrapper">
            <button
              type="button"
              className="pricing-comparison-btn"
              onClick={scrollToComparison}
            >
              See Details About These Plans
            </button>
          </div>
      </motion.div>

      {/* Comparison Table Section */}
      <motion.div
        className="pricing-comparison-section"
        variants={fadeInUp}
        ref={comparisonRef}
      >
        <h2 className="pricing-comparison-title">Plan Comparison</h2>
        <p className="pricing-comparison-subtitle">
          Compare features across all plans
        </p>

        <div className="pricing-comparison-table-wrapper">
          <table className="pricing-comparison-table">
            <thead>
              <tr>
                <th className="comparison-header-feature">Feature</th>
                <th>Starter</th>
                <th className="comparison-highlight">Premium</th>
                <th>Elite</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="comparison-feature-name">Static Pages</td>
                <td><span className="comparison-check">&#10003;</span></td>
                <td className="comparison-highlight"><span className="comparison-check">&#10003;</span></td>
                <td><span className="comparison-check">&#10003;</span></td>
              </tr>
              <tr>
                <td className="comparison-feature-name">Contact Form</td>
                <td><span className="comparison-check">&#10003;</span></td>
                <td className="comparison-highlight"><span className="comparison-check">&#10003;</span></td>
                <td><span className="comparison-check">&#10003;</span></td>
              </tr>
              <tr>
                <td className="comparison-feature-name">Blog</td>
                <td><span className="comparison-check">&#10003;</span></td>
                <td className="comparison-highlight"><span className="comparison-check">&#10003;</span></td>
                <td><span className="comparison-check">&#10003;</span></td>
              </tr>
              <tr>
                <td className="comparison-feature-name">CMS</td>
                <td><span className="comparison-cross">&#10007;</span></td>
                <td className="comparison-highlight"><span className="comparison-check">&#10003;</span></td>
                <td><span className="comparison-check">&#10003;</span></td>
              </tr>
              <tr>
                <td className="comparison-feature-name">Authentication</td>
                <td><span className="comparison-cross">&#10007;</span></td>
                <td className="comparison-highlight"><span className="comparison-check">&#10003;</span></td>
                <td><span className="comparison-check">&#10003;</span></td>
              </tr>
              <tr>
                <td className="comparison-feature-name">Dashboard</td>
                <td><span className="comparison-cross">&#10007;</span></td>
                <td className="comparison-highlight"><span>Limited</span></td>
                <td><span className="comparison-check">&#10003;</span></td>
              </tr>
              <tr>
                <td className="comparison-feature-name">Payments</td>
                <td><span className="comparison-cross">&#10007;</span></td>
                <td className="comparison-highlight"><span>Optional</span></td>
                <td><span className="comparison-check">&#10003;</span></td>
              </tr>
              <tr>
                <td className="comparison-feature-name">Custom Backend</td>
                <td><span className="comparison-cross">&#10007;</span></td>
                <td className="comparison-highlight"><span>Limited</span></td>
                <td><span className="comparison-check">&#10003;</span></td>
              </tr>
              <tr>
                <td className="comparison-feature-name">User Roles</td>
                <td><span className="comparison-cross">&#10007;</span></td>
                <td className="comparison-highlight"><span className="comparison-cross">&#10007;</span></td>
                <td><span className="comparison-check">&#10003;</span></td>
              </tr>
              <tr>
                <td className="comparison-feature-name">API Integrations</td>
                <td><span className="comparison-cross">&#10007;</span></td>
                <td className="comparison-highlight"><span>1&ndash;2</span></td>
                <td><span>Unlimited</span></td>
              </tr>
              <tr>
                <td className="comparison-feature-name">Major Updates / Month</td>
                <td>1</td>
                <td className="comparison-highlight">4</td>
                <td>8</td>
              </tr>
              <tr>
                <td className="comparison-feature-name">Minor Changes / Month</td>
                <td>3</td>
                <td className="comparison-highlight">6</td>
                <td>Unlimited</td>
              </tr>
              <tr>
                <td className="comparison-feature-name">Hosting Included</td>
                <td><span className="comparison-check">&#10003;</span></td>
                <td className="comparison-highlight"><span className="comparison-check">&#10003;</span></td>
                <td><span className="comparison-check">&#10003;</span></td>
              </tr>
              <tr>
                <td className="comparison-feature-name">Domain Included</td>
                <td>.in</td>
                <td className="comparison-highlight">.in / .com</td>
                <td>Client Choice</td>
              </tr>
              <tr>
                <td className="comparison-feature-name">Support Response</td>
                <td>&lt;24h</td>
                <td className="comparison-highlight">&lt;24h</td>
                <td>Priority</td>
              </tr>
              <tr>
                <td className="comparison-feature-name">Monthly Audit Report</td>
                <td><span className="comparison-check">&#10003;</span></td>
                <td className="comparison-highlight"><span className="comparison-check">&#10003;</span></td>
                <td><span className="comparison-check">&#10003;</span></td>
              </tr>
              <tr>
                <td className="comparison-feature-name">Security Hardening</td>
                <td><span className="comparison-cross">&#10007;</span></td>
                <td className="comparison-highlight"><span>Limited</span></td>
                <td><span className="comparison-check">&#10003;</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        className="enterprise-callout"
        variants={fadeInUp}
        style={{
          background: "rgba(202,169,76,0.06)",
          border: "1px solid rgba(202,169,76,0.25)",
          borderRadius: 12,
          padding: "28px 32px",
          marginTop: 32,
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#caa94c", margin: "0 0 8px" }}>
          Looking for Enterprise Solutions?
        </h2>
        <p style={{ color: "#d4d4d4", margin: "0 0 16px", maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
          If you need custom architecture, security audits, strategic
          consultation, or large-scale systems, submit an enterprise consultation
          request.
        </p>
        <Link
          to="/enterprise-consultation"
          className="bw-btn"
          style={{ display: "inline-block", textDecoration: "none" }}
        >
          Request Enterprise Consultation
        </Link>
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

              <label className="form-label">Country</label>
              <input
                className={`form-input ${hasError("country") ? "input-error" : ""}`}
                value={formData.country}
                onBlur={() => handleBlur("country")}
                onChange={(e) => updateField("country", e.target.value)}
                placeholder="Country (required for billing and international clients)"
              />

              <label className="form-label">Billing Name</label>
              <input
                className="form-input"
                value={formData.billingName}
                onChange={(e) => updateField("billingName", e.target.value)}
                placeholder="Optional billing / invoice name"
              />

              <label className="form-label">Currency</label>
              <select
                className="form-input"
                value={formData.currency}
                onChange={(e) => updateField("currency", e.target.value)}
              >
                <option value="INR">INR - Indian Rupee</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="AED">AED - UAE Dirham</option>
              </select>

              <hr className="form-divider-second" />
              <h3 className="form-section-title">Service Details</h3>
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
