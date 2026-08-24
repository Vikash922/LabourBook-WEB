import React, { useState } from 'react';
import { X, Clock, IndianRupee, Trash2 } from 'lucide-react';

interface OvertimeModalProps {
  isOpen: boolean;
  workerName: string;
  dayNumber: number;
  selectedMonth: string;
  defaultHourlyRate: number;
  initialHours: number;
  initialRate: number;
  onSave: (hours: number, rate: number) => void;
  onDelete: () => void;
  onClose: () => void;
}

export const OvertimeModal: React.FC<OvertimeModalProps> = ({
  isOpen,
  workerName,
  dayNumber,
  selectedMonth,
  defaultHourlyRate,
  initialHours,
  initialRate,
  onSave,
  onDelete,
  onClose
}) => {
  if (!isOpen) return null;

  const [hours, setHours] = useState<number>(Math.floor(initialHours) || 0);
  const [minutes, setMinutes] = useState<number>(Math.round((initialHours - Math.floor(initialHours)) * 60) || 0);
  const [rateStr, setRateStr] = useState<string>(
    initialRate > 0 ? String(initialRate) : (defaultHourlyRate > 0 ? String(Math.round(defaultHourlyRate)) : '')
  );

  const totalHoursFloat = hours + (minutes / 60);
  const hourlyRate = parseFloat(rateStr) || 0;
  const calculatedTotal = totalHoursFloat * hourlyRate;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(totalHoursFloat, hourlyRate);
    onClose();
  };

  const presetHours = [1, 1.5, 2, 2.5, 3, 4, 5];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Overtime Hours</h3>
            <p className="text-xs text-slate-500">{workerName} • Day {dayNumber}, {selectedMonth}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Overtime Duration
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 mb-1 block">Hours</span>
                <select
                  value={hours}
                  onChange={(e) => setHours(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((h) => (
                    <option key={h} value={h}>{h} hrs</option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-500 mb-1 block">Minutes</span>
                <select
                  value={minutes}
                  onChange={(e) => setMinutes(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>00 mins</option>
                  <option value={15}>15 mins</option>
                  <option value={30}>30 mins</option>
                  <option value={45}>45 mins</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {presetHours.map((ph) => {
                const hVal = Math.floor(ph);
                const mVal = Math.round((ph - hVal) * 60);
                return (
                  <button
                    type="button"
                    key={ph}
                    onClick={() => {
                      setHours(hVal);
                      setMinutes(mVal);
                    }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-xs font-semibold text-slate-600 rounded-lg transition"
                  >
                    {ph}h
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Hourly Overtime Rate (₹)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold">
                ₹
              </div>
              <input
                type="number"
                step="any"
                min="0"
                value={rateStr}
                onChange={(e) => setRateStr(e.target.value)}
                placeholder="Enter hourly rate"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-blue-900">Total OT Wage:</span>
            </div>
            <span className="text-base font-black text-blue-700">
              ₹{calculatedTotal.toFixed(0)}
            </span>
          </div>

          <div className="flex gap-2 pt-2">
            {initialHours > 0 && (
              <button
                type="button"
                onClick={() => {
                  onDelete();
                  onClose();
                }}
                className="p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl flex items-center justify-center transition border border-red-200"
                title="Remove Overtime"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition"
            >
              Save Overtime
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
