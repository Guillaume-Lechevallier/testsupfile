const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';
const TOKEN_KEY = 'supfile_token';

export const getToken = () => window.localStorage.getItem(TOKEN_KEY);

export const setToken = (token: string) => {
  window.localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
  window.localStorage.removeItem(TOKEN_KEY);
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || `Erreur serveur (${response.status}).`;
    throw new ApiError(message, response.status);
  }

  return payload as T;
}

export { API_URL };
