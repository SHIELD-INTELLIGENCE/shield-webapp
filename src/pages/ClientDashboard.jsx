import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { jsPDF } from "jspdf";
import { updateSEO } from "../utils/seoUtils";

function formatCurrency(amount) {
  const num = Number(amount);
  if (Number.isNaN(num)) return "—";
  return "INR " + num.toLocaleString("en-IN");
}

function formatDate(value) {
  if (!value) return "—";
  const d = value.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    year: "numeric", month: "short", day: "numeric",
  });
}

const SECTIONS = {
  dashboard: "Dashboard",
  requests: "My Requests",
  invoices: "My Invoices",
  profile: "Profile",
};

const STATUS_STYLES = {
  pending: { bg: "rgba(245,158,11,0.15)", color: "#fbbf24" },
  "in-review": { bg: "rgba(96,165,250,0.15)", color: "#93c5fd" },
  contacted: { bg: "rgba(52,211,153,0.15)", color: "#6ee7b7" },
  approved: { bg: "rgba(34,197,94,0.15)", color: "#4ade80" },
  rejected: { bg: "rgba(239,68,68,0.15)", color: "#fca5a5" },
  "on-hold": { bg: "rgba(168,85,247,0.15)", color: "#c4b5fd" },
};

function getStatusStyle(status) {
  return STATUS_STYLES[status] || { bg: "rgba(107,114,128,0.15)", color: "#d1d5db" };
}

const BUDGET_LABELS = {
  "under-1l": "Under ₹1,00,000",
  "1l-5l": "₹1,00,000 - ₹5,00,000",
  "5l-10l": "₹5,00,000 - ₹10,00,000",
  "10l-25l": "₹10,00,000 - ₹25,00,000",
  "25l+": "₹25,00,000+",
  "not-sure": "To be discussed",
};

const TIMELINE_LABELS = {
  urgent: "ASAP (Within 1 month)",
  short: "1-3 months",
  medium: "3-6 months",
  long: "6+ months",
  planning: "Still planning",
};

