// FinIntel Institutional Authentication State & Helper Utilities

export interface UserSession {
  name: string;
  email: string;
  role: string;
  institution?: string;
  isDemo: boolean;
  avatarInitials: string;
  loginTime: string;
}

export interface User {
  id?: string;
  email: string;
  name: string;
  role?: string;
  institution?: string;
  isDemo?: boolean;
  avatarInitials?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const STORAGE_KEY = "finintel_user_session";
const TOKEN_KEY = "finintel_auth_token";
const USER_KEY = "finintel_auth_user";

export const DEFAULT_DEMO_USER: UserSession = {
  name: "R. Dhanuka",
  email: "rd@finintel.ai",
  role: "Senior Institutional Analyst",
  institution: "FinIntel Capital Markets",
  isDemo: true,
  avatarInitials: "RD",
  loginTime: new Date().toISOString()
};

export function getStoredUser(): UserSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function saveUserSession(user: UserSession): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, "demo_jwt_token_institutional");
    document.cookie = `finintel_token=demo_jwt_token_institutional; path=/; max-age=604800; SameSite=Lax`;
  } catch {
    // ignore storage error
  }
}

export function setAuth(token: string, user: User): void {
  if (typeof window === "undefined") return;
  try {
    const sessionUser: UserSession = {
      name: user.name || "Analyst",
      email: user.email,
      role: user.role || "Institutional Analyst",
      institution: user.institution || "FinIntel Desk",
      isDemo: user.isDemo ?? false,
      avatarInitials: (user.name || user.email).substring(0, 2).toUpperCase(),
      loginTime: new Date().toISOString()
    };
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
    document.cookie = `finintel_token=${token}; path=/; max-age=604800; SameSite=Lax`;
  } catch {
    // ignore storage error
  }
}

export function clearUserSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    document.cookie = "finintel_token=; path=/; max-age=0; SameSite=Lax";
  } catch {
    // ignore storage error
  }
}

export function clearAuth(): void {
  clearUserSession();
}

export function isUserAuthenticated(): boolean {
  return getStoredUser() !== null;
}

export function isAuthenticated(): boolean {
  return !!getStoredToken() || getStoredUser() !== null;
}
