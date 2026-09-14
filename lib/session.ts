const ACCESS_TOKEN_KEY = 'prasha-auth-token';
const REFRESH_TOKEN_KEY = 'prasha-refresh-token';
const USER_KEY = 'prasha-user';

export const SESSION_EXPIRED_EVENT = 'prasha:session-expired';

/** Removes browser state that must never be used as proof of authentication. */
export function clearSession() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

function notifySessionExpired() {
  clearSession();
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
}

/**
 * The single authenticated request path for the storefront.  A 401 always
 * invalidates the client session, so no component can retain a stale user.
 */
export async function authenticatedFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const token = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!token) {
    return new Response(null, { status: 401 });
  }

  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(input, { ...init, headers });
  if (response.status === 401) notifySessionExpired();
  return response;
}

/** Uses the protected profile endpoint as the backend authority on startup and before protected UI actions. */
export async function getValidatedSession<T = unknown>(): Promise<T | null> {
  if (!window.localStorage.getItem(ACCESS_TOKEN_KEY)) {
    clearSession();
    return null;
  }
  const response = await authenticatedFetch('/api/auth/profile');
  if (!response.ok) return null;

  const payload = await response.json();
  return (payload?.data ?? null) as T | null;
}
