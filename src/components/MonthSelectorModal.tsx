import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { MONTHS_SHORT, parseYearMonth, getTodayYear } from '../utils/calendar';

const FULL_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface MonthSelectorModalProps {
  isOpen: boolean;
  selectedMonth: string; // e.g. "Aug 2026"
  onSelectMonth: (month: string) => void;
  onClose: () => void;
}

export const MonthSelectorModal: React.FC<MonthSelectorModalProps> = ({
  isOpen,
  selectedMonth,
  onSelectMonth,
  onClose
}) => {
  const currentYear = getTodayYear();
  const parsed = parseYearMonth(selectedMonth);
  
  // State for the temporary selections before hitting "Ok"
  const [tempMonthIdx, setTempMonthIdx] = useState(() => {
    return (parsed.month >= 1 && parsed.month <= 12) ? parsed.month - 1 : 7;
  });
  const [tempYear, setTempYear] = useState<number>(parsed.year || currentYear);

  const [view, setView] = useState<'MAIN' | 'MONTH' | 'YEAR'>('MAIN');

  if (!isOpen) return null;

  const handleOk = () => {
    const mShort = MONTHS_SHORT[tempMonthIdx];
    onSelectMonth(`${mShort} ${tempYear}`);
    onClose();
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 select-none"
      onClick={onClose}
      style={{ zIndex: 9999 }}
    >
      <div 
        className="w-full max-w-md bg-white rounded-t-3xl shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {view === 'MAIN' && (
          <div className="p-5 pb-8 sm:pb-6 animate-in slide-in-from-bottom-4 duration-200">
            <h3 className="font-bold text-slate-900 text-[17px] mb-5">Select Month & Year</h3>
            
            <div className="flex items-center gap-3 mb-8">
              <button
                type="button"
                onClick={() => setView('MONTH')}
                className="flex-1 flex items-center justify-between px-4 py-3 rounded-[14px] border border-slate-300 text-[15px] font-semibold text-slate-800"
              >
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-slate-800" />
                  <span>{FULL_MONTHS[tempMonthIdx]}</span>
                </div>
                <ChevronDown className="w-5 h-5 text-slate-800" />
              </button>

              <button
                type="button"
                onClick={() => setView('YEAR')}
                className="flex-1 flex items-center justify-between px-4 py-3 rounded-[14px] border border-slate-300 text-[15px] font-semibold text-slate-800"
              >
                <span>{tempYear}</span>
                <ChevronDown className="w-5 h-5 text-slate-800" />
              </button>
            </div>

            <button
              onClick={handleOk}
              className="w-full py-3.5 bg-[#1862D6] hover:bg-blue-700 active:bg-blue-800 text-white rounded-2xl font-bold text-[15px] transition"
            >
              Ok
            </button>
          </div>
        )}

        {view === 'MONTH' && (
          <div className="p-5 pb-8 sm:pb-6 max-h-[70vh] overflow-y-auto animate-in fade-in duration-200">
            <h3 className="font-bold text-slate-900 text-lg mb-4">Select month</h3>
            <div className="flex flex-col">
              {FULL_MONTHS.map((m, idx) => (
                <label key={m} className="flex items-center gap-4 py-3.5 cursor-pointer">
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <input
                      type="radio"
                      name="month"
                      checked={tempMonthIdx === idx}
                      onChange={() => {
                        setTempMonthIdx(idx);
                        setView('MAIN');
                      }}
                      className="peer appearance-none w-5 h-5 rounded-full border-2 border-slate-400 checked:border-[#228751] transition-colors"
                    />
                    {tempMonthIdx === idx && (
                      <div className="absolute w-2.5 h-2.5 bg-[#228751] rounded-full pointer-events-none" />
                    )}
                  </div>
                  <span className="text-[17px] text-slate-800 font-medium">{m}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {view === 'YEAR' && (
          <div className="p-5 pb-8 sm:pb-6 max-h-[70vh] overflow-y-auto animate-in fade-in duration-200">
            <h3 className="font-bold text-slate-900 text-lg mb-4">Select year</h3>
            <div className="flex flex-col">
              {[currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2].map((yr) => (
                <label key={yr} className="flex items-center gap-4 py-3.5 cursor-pointer">
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <input
                      type="radio"
                      name="year"
                      checked={tempYear === yr}
                      onChange={() => {
                        setTempYear(yr);
                        setView('MAIN');
                      }}
                      className="peer appearance-none w-5 h-5 rounded-full border-2 border-slate-400 checked:border-[#228751] transition-colors"
                    />
                    {tempYear === yr && (
                      <div className="absolute w-2.5 h-2.5 bg-[#228751] rounded-full pointer-events-none" />
                    )}
                  </div>
                  <span className="text-[17px] text-slate-800 font-medium">{yr}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
};

