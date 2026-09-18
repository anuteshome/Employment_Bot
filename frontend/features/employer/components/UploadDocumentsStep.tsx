import React from 'react';
import { FileText } from 'lucide-react';
import { StepHeader } from '@/components/shared/step-header';

export function UploadDocumentsStep() {
  const documents = [
    { title: 'Business License', status: 'Uploaded', verified: true },
    { title: 'Incorporation / TIN Certificate', status: 'Verifying format', verified: false },
  ];

  return (
    <>
      <StepHeader
        step="Step 3 of 4"
        title="Upload documents"
        desc="Securely upload your company credentials."
      />
      <div className="mt-6 space-y-3">
        {documents.map(({ title, status, verified }) => (
          <div key={title} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
            <FileText className="text-rose-500 shrink-0" size={24} />
            <div className="flex-1 min-w-0">
              <b className="text-xs truncate block">{title}</b>
              <p className="text-[11px] text-slate-600">PDF · up to 10MB</p>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                verified
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : 'bg-amber-50 text-amber-600 border border-amber-200'
              }`}
            >
              {status}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
