import React, { useState } from 'react';
import { ArrowLeft, User, Phone, IndianRupee, Briefcase, Check, UserPlus, Users } from 'lucide-react';
import { useLabor } from '../context/LaborContext';
import { SalaryType } from '../types';
import { t } from '../utils/strings';

export const AddLaborScreen: React.FC = () => {
  const { addWorker, navigateTo, userProfile } = useLabor();
  const lang = userProfile.language || 'en';

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [salaryType, setSalaryType] = useState<SalaryType>('Daily');
  const [wageStr, setWageStr] = useState('600');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const wage = parseFloat(wageStr) || 0;
    const workerId = addWorker(name.trim(), phoneNumber.trim(), wage, salaryType);
    navigateTo({ type: 'LABOR_DETAIL', workerId });
  };

  const sampleRoles = [
    { label: "Mason (Mistri)", wage: 750, type: "Daily" as SalaryType },
    { label: "Helper / Labour", wage: 550, type: "Daily" as SalaryType },
    { label: "Carpenter", wage: 800, type: "Daily" as SalaryType },
    { label: "Painter", wage: 700, type: "Daily" as SalaryType },
    { label: "Electrician", wage: 850, type: "Daily" as SalaryType },
    { label: "Site Supervisor", wage: 18000, type: "Monthly" as SalaryType }
  ];

  return (
    <div className="pb-24 pt-2 px-3 max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 flex items-center gap-3">
        <button
          onClick={() => navigateTo({ type: 'HOME' })}
          className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-bold text-slate-900 text-base leading-tight">
            {t('add_staff_title', lang)}
          </h2>
          <p className="text-xs text-slate-500">Register new worker / staff member</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('name', lang)} *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Kumar, Sunita Devi"
                className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('phone_number', lang)}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Salary Type Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('salary_type', lang)}
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setSalaryType('Daily')}
                className={`py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  salaryType === 'Daily'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('daily', lang)} (Daily Wage)
              </button>
              <button
                type="button"
                onClick={() => setSalaryType('Monthly')}
                className={`py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  salaryType === 'Monthly'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('monthly', lang)} (Monthly Salary)
              </button>
            </div>
          </div>

          {/* Wage / Salary Amount */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {salaryType === 'Daily' ? 'Daily Wage Rate (₹ / Day)' : 'Monthly Fixed Salary (₹ / Month)'} *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold">
                ₹
              </div>
              <input
                type="number"
                step="any"
                min="0"
                required
                value={wageStr}
                onChange={(e) => setWageStr(e.target.value)}
                placeholder="Enter wage amount"
                className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-black text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Quick presets */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Quick Role Presets
            </span>
            <div className="flex flex-wrap gap-2">
              {sampleRoles.map((role, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setName(role.label);
                    setWageStr(String(role.wage));
                    setSalaryType(role.type);
                  }}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 transition"
                >
                  {role.label} (₹{role.wage}/{role.type === 'Monthly' ? 'mo' : 'd'})
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={() => navigateTo({ type: 'HOME' })}
              className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
            >
              {t('cancel', lang)}
            </button>
            <button
              type="submit"
              className="flex-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/25 transition flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t('save', lang)} Staff</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
