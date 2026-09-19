'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { Steps } from '@/components/ui/steps';
import { PersonalInfoStep } from './components/PersonalInfoStep';
import { ProfessionalDetailsStep } from './components/ProfessionalDetailsStep';
import { UploadCvStep } from './components/UploadCvStep';
import { ReviewStep } from './components/ReviewStep';
import { EmployeeDashboard } from './components/EmployeeDashboard';
import {
  saveEmployeeProfile,
  getEmployeeProfile,
  EmployeeProfileCreatePayload,
} from '@/services/employeeService';

const STEP_ITEMS = ['Personal Info', 'Professional', 'Upload CV', 'Review'];

export function EmployeeWizard() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: 'Alex Morgan',
    email: 'alex@company.com',
    phone: '+251 (911) 000-000',
    location: 'Addis Ababa, Ethiopia',
    emergencyName: 'Jordan Morgan',
    emergencyPhone: '+251 (911) 000-000',
    jobTitle: 'Senior Product Designer',
    yearsExp: '5–7 years',
    portfolio: 'https://yourportfolio.com',
    bio: 'Experienced product designer',
  });

  const [skills, setSkills] = useState(['React', 'TypeScript', 'Product Design']);

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getEmployeeProfile();
        if (profile) {
          setFormData((prev) => ({
            ...prev,
            fullName: `${profile.first_name} ${profile.last_name}`,
            email: profile.email || prev.email,
            phone: profile.phone || prev.phone,
            emergencyName: profile.emergency_contact_name || prev.emergencyName,
            emergencyPhone: profile.emergency_contact_phone || prev.emergencyPhone,
            jobTitle: profile.current_job_title || prev.jobTitle,
            yearsExp: profile.years_experience || prev.yearsExp,
            portfolio: profile.portfolio_url || prev.portfolio,
            location: profile.location || prev.location,
            bio: profile.bio || prev.bio,
          }));
          if (profile.skills && profile.skills.length > 0) {
            setSkills(profile.skills.map((s) => s.name));
          }
          setSubmitted(true);
        }
      } catch (err) {
        // Profile not created yet in DB
      }
    }
    loadProfile();
  }, []);

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = (skill: string) => {
    if (skill && !skills.includes(skill)) {
      setSkills((prev) => [...prev, skill]);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const nameParts = formData.fullName.trim().split(' ');
      const firstName = nameParts[0] || 'Alex';
      const lastName = nameParts.slice(1).join(' ') || 'User';

      const payload: EmployeeProfileCreatePayload = {
        first_name: firstName,
        last_name: lastName,
        email: formData.email,
        phone: formData.phone,
        emergency_contact_name: formData.emergencyName,
        emergency_contact_phone: formData.emergencyPhone,
        current_job_title: formData.jobTitle,
        years_experience: formData.yearsExp,
        portfolio_url: formData.portfolio,
        bio: formData.bio || 'Candidate profile',
        location: formData.location,
        availability_status: 'AVAILABLE',
        skills: skills.map((s) => ({
          name: s,
          category: 'General',
          years_experience: formData.yearsExp.includes('8+') ? 8 : formData.yearsExp.includes('5–7') ? 5 : 2,
        })),
        experiences: [
          {
            company_name: 'Tech Corp Ethiopia',
            position: formData.jobTitle || 'Senior Product Designer',
            description: 'Work history details',
          },
        ],
        educations: [
          {
            institution: 'Addis Ababa University',
            qualification: 'BSc Degree',
            field: 'Computer Science',
          },
        ],
      };

      await saveEmployeeProfile(payload);
      setSubmitted(true);
    } catch (err: any) {
      alert(`Failed to save employee profile: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <EmployeeDashboard
        fullName={formData.fullName}
        jobTitle={formData.jobTitle}
        yearsExp={formData.yearsExp.split(' ')[0]}
        skills={skills}
        cvFileName="Alex_Morgan_CV.pdf"
        cvFileSize="2.4 MB"
        onEditProfile={() => setSubmitted(false)}
      />
    );
  }

  const personalInfoSummary = `${formData.fullName} · ${formData.email} · ${formData.location}`;
  const professionalSummary = `${formData.jobTitle} · ${formData.yearsExp} · ${skills.join(' · ')}`;
  const documentsSummary = 'Alex_Morgan_CV.pdf · 2.4 MB';

  return (
    <>
      <Steps items={STEP_ITEMS} active={step} />
      <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        {step === 0 && (
          <PersonalInfoStep formData={formData} onChange={handleFormChange} />
        )}
        {step === 1 && (
          <ProfessionalDetailsStep
            formData={formData}
            skills={skills}
            onFormChange={handleFormChange}
            onAddSkill={handleAddSkill}
            onRemoveSkill={handleRemoveSkill}
          />
        )}
        {step === 2 && <UploadCvStep />}
        {step === 3 && (
          <ReviewStep
            personalInfoSummary={personalInfoSummary}
            professionalSummary={professionalSummary}
            documentsSummary={documentsSummary}
            agreed={agreed}
            onAgreeChange={setAgreed}
            onEditStep={(s) => setStep(s)}
          />
        )}

        <div className="mt-8 flex justify-between border-t border-slate-100 pt-5">
          <button
            type="button"
            onClick={() => setStep((prev) => Math.max(0, prev - 1))}
            disabled={step === 0 || isSubmitting}
            className="flex items-center gap-1 text-sm font-bold text-slate-700 disabled:invisible hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => {
              if (step === 3) {
                handleSubmit();
              } else {
                setStep((prev) => prev + 1);
              }
            }}
            className="flex items-center gap-2 rounded-xl bg-[#2E2A47] px-5 py-3 text-sm font-bold text-white hover:bg-[#1E1A37] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saving to database...</span>
              </>
            ) : (
              <>
                <span>{step === 3 ? 'Submit application' : 'Continue'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
