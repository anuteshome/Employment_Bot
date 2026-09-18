import React from 'react';
import { Building2, Mail, Globe2 } from 'lucide-react';
import { StepHeader } from '@/components/shared/step-header';
import { Field } from '@/components/ui/field';

interface CompanyInfoStepProps {
  formData: {
    companyName: string;
    regNumber: string;
    email: string;
    website: string;
  };
  onChange: (field: string, value: string) => void;
}

export function CompanyInfoStep({ formData, onChange }: CompanyInfoStepProps) {
  return (
    <>
      <StepHeader
        step="Step 1 of 4"
        title="Company information"
        desc="Tell us about your organization."
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field
          label="Company legal name"
          placeholder="Acme Corporation PLC"
          icon={Building2}
          value={formData.companyName}
          onChange={(e) => onChange('companyName', e.target.value)}
        />
        <Field
          label="Registration number"
          placeholder="REG-0001234"
          value={formData.regNumber}
          onChange={(e) => onChange('regNumber', e.target.value)}
        />
        <Field
          label="Official domain email"
          placeholder="hello@acme.com"
          icon={Mail}
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
        />
        <Field
          label="Website URL"
          placeholder="https://acme.com"
          icon={Globe2}
          value={formData.website}
          onChange={(e) => onChange('website', e.target.value)}
        />
      </div>
    </>
  );
}
