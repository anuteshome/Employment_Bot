import React from 'react';
import { Upload, FileText, Trash2, LockKeyhole } from 'lucide-react';
import { StepHeader } from '@/components/shared/step-header';

interface UploadCvStepProps {
  fileName?: string;
  fileSize?: string;
  onFileSelect?: (file: File) => void;
}

export function UploadCvStep({
  fileName = 'Alex_Morgan_CV.pdf',
  fileSize = '2.4 MB',
}: UploadCvStepProps) {
  return (
    <>
      <StepHeader
        step="Step 3 of 4"
        title="Upload your CV"
        desc="PDF or DOCX files up to 10MB."
      />
      <label className="mt-6 flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-indigo-200 bg-[#F1EFF8]/40 px-5 py-10 text-center hover:bg-[#F1EFF8]/60 transition-colors">
        <input type="file" className="sr-only" accept=".pdf,.docx,.doc" />
        <div className="grid size-12 place-items-center rounded-2xl bg-white text-[#2E2A47] shadow-sm">
          <Upload size={20} />
        </div>
        <b className="mt-3 text-sm">Drag and drop your CV here</b>
        <p className="mt-1 text-xs text-slate-700">
          or <span className="font-bold text-[#2E2A47]">browse files</span>
        </p>
        <div className="mt-4 flex gap-2">
          <span className="rounded bg-white px-2 py-1 text-[10px] font-bold text-rose-500 shadow-sm">
            PDF
          </span>
          <span className="rounded bg-white px-2 py-1 text-[10px] font-bold text-blue-500 shadow-sm">
            DOCX
          </span>
        </div>
      </label>

      <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
        <FileText className="text-rose-500 shrink-0" size={24} />
        <div className="flex-1 min-w-0">
          <b className="text-xs truncate block">{fileName}</b>
          <p className="text-[11px] text-slate-700">{fileSize} · Ready to upload</p>
          <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full w-4/5 rounded-full bg-emerald-500" />
          </div>
        </div>
        <button type="button" className="text-slate-600 hover:text-rose-500 transition-colors">
          <Trash2 size={15} />
        </button>
      </div>

      <p className="mt-5 flex items-center gap-2 text-xs text-slate-700">
        <LockKeyhole size={14} className="text-emerald-600 shrink-0" />
        <span>Encrypted and only visible to verified employers.</span>
      </p>
    </>
  );
}
