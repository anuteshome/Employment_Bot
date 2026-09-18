import { fetchWithAuth } from './apiClient';

export interface EmployerProfileCreatePayload {
  business_name: string;
  business_type: string;
  description?: string;
  phone?: string;
  location?: string;
}

export interface EmployerProfileResponse {
  id: string;
  user_id: string;
  business_name: string;
  business_type: string;
  description?: string;
  phone?: string;
  location?: string;
  verification_status: string;
  created_at: string;
  updated_at: string;
}

export async function saveEmployerProfile(
  payload: EmployerProfileCreatePayload
): Promise<EmployerProfileResponse> {
  return fetchWithAuth<EmployerProfileResponse>('/employers/profile', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getEmployerProfile(): Promise<EmployerProfileResponse> {
  return fetchWithAuth<EmployerProfileResponse>('/employers/me');
}
