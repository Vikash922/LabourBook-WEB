import React, { useState, useMemo } from 'react';
import { ArrowLeft, Download, Send, Calendar, Wallet, ArrowDownLeft, ArrowUpRight, Copy, Check } from 'lucide-react';
import { useLabor } from '../context/LaborContext';
import { getDateKey, getTodayYear, getTodayMonth, getTodayDay, formatDisplayDate } from '../utils/calendar';
import { downloadCashBookReportPdf } from '../utils/pdfGenerator';
import { t } from '../utils/strings';

export const CashBookReportScreen: React.FC = () => {
  const { transactions, navigateTo, showToast, userProfile } = useLabor();
  const lang = userProfile.language || 'en';

  const currentYear = getTodayYear();
  const currentMonth = getTodayMonth();
  const todayDay = getTodayDay();

  const [startDate, setStartDate] = useState(getDateKey(currentYear, currentMonth, 1));
  const [endDate, setEndDate] = useState(getDateKey(currentYear, currentMonth, todayDay));
  const [copied, setCopied] = useState(false);

  // Filter transactions between startDate and endDate
  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const d = t.fullDate || t.dateDisplay;
      if (!d) return true;
      return d >= startDate && d <= endDate;
    }).sort((a, b) => (a.fullDate || '').localeCompare(b.fullDate || ''));
  }, [transactions, startDate, endDate]);

  const { totalIn, totalOut, netBalance } = useMemo(() => {
    let inSum = 0;
    let outSum = 0;
    for (const t of filtered) {
      if (t.type === 'CASH_IN') inSum += t.amount || 0;
      else outSum += t.amount || 0;
    }
    return {
      totalIn: inSum,
      totalOut: outSum,
      netBalance: inSum - outSum
    };
  }, [filtered]);

  const generateReportSummaryText = () => {
    return `*CASH BOOK LEDGER REPORT*
📅 *Period:* ${startDate} to ${endDate}
🏢 *Business:* ${userProfile.businessName || 'LabourBook'}

*Summary:*
🟢 Total Cash In: Rs.${totalIn.toFixed(0)}
🔴 Total Cash Out: Rs.${totalOut.toFixed(0)}
───────────────────
🔵 *NET BALANCE:* Rs.${netBalance.toFixed(0)}
📝 *Total Transactions:* ${filtered.length} entries

_Generated via Laborbook App_`;
  };

  const handleDownloadPdf = () => {
    downloadCashBookReportPdf(filtered, startDate, endDate, totalIn, totalOut, netBalance);
    showToast('Cash Book PDF Report downloaded!');
  };

  const handleShareWhatsApp = () => {
    const text = generateReportSummaryText();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyText = () => {
    const text = generateReportSummaryText();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast('Summary copied to clipboard!');
    }
  };

  return (
    <div className="pb-24 pt-2 px-3 max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo({ type: 'CASH_BOOK' })}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-bold text-slate-900 text-base leading-tight">Cash Book Ledger Report</h2>
            <p className="text-xs text-slate-500">Custom Date Statement & Export</p>
          </div>
        </div>

        <button
          onClick={handleDownloadPdf}
          className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
        >
          <Download className="w-4 h-4" />
          <span>PDF</span>
        </button>
      </div>

      {/* Date Filter Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
          Select Date Range
        </span>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">From Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">To Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Summary KPI */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
            <span className="text-[10px] text-emerald-700 font-semibold block">Total Cash In</span>
            <span className="text-base font-black text-emerald-600">₹{totalIn.toFixed(0)}</span>
          </div>

          <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
            <span className="text-[10px] text-red-700 font-semibold block">Total Cash Out</span>
            <span className="text-base font-black text-red-600">₹{totalOut.toFixed(0)}</span>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
            <span className="text-[10px] text-blue-700 font-semibold block">Net Balance</span>
            <span className="text-base font-black text-blue-700">₹{netBalance.toFixed(0)}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
          <button
            onClick={handleCopyText}
            className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>
          <button
            onClick={handleShareWhatsApp}
            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
          >
            <Send className="w-4 h-4" />
            <span>Share WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Transaction Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
          <span>Transactions ({filtered.length})</span>
          <span className="text-slate-400 font-normal">{startDate} ~ {endDate}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No entries within this date range.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((t) => (
              <div key={t.id} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      t.type === 'CASH_IN' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {t.type === 'CASH_IN' ? '+' : '-'}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{t.notes || 'Transaction'}</span>
                    <span className="text-[10px] text-slate-400">
                      {formatDisplayDate(t.fullDate || t.dateDisplay)} • {t.paymentMethod}
                    </span>
                  </div>
                </div>

                <span
                  className={`font-black text-sm ${
                    t.type === 'CASH_IN' ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {t.type === 'CASH_IN' ? '+' : '-'} ₹{t.amount}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
