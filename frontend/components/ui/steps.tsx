import React from 'react';
import { Check } from 'lucide-react';

interface StepsProps {
  items: string[];
  active: number;
}

export function Steps({ items, active }: StepsProps) {
  return (
    <div className="flex items-start justify-between">
      {items.map((x, i) => (
        <div key={x} className="flex min-w-0 flex-1 flex-col items-center">
          <div className="flex w-full items-center">
            <div
              className={`h-1 flex-1 ${
                i ? (i <= active ? 'bg-[#2E2A47]' : 'bg-slate-200') : 'bg-transparent'
              }`}
            />
            <div
              className={`grid size-7 place-items-center rounded-full text-[11px] font-bold ${
                i < active
                  ? 'bg-[#2E2A47] text-white'
                  : i === active
                  ? 'border-2 border-[#2E2A47] text-[#2E2A47]'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {i < active ? <Check size={13} /> : i + 1}
            </div>
            <div
              className={`h-1 flex-1 ${
                i === items.length - 1
                  ? 'bg-transparent'
                  : i < active
                  ? 'bg-[#2E2A47]'
                  : 'bg-slate-200'
              }`}
            />
          </div>
          <span
            className={`mt-2 text-center text-[10px] ${
              i === active ? 'font-bold text-[#2E2A47]' : 'text-slate-600'
            }`}
          >
            {x}
          </span>
        </div>
      ))}
    </div>
  );
}
