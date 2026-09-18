import { fetchWithAuth } from './apiClient';

export interface UserAuthResponse {
  id: string;
  telegram_user_id: number;
  username?: string;
  phone?: string;
  role: string;
  status: string;
  has_employee_profile: boolean;
  has_employer_profile: boolean;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: UserAuthResponse;
}

export async function loginWithTelegram(initData: string): Promise<TokenResponse> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

  const response = await fetch(`${API_BASE_URL}/auth/telegram`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ init_data: initData }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Telegram authentication failed');
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', data.access_token);
  }

  return data;
}

export async function loginDevMode(): Promise<TokenResponse> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

  const response = await fetch(`${API_BASE_URL}/auth/dev-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Dev login failed');
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', data.access_token);
  }

  return data;
}

export async function getCurrentUser(): Promise<UserAuthResponse> {
  return fetchWithAuth<UserAuthResponse>('/users/me');
}

