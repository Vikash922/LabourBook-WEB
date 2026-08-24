import React from 'react';
import { X, Check, Clock, Plus, Ban, AlertCircle } from 'lucide-react';
import { AttendanceStatus } from '../types';

interface AttendanceSheetProps {
  isOpen: boolean;
  dayNumber: number;
  currentStatus: AttendanceStatus;
  onSelectStatus: (status: AttendanceStatus) => void;
  onClose: () => void;
}

export const AttendanceSheet: React.FC<AttendanceSheetProps> = ({
  isOpen,
  dayNumber,
  currentStatus,
  onSelectStatus,
  onClose
}) => {
  if (!isOpen) return null;

  const options: { status: AttendanceStatus; label: string; subLabel: string; bg: string; text: string; border: string }[] = [
    {
      status: "PRESENT",
      label: "Present (P)",
      subLabel: "1.0 Full Day Wage",
      bg: "bg-emerald-50 hover:bg-emerald-100",
      text: "text-emerald-700",
      border: "border-emerald-300"
    },
    {
      status: "ABSENT",
      label: "Absent (A)",
      subLabel: "0.0 No Wage",
      bg: "bg-red-50 hover:bg-red-100",
      text: "text-red-700",
      border: "border-red-300"
    },
    {
      status: "HALF_DAY",
      label: "Half Day (H)",
      subLabel: "0.5 Half Day Wage",
      bg: "bg-amber-50 hover:bg-amber-100",
      text: "text-amber-700",
      border: "border-amber-300"
    },
    {
      status: "DOUBLE",
      label: "Double (P+P)",
      subLabel: "2.0 Double Day Wage",
      bg: "bg-purple-50 hover:bg-purple-100",
      text: "text-purple-700",
      border: "border-purple-300"
    },
    {
      status: "PRESENT_HALF",
      label: "Present + 1/2",
      subLabel: "1.5 One and Half Day",
      bg: "bg-indigo-50 hover:bg-indigo-100",
      text: "text-indigo-700",
      border: "border-indigo-300"
    },
    {
      status: "UNMARKED",
      label: "Clear / Unmarked",
      subLabel: "Reset this day entry",
      bg: "bg-slate-50 hover:bg-slate-100",
      text: "text-slate-600",
      border: "border-slate-300"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl transition-all max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Mark Attendance for Day {dayNumber}</h3>
            <p className="text-xs text-slate-500">Choose attendance status</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2 mt-4">
          {options.map((opt) => {
            const isSelected = currentStatus === opt.status;
            return (
              <button
                key={opt.status}
                onClick={() => {
                  onSelectStatus(opt.status);
                  onClose();
                }}
                className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all ${opt.bg} ${
                  isSelected ? `${opt.border} ring-2 ring-blue-500 shadow-xs font-bold` : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col text-left">
                  <span className={`text-sm font-bold ${opt.text}`}>{opt.label}</span>
                  <span className="text-xs text-slate-500">{opt.subLabel}</span>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
