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
  } catch {
    return null;
  }
}

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

