import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface OvertimeModalProps {
  isOpen: boolean;
  workerName: string;
  formattedDate: string;
  dayNumber: number;
  selectedMonth: string;
  defaultHourlyRate?: number;
  initialHours: number;
  initialRate: number;
  onSave: (hours: number, rate: number) => void;
  onDelete: () => void;
  onClose: () => void;
}

export const OvertimeModal: React.FC<OvertimeModalProps> = ({
  isOpen,
  initialHours,
  initialRate,
  onSave,
  onDelete,
  onClose
}) => {
  const [hoursStr, setHoursStr] = useState<string>('');
  const [rateStr, setRateStr] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    setHoursStr(initialHours > 0 ? String(initialHours) : '');
    setRateStr(initialRate > 0 ? String(initialRate) : '');
  }, [initialHours, initialRate, isOpen]);

  if (!isOpen) return null;

  const hoursFloat = parseFloat(hoursStr) || 0;
  const rateFloat = parseFloat(rateStr) || 0;
  const totalAmount = hoursFloat * rateFloat;
  const isValid = hoursFloat > 0 && rateFloat > 0;

  const handleSave = () => {
    if (!isValid) return;
    onSave(hoursFloat, rateFloat);
    onClose();
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 select-none"
      onClick={onClose}
      style={{ zIndex: 9999 }}
    >
      <div
        className="w-full max-w-md bg-white rounded-t-3xl pt-6 px-6 pb-6 shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-4 duration-200 flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6">
          <h2 className="text-[20px] font-bold text-slate-900 tracking-tight">
            Add / edit Overtime
          </h2>
        </div>

        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-[15px] text-slate-700 font-medium mb-2">
              Hours *
            </label>
            <input
              type="number"
              step="any"
              min="0"
              value={hoursStr}
              onChange={(e) => setHoursStr(e.target.value)}
              placeholder="Enter overtime hours"
              className="w-full h-12 px-4 bg-white border border-slate-300 rounded-[12px] text-[15px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1862D6] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[15px] text-slate-700 font-medium mb-2">
              Hourly Rate
            </label>
            <input
              type="number"
              step="any"
              min="0"
              value={rateStr}
              onChange={(e) => setRateStr(e.target.value)}
              placeholder="Enter hourly rate"
              className="w-full h-12 px-4 bg-white border border-slate-300 rounded-[12px] text-[15px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1862D6] transition-colors"
            />
          </div>
        </div>

        <div className="mb-6">
          <p className="text-[16px] font-bold text-slate-800 mb-1">
            Amount: <span className="text-slate-900">₹ {totalAmount.toFixed(1)}</span>
          </p>
          <p className="text-[13px] leading-relaxed text-slate-500">
            Total overtime amount will be calculated by multiplying hours with hourly rate. For example if rate is ₹100 and hours are 2 then amount will be ₹200.
          </p>
        </div>

        <div className="flex items-center gap-4 mt-2">
          <button
            type="button"
            onClick={() => {
              onDelete();
              onClose();
            }}
            className="flex-1 py-3.5 px-4 border border-[#D32F2F] text-[#D32F2F] font-medium text-[15px] rounded-full text-center cursor-pointer"
          >
            Remove Marked
          </button>

          <button
            type="button"
            onClick={handleSave}
            className={`flex-1 py-3.5 px-4 font-medium text-[15px] rounded-full text-center transition ${
              isValid
                ? 'bg-[#1862D6] hover:bg-blue-700 active:bg-blue-800 text-white cursor-pointer'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
            disabled={!isValid}
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
};