async function buildInvoicePdf(invoice) {
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const pw = pdf.internal.pageSize.getWidth();
  const ph = pdf.internal.pageSize.getHeight();
  const m = 16;
  const cw = pw - m * 2;

  pdf.setFillColor(18, 18, 18);
  pdf.rect(0, 0, pw, ph, "F");
  pdf.setFillColor(202, 169, 76);
  pdf.rect(0, 0, pw, 3, "F");

  // Logo
  let shieldLogoB64 = null;
  try {
    const resp = await fetch("/logo.png");
    if (resp.ok) {
      const blob = await resp.blob();
      shieldLogoB64 = await new Promise(resolve => {
        const r = new FileReader();
        r.onloadend = () => resolve(r.result.split(",", 2)[1]);
        r.readAsDataURL(blob);
      });
    }
  } catch (e) { /* logo unavailable */ }
  if (shieldLogoB64) {
    try { pdf.addImage(shieldLogoB64, "PNG", m, 10, 18, 18); } catch (e) { console.warn("PDF logo failed:", e); }
  }

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);
  pdf.setTextColor(202, 169, 76);
  pdf.text("SHIELD INTELLIGENCE", m + 24, 18);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(202, 169, 76);
  pdf.text("Securing Tomorrow with Strategic Intelligence.", m + 24, 24);
  pdf.setFontSize(7);
  pdf.setTextColor(140, 140, 140);
  pdf.text("SHIELD Intelligence | queriesshield@gmail.com", m + 24, 29);
  pdf.text("Haldwani, Uttarakhand, India", m + 24, 33);

  pdf.setDrawColor(202, 169, 76);
  pdf.setLineWidth(0.4);
  pdf.line(m, 38, pw - m, 38);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(26);
  pdf.setTextColor(202, 169, 76);
  pdf.text("INVOICE", m, 56);

  const metaX = pw - m;
  const created = invoice.createdAt?.toDate ? invoice.createdAt.toDate() : new Date(invoice.createdAt || new Date());
  const dateStr = formatDate(created.toISOString());

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(160, 160, 160);
  pdf.text("Invoice ID:", metaX, 50, { align: "right" });
  pdf.setTextColor(220, 220, 220);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text(invoice.invoiceId || "—", metaX, 56, { align: "right" });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(160, 160, 160);
  pdf.text("Date Issued:", metaX, 64, { align: "right" });
  pdf.setTextColor(220, 220, 220);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text(dateStr, metaX, 70, { align: "right" });

  const isPaid = String(invoice.status || "").toLowerCase() === "paid";
  const badgeText = isPaid ? "PAID" : "UNPAID";
  pdf.setFillColor(...(isPaid ? [21, 128, 61] : [180, 100, 20]));
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  const bw = pdf.getTextWidth(badgeText) + 10;
  pdf.roundedRect(metaX - bw, 74, bw, 6, 2, 2, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.text(badgeText, metaX - bw / 2, 74 + 4.5, { align: "center" });

  let cy = 92;
  pdf.setFillColor(30, 30, 30);
  pdf.roundedRect(m, cy, cw, 24, 4, 4, "F");
  pdf.setDrawColor(202, 169, 76, 0.25);
  pdf.roundedRect(m, cy, cw, 24, 4, 4, "S");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(202, 169, 76);
  pdf.text("BILL TO", m + 12, cy + 8);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(220, 220, 220);
  pdf.text(invoice.clientName || "—", m + 12, cy + 18);
  pdf.setFontSize(8);
  pdf.setTextColor(160, 160, 160);
  if (invoice.clientEmail) pdf.text(invoice.clientEmail, m + 12, cy + 26);

  cy += 32;
  pdf.setFillColor(40, 40, 40);
  pdf.rect(m, cy, cw, 11, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.setTextColor(202, 169, 76);
  pdf.text("DESCRIPTION", m + 12, cy + 8);
  pdf.text("AMOUNT", metaX - 12, cy + 8, { align: "right" });

  cy += 11;
  pdf.setFillColor(24, 24, 24);
  pdf.rect(m, cy, cw, 13, "F");
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(220, 220, 220);
  pdf.text(invoice.planName || "Service", m + 12, cy + 9);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(202, 169, 76);
  pdf.text(formatCurrency(invoice.amount), metaX - 12, cy + 9, { align: "right" });

  cy += 13;
  pdf.setFillColor(40, 40, 40);
  pdf.rect(m, cy, cw, 11, "F");
  pdf.setDrawColor(202, 169, 76, 0.5);
  pdf.line(m, cy, pw - m, cy);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(202, 169, 76);
  pdf.text("TOTAL", m + 12, cy + 8);
  pdf.setFontSize(11);
  pdf.text(formatCurrency(invoice.amount), metaX - 12, cy + 8, { align: "right" });

  cy += 17;
  pdf.setFillColor(30, 30, 30);
  pdf.roundedRect(m, cy, cw, 22, 4, 4, "F");
  pdf.setDrawColor(202, 169, 76, 0.2);
  pdf.roundedRect(m, cy, cw, 22, 4, 4, "S");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(202, 169, 76);
  pdf.text("PAYMENT INFORMATION", m + 12, cy + 8);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(160, 160, 160);
  pdf.text("Method: " + (invoice.paymentMethod || "—"), m + 12, cy + 17);
  pdf.text("Reference: " + (invoice.transactionReference || "—"), metaX - 12, cy + 17, { align: "right" });

  pdf.setDrawColor(202, 169, 76, 0.3);
  pdf.setLineWidth(0.3);
  pdf.line(m, ph - 24, pw - m, ph - 24);
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(8);
  pdf.setTextColor(120, 120, 120);
  pdf.text("SHIELD Intelligence — Building secure software, authentication tools, and privacy-focused digital systems.", m, ph - 18);
  pdf.text("Contact: queriesshield@gmail.com", m, ph - 13);
  pdf.setTextColor(202, 169, 76, 0.5);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.text("Thank you for your business", metaX, ph - 13, { align: "right" });
  pdf.setFillColor(202, 169, 76);
  pdf.rect(0, ph - 2, pw, 2, "F");
  pdf.save((invoice.invoiceId || "SHIELD-invoice") + ".pdf");
}

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firestoreUser, setFirestoreUser] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [serviceRequests, setServiceRequests] = useState([]);
  const [enterpriseRequests, setEnterpriseRequests] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    updateSEO(
      "Client Dashboard | SHIELD Intelligence",
      "Manage your service requests, invoices, and account settings.",
    );
  }, []);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      if (!u) { navigate("/login", { replace: true }); return; }
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const userRef = doc(db, "users", user.email);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setFirestoreUser({ docId: userSnap.id, ...data });
          if (data.role === "admin") {
            window.location.href = process.env.ADMIN_URL || "https://shielddashboard.netlify.app";
          }
        }
      } catch (e) { console.error("Failed to fetch user data:", e); }
    })();
  }, [user]);

  useEffect(() => {
    if (!user?.email) return;
    setDataLoading(true);
    (async () => {
      try {
        const [srSnap, erSnap, invSnap] = await Promise.all([
          getDocs(query(collection(db, "serviceRequests"), where("assignedUserId", "==", user.email))),
          getDocs(query(collection(db, "enterpriseConsultations"), where("assignedUserId", "==", user.email))),
          getDocs(collection(db, "invoices")),
        ]);
        const srList = []; srSnap.forEach((d) => srList.push({ id: d.id, ...d.data() }));
        const erList = []; erSnap.forEach((d) => erList.push({ id: d.id, ...d.data() }));
        setServiceRequests(srList);
        setEnterpriseRequests(erList);
        const assignedIds = new Set([...srList.map((r) => r.id), ...erList.map((r) => r.id)]);
        const invList = [];
        invSnap.forEach((d) => { const data = { id: d.id, ...d.data() }; if (data.requestId && assignedIds.has(data.requestId)) invList.push(data); });
        setInvoices(invList);
      } catch (e) { console.error("Failed to load dashboard data:", e); }
      finally { setDataLoading(false); }
    })();
  }, [user]);

  const handleLogout = async () => {
    try { await signOut(auth); navigate("/", { replace: true }); }
    catch (e) { console.error("Logout error:", e); }
  };

  if (loading) {
    return <div className="shield-logout-screen"><div className="shield-logout-spinner" /></div>;
  }

  const isAdmin = firestoreUser?.role === "admin";
  if (isAdmin) {
    window.location.href = process.env.ADMIN_URL || "https://shielddashboard.netlify.app";
    return null;
  }

  const name = firestoreUser?.displayName || firestoreUser?.name || user?.displayName || user?.email?.split("@")[0] || "User";
  const email = user?.email || "—";
  const role = firestoreUser?.role || "user";

  const allRequests = [
    ...serviceRequests.map((r) => ({ ...r, _type: "Service" })),
    ...enterpriseRequests.map((r) => ({ ...r, _type: "Enterprise" })),
  ].sort((a, b) => {
    const aTime = a.createdAt?.toDate?.()?.getTime() || a.createdAt || 0;
    const bTime = b.createdAt?.toDate?.()?.getTime() || b.createdAt || 0;
    return bTime - aTime;
  });

  const invoicesByRequest = {};
  invoices.forEach((inv) => {
    const rid = inv.requestId;
    if (!rid) return;
    if (!invoicesByRequest[rid]) invoicesByRequest[rid] = [];
    invoicesByRequest[rid].push(inv);
  });

  function getPaymentInfo(reqId) {
    const reqInvoices = invoicesByRequest[reqId];
    if (!reqInvoices || reqInvoices.length === 0) return null;
    const sorted = [...reqInvoices].sort((a, b) => {
      const aTime = a.createdAt?.toDate?.()?.getTime() || a.createdAt || 0;
      const bTime = b.createdAt?.toDate?.()?.getTime() || b.createdAt || 0;
      return bTime - aTime;
    });
    const latest = sorted[0];
    const isPaid = String(latest.status || "").toLowerCase() === "paid";
    return { latest, isPaid, total: sorted.length, unpaidCount: sorted.filter((i) => String(i.status || "").toLowerCase() !== "paid").length };
  }

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "requests", label: "My Requests" },
    { id: "invoices", label: "My Invoices" },
    { id: "profile", label: "Profile" },
  ];

  const goldBorder = "1px solid rgba(202, 169, 76, 0.3)";
  const goldGlow = "0 0 12px rgba(202, 169, 76, 0.25)";
  const cardBg = "rgba(26, 26, 26, 0.85)";

  function getDaysRemaining(dateVal) {
    if (!dateVal) return null;
    const d = dateVal.toDate ? dateVal.toDate() : new Date(dateVal);
    if (Number.isNaN(d.getTime())) return null;
    const diff = d.getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  function getBillingCycleLabel(req) {
    const cycle = (req.billingCycle || "").toLowerCase();
    if (cycle.includes("year")) return "/year";
    if (cycle.includes("quarter")) return "/quarter";
    if (cycle.includes("month")) return "/month";
    return "/month";
  }

  function getRenewalStatus(days) {
    if (days === null) return null;
    if (days <= 0) return { label: "Expired", color: "#fca5a5", bg: "rgba(239,68,68,0.15)" };
    if (days <= 7) return { label: `${days}d remaining`, color: "#fb923c", bg: "rgba(249,115,22,0.15)" };
    if (days <= 14) return { label: `${days}d remaining`, color: "#fbbf24", bg: "rgba(245,158,11,0.15)" };
    if (days <= 30) return { label: `${days}d remaining`, color: "#a7f3d0", bg: "rgba(52,211,153,0.12)" };
    return { label: `Active (${days}d)`, color: "#6ee7b7", bg: "rgba(34,197,94,0.1)" };
  }

  // ─── SECTION RENDERERS ───

  function renderDashboard() {
    const pendingPayments = invoices.filter((inv) => String(inv.status || "").toLowerCase() !== "paid").length;
    const req = allRequests[0];
    const latestReq = req;
    const isEnt = latestReq?._type === "Enterprise";
    const days = latestReq ? getDaysRemaining(latestReq.billingEndDate) : null;
    const renewal = getRenewalStatus(days);
    const pay = latestReq ? getPaymentInfo(latestReq.id) : null;
    const credits = latestReq?.credits || {};

    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        {/* Welcome Card */}
        <div style={{ background: cardBg, border: goldBorder, borderRadius: 12, padding: 28, marginBottom: 24, boxShadow: goldGlow }}>
          <h2 style={{ margin: "0 0 4px", color: "#caa94c", fontSize: "1.6rem", textShadow: "0 0 8px rgba(202, 169, 76, 0.3)" }}>
            Welcome back, {name}
          </h2>
          <p style={{ margin: 0, color: "rgba(250,250,250,0.7)", fontSize: "0.9rem" }}>
            {email} &middot; {role.toUpperCase()}
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Service Requests", count: serviceRequests.length },
            { label: "Enterprise Requests", count: enterpriseRequests.length },
            { label: "Invoices", count: invoices.length },
            { label: "Pending Payments", count: pendingPayments },
          ].map((s) => (
            <div key={s.label} style={{ background: cardBg, border: goldBorder, borderRadius: 10, padding: "18px 20px", boxShadow: goldGlow }}>
              <div style={{ color: "#caa94c", fontSize: "1.8rem", fontWeight: 700 }}>{s.count}</div>
              <div style={{ color: "rgba(250,250,250,0.65)", fontSize: "0.82rem", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Only show detailed cards if there's an active request */}
        {latestReq && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 24 }}>
            {/* Current Plan */}
            <div style={{ background: cardBg, border: goldBorder, borderRadius: 10, padding: 20, boxShadow: goldGlow }}>
              <div style={{ color: "rgba(202,169,76,0.6)", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Current Plan</div>
              <div style={{ color: "#fafafa", fontSize: "1.15rem", fontWeight: 700 }}>{latestReq.plan || (isEnt ? "Enterprise" : "—")}</div>
              {latestReq.billingCycle && (
                <div style={{ color: "rgba(250,250,250,0.55)", fontSize: "0.82rem", marginTop: 2 }}>
                  {latestReq.billingCycle}{latestReq.customMonthlyPrice ? ` — ${formatCurrency(latestReq.customMonthlyPrice)}${getBillingCycleLabel(latestReq)}` : ""}
                </div>
              )}
            </div>

            {/* Project Status */}
            <div style={{ background: cardBg, border: goldBorder, borderRadius: 10, padding: 20, boxShadow: goldGlow }}>
              <div style={{ color: "rgba(202,169,76,0.6)", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Project Status</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ ...getStatusStyle(latestReq.status), padding: "4px 12px", borderRadius: 6, fontSize: "0.82rem", fontWeight: 600 }}>
                  {latestReq.status || "pending"}
                </span>
                {latestReq.lifecyclePhase && (
                  <span style={{ fontSize: "0.72rem", padding: "3px 10px", borderRadius: 6, background: "rgba(147,51,234,0.15)", color: "#c4b5fd", fontWeight: 600 }}>
                    {latestReq.lifecyclePhase}
                  </span>
                )}
              </div>
            </div>

            {/* Website Status */}
            <div style={{ background: cardBg, border: goldBorder, borderRadius: 10, padding: 20, boxShadow: goldGlow }}>
              <div style={{ color: "rgba(202,169,76,0.6)", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Website</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                {latestReq.websiteStatus && (
                  <span style={{
                    padding: "3px 10px", borderRadius: 6, fontSize: "0.78rem", fontWeight: 600,
                    ...(latestReq.websiteStatus === "live" ? { background: "rgba(34,197,94,0.15)", color: "#4ade80" } : {}),
                    ...(latestReq.websiteStatus === "paused" ? { background: "rgba(168,85,247,0.15)", color: "#c4b5fd" } : {}),
                    ...(latestReq.websiteStatus === "building" ? { background: "rgba(96,165,250,0.15)", color: "#93c5fd" } : {}),
                    ...(latestReq.websiteStatus === "maintenance" ? { background: "rgba(245,158,11,0.15)", color: "#fbbf24" } : {}),
                  }}>
                    {latestReq.websiteStatus === "live" ? "Website Live" :
                     latestReq.websiteStatus === "paused" ? "Website Paused" :
                     latestReq.websiteStatus === "maintenance" ? "Maintenance Active" :
                     latestReq.websiteStatus}
                  </span>
                )}
                {latestReq.isPaused && (
                  <span style={{ fontSize: "0.72rem", padding: "3px 10px", borderRadius: 6, background: "rgba(239,68,68,0.12)", color: "#fca5a5", fontWeight: 600 }}>
                    Paused
                  </span>
                )}
              </div>
            </div>

            {/* Maintenance */}
            <div style={{ background: cardBg, border: goldBorder, borderRadius: 10, padding: 20, boxShadow: goldGlow }}>
              <div style={{ color: "rgba(202,169,76,0.6)", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Maintenance</div>
              {latestReq.customMonthlyPrice ? (
                <>
                  <div style={{ color: "#fafafa", fontSize: "1rem", fontWeight: 600 }}>{formatCurrency(latestReq.customMonthlyPrice)}{getBillingCycleLabel(latestReq)}</div>
                  <div style={{ color: "rgba(250,250,250,0.55)", fontSize: "0.78rem", marginTop: 2 }}>Credits: {credits.largeCommits || 0} large / {credits.smallChanges ?? "∞"} small</div>
                </>
              ) : latestReq.plan ? (
                <div style={{ color: "rgba(250,250,250,0.55)", fontSize: "0.82rem" }}>Included in plan</div>
              ) : (
                <div style={{ color: "rgba(250,250,250,0.35)", fontSize: "0.82rem" }}>—</div>
              )}
            </div>

            {/* Payment Status */}
            <div style={{ background: cardBg, border: goldBorder, borderRadius: 10, padding: 20, boxShadow: goldGlow }}>
              <div style={{ color: "rgba(202,169,76,0.6)", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Payment</div>
              {pay ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div>
                    <span style={{ fontSize: "0.82rem", padding: "3px 10px", borderRadius: 6, fontWeight: 600,
                      background: pay.isPaid ? "rgba(34,197,94,0.15)" : "rgba(249,115,22,0.15)",
                      color: pay.isPaid ? "#4ade80" : "#fb923c" }}>
                      {pay.isPaid ? "All Paid" : "Payment Pending"}
                    </span>
                  </div>
                  {!pay.isPaid && (
                    <div style={{ color: "#fb923c", fontSize: "0.85rem", fontWeight: 600 }}>
                      {pay.unpaidCount} unpaid invoice{pay.unpaidCount > 1 ? "s" : ""}
                    </div>
                  )}
                  <div style={{ color: "rgba(250,250,250,0.5)", fontSize: "0.75rem" }}>
                    {pay.total} invoice{pay.total > 1 ? "s" : ""} total
                  </div>
                </div>
              ) : (
                <div style={{ color: "rgba(250,250,250,0.35)", fontSize: "0.82rem" }}>No invoices yet</div>
              )}
            </div>

            {/* Billing Cycle & Renewal */}
            <div style={{ background: cardBg, border: goldBorder, borderRadius: 10, padding: 20, boxShadow: goldGlow }}>
              <div style={{ color: "rgba(202,169,76,0.6)", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Billing</div>
              {latestReq.billingCycle && (
                <div style={{ color: "#fafafa", fontSize: "0.9rem" }}>
                  {latestReq.billingCycle}
                </div>
              )}
              {latestReq.billingStartDate && (
                <div style={{ color: "rgba(250,250,250,0.5)", fontSize: "0.78rem", marginTop: 4 }}>
                  Next billing: {formatDate(latestReq.billingEndDate)}
                </div>
              )}
              {renewal && (
                <div style={{ marginTop: 8 }}>
                  <span style={{ fontSize: "0.78rem", padding: "4px 12px", borderRadius: 6, fontWeight: 600,
                    background: renewal.bg, color: renewal.color }}>
                    {renewal.label}
                  </span>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            {allRequests.length > 0 && (
              <div style={{ background: cardBg, border: goldBorder, borderRadius: 10, padding: 20, boxShadow: goldGlow, gridColumn: "1 / -1" }}>
                <h3 style={{ margin: "0 0 12px", color: "#caa94c", fontSize: "1rem", textShadow: "0 0 6px rgba(202, 169, 76, 0.2)" }}>Recent Activity</h3>
                {allRequests.slice(0, 5).map((r) => {
                  const st = getStatusStyle(r.status);
                  const pi = getPaymentInfo(r.id);
                  return (
                    <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer" }}
                      onClick={() => { setSelectedRequest(r); setActiveSection("requests"); }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: "#fafafa", fontWeight: 600, fontSize: "0.9rem" }}>{r.projectTitle || r.name || r.companyName || r._type + " Request"}</div>
                        <div style={{ color: "rgba(250,250,250,0.5)", fontSize: "0.78rem", marginTop: 2 }}>{r._type} &middot; {r.plan || "—"}</div>
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        {pi && (
                          <span style={{ fontSize: "0.7rem", padding: "2px 8px", borderRadius: 4, background: pi.isPaid ? "rgba(34,197,94,0.15)" : "rgba(249,115,22,0.15)", color: pi.isPaid ? "#4ade80" : "#fb923c" }}>
                            {pi.isPaid ? "Paid" : `Pending${pi.unpaidCount > 1 ? ` (${pi.unpaidCount})` : ""}`}
                          </span>
                        )}
                        <span style={{ background: st.bg, color: st.color, padding: "3px 10px", borderRadius: 6, fontSize: "0.75rem", fontWeight: 600 }}>{r.status || "pending"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {allRequests.length === 0 && (
          <div style={{ background: cardBg, border: goldBorder, borderRadius: 10, padding: 40, textAlign: "center", color: "rgba(250,250,250,0.5)" }}>
            No requests assigned yet. When a SHIELD admin assigns a service to you, it will appear here.
          </div>
        )}
      </motion.div>
    );
  }

  function renderRequestDetail(req) {
    if (!req) return null;
    const credits = req.credits || {};
    const isEnt = req._type === "Enterprise";
    const reqInvoices = invoicesByRequest[req.id] || [];
    const sortedInvoices = [...reqInvoices].sort((a, b) => {
      const aTime = a.createdAt?.toDate?.()?.getTime() || a.createdAt || 0;
      const bTime = b.createdAt?.toDate?.()?.getTime() || b.createdAt || 0;
      return bTime - aTime;
    });
    const pay = getPaymentInfo(req.id);
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <button onClick={() => setSelectedRequest(null)}
          style={{ background: "transparent", border: goldBorder, borderRadius: 6, padding: "8px 16px", color: "#caa94c", cursor: "pointer", marginBottom: 16, fontSize: "0.85rem" }}>
          &larr; Back to Requests
        </button>
        <div style={{ background: cardBg, border: pay && !pay.isPaid ? "1px solid rgba(249,115,22,0.3)" : goldBorder, borderRadius: 12, padding: 24, boxShadow: goldGlow }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ margin: 0, color: "#caa94c", fontSize: "1.2rem" }}>{req.projectTitle || req.name || req.companyName || "Request"}</h3>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {pay && (
                <span style={{ fontSize: "0.78rem", padding: "4px 12px", borderRadius: 6, background: pay.isPaid ? "rgba(34,197,94,0.15)" : "rgba(249,115,22,0.15)", color: pay.isPaid ? "#4ade80" : "#fb923c", fontWeight: 600 }}>
                  {pay.isPaid ? "All Paid" : `Payment Pending (${pay.unpaidCount})`}
                </span>
              )}
              <span style={{ ...getStatusStyle(req.status), padding: "4px 12px", borderRadius: 6, fontSize: "0.8rem", fontWeight: 600 }}>{req.status || "pending"}</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px", fontSize: "0.88rem" }}>
            <DetailRow label="Type" value={req._type} />
            <DetailRow label="Plan" value={req.plan || (isEnt ? "Enterprise" : "—")} />
            {req.projectDescription && <div style={{ gridColumn: "1 / -1" }}><DetailRow label="Description" value={req.projectDescription} /></div>}
            <DetailRow label="Billing Cycle" value={req.billingCycle || "—"} />
            <DetailRow label="Build Cost" value={req.buildCost || (isEnt ? BUDGET_LABELS[req.estimatedBudget] || "—" : "—")} />
            <DetailRow label="Monthly Maintenance" value={req.customMonthlyPrice ? formatCurrency(req.customMonthlyPrice) : req.plan ? "Included in plan" : "—"} />
            <DetailRow label="Large Commits" value={`${credits.largeCommits || 0} used`} />
            <DetailRow label="Small Changes" value={credits.smallChanges !== undefined ? `${credits.smallChanges} used (unlimited)` : "Unlimited"} />
            <DetailRow label="Created" value={formatDate(req.createdAt)} />
            {req.expectedTimeline && <DetailRow label="Timeline" value={TIMELINE_LABELS[req.expectedTimeline] || req.expectedTimeline} />}
            {req.estimatedBudget && isEnt && <DetailRow label="Estimated Budget" value={BUDGET_LABELS[req.estimatedBudget] || req.estimatedBudget} />}
          </div>
        </div>

        {sortedInvoices.length > 0 && (
          <div style={{ background: cardBg, border: goldBorder, borderRadius: 12, padding: 24, marginTop: 16, boxShadow: goldGlow }}>
            <h4 style={{ margin: "0 0 14px", color: "#caa94c", fontSize: "1rem", textShadow: "0 0 6px rgba(202,169,76,0.2)" }}>Payment History</h4>
            {sortedInvoices.map((inv) => {
              const invPaid = String(inv.status || "").toLowerCase() === "paid";
              return (
                <div key={inv.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div>
                    <div style={{ color: "#fafafa", fontSize: "0.85rem", fontWeight: 600 }}>{inv.invoiceId || "Invoice"}</div>
                    <div style={{ color: "rgba(250,250,250,0.45)", fontSize: "0.75rem", marginTop: 2 }}>{inv.planName || "—"} &middot; {formatDate(inv.createdAt)}</div>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ color: "#caa94c", fontWeight: 700, fontSize: "0.88rem" }}>{formatCurrency(inv.amount)}</span>
                    <span style={{ fontSize: "0.72rem", padding: "3px 10px", borderRadius: 6, fontWeight: 600, background: invPaid ? "rgba(34,197,94,0.15)" : "rgba(249,115,22,0.15)", color: invPaid ? "#4ade80" : "#fb923c" }}>
                      {invPaid ? "PAID" : "UNPAID"}
                    </span>
                    <button onClick={(e) => { e.stopPropagation(); buildInvoicePdf(inv); }}
                      style={{ padding: "4px 10px", background: "rgba(202,169,76,0.1)", border: "1px solid rgba(202,169,76,0.2)", borderRadius: 4, color: "#caa94c", cursor: "pointer", fontSize: "0.72rem" }}>
                      PDF
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    );
  }

  function renderRequests() {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h2 style={{ margin: "0 0 20px", color: "#caa94c", textShadow: "0 0 8px rgba(202, 169, 76, 0.3)" }}>My Requests</h2>
        {selectedRequest ? renderRequestDetail(selectedRequest) : allRequests.length === 0 ? (
          <div style={{ background: cardBg, border: goldBorder, borderRadius: 10, padding: 40, textAlign: "center", color: "rgba(250,250,250,0.5)" }}>
            No requests assigned yet.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {allRequests.map((req) => {
              const st = getStatusStyle(req.status);
              const isEnt = req._type === "Enterprise";
              const pay = getPaymentInfo(req.id);
              const isPaid = pay?.isPaid;
              return (
                <div key={req.id} style={{ background: cardBg, border: pay && !isPaid ? "1px solid rgba(249,115,22,0.3)" : goldBorder, borderRadius: 10, padding: 18, cursor: "pointer", boxShadow: goldGlow }}
                  onClick={() => setSelectedRequest(req)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div>
                      <span style={{ color: "#fafafa", fontWeight: 600, fontSize: "1rem" }}>{req.projectTitle || req.name || req.companyName || "Request"}</span>
                      <span style={{ marginLeft: 8, fontSize: "0.72rem", color: "#caa94c", background: "rgba(202,169,76,0.12)", padding: "2px 8px", borderRadius: 4 }}>{req._type}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      {pay && (
                        <span style={{ fontSize: "0.72rem", padding: "3px 10px", borderRadius: 6, background: isPaid ? "rgba(34,197,94,0.15)" : "rgba(249,115,22,0.15)", color: isPaid ? "#4ade80" : "#fb923c", fontWeight: 600 }}>
                          {isPaid ? "Paid" : `Payment Pending${pay.unpaidCount > 1 ? ` (${pay.unpaidCount})` : ""}`}
                        </span>
                      )}
                      <span style={{ background: st.bg, color: st.color, padding: "3px 10px", borderRadius: 6, fontSize: "0.75rem", fontWeight: 600 }}>{req.status || "pending"}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: "0.8rem", color: "rgba(250,250,250,0.55)" }}>
                    <span>Plan: <strong style={{ color: "#caa94c" }}>{req.plan || (isEnt ? "Enterprise" : "—")}</strong></span>
                    <span>Billing: <strong style={{ color: "#caa94c" }}>{req.billingCycle || "—"}</strong></span>
                    <span>Build: <strong style={{ color: "#caa94c" }}>{req.buildCost || (isEnt ? BUDGET_LABELS[req.estimatedBudget] || "—" : "—")}</strong></span>
                    {pay && (
                      <span>Latest Invoice: <strong style={{ color: pay.isPaid ? "#4ade80" : "#fb923c" }}>{formatCurrency(pay.latest.amount)} — {pay.isPaid ? "Paid" : "Pending"}</strong></span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    );
  }

  function renderInvoices() {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h2 style={{ margin: "0 0 20px", color: "#caa94c", textShadow: "0 0 8px rgba(202, 169, 76, 0.3)" }}>My Invoices</h2>
        {invoices.length === 0 ? (
          <div style={{ background: cardBg, border: goldBorder, borderRadius: 10, padding: 40, textAlign: "center", color: "rgba(250,250,250,0.5)" }}>
            No invoices yet.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {invoices.map((inv) => {
              const isPaid = String(inv.status || "").toLowerCase() === "paid";
              return (
                <div key={inv.id} style={{ background: cardBg, border: isPaid ? "1px solid rgba(34,197,94,0.3)" : goldBorder, borderRadius: 10, padding: 18, boxShadow: goldGlow }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div>
                      <span style={{ color: "#fafafa", fontWeight: 600 }}>{inv.invoiceId || "Invoice"}</span>
                      <span style={{ marginLeft: 10, color: "rgba(250,250,250,0.5)", fontSize: "0.8rem" }}>{inv.planName || "—"}</span>
                    </div>
                    <span style={{ color: isPaid ? "#4ade80" : "#fb923c", fontWeight: 700, fontSize: "0.8rem", background: isPaid ? "rgba(34,197,94,0.12)" : "rgba(249,115,22,0.12)", padding: "4px 10px", borderRadius: 6 }}>
                      {isPaid ? "PAID" : "UNPAID"}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: "0.8rem", color: "rgba(250,250,250,0.55)" }}>
                    <span>Amount: <strong style={{ color: "#caa94c" }}>{formatCurrency(inv.amount)}</strong></span>
                    <span>Issued: {formatDate(inv.createdAt)}</span>
                    {inv.paymentMethod && <span>Method: {inv.paymentMethod}</span>}
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <button onClick={() => buildInvoicePdf(inv)}
                      style={{ padding: "6px 14px", background: "rgba(202,169,76,0.12)", border: "1px solid rgba(202,169,76,0.3)", borderRadius: 6, color: "#caa94c", cursor: "pointer", fontSize: "0.8rem" }}>
                      Download PDF
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    );
  }

  function renderProfile() {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h2 style={{ margin: "0 0 20px", color: "#caa94c", textShadow: "0 0 8px rgba(202, 169, 76, 0.3)" }}>Profile</h2>
        <div style={{ background: cardBg, border: goldBorder, borderRadius: 12, padding: 24, maxWidth: 480, boxShadow: goldGlow }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: "rgba(250,250,250,0.5)", fontSize: "0.78rem", marginBottom: 2 }}>Name</div>
            <div style={{ color: "#fafafa", fontSize: "1rem" }}>{name}</div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: "rgba(250,250,250,0.5)", fontSize: "0.78rem", marginBottom: 2 }}>Email</div>
            <div style={{ color: "#fafafa", fontSize: "1rem" }}>{email}</div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ color: "rgba(250,250,250,0.5)", fontSize: "0.78rem", marginBottom: 2 }}>Role</div>
            <div style={{ color: "#caa94c", fontSize: "1rem", fontWeight: 600 }}>{role.toUpperCase()}</div>
          </div>
          <button onClick={handleLogout}
            style={{ padding: "10px 24px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, color: "#fca5a5", cursor: "pointer", fontSize: "0.88rem", fontWeight: 600 }}>
            Logout
          </button>
        </div>
      </motion.div>
    );
  }

  const sectionContent = {
    dashboard: renderDashboard(),
    requests: renderRequests(),
    invoices: renderInvoices(),
    profile: renderProfile(),
  };

  // ─── LAYOUT ───

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 60px)", background: "#1a1a1a", color: "#fafafa" }}>
      {/* Sidebar */}
      <aside style={{ width: 220, flexShrink: 0, background: "rgba(42,42,42,0.5)", borderRight: "1px solid rgba(202,169,76,0.2)", padding: "24px 0", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "0 20px", marginBottom: 24, fontSize: "0.72rem", color: "rgba(202,169,76,0.6)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
          Client Portal
        </div>
        <nav style={{ flex: 1 }}>
          {sidebarItems.map((item) => (
            <button key={item.id} onClick={() => { setActiveSection(item.id); setSelectedRequest(null); }}
              style={{
                display: "block", width: "100%", padding: "12px 20px",
                background: activeSection === item.id ? "rgba(202,169,76,0.1)" : "transparent",
                border: "none", borderRight: activeSection === item.id ? "2px solid #caa94c" : "2px solid transparent",
                color: activeSection === item.id ? "#caa94c" : "rgba(250,250,250,0.5)",
                cursor: "pointer", fontSize: "0.88rem", textAlign: "left",
                transition: "all 0.15s",
              }}>
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "0 20px", marginTop: "auto" }}>
          <div style={{ padding: "16px 0", borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: "0.72rem", color: "rgba(250,250,250,0.35)" }}>
            {user?.email}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "32px 40px", overflowY: "auto", maxWidth: 960 }}>
        {dataLoading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
            <div className="shield-logout-spinner" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={activeSection} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {sectionContent[activeSection]}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div style={{ padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ color: "rgba(250,250,250,0.45)", fontSize: "0.75rem", marginBottom: 2 }}>{label}</div>
      <div style={{ color: "#fafafa", fontSize: "0.88rem" }}>{value || "—"}</div>
    </div>
  );
}
