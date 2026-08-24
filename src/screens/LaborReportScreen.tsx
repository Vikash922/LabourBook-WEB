import React, { useState } from 'react';
import { ArrowLeft, Download, Send, Copy, Check, FileText, Phone, IndianRupee, Calendar } from 'lucide-react';
import { useLabor } from '../context/LaborContext';
import { calculateMonthStats } from '../utils/stats';
import { generateWorkerReportText, downloadWorkerSlipPdf } from '../utils/pdfGenerator';
import { getMonthDays, parseYearMonth } from '../utils/calendar';
import { getAvatarBgWithOpacity } from '../utils/avatar';
import { t } from '../utils/strings';

interface LaborReportScreenProps {
  workerId: string;
}

export const LaborReportScreen: React.FC<LaborReportScreenProps> = ({ workerId }) => {
  const { workers, selectedMonth, navigateTo, showToast, userProfile } = useLabor();
  const lang = userProfile.language || 'en';

  const worker = workers.find((w) => w.id === workerId);
  const [copied, setCopied] = useState(false);

  if (!worker) {
    return (
      <div className="p-8 text-center max-w-md mx-auto">
        <p className="text-slate-600 mb-4">Staff member not found.</p>
        <button
          onClick={() => navigateTo({ type: 'HOME' })}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const stats = calculateMonthStats(worker, selectedMonth);
  const days = getMonthDays(selectedMonth);
  const formattedText = generateWorkerReportText(worker, selectedMonth, stats);

  const isMonthly = (worker.salaryType || '').toLowerCase() === 'monthly';
  const wageDisplay = isMonthly ? `₹${worker.dailyWage} / month` : `₹${worker.dailyWage} / day`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(formattedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast('Wage slip copied to clipboard!');
    }
  };

  const handleWhatsApp = () => {
    const cleanPhone = (worker.phoneNumber || '').replace(/\D/g, '');
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(formattedText)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(formattedText)}`;
    window.open(url, '_blank');
  };

  const handleDownloadPdf = () => {
    downloadWorkerSlipPdf(worker, selectedMonth);
    showToast('Worker Wage Slip PDF downloaded!');
  };

  return (
    <div className="pb-24 pt-2 px-3 max-w-4xl mx-auto space-y-3.5">
      {/* 1. Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo({ type: 'LABOR_DETAIL', workerId: worker.id })}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-bold text-slate-900 text-base leading-tight">Monthly Wage Slip</h2>
            <p className="text-xs text-slate-500">{worker.name} • {selectedMonth}</p>
          </div>
        </div>

        <button
          onClick={handleDownloadPdf}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
        >
          <Download className="w-4 h-4" />
          <span>PDF Slip</span>
        </button>
      </div>

      {/* 2. Worker Info & Net Balance Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4">
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-slate-800 text-lg shrink-0"
              style={{ backgroundColor: getAvatarBgWithOpacity(worker.avatarColorHex, 0.1) }}
            >
              {worker.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base leading-tight">{worker.name}</h3>
              <p className="text-xs text-slate-500 font-medium">{worker.phoneNumber || 'No phone number'}</p>
              <span className="inline-block mt-0.5 text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {wageDisplay}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Net Balance
            </span>
            <span className="text-xl font-black text-blue-600">
              ₹{stats.balance.toFixed(0)}
            </span>
          </div>
        </div>

        {/* Breakdown KPIs */}
        <div className="grid grid-cols-4 gap-2 text-center mt-3.5">
          <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl">
            <span className="text-[10px] text-emerald-700 font-semibold block">Present</span>
            <span className="text-base font-black text-emerald-600">{stats.presentCount}</span>
          </div>

          <div className="p-2.5 bg-red-50 border border-red-100 rounded-xl">
            <span className="text-[10px] text-red-700 font-semibold block">Absent</span>
            <span className="text-base font-black text-red-600">{stats.absentCount}</span>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] text-slate-600 font-semibold block">Overtime</span>
            <span className="text-base font-black text-slate-800">{stats.overtimeHours}h</span>
          </div>

          <div className="p-2.5 bg-red-50/70 border border-red-200 rounded-xl">
            <span className="text-[10px] text-red-600 font-semibold block">Advance</span>
            <span className="text-base font-black text-red-600">₹{stats.totalAdvance}</span>
          </div>
        </div>

        {/* Detailed wage line */}
        <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs flex items-center justify-between">
          <span className="text-slate-600">Gross Wage: <strong>₹{stats.grossWage.toFixed(0)}</strong></span>
          <span className="text-red-600">Advance Deducted: <strong>-₹{stats.totalAdvance.toFixed(0)}</strong></span>
        </div>
      </div>

      {/* 3. Copyable WhatsApp Text Slip Box */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-emerald-600" />
            WhatsApp Slip Text (Preview)
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono whitespace-pre-wrap leading-relaxed">
          {formattedText}
        </pre>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleWhatsApp}
            className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
          >
            <Send className="w-4 h-4" />
            <span>Send on WhatsApp</span>
          </button>
          <button
            onClick={handleDownloadPdf}
            className="py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* 4. Month Log Table Preview */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 flex justify-between">
          <span>Daily Attendance Log</span>
          <span>{days.length} Days</span>
        </div>

        <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
          {days.map((d) => {
            const rec = worker.attendance[d.dateKey];
            const status = rec?.status || 'UNMARKED';
            const adv = rec?.advanceAmount ? `₹${rec.advanceAmount}` : '-';
            const ot = rec?.overtimeHours ? `${rec.overtimeHours}h` : '-';

            return (
              <div key={d.dayNumber} className="px-3.5 py-2 flex items-center justify-between text-xs hover:bg-slate-50">
                <span className="font-semibold text-slate-700 w-16">
                  {d.dayNumber} ({d.dayOfWeek})
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  status === 'PRESENT' ? 'bg-emerald-100 text-emerald-800' :
                  status === 'ABSENT' ? 'bg-red-100 text-red-800' :
                  status === 'HALF_DAY' ? 'bg-amber-100 text-amber-800' :
                  status === 'DOUBLE' ? 'bg-purple-100 text-purple-800' :
                  status === 'PRESENT_HALF' ? 'bg-indigo-100 text-indigo-800' :
                  'bg-slate-100 text-slate-500'
                }`}>
                  {status}
                </span>
                <span className="text-slate-500 text-[11px]">OT: {ot}</span>
                <span className="text-red-600 font-bold text-[11px]">Adv: {adv}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
