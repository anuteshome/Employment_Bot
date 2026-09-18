'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Steps } from '@/components/ui/steps';
import { CompanyInfoStep } from './components/CompanyInfoStep';
import { LicenseInfoStep } from './components/LicenseInfoStep';
import { UploadDocumentsStep } from './components/UploadDocumentsStep';
import { VerificationStatusStep } from './components/VerificationStatusStep';
import {
  saveEmployerProfile,
  getEmployerProfile,
  EmployerProfileCreatePayload,
} from '@/services/employerService';

const ORG_STEP_ITEMS = ['Company Info', 'License Details', 'Documents', 'Status'];

export function EmployerWizard() {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string>('PENDING');

  const [formData, setFormData] = useState({
    companyName: 'Acme Corporation PLC',
    regNumber: 'REG-0001234',
    email: 'hello@acme.com',
    website: 'https://acme.com',
    taxId: '12-3456789',
    location: 'Addis Ababa, Ethiopia',
    regDate: '01 / 15 / 2023',
  });

  useEffect(() => {
    async function loadEmployer() {
      try {
        const profile = await getEmployerProfile();
        if (profile) {
          setFormData((prev) => ({
            ...prev,
            companyName: profile.business_name,
            location: profile.location || prev.location,
            phone: profile.phone || '',
          }));
          setVerificationStatus(profile.verification_status);
          setStep(3); // Land directly on status screen if profile exists
        }
      } catch (err) {
        // No profile created yet
      }
    }
    loadEmployer();
  }, []);

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload: EmployerProfileCreatePayload = {
        business_name: formData.companyName,
        business_type: 'PLC',
        description: `Reg: ${formData.regNumber}, Email: ${formData.email}, Web: ${formData.website}`,
        phone: '+251 (911) 000-000',
        location: formData.location,
      };

      const profile = await saveEmployerProfile(payload);
      setVerificationStatus(profile.verification_status);
      setStep(3); // Navigate to status screen
    } catch (err: any) {
      alert(`Failed to save employer profile: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Steps items={ORG_STEP_ITEMS} active={step} />
      <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        {step === 0 && (
          <CompanyInfoStep formData={formData} onChange={handleFormChange} />
        )}
        {step === 1 && (
          <LicenseInfoStep formData={formData} onChange={handleFormChange} />
        )}
        {step === 2 && <UploadDocumentsStep />}
        {step === 3 && (
          <VerificationStatusStep
            companyName={formData.companyName}
            verificationStatus={verificationStatus}
            onEditProfile={() => setStep(0)}
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
              if (step === 2) {
                handleSubmit();
              } else {
                setStep((prev) => Math.min(3, prev + 1));
              }
            }}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Submitting to database...</span>
              </>
            ) : (
              <span>{step === 2 ? 'Submit for verification' : step === 3 ? 'Done' : 'Continue'}</span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

