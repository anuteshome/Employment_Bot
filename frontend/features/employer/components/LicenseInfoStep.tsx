import React from 'react';
import { MapPin, ShieldCheck } from 'lucide-react';
import { StepHeader } from '@/components/shared/step-header';
import { Field } from '@/components/ui/field';

interface LicenseInfoStepProps {
  formData: {
    taxId: string;
    location: string;
    regDate: string;
  };
  onChange: (field: string, value: string) => void;
}

export function LicenseInfoStep({ formData, onChange }: LicenseInfoStepProps) {
  return (
    <>
      <StepHeader
        step="Step 2 of 4"
        title="License information"
        desc="Verify your legal registration details."
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field
          label="Business Tax ID / TIN"
          placeholder="12-3456789"
          value={formData.taxId}
          onChange={(e) => onChange('taxId', e.target.value)}
        />
        <Field
          label="Issuing city / region"
          placeholder="Addis Ababa, Ethiopia"
          icon={MapPin}
          value={formData.location}
          onChange={(e) => onChange('location', e.target.value)}
        />
        <Field
          label="Registration date"
          placeholder="MM / DD / YYYY"
          value={formData.regDate}
          onChange={(e) => onChange('regDate', e.target.value)}
        />
      </div>

      <div className="mt-5 flex gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800 items-center">
        <ShieldCheck size={16} className="shrink-0" />
        <span>Credentials checked against official registries.</span>
      </div>
    </>
  );
}
