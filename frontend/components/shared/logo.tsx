import React from 'react';
import { Sparkles } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 text-sm font-bold">
      <div className="grid size-8 place-items-center rounded-xl bg-[#2E2A47] text-white">
        <Sparkles size={16} />
      </div>
      <span>talent</span>
      <span className="text-[#2E2A47]">flow</span>
    </div>
  );
}
