import React from 'react';
import { CircleHelp } from 'lucide-react';
import { Logo } from './logo';

export function Header() {
  return (
    <header className="bg-white border-b border-slate-100">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Logo />
        <button
          type="button"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
        >
          <CircleHelp size={16} />
          <span>Help</span>
        </button>
      </div>
    </header>
  );
}
