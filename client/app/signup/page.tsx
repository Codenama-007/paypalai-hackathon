"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  X,
  FileText
} from "lucide-react";
import { saveUserSession, DEFAULT_DEMO_USER } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // States
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const validate = () => {
    const errs: typeof errors = {};

    if (!fullName.trim()) {
      errs.fullName = "Full name is required.";
    } else if (fullName.trim().length < 2) {
      errs.fullName = "Please enter a valid full name.";
    }

    if (!email.trim()) {
      errs.email = "Institutional email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Please enter a valid institutional email format.";
    }

    if (!password) {
      errs.password = "Password is required.";
    } else if (password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }

    if (!confirmPassword) {
      errs.confirmPassword = "Confirm your password.";
    } else if (confirmPassword !== password) {
      errs.confirmPassword = "Passwords do not match.";
    }

    if (!acceptTerms) {
      errs.terms = "You must accept the Institutional Research terms to proceed.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      // Save session with user's name
      saveUserSession({
        ...DEFAULT_DEMO_USER,
        name: fullName,
        email: email,
        avatarInitials: fullName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase()
      });
      setIsLoading(false);
      router.push("/");
    }, 700);
  };

  const handleQuickDemo = () => {
    saveUserSession(DEFAULT_DEMO_USER);
    router.push("/");
  };

  // Password Strength calculation
  const getPasswordStrength = () => {
    if (!password) return { label: "Empty", score: 0, color: "#5F6D7E" };
    if (password.length < 6) return { label: "Weak", score: 1, color: "#E36B73" };
    if (password.length < 10) return { label: "Moderate", score: 2, color: "#E5A93C" };
    return { label: "Strong", score: 3, color: "#26C88A" };
  };

  const strength = getPasswordStrength();

  return (
    <div className="auth-page-root">
      {/* Ambient background glows */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 0%, rgba(214,183,94,0.08) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(38,200,138,0.04) 0%, transparent 40%)",
          pointerEvents: "none"
        }}
      />

      {/* Header */}
      <header className="auth-header-bar">
        <Link href="/" className="auth-brand-link">
          <div style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 24 24" style={{ width: 20, height: 20 }} fill="none">
              <path d="M4 19L11 4L13.5 9.5L8.5 19H4Z" fill="#D6B75E" />
              <path d="M14.5 11.5L18 19H13L11.5 15.5L14.5 11.5Z" fill="#F3DE97" />
              <path d="M13 15H17" stroke="#080D12" strokeWidth="1.2" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: 700, fontSize: "14px", color: "#E7E9EC", lineHeight: 1.15 }}>
              FinAnalyst AI
            </span>
            <span style={{ fontSize: "9px", color: "#A98B45", fontWeight: 500, letterSpacing: "0.04em" }}>
              Research · Analyse · Invest
            </span>
          </div>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: "11px" }}>
          <span style={{ color: "#929CA7" }}>Already registered?</span>
          <Link
            href="/login"
            style={{
              padding: "5px 12px",
              borderRadius: "5px",
              backgroundColor: "#101A23",
              border: "1px solid #26333D",
              color: "#D6B75E",
              fontWeight: 600,
              textDecoration: "none"
            }}
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Registration Card */}
      <main className="auth-main-area">
        <div className="auth-card-panel" style={{ maxWidth: 450 }}>
          {/* Card Header */}
          <div className="auth-heading-center">
            <div className="auth-sparkle-pill">
              <Sparkles style={{ width: 18, height: 18 }} />
            </div>
            <h1 className="auth-heading-title">Create Your Account</h1>
            <p className="auth-heading-subtitle">
              Access AI-powered equity research, deep analysis & actionable insights.
            </p>
          </div>

          {/* Quick Demo Bypass Option */}
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 6,
              backgroundColor: "#131F29",
              border: "1px solid #26333D",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ShieldCheck style={{ width: 16, height: 16, color: "#D6B75E" }} />
              <div style={{ textAlign: "left" }}>
                <p style={{ fontSize: "10.5px", fontWeight: 700, color: "#E7E9EC", margin: 0, lineHeight: 1.2 }}>Evaluating the platform?</p>
                <p style={{ fontSize: "9px", color: "#929CA7", margin: 0 }}>Bypass registration and test with demo profile</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleQuickDemo}
              style={{
                padding: "4px 10px",
                borderRadius: 4,
                backgroundColor: "#1E1A11",
                border: "1px solid #D6B75E",
                color: "#D6B75E",
                fontSize: "10px",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              Demo Access
            </button>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSignup} className="auth-form-stack" noValidate>
            {/* Full Name */}
            <div className="auth-field-stack">
              <label className="auth-label-text">Full Name</label>
              <div className="auth-input-container">
                <User className="auth-input-lead-icon" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                  }}
                  placeholder="e.g. Radhika Dhanuka"
                  className={`auth-text-input ${errors.fullName ? "input-has-error" : ""}`}
                />
              </div>
              {errors.fullName && (
                <div className="auth-err-banner">
                  <AlertCircle style={{ width: 12, height: 12 }} />
                  <span>{errors.fullName}</span>
                </div>
              )}
            </div>

            {/* Email Address */}
            <div className="auth-field-stack">
              <label className="auth-label-text">Institutional Email</label>
              <div className="auth-input-container">
                <Mail className="auth-input-lead-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="analyst@institution.com"
                  className={`auth-text-input ${errors.email ? "input-has-error" : ""}`}
                />
              </div>
              {errors.email && (
                <div className="auth-err-banner">
                  <AlertCircle style={{ width: 12, height: 12 }} />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password Field + Strength Meter */}
            <div className="auth-field-stack">
              <div className="auth-field-label-group">
                <label className="auth-label-text">Password</label>
                {password && (
                  <span style={{ fontSize: "9px", fontFamily: "monospace", fontWeight: 700, color: strength.color }}>
                    Strength: {strength.label}
                  </span>
                )}
              </div>
              <div className="auth-input-container">
                <Lock className="auth-input-lead-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="Min 6 characters"
                  className={`auth-text-input ${errors.password ? "input-has-error" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-pwd-reveal"
                >
                  {showPassword ? <EyeOff style={{ width: 14, height: 14 }} /> : <Eye style={{ width: 14, height: 14 }} />}
                </button>
              </div>

              {/* Password Strength Bar */}
              {password && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, paddingTop: 2 }}>
                  <div style={{ height: 4, borderRadius: 2, backgroundColor: strength.score >= 1 ? "#E36B73" : "#26333D" }} />
                  <div style={{ height: 4, borderRadius: 2, backgroundColor: strength.score >= 2 ? "#E5A93C" : "#26333D" }} />
                  <div style={{ height: 4, borderRadius: 2, backgroundColor: strength.score >= 3 ? "#26C88A" : "#26333D" }} />
                </div>
              )}

              {errors.password && (
                <div className="auth-err-banner">
                  <AlertCircle style={{ width: 12, height: 12 }} />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="auth-field-stack">
              <label className="auth-label-text">Confirm Password</label>
              <div className="auth-input-container">
                <Lock className="auth-input-lead-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                  }}
                  placeholder="Repeat your password"
                  className={`auth-text-input ${errors.confirmPassword ? "input-has-error" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="auth-pwd-reveal"
                >
                  {showConfirmPassword ? <EyeOff style={{ width: 14, height: 14 }} /> : <Eye style={{ width: 14, height: 14 }} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="auth-err-banner">
                  <AlertCircle style={{ width: 12, height: 12 }} />
                  <span>{errors.confirmPassword}</span>
                </div>
              )}
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="auth-field-stack" style={{ paddingTop: 4 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => {
                    setAcceptTerms(e.target.checked);
                    if (errors.terms) setErrors((prev) => ({ ...prev, terms: undefined }));
                  }}
                  style={{ width: 14, height: 14, marginTop: 2, accentColor: "#D6B75E", cursor: "pointer", flexShrink: 0 }}
                />
                <label htmlFor="terms" style={{ fontSize: "10px", color: "#929CA7", lineHeight: 1.3, cursor: "pointer", userSelect: "none" }}>
                  I accept the{" "}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowTermsModal(true);
                    }}
                    style={{ color: "#D6B75E", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", padding: 0, font: "inherit" }}
                  >
                    Institutional Research Terms of Service
                  </button>{" "}
                  and SEBI Regulatory Guidelines.
                </label>
              </div>
              {errors.terms && (
                <div className="auth-err-banner">
                  <AlertCircle style={{ width: 12, height: 12 }} />
                  <span>{errors.terms}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="auth-submit-btn"
              style={{ marginTop: 4, backgroundColor: "#D6B75E", color: "#080D12" }}
            >
              {isLoading ? (
                <span>Provisioning Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight style={{ width: 14, height: 14 }} />
                </>
              )}
            </button>
          </form>

          {/* Footnote */}
          <div style={{ textAlign: "center", paddingTop: 8, borderTop: "1px solid #26333D", fontSize: "10px", color: "#929CA7" }}>
            <span>Existing institutional account? </span>
            <Link href="/login" style={{ color: "#D6B75E", fontWeight: 600, textDecoration: "none" }}>
              Sign In
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="auth-footer-bar">
        <span>© 2026 FinIntel Technologies · Institutional Research</span>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/login" style={{ color: "#D6B75E", textDecoration: "none" }}>
            Sign In to Terminal
          </Link>
          <span style={{ color: "#26333D" }}>|</span>
          <span style={{ color: "#929CA7" }}>SEBI Regulatory Compliance v2.4</span>
        </div>
      </footer>

      {/* Terms of Service Modal */}
      {showTermsModal && (
        <div className="auth-modal-backdrop">
          <div className="auth-modal-box" style={{ maxWidth: 480 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #26333D", paddingBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FileText style={{ width: 16, height: 16, color: "#D6B75E" }} />
                <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#E7E9EC", margin: 0 }}>
                  Institutional Research Terms of Service
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                style={{ background: "none", border: "none", color: "#929CA7", cursor: "pointer" }}
              >
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>

            <div style={{ maxHeight: 260, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, fontSize: "10.5px", color: "#929CA7", lineHeight: 1.5, paddingRight: 6 }}>
              <p style={{ margin: 0 }}>
                <strong style={{ color: "#E7E9EC" }}>1. Scope of Research:</strong> FinIntel provides AI-assisted equity research intelligence, multi-agent financial summarization, and valuation telemetry strictly for educational and research purposes.
              </p>
              <p style={{ margin: 0 }}>
                <strong style={{ color: "#E7E9EC" }}>2. SEBI Compliance:</strong> FinIntel is not a registered investment advisor or research analyst under SEBI (Research Analysts) Regulations, 2014. No output constitutes a recommendation to buy, sell, or hold any security.
              </p>
              <p style={{ margin: 0 }}>
                <strong style={{ color: "#E7E9EC" }}>3. Human-in-the-Loop Gate:</strong> All agentic thesis executions require explicit human verification via the Approval Gate before deployment or trade orchestration.
              </p>
              <p style={{ margin: 0 }}>
                <strong style={{ color: "#E7E9EC" }}>4. Market Telemetry:</strong> All quotes, ratios, and price updates reflect publicly reported NSE exchange data and are subject to market volatility.
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, paddingTop: 8, borderTop: "1px solid #26333D" }}>
              <button
                type="button"
                onClick={() => {
                  setAcceptTerms(true);
                  setShowTermsModal(false);
                }}
                style={{
                  padding: "6px 14px",
                  borderRadius: 4,
                  backgroundColor: "#D6B75E",
                  border: "none",
                  color: "#080D12",
                  fontWeight: 700,
                  fontSize: "11px",
                  cursor: "pointer"
                }}
              >
                Accept & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
