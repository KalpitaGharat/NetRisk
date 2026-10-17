import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  KeyRound, 
  Eye, 
  EyeOff,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { NetRiskAPI } from '../api';

export default function LoginPage({ onLoginSuccess, currentUser, onBackToDashboard }) {
  const [username, setUsername] = useState('kalpita.gharat');
  const [password, setPassword] = useState('architect-sec-2026');
  const [role, setRole] = useState('Lead Security Architect');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState(null);

  const roles = [
    { id: 'lead', title: 'Lead Security Architect', clearance: 'Level 4: Full Read/Write & Deployment' },
    { id: 'analyst', title: 'Senior SOC Risk Analyst', clearance: 'Level 3: Evaluation & Simulation Access' },
    { id: 'evaluator', title: 'CIAP Faculty Evaluator', clearance: 'Level 5: Academic Audit & Assessment Verification' },
  ];

  const handleLogin = async (e) => {
    e?.preventDefault();
    setAuthError(null);
    setIsAuthenticating(true);
    try {
      const res = await NetRiskAPI.login({
        username: username.trim(),
        password: password.trim(),
        role: role,
      });
      if (res && res.token) {
        localStorage.setItem('netrisk_token', res.token);
      }
      if (onLoginSuccess && res.user) {
        onLoginSuccess(res.user);
      }
    } catch (err) {
      setAuthError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleQuickDemoLogin = async (selectedRole, demoName) => {
    setUsername(demoName);
    setPassword('demo-access-2026');
    setRole(selectedRole);
    setAuthError(null);
    setIsAuthenticating(true);
    try {
      const res = await NetRiskAPI.login({
        username: demoName,
        password: 'demo-access-2026',
        role: selectedRole,
      });
      if (res && res.token) {
        localStorage.setItem('netrisk_token', res.token);
      }
      if (onLoginSuccess && res.user) {
        onLoginSuccess(res.user);
      }
    } catch (err) {
      setAuthError(err.message || 'Demo authentication failed.');
    } finally {
      setIsAuthenticating(false);
    }
  };


  return (
    <div className="min-h-screen bg-cyber-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-cyan/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-cyber-blue/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Back to Dashboard if already authenticated */}
      {onBackToDashboard && (
        <button
          onClick={onBackToDashboard}
          className="absolute top-6 left-6 z-20 px-3.5 py-2 rounded-xl bg-cyber-card border border-cyber-border text-xs font-semibold text-cyber-textSecondary hover:text-white hover:border-cyber-cyan transition flex items-center gap-2"
        >
          <span>&larr; Return to Dashboard</span>
        </button>
      )}

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-cyber-card border border-cyber-border/80 rounded-3xl p-8 shadow-2xl relative z-10 backdrop-blur-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyber-blue to-cyber-cyan flex items-center justify-center text-cyber-bg font-extrabold mx-auto shadow-glowCyan">
            <ShieldAlert className="w-8 h-8 text-cyber-bg stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            NETRISK
            <span className="text-[10px] bg-cyber-cyan/15 text-cyber-cyan px-2 py-0.5 rounded-full font-mono border border-cyber-cyan/30">
              v2.0
            </span>
          </h1>
          <p className="text-xs text-cyber-textSecondary font-medium">
            AI-IDS Risk-Aware SDLC Decision Platform
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SECURE ACCESS PORTAL</span>
          </div>
        </div>

        {/* Authentication Error Banner */}
        {authError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block text-rose-200">Authentication Failed</span>
              <span>{authError}</span>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Identity input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-cyber-textMuted uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyber-cyan" />
              <span>Security Analyst Identity / Email</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-cyber-elevated text-white text-xs font-semibold rounded-xl px-4 py-3 border border-cyber-border focus:border-cyber-cyan focus:outline-none transition"
                placeholder="e.g. kalpita.gharat"
                required
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-cyber-textMuted uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-cyber-cyan" />
              <span>Password / Access Key</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-cyber-elevated text-white text-xs font-mono rounded-xl px-4 py-3 border border-cyber-border focus:border-cyber-cyan focus:outline-none transition pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-textMuted hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Role clearance selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-cyber-textMuted uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyber-cyan" />
              <span>Operational Role &amp; Clearance</span>
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-cyber-elevated text-white text-xs font-semibold rounded-xl px-3.5 py-3 border border-cyber-border focus:border-cyber-cyan focus:outline-none transition"
            >
              {roles.map(r => (
                <option key={r.id} value={r.title}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyber-blue to-cyber-cyan text-cyber-bg font-extrabold text-sm shadow-glowCyan hover:brightness-110 transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {isAuthenticating ? (
              <>
                <div className="w-4 h-4 border-2 border-cyber-bg border-t-transparent rounded-full animate-spin" />
                <span>Verifying Security Clearance...</span>
              </>
            ) : (
              <>
                <span>Authenticate Session</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Access Buttons */}
        <div className="pt-2 border-t border-cyber-border/70 space-y-2.5">
          <p className="text-[11px] font-mono uppercase tracking-wider text-center text-cyber-textMuted">
            ⚡ 1-Click Capstone Demo Profiles
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDemoLogin('Lead Security Architect', 'kalpita.gharat')}
              className="px-3 py-2 rounded-lg bg-cyber-elevated hover:bg-white/10 border border-cyber-border text-[11px] font-semibold text-white flex items-center justify-center gap-1.5 transition"
            >
              <KeyRound className="w-3 h-3 text-cyber-cyan" />
              <span>Kalpita Gharat</span>
            </button>
            <button
              onClick={() => handleQuickDemoLogin('CIAP Faculty Evaluator', 'faculty.evaluator')}
              className="px-3 py-2 rounded-lg bg-cyber-elevated hover:bg-white/10 border border-cyber-border text-[11px] font-semibold text-white flex items-center justify-center gap-1.5 transition"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Faculty Evaluator</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[10px] text-cyber-textMuted font-mono">
          UN SDG 9 Aligned Infrastructure &bull; CIAP Capstone Demonstration
        </div>
      </div>
    </div>
  );
}
