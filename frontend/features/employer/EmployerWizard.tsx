'use client';

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Steps } from '@/components/ui/steps';
import { CompanyInfoStep } from './components/CompanyInfoStep';
import { LicenseInfoStep } from './components/LicenseInfoStep';
import { UploadDocumentsStep } from './components/UploadDocumentsStep';
import { VerificationStatusStep } from './components/VerificationStatusStep';

const ORG_STEP_ITEMS = ['Company Info', 'License Details', 'Documents', 'Status'];

export function EmployerWizard() {
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    companyName: 'Acme Corporation PLC',
    regNumber: 'REG-0001234',
    email: 'hello@acme.com',
    website: 'https://acme.com',
    taxId: '12-3456789',
    location: 'Addis Ababa, Ethiopia',
    regDate: '01 / 15 / 2023',
  });

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
        {step === 3 && <VerificationStatusStep />}

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
            onClick={() => setStep((prev) => Math.min(3, prev + 1))}
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 transition-colors"
          >
            {step === 3 ? 'Submit for verification' : 'Continue'}
          </button>
        </div>
      </div>
    </>
  );
}
