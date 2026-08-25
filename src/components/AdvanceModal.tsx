import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PaymentMethod } from '../types';

interface AdvanceModalProps {
  isOpen: boolean;
  workerName: string;
  dayNumber: number;
  selectedMonth: string;
  initialAdvance: number;
  initialNote: string;
  initialPaymentMethod: PaymentMethod;
  onSave: (amount: number, note: string, paymentMethod: PaymentMethod) => void;
  onDelete: () => void;
  onClose: () => void;
}

export const AdvanceModal: React.FC<AdvanceModalProps> = ({
  isOpen,
  initialAdvance,
  initialNote,
  initialPaymentMethod,
  onSave,
  onDelete,
  onClose
}) => {
  const [amountStr, setAmountStr] = useState(initialAdvance > 0 ? String(initialAdvance) : '');
  const [note, setNote] = useState(initialNote || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initialPaymentMethod || 'CASH');

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    setAmountStr(initialAdvance > 0 ? String(initialAdvance) : '');
    setNote(initialNote || '');
    setPaymentMethod(initialPaymentMethod || 'CASH');
  }, [initialAdvance, initialNote, initialPaymentMethod, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const amount = parseFloat(amountStr) || 0;
    // We allow saving if either amount > 0 or note is provided
    if (amount === 0 && !note.trim()) {
      onClose(); // nothing to save
      return;
    }
    onSave(amount, note, paymentMethod);
    onClose();
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 select-none"
      onClick={onClose}
      style={{ zIndex: 9999 }}
    >
      <div 
        className="w-full max-w-md bg-white rounded-t-3xl pt-4 px-4 pb-4 shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-4 duration-200 flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">
          <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">
            Add/Edit Advance Or Note
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 mb-4">
          <input
            type="number"
            step="any"
            min="0"
            autoFocus
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value)}
            placeholder="₹ Amount"
            className="w-full h-10 px-3 bg-white border border-slate-300 rounded-[10px] text-[14px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1862D6] transition-colors"
          />

          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note (Optional)"
            className="w-full h-10 px-3 bg-white border border-slate-300 rounded-[10px] text-[14px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1862D6] transition-colors"
          />

          <div>
            <label className="block text-[14px] text-slate-700 font-medium mb-1 mt-1">
              Payment Method
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('CASH')}
                className={`flex-1 py-2.5 rounded-[10px] font-medium text-[14px] flex items-center justify-center transition ${
                  paymentMethod === 'CASH'
                    ? 'bg-[#E8F0FE] text-[#1862D6] border border-[#d2e3fc]'
                    : 'bg-white text-slate-600 border border-slate-300'
                }`}
              >
                Cash
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('ONLINE')}
                className={`flex-1 py-2.5 rounded-[10px] font-medium text-[14px] flex items-center justify-center transition ${
                  paymentMethod === 'ONLINE'
                    ? 'bg-[#E8F0FE] text-[#1862D6] border border-[#d2e3fc]'
                    : 'bg-white text-slate-600 border border-slate-300'
                }`}
              >
                Online
              </button>
            </div>
          </div>
        </form>

        <div className="mb-4">
          <p className="text-[12px] leading-relaxed text-slate-500">
            Total advance will be adjusted in final salary calculation.
          </p>
        </div>

        <div className="flex items-center gap-3 mt-1">
          <button
            type="button"
            onClick={() => {
              onDelete();
              onClose();
            }}
            className="flex-1 py-3 px-4 border border-[#D32F2F] text-[#D32F2F] font-medium text-[14px] rounded-full text-center cursor-pointer"
          >
            Remove Marked
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 py-3 px-4 bg-[#1862D6] hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-[14px] rounded-full text-center transition cursor-pointer"
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
