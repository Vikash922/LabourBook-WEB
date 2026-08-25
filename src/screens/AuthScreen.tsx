import React, { useState } from 'react';
import { Mail, Lock, EyeOff, Building2, Phone, RefreshCw, Cloud, Shield } from 'lucide-react';

export const AuthScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F2F5]">
      {/* Top Section - Dark Blue */}
      <div className="bg-[#22495F] pt-12 pb-24 px-4 flex flex-col items-center flex-shrink-0">
        {/* Logo area */}
        <div className="w-[100px] h-[100px] bg-white rounded-full flex items-center justify-center shadow-lg mb-4 overflow-hidden">
          <img src="/ic_app_logo.png" alt="LaborBook Logo" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-white text-2xl font-bold tracking-wide mb-1">Laborbook</h1>
        <p className="text-[#a8c1d1] text-[13px]">Smart Attendance, Wages & Cash Book</p>
      </div>

      {/* Main Card */}
      <div className="flex-1 px-4 -mt-16 pb-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-md mx-auto relative z-10">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab('signin')}
              className={`flex-1 py-4 text-[15px] font-semibold transition-colors relative ${
                activeTab === 'signin' ? 'text-[#1C3B4E]' : 'text-[#707A8A]'
              }`}
            >
              Sign In
              {activeTab === 'signin' && (
                <div className="absolute bottom-0 left-6 right-6 h-[3px] bg-[#1C3B4E]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-4 text-[15px] font-semibold transition-colors relative ${
                activeTab === 'signup' ? 'text-[#1C3B4E]' : 'text-[#707A8A]'
              }`}
            >
              Create Account
              {activeTab === 'signup' && (
                <div className="absolute bottom-0 left-6 right-6 h-[3px] bg-[#1C3B4E]" />
              )}
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'signin' ? (
              <div className="space-y-5">
                <div className="relative">
                  <Mail className="absolute left-1 top-3.5 text-[#707A8A] w-[22px] h-[22px]" strokeWidth={1.5} />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full pl-10 py-3.5 border-b border-[#EAEAEA] text-[15px] text-slate-800 focus:outline-none focus:border-[#22495F] placeholder-[#707A8A]"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-1 top-3.5 text-[#707A8A] w-[22px] h-[22px]" strokeWidth={1.5} />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full pl-10 pr-10 py-3.5 border-b border-[#EAEAEA] text-[15px] text-slate-800 focus:outline-none focus:border-[#22495F] placeholder-[#707A8A]"
                  />
                  <EyeOff className="absolute right-1 top-3.5 text-[#707A8A] w-[22px] h-[22px] cursor-pointer" strokeWidth={1.5} />
                </div>

                <div className="text-center mt-6 mb-2 pt-2">
                  <button className="text-[13px] font-bold text-[#22495F]">
                    Forgot password?
                  </button>
                </div>

                <button 
                  onClick={onLogin}
                  className="w-full bg-[#20485F] text-white rounded-xl py-3.5 text-[15px] font-semibold hover:bg-[#1a3848] transition-colors shadow-sm"
                >
                  Sign In with Email
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="relative">
                  <Building2 className="absolute left-1 top-3.5 text-[#707A8A] w-[22px] h-[22px]" strokeWidth={1.5} />
                  <input
                    type="text"
                    placeholder="Business / Contractor Name"
                    className="w-full pl-10 py-3.5 border-b border-[#EAEAEA] text-[15px] text-slate-800 focus:outline-none focus:border-[#22495F] placeholder-[#707A8A]"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-1 top-3.5 text-[#707A8A] w-[22px] h-[22px]" strokeWidth={1.5} />
                  <input
                    type="tel"
                    placeholder="Mobile Number (Optional)"
                    className="w-full pl-10 py-3.5 border-b border-[#EAEAEA] text-[15px] text-slate-800 focus:outline-none focus:border-[#22495F] placeholder-[#707A8A]"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-1 top-3.5 text-[#707A8A] w-[22px] h-[22px]" strokeWidth={1.5} />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full pl-10 py-3.5 border-b border-[#EAEAEA] text-[15px] text-slate-800 focus:outline-none focus:border-[#22495F] placeholder-[#707A8A]"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-1 top-3.5 text-[#707A8A] w-[22px] h-[22px]" strokeWidth={1.5} />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full pl-10 pr-10 py-3.5 border-b border-[#EAEAEA] text-[15px] text-slate-800 focus:outline-none focus:border-[#22495F] placeholder-[#707A8A]"
                  />
                  <EyeOff className="absolute right-1 top-3.5 text-[#707A8A] w-[22px] h-[22px] cursor-pointer" strokeWidth={1.5} />
                </div>

                <div className="pt-2">
                  <button 
                    onClick={onLogin}
                    className="w-full bg-[#20485F] text-white rounded-xl py-3.5 text-[15px] font-semibold hover:bg-[#1a3848] transition-colors shadow-sm"
                  >
                    Create Account with Email
                  </button>
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center justify-center relative">
              <div className="w-full h-px bg-[#EAEAEA] absolute top-1/2 -translate-y-1/2"></div>
              <span className="px-3 text-[11px] uppercase font-semibold text-[#707A8A] tracking-wide relative bg-white">
                OR WITH GOOGLE
              </span>
            </div>

            <button 
              onClick={onLogin}
              className="mt-6 w-full flex items-center justify-center gap-3 border border-[#EAEAEA] rounded-full py-3 hover:bg-gray-50 transition-colors"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-[18px] h-[18px]" />
              <span className="text-[15px] font-bold text-slate-800">
                Continue with Google
              </span>
            </button>
          </div>
        </div>

        {/* Bottom Features */}
        <div className="mt-10 flex justify-center gap-8 text-center max-w-md mx-auto">
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="w-5 h-5 text-[#707A8A]" strokeWidth={2} />
            <span className="text-[11px] font-bold text-[#112940]">Auto Cloud Sync</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Cloud className="w-5 h-5 text-[#707A8A]" strokeWidth={2} />
            <span className="text-[11px] font-bold text-[#112940]">Instant Restore</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Shield className="w-5 h-5 text-[#707A8A]" strokeWidth={2} />
            <span className="text-[11px] font-bold text-[#112940]">100% Private</span>
          </div>
        </div>
      </div>
    </div>
  );
};
