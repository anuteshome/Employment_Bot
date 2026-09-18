import React, { useState } from 'react';
import { X } from 'lucide-react';
import { StepHeader } from '@/components/shared/step-header';
import { Field } from '@/components/ui/field';

interface ProfessionalDetailsStepProps {
  formData: {
    jobTitle: string;
    yearsExp: string;
    portfolio: string;
  };
  skills: string[];
  onFormChange: (field: string, value: string) => void;
  onAddSkill: (skill: string) => void;
  onRemoveSkill: (skill: string) => void;
}

export function ProfessionalDetailsStep({
  formData,
  skills,
  onFormChange,
  onAddSkill,
  onRemoveSkill,
}: ProfessionalDetailsStepProps) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      onAddSkill(input.trim());
      setInput('');
    }
  };

  return (
    <>
      <StepHeader
        step="Step 2 of 4"
        title="Professional details"
        desc="Showcase your experience and strengths."
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field
          label="Current job title"
          placeholder="Senior Product Designer"
          value={formData.jobTitle}
          onChange={(e) => onFormChange('jobTitle', e.target.value)}
        />
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-700">Years of experience</span>
          <select
            value={formData.yearsExp}
            onChange={(e) => onFormChange('yearsExp', e.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#EA580C]"
          >
            <option value="5–7 years">5–7 years</option>
            <option value="1–3 years">1–3 years</option>
            <option value="8+ years">8+ years</option>
          </select>
        </label>
      </div>

      <div className="mt-4 space-y-1.5">
        <span className="text-xs font-semibold text-slate-700">Skills</span>
        <div className="flex min-h-11 flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#F1EFF8] px-2.5 py-1 text-xs font-semibold text-[#2E2A47]"
            >
              {skill}
              <button
                type="button"
                onClick={() => onRemoveSkill(skill)}
                className="hover:text-rose-500 transition-colors"
              >
                <X size={11} />
              </button>
            </span>
          ))}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a skill and press Enter..."
            className="min-w-24 flex-1 outline-none text-sm placeholder:text-slate-600 bg-transparent px-1"
          />
        </div>
      </div>

      <div className="mt-4">
        <Field
          label="Portfolio link"
          placeholder="https://yourportfolio.com"
          value={formData.portfolio}
          onChange={(e) => onFormChange('portfolio', e.target.value)}
        />
      </div>
    </>
  );
}
