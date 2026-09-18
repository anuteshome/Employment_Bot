import React from 'react';
import { Check, ShieldCheck } from 'lucide-react';
import { StepHeader } from '@/components/shared/step-header';

interface VerificationStatusStepProps {
  companyName?: string;
  verificationStatus?: string;
  onEditProfile?: () => void;
}

export function VerificationStatusStep({
  companyName = 'Acme Corporation PLC',
  verificationStatus = 'PENDING',
  onEditProfile,
}: VerificationStatusStepProps) {
  const isVerified = verificationStatus === 'VERIFIED';
  const isUnderReview = verificationStatus === 'UNDER_REVIEW' || verificationStatus === 'PENDING';

  return (
    <>
      <div className="flex items-center justify-between">
        <StepHeader
          step="Step 4 of 4"
          title="Verification status"
          desc={`Verification status for ${companyName}.`}
        />
        {onEditProfile && (
          <button
            type="button"
            onClick={onEditProfile}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Edit Details
          </button>
        )}
      </div>

      <div className="mt-6 rounded-2xl bg-slate-900 p-5 text-white">
        <p className="text-xs text-slate-400 font-medium">Current status</p>
        <div className="mt-1 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white capitalize">
            {verificationStatus.replace('_', ' ').toLowerCase()}
          </h3>
          {isVerified && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
              <ShieldCheck size={14} />
              Verified Employer
            </span>
          )}
        </div>
        
        <div className="mt-5 flex items-center justify-between text-center text-[10px] text-slate-400">
          <div>
            <div className="mx-auto mb-2 grid size-7 place-items-center rounded-full bg-emerald-500 text-white font-bold">
              <Check size={14} />
            </div>
            <span>Submitted</span>
          </div>
          <div className="h-px flex-1 bg-slate-700 mx-2" />
          <div>
            <div className={`mx-auto mb-2 grid size-7 place-items-center rounded-full border font-bold ${
              isUnderReview ? 'border-emerald-400 text-emerald-400' : 'bg-emerald-500 text-white'
            }`}>
              {isVerified ? <Check size={14} /> : '2'}
            </div>
            <span className={isUnderReview ? 'text-emerald-400 font-semibold' : ''}>Under review</span>
          </div>
          <div className="h-px flex-1 bg-slate-700 mx-2" />
          <div>
            <div className={`mx-auto mb-2 grid size-7 place-items-center rounded-full border ${
              isVerified ? 'bg-emerald-500 text-white font-bold' : 'border-slate-600 text-slate-500'
            }`}>
              {isVerified ? <Check size={14} /> : '3'}
            </div>
            <span className={isVerified ? 'text-emerald-400 font-bold' : ''}>Verified</span>
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

