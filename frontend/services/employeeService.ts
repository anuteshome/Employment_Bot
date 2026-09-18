import { fetchWithAuth } from './apiClient';

export interface SkillInput {
  name: string;
  category?: string;
  years_experience: number;
}

export interface SkillResponse {
  id: string;
  name: string;
  category?: string;
  years_experience: number;
}

export interface ExperienceInput {
  company_name: string;
  position: string;
  description?: string;
  start_date?: string;
  end_date?: string;
}

export interface ExperienceResponse {
  id: string;
  company_name: string;
  position: string;
  description?: string;
  start_date?: string;
  end_date?: string;
}

export interface EducationInput {
  institution: string;
  qualification: string;
  field?: string;
  start_date?: string;
  end_date?: string;
}

export interface EducationResponse {
  id: string;
  institution: string;
  qualification: string;
  field?: string;
  start_date?: string;
  end_date?: string;
}

export interface EmployeeProfileCreatePayload {
  first_name: string;
  last_name: string;
  bio?: string;
  location?: string;
  availability_status: string;
  skills: SkillInput[];
  experiences: ExperienceInput[];
  educations: EducationInput[];
}

export interface EmployeeProfileResponse {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  bio?: string;
  location?: string;
  availability_status: string;
  profile_completion: number;
  skills: SkillResponse[];
  experiences: ExperienceResponse[];
  educations: EducationResponse[];
  created_at: string;
  updated_at: string;
}

export async function saveEmployeeProfile(
  payload: EmployeeProfileCreatePayload
): Promise<EmployeeProfileResponse> {
  return fetchWithAuth<EmployeeProfileResponse>('/employees/profile', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getEmployeeProfile(): Promise<EmployeeProfileResponse> {
  return fetchWithAuth<EmployeeProfileResponse>('/employees/me');
}
