import React from 'react';

interface StepHeaderProps {
  step: string;
  title: string;
  desc: string;
}

export function StepHeader({ step, title, desc }: StepHeaderProps) {
  return (
    <>
      <p className="text-[11px] font-bold uppercase tracking-widest text-[#2E2A47]">
        {step}
      </p>
      <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
        {title}
      </h2>
      <p className="mt-1 text-sm text-slate-700">
        {desc}
      </p>
    </>
  );
}
