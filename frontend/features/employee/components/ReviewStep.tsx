import React from 'react';
import { Pencil } from 'lucide-react';
import { StepHeader } from '@/components/shared/step-header';

interface ReviewStepProps {
  personalInfoSummary: string;
  professionalSummary: string;
  documentsSummary: string;
  agreed: boolean;
  onAgreeChange: (agreed: boolean) => void;
  onEditStep: (stepIndex: number) => void;
}

export function ReviewStep({
  personalInfoSummary,
  professionalSummary,
  documentsSummary,
  agreed,
  onAgreeChange,
  onEditStep,
}: ReviewStepProps) {
  const sections = [
    { title: 'Personal information', summary: personalInfoSummary, stepIndex: 0 },
    { title: 'Professional details', summary: professionalSummary, stepIndex: 1 },
    { title: 'Documents', summary: documentsSummary, stepIndex: 2 },
  ];

  return (
    <>
      <StepHeader
        step="Step 4 of 4"
        title="Review your application"
        desc="Make sure everything looks right before submitting."
      />
      <div className="mt-6 space-y-3">
        {sections.map(({ title, summary, stepIndex }) => (
          <div key={title} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex justify-between items-center text-xs font-bold">
              <span>{title}</span>
              <button
                type="button"
                onClick={() => onEditStep(stepIndex)}
                className="text-[#2E2A47] hover:underline flex items-center gap-1"
              >
                <Pencil size={13} />
                <span>Edit</span>
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-700 leading-relaxed">{summary}</p>
          </div>
        ))}

        <label className="flex gap-2 pt-2 text-xs text-slate-600 items-start cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => onAgreeChange(e.target.checked)}
            className="accent-indigo-600 mt-0.5 rounded"
          />
          <span>I agree to the terms of service and privacy policy.</span>
        </label>
      </div>
    </>
  );
}
