import React from 'react';
import { UserRound, Building2 } from 'lucide-react';

interface ModeSwitcherProps {
  mode: 'employee' | 'employer';
  onChange: (mode: 'employee' | 'employer') => void;
}

export function ModeSwitcher({ mode, onChange }: ModeSwitcherProps) {
  return (
    <div className="my-7 grid grid-cols-2 rounded-xl bg-slate-200 p-1">
      <button
        type="button"
        onClick={() => onChange('employee')}
        className={`rounded-lg py-2.5 text-xs font-bold transition-all ${
          mode === 'employee'
            ? 'bg-white text-[#2E2A47] shadow-sm'
            : 'text-slate-700 hover:text-slate-900'
        }`}
      >
        <UserRound size={15} className="mr-2 inline" />
        I&apos;m an employee
      </button>
      <button
        type="button"
        onClick={() => onChange('employer')}
        className={`rounded-lg py-2.5 text-xs font-bold transition-all ${
          mode === 'employer'
            ? 'bg-white text-slate-800 shadow-sm'
            : 'text-slate-700 hover:text-slate-900'
        }`}
      >
        <Building2 size={15} className="mr-2 inline" />
        I&apos;m an employer
      </button>
    </div>
  );
}
