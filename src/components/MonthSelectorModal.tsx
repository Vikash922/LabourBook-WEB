import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Check } from 'lucide-react';
import { MONTHS_SHORT, parseYearMonth, getRollingMonthsList, getTodayYear } from '../utils/calendar';

interface MonthSelectorModalProps {
  isOpen: boolean;
  selectedMonth: string;
  onSelectMonth: (month: string) => void;
  onClose: () => void;
}

export const MonthSelectorModal: React.FC<MonthSelectorModalProps> = ({
  isOpen,
  selectedMonth,
  onSelectMonth,
  onClose
}) => {
  if (!isOpen) return null;

  const currentYear = getTodayYear();
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    return parseYearMonth(selectedMonth).year || currentYear;
  });

  const availableYears = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];

  const handleMonthClick = (mShort: string) => {
    const formatted = `${mShort} ${selectedYear}`;
    onSelectMonth(formatted);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Select Month & Year</h3>
              <p className="text-xs text-slate-500">Currently: {selectedMonth}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Year Selector Tabs */}
        <div className="flex gap-2 my-4 p-1 bg-slate-100 rounded-xl">
          {availableYears.map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                selectedYear === yr
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {yr}
            </button>
          ))}
        </div>

        {/* Month Grid */}
        <div className="grid grid-cols-3 gap-2.5 my-3">
          {MONTHS_SHORT.map((mShort, idx) => {
            const formatted = `${mShort} ${selectedYear}`;
            const isSelected = selectedMonth === formatted;

            return (
              <button
                key={mShort}
                onClick={() => handleMonthClick(mShort)}
                className={`py-3 px-2 rounded-xl text-sm font-medium border flex items-center justify-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-md shadow-blue-200'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-200'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                {mShort}
              </button>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
          <button
            onClick={() => {
              onSelectMonth("All Months");
              onClose();
            }}
            className="w-full py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            Show All Months
          </button>
        </div>
      </div>
    </div>
  );
};
