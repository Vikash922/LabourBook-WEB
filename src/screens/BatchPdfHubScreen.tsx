import React from 'react';
import {
  FileSpreadsheet,
  Download,
  Users,
  Wallet,
  FileText,
  CheckCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useLabor } from '../context/LaborContext';
import { downloadBatchRosterPdf, downloadWorkerSlipPdf, downloadCashBookReportPdf } from '../utils/pdfGenerator';
import { getDateKey, getTodayYear, getTodayMonth, getTodayDay } from '../utils/calendar';
import { t } from '../utils/strings';

export const BatchPdfHubScreen: React.FC = () => {
  const {
    workers,
    transactions,
    selectedMonth,
    exportBackup,
    showToast,
    navigateTo,
    userProfile
  } = useLabor();

  const lang = userProfile.language || 'en';
  const currentYear = getTodayYear();
  const currentMonth = getTodayMonth();
  const todayDay = getTodayDay();

  const handleDownloadRoster = () => {
    if (workers.length === 0) {
      showToast('No staff members to generate roster');
      return;
    }
    downloadBatchRosterPdf(workers, selectedMonth);
    showToast('Monthly Staff Roster PDF downloaded!');
  };

  const handleDownloadCashBook = () => {
    const startDate = getDateKey(currentYear, currentMonth, 1);
    const endDate = getDateKey(currentYear, currentMonth, todayDay);
    let inSum = 0;
    let outSum = 0;
    for (const t of transactions) {
      if (t.type === 'CASH_IN') inSum += t.amount || 0;
      else outSum += t.amount || 0;
    }
    downloadCashBookReportPdf(transactions, startDate, endDate, inSum, outSum, inSum - outSum);
    showToast('Cash Book PDF Report downloaded!');
  };

  return (
    <div className="pb-24 pt-2 px-3 max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-lg leading-tight">
              {t('pdf_reports', lang)}
            </h2>
            <p className="text-xs text-slate-500">
              Download professional PDF slips, monthly rosters & financial audit statements
            </p>
          </div>
        </div>
      </div>

      {/* Main Report Generation Cards */}
      <div className="grid sm:grid-cols-2 gap-3.5">
        {/* 1. Monthly Staff Roster PDF */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Users className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {selectedMonth}
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Monthly Staff Roster (All Workers)</h3>
            <p className="text-xs text-slate-500 mt-1">
              Consolidated table of all {workers.length} staff members, present days, overtime hours, advances, and net payable.
            </p>
          </div>

          <button
            onClick={handleDownloadRoster}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            <span>Download Staff Roster (PDF)</span>
          </button>
        </div>

        {/* 2. Cash Book Ledger PDF */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <Wallet className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {transactions.length} Entries
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Cash Book Ledger Statement</h3>
            <p className="text-xs text-slate-500 mt-1">
              Full record of income (Cash In), expenses (Cash Out), payment modes, and final net balance.
            </p>
          </div>

          <button
            onClick={handleDownloadCashBook}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            <span>Download Cash Book (PDF)</span>
          </button>
        </div>
      </div>

      {/* 3. Master CSV Backup Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileSpreadsheet className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-slate-900 text-sm">Master CSV Backup</h3>
          </div>
          <p className="text-xs text-slate-500">
            Export all workers, daily attendance history, and transactions in standard format.
          </p>
        </div>

        <button
          onClick={exportBackup}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* 4. Individual Worker Wage Slips List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800">
          <span>Individual Worker PDF Slips</span>
          <span className="text-slate-500">{selectedMonth}</span>
        </div>

        {workers.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            No workers available. Add workers to download individual wage slips.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {workers.map((w) => (
              <div key={w.id} className="p-3 flex items-center justify-between hover:bg-slate-50 transition">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: w.avatarColorHex || '#1D61D2' }}
                  >
                    {w.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">{w.name}</span>
                    <span className="text-[10px] text-slate-500">{w.phoneNumber || 'No phone'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateTo({ type: 'LABOR_REPORT', workerId: w.id })}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition"
                  >
                    View Slip
                  </button>
                  <button
                    onClick={() => {
                      downloadWorkerSlipPdf(w, selectedMonth);
                      showToast(`Downloaded slip for ${w.name}`);
                    }}
                    className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                    title="Download PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
