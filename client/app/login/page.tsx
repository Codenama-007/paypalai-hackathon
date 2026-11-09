"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X
} from "lucide-react";
import { saveUserSession, DEFAULT_DEMO_USER } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Interaction & Validation States
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errs.email = "Institutional email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Please enter a valid institutional email format.";
    }
    if (!password) {
      errs.password = "Password is required.";
    } else if (password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      // Frontend-only demo authentication flow
      saveUserSession({
        ...DEFAULT_DEMO_USER,
        name: email.split("@")[0].toUpperCase(),
        email: email,
        avatarInitials: email.substring(0, 2).toUpperCase()
      });
      setIsLoading(false);
      router.push("/");
    }, 700);
  };

  const handleDemoLogin = () => {
    setIsDemoLoading(true);
    setTimeout(() => {
      saveUserSession(DEFAULT_DEMO_USER);
      setIsDemoLoading(false);
      router.push("/");
    }, 500);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      return;
    }
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setShowForgotModal(false);
      setForgotEmail("");
    }, 2000);
  };

  return (
    <div className="auth-page-root">
      {/* Background Ambient Glow & Grid Lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 0%, rgba(214,183,94,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(38,200,138,0.04) 0%, transparent 40%)",
          pointerEvents: "none"
        }}
      />

      {/* Top Header */}
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
          <span style={{ color: "#929CA7" }}>New to FinIntel?</span>
          <Link
            href="/signup"
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
            Create Account
          </Link>
        </div>
      </header>

      {/* Central Login Card Container */}
      <main className="auth-main-area">
        <div className="auth-card-panel">
          {/* Card Header */}
          <div className="auth-heading-center">
            <div className="auth-sparkle-pill">
              <Sparkles style={{ width: 18, height: 18 }} />
            </div>
            <h1 className="auth-heading-title">Welcome Back</h1>
            <p className="auth-heading-subtitle">Your intelligent equity research desk awaits.</p>
          </div>

          {/* Quick Demo Login Hero Action */}
          <div className="auth-demo-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "11px", fontWeight: 700, color: "#26C88A" }}>
                <ShieldCheck style={{ width: 15, height: 15 }} />
                <span>Instant Demo Access</span>
              </div>
              <span className="auth-demo-badge">No Password Required</span>
            </div>
            <p style={{ fontSize: "10px", color: "#929CA7", lineHeight: 1.4, margin: 0 }}>
              Explore the full Bloomberg-grade analyst workspace with preloaded market telemetry.
            </p>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isDemoLoading}
              className="auth-btn-demo-action"
            >
              {isDemoLoading ? (
                <span>Launching Terminal...</span>
              ) : (
                <>
                  <span>Continue with Demo Account</span>
                  <ArrowRight style={{ width: 14, height: 14 }} />
                </>
              )}
            </button>
          </div>

          {/* Institutional Divider */}
          <div className="auth-separator">
            <div className="auth-separator-rule" />
            <span className="auth-separator-badge">Or Sign In with Credentials</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="auth-form-stack" noValidate>
            {/* Email Field */}
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

            {/* Password Field */}
            <div className="auth-field-stack">
              <div className="auth-field-label-group">
                <label className="auth-label-text">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  style={{ fontSize: "10.5px", color: "#D6B75E", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  Forgot password?
                </button>
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
                  placeholder="••••••••••••"
                  className={`auth-text-input ${errors.password ? "input-has-error" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-pwd-reveal"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff style={{ width: 14, height: 14 }} /> : <Eye style={{ width: 14, height: 14 }} />}
                </button>
              </div>
              {errors.password && (
                <div className="auth-err-banner">
                  <AlertCircle style={{ width: 12, height: 12 }} />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 2 }}>
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ width: 14, height: 14, accentColor: "#D6B75E", cursor: "pointer" }}
              />
              <label htmlFor="remember" style={{ fontSize: "11px", color: "#929CA7", cursor: "pointer", userSelect: "none" }}>
                Remember this terminal session for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="auth-submit-btn"
            >
              {isLoading ? (
                <span>Authenticating Terminal...</span>
              ) : (
                <>
                  <span>Sign In to Terminal</span>
                  <ArrowRight style={{ width: 14, height: 14 }} />
                </>
              )}
            </button>
          </form>

          {/* Regulatory Disclaimer Notice */}
          <div style={{ paddingTop: 8, borderTop: "1px solid #26333D", display: "flex", alignItems: "flex-start", gap: 6, fontSize: "9px", color: "#5F6D7E", lineHeight: 1.4 }}>
            <HelpCircle style={{ width: 12, height: 12, flexShrink: 0, marginTop: 2 }} />
            <span>
              FinAnalyst AI is configured in Demo Mode for equity research testing. Real institutional SSO integrations (SAML 2.0 / Okta) can be connected without altering existing frontend logic.
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="auth-footer-bar">
        <span>© 2026 FinIntel Technologies · Institutional Research</span>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/signup" style={{ color: "#D6B75E", textDecoration: "none" }}>
            Register Account
          </Link>
          <span style={{ color: "#26333D" }}>|</span>
          <span style={{ color: "#929CA7" }}>SEBI Regulatory Compliance v2.4</span>
        </div>
      </footer>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="auth-modal-backdrop">
          <div className="auth-modal-box">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #26333D", paddingBottom: 10 }}>
              <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#E7E9EC", margin: 0 }}>Reset Password</h3>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                style={{ background: "none", border: "none", color: "#929CA7", cursor: "pointer" }}
              >
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>

            {forgotSuccess ? (
              <div style={{ padding: 12, borderRadius: 6, backgroundColor: "#18221B", border: "1px solid #26C88A", textAlign: "center", display: "flex", flexDirection: "column", gap: 4 }}>
                <CheckCircle2 style={{ width: 20, height: 20, color: "#26C88A", margin: "0 auto" }} />
                <p style={{ fontSize: "11px", fontWeight: 600, color: "#26C88A", margin: 0 }}>Password Reset Instructions Sent</p>
                <p style={{ fontSize: "9.5px", color: "#929CA7", margin: 0 }}>
                  Check {forgotEmail} for your secure terminal reset link.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <p style={{ fontSize: "10.5px", color: "#929CA7", lineHeight: 1.4, margin: 0 }}>
                  Enter your registered institutional email to receive a password reset link.
                </p>
                <div className="auth-input-container">
                  <Mail className="auth-input-lead-icon" />
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="analyst@institution.com"
                    className="auth-text-input"
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, paddingTop: 4 }}>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    style={{ padding: "6px 12px", borderRadius: 4, border: "1px solid #26333D", backgroundColor: "transparent", color: "#929CA7", fontSize: "10.5px", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: "6px 12px", borderRadius: 4, backgroundColor: "#1E1A11", border: "1px solid #D6B75E", color: "#D6B75E", fontWeight: 600, fontSize: "10.5px", cursor: "pointer" }}
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
