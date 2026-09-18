'use client';

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Steps } from '@/components/ui/steps';
import { PersonalInfoStep } from './components/PersonalInfoStep';
import { ProfessionalDetailsStep } from './components/ProfessionalDetailsStep';
import { UploadCvStep } from './components/UploadCvStep';
import { ReviewStep } from './components/ReviewStep';
import { EmployeeDashboard } from './components/EmployeeDashboard';

const STEP_ITEMS = ['Personal Info', 'Professional', 'Upload CV', 'Review'];

export function EmployeeWizard() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);

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
  });

  const [skills, setSkills] = useState(['React', 'TypeScript', 'Product Design']);

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

  if (submitted) {
    return (
      <EmployeeDashboard
        fullName={formData.fullName}
        jobTitle={formData.jobTitle}
        yearsExp={formData.yearsExp.split(' ')[0]}
        skills={skills}
        cvFileName="Alex_Morgan_CV.pdf"
        cvFileSize="2.4 MB"
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
            disabled={step === 0}
            className="flex items-center gap-1 text-sm font-bold text-slate-700 disabled:invisible hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <button
            type="button"
            onClick={() => {
              if (step === 3) {
                setSubmitted(true);
              } else {
                setStep((prev) => prev + 1);
              }
            }}
            className="flex items-center gap-2 rounded-xl bg-[#2E2A47] px-5 py-3 text-sm font-bold text-white hover:bg-[#1E1A37] transition-colors"
          >
            <span>{step === 3 ? 'Submit application' : 'Continue'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
