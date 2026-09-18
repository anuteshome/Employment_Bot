import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FieldProps {
  label: string;
  placeholder: string;
  icon?: LucideIcon;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Field({
  label,
  placeholder,
  icon: Icon,
  type = 'text',
  value,
  onChange,
}: FieldProps) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold text-slate-700">{label}</span>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none placeholder:text-slate-600 focus:border-[#EA580C] transition-colors"
        />
        {Icon && (
          <Icon size={16} className="absolute right-3 top-3.5 text-slate-600 pointer-events-none" />
        )}
      </div>
    </label>
  );
}
