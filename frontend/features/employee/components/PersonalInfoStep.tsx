import React from 'react';
import { UserRound, Mail, Phone, MapPin } from 'lucide-react';
import { StepHeader } from '@/components/shared/step-header';
import { Field } from '@/components/ui/field';

interface PersonalInfoStepProps {
  formData: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    emergencyName: string;
    emergencyPhone: string;
  };
  onChange: (field: string, value: string) => void;
}

export function PersonalInfoStep({ formData, onChange }: PersonalInfoStepProps) {
  return (
    <>
      <StepHeader
        step="Step 1 of 4"
        title="Personal information"
        desc="Tell us a little about yourself."
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field
          label="Full name"
          placeholder="Alex Morgan"
          icon={UserRound}
          value={formData.fullName}
          onChange={(e) => onChange('fullName', e.target.value)}
        />
        <Field
          label="Email address"
          placeholder="alex@company.com"
          icon={Mail}
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
        />
        <Field
          label="Phone number"
          placeholder="+251 (911) 000-000"
          icon={Phone}
          value={formData.phone}
          onChange={(e) => onChange('phone', e.target.value)}
        />
        <Field
          label="Location"
          placeholder="Addis Ababa, Ethiopia"
          icon={MapPin}
          value={formData.location}
          onChange={(e) => onChange('location', e.target.value)}
        />
      </div>

      <div className="mt-5 flex items-center gap-4 rounded-2xl bg-[#FAFAFA] p-3 border border-slate-100">
        <div className="grid size-14 place-items-center rounded-full bg-indigo-100 text-[#2E2A47]">
          <UserRound size={24} />
        </div>
        <div className="flex-1">
          <b className="text-xs">Profile photo</b>
          <p className="text-[11px] text-slate-700">JPG or PNG, max 5MB</p>
        </div>
        <button
          type="button"
          className="rounded-lg border bg-white px-3 py-2 text-xs font-bold text-[#2E2A47] hover:bg-slate-50 transition-colors"
        >
          Upload
        </button>
      </div>

      <div className="mt-6 border-t pt-5">
        <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-600">
          Emergency contact
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Contact name"
            placeholder="Jordan Morgan"
            value={formData.emergencyName}
            onChange={(e) => onChange('emergencyName', e.target.value)}
          />
          <Field
            label="Contact phone"
            placeholder="+251 (911) 000-000"
            icon={Phone}
            value={formData.emergencyPhone}
            onChange={(e) => onChange('emergencyPhone', e.target.value)}
          />
        </div>
      </div>
    </>
  );
}
