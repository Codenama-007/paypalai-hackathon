<<<<<<< HEAD
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

const STORAGE_KEY = "finintel_user_session";

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
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
=======
/**
 * Client authentication helpers and session management
 */

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const TOKEN_KEY = "finintel_auth_token";
const USER_KEY = "finintel_auth_user";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
>>>>>>> 1565b5fb0604e3a8dadf245d5c565c19003d30b9
  } catch {
    return null;
  }
}

<<<<<<< HEAD
export function saveUserSession(user: UserSession): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {
    // ignore storage error
  }
}

export function clearUserSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore storage error
  }
}

export function isUserAuthenticated(): boolean {
  return getStoredUser() !== null;
}

=======
export function setAuth(token: string, user: User): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  // Set cookie for Next.js middleware / SSR compatibility if needed
  document.cookie = `finintel_token=${token}; path=/; max-age=604800; SameSite=Lax`;
}

export function clearAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = "finintel_token=; path=/; max-age=0; SameSite=Lax";
}

export function isAuthenticated(): boolean {
  return !!getStoredToken();
}
>>>>>>> 1565b5fb0604e3a8dadf245d5c565c19003d30b9
