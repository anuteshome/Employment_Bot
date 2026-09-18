'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/shared/header';
import { ModeSwitcher } from '@/components/shared/mode-switcher';
import { EmployeeWizard } from '@/features/employee/EmployeeWizard';
import { EmployerWizard } from '@/features/employer/EmployerWizard';
import { loginWithTelegram, loginDevMode } from '@/services/authService';

export default function Page() {
  const [mode, setMode] = useState<'employee' | 'employer'>('employee');
  const [authStatus, setAuthStatus] = useState<string>('Initializing...');

  useEffect(() => {
    // Automatically initialize Telegram Mini App & authenticate with backend
    if (typeof window !== 'undefined') {
      const initData = window.Telegram?.WebApp?.initData;
      if (initData) {
        window.Telegram?.WebApp?.ready();
        window.Telegram?.WebApp?.expand();

        loginWithTelegram(initData)
          .then((res) => {
            setAuthStatus(`Authenticated as @${res.user.username || res.user.telegram_user_id}`);
          })
          .catch((err) => {
            setAuthStatus(`Auth Error: ${err.message}`);
          });
      } else {
        // Fallback for standalone browser testing
        loginDevMode()
          .then((res) => {
            setAuthStatus(`Dev Mode (@${res.user.username})`);
          })
          .catch((err) => {
            setAuthStatus(`Dev Auth Error: ${err.message}`);
          });
      }
    }
  }, []);


  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <Header />
      <div className="mx-auto max-w-5xl px-4 pb-12 pt-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-600">
              Welcome to talentflow
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Let&apos;s get you set up
            </h1>
          </div>
          <span className="hidden sm:inline-block rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600 border border-slate-200">
            {authStatus}
          </span>
        </div>

        <ModeSwitcher mode={mode} onChange={setMode} />

        {mode === 'employee' ? <EmployeeWizard /> : <EmployerWizard />}

        <p className="mt-6 text-center text-[11px] text-slate-600">
          By continuing, you agree to our{' '}
          <span className="font-semibold text-[#2E2A47] cursor-pointer hover:underline">
            Terms
          </span>{' '}
          and{' '}
          <span className="font-semibold text-[#2E2A47] cursor-pointer hover:underline">
            Privacy Policy
          </span>
          .
        </p>
      </div>
    </main>
  );
}
