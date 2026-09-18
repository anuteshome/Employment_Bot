import React from 'react';
import { Check } from 'lucide-react';
import { StepHeader } from '@/components/shared/step-header';

export function VerificationStatusStep() {
  return (
    <>
      <StepHeader
        step="Step 4 of 4"
        title="Verification status"
        desc="Your submission is ready for review."
      />
      <div className="mt-6 rounded-2xl bg-slate-900 p-5 text-white">
        <p className="text-xs text-slate-400 font-medium">Current status</p>
        <h3 className="mt-1 text-xl font-bold text-white">Verification pending</h3>
        
        <div className="mt-5 flex items-center justify-between text-center text-[10px] text-slate-400">
          <div>
            <div className="mx-auto mb-2 grid size-7 place-items-center rounded-full bg-emerald-500 text-white font-bold">
              <Check size={14} />
            </div>
            <span>Submitted</span>
          </div>
          <div className="h-px flex-1 bg-slate-700 mx-2" />
          <div>
            <div className="mx-auto mb-2 grid size-7 place-items-center rounded-full border border-emerald-400 text-emerald-400 font-bold">
              2
            </div>
            <span className="text-emerald-400 font-semibold">Under review</span>
          </div>
          <div className="h-px flex-1 bg-slate-700 mx-2" />
          <div>
            <div className="mx-auto mb-2 grid size-7 place-items-center rounded-full border border-slate-600 text-slate-500">
              3
            </div>
            <span>Verified</span>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-amber-50 p-3.5 text-xs text-amber-800 border border-amber-200">
        <b>Estimated turnaround: 24–48 hours</b>
        <p className="mt-1 leading-relaxed">
          Full employer candidate search & messaging access unlocks after verification.
        </p>
      </div>
    </>
  );
}
