
export interface AuthUser {
  token: string;
  username: string;
  id?: string;
}

const AUTH_KEY = "auth";

export const auth = {
  set(user: AuthUser) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  },

  get(): AuthUser | null {
    const data = localStorage.getItem(AUTH_KEY);
    if (!data) {
      return null;
    }

    try {
      return JSON.parse(data) as AuthUser;
    } catch {
      localStorage.removeItem(AUTH_KEY);
      return null;
    }
  },

  token(): string | null {
    return this.get()?.token || null;
  },

  isAuthenticated(): boolean {
    return !!this.token();
  },

  clear() {
    localStorage.removeItem(AUTH_KEY);
  }
}
