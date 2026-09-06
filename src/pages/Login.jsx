import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, LockKeyhole, LoaderCircle, ShieldAlert, UserRound } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSigningIn(true);
    window.setTimeout(() => navigate('/dashboard'), 700);
  };

  const updateCredential = (event) => {
    const { name, value } = event.target;
    setCredentials((current) => ({ ...current, [name]: value }));
  };

  return (
    <main className="min-h-screen bg-[#E9EEF5] text-[#1E293B] flex items-center justify-center p-4 sm:p-8">
      {isSigningIn && (
        <div className="sign-in-curtain" aria-hidden="true">
          <LoaderCircle className="h-8 w-8 animate-spin text-white/80" />
        </div>
      )}
      <div className="w-full max-w-5xl overflow-hidden rounded-lg border border-[#d8d5cd] bg-white shadow-xl shadow-slate-900/10 lg:grid lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-[#102a43] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[28px] border-[#e4a11b]/15" />
          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border-[36px] border-[#4d9b72]/15" />

          <div className="relative">
            <div className="mb-12 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#e4a11b] text-[#102a43] shadow-lg shadow-slate-950/30">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <p className="font-mono text-sm font-black tracking-tight">MPLADS AI INTELLIGENCE</p>
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-300">Public programme intelligence | Secure portal</p>
              </div>
            </div>
            <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#f0bf52]">Secure operations access</p>
            <h1 className="max-w-md text-4xl font-black leading-tight tracking-tight">Turn public allocation data into accountable action.</h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-slate-300">A single intelligence workspace for allocation analysis, risk prioritisation, and project monitoring.</p>
          </div>

          <div className="relative flex items-center gap-3 border-t border-slate-800 pt-5 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <span className="h-2 w-2 rounded-full bg-[#63b887] shadow-[0_0_0_4px_rgba(99,184,135,0.14)]" />
            Intelligence systems operational
          </div>
        </section>

        <section className="p-6 sm:p-10 lg:p-14">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#102a43] text-[#f0bf52]">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <p className="font-mono text-sm font-black tracking-tight text-slate-900">MPLADS AI INTELLIGENCE</p>
            </div>
          </div>

          <div className="mb-8">
            <p className="mb-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#1d5b85]">Operator portal</p>
            <h2 className="text-3xl font-black tracking-tight text-slate-950">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-500">Sign in to access the intelligence command center.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider text-slate-700">Official email</span>
              <span className="relative block">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={updateCredential}
                  placeholder="operator@government.gov.in"
                  className="w-full rounded-md border border-[#c9c7c0] bg-[#faf9f6] py-3 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#1d5b85] focus:bg-white focus:ring-2 focus:ring-[#d9e8f1]"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider text-slate-700">Password</span>
              <span className="relative block">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={credentials.password}
                  onChange={updateCredential}
                  placeholder="Enter your password"
                  className="w-full rounded-md border border-[#c9c7c0] bg-[#faf9f6] py-3 pl-10 pr-11 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#1d5b85] focus:bg-white focus:ring-2 focus:ring-[#d9e8f1]"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </span>
            </label>

            <div className="flex items-center justify-between gap-4 text-xs">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-[#1d5b85] focus:ring-[#1d5b85]" />
                Keep me signed in
              </label>
              <button type="button" className="font-semibold text-blue-700 hover:text-blue-900">Forgot password?</button>
            </div>

            <button disabled={isSigningIn} type="submit" className="flex w-full items-center justify-center gap-2 rounded-md bg-[#1d5b85] py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#164968] focus:outline-none focus:ring-2 focus:ring-[#1d5b85] focus:ring-offset-2 disabled:cursor-wait disabled:opacity-80">
              {isSigningIn ? 'Opening command center...' : 'Sign in to command center'}
              {isSigningIn ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>
          </form>

          <p className="mt-8 border-t border-slate-200 pt-5 text-center text-xs text-slate-500">
            Access restricted to authorised personnel. <Link to="/dashboard" className="font-semibold text-blue-700 hover:text-blue-900">View demo workspace</Link>
          </p>
        </section>
      </div>
    </main>
  );
}