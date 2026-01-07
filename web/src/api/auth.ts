import { apiRequest, setToken } from './client';

export type AuthResponse = {
  token: string;
  user: {
    id: number;
    email: string;
  };
};

export const login = async (email: string, password: string) => {
  const data = await apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  setToken(data.token);
  return data;
};

export const register = async (email: string, password: string) => {
  const data = await apiRequest<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  setToken(data.token);
  return data;
};
