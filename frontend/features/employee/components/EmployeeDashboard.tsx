import React from 'react';
import { Clock3, FileText } from 'lucide-react';

interface EmployeeDashboardProps {
  fullName: string;
  jobTitle: string;
  yearsExp: string;
  skills: string[];
  cvFileName: string;
  cvFileSize: string;
}

export function EmployeeDashboard({
  fullName = 'Alex Morgan',
  jobTitle = 'Senior Product Designer',
  yearsExp = '5–7',
  skills = ['React', 'TypeScript', 'Product Design'],
  cvFileName = 'Alex_Morgan_CV.pdf',
  cvFileSize = '2.4 MB',
}: EmployeeDashboardProps) {
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="bg-slate-900 p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="grid size-16 place-items-center rounded-full bg-[#2E2A47] font-bold text-lg text-white">
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-bold">{fullName}</h2>
            <p className="text-sm text-slate-300">{jobTitle}</p>
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#EA580C]/20 px-2.5 py-1 text-[10px] font-bold text-orange-200">
              <Clock3 size={11} />
              Under review
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x border-b border-slate-100 py-4 text-center">
        <div>
          <b className="text-base text-slate-900">{yearsExp}</b>
          <p className="text-[10px] text-slate-600">Years exp.</p>
        </div>
        <div>
          <b className="text-base text-slate-900">{skills.length}</b>
          <p className="text-[10px] text-slate-600">Core skills</p>
        </div>
        <div>
          <b className="text-base text-slate-900">1</b>
          <p className="text-[10px] text-slate-600">CV uploaded</p>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Skills
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-lg bg-[#F1EFF8] px-3 py-1.5 text-xs font-semibold text-[#2E2A47]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 bg-slate-50/50">
          <FileText className="text-rose-500 shrink-0" size={24} />
          <div className="flex-1 min-w-0">
            <b className="text-xs truncate block">{cvFileName}</b>
            <p className="text-[11px] text-slate-700">
              {cvFileSize} · Uploaded securely
            </p>
          </div>
          <button
            type="button"
            className="rounded-lg bg-[#F1EFF8] px-3 py-2 text-[11px] font-bold text-[#2E2A47] hover:bg-[#E2DEEE] transition-colors"
          >
            View CV
          </button>
        </div>
      </div>
    </div>
  );
}
