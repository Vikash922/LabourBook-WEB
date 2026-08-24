import React, { useState } from 'react';
import { X, Trash2, IndianRupee, CreditCard, Banknote } from 'lucide-react';
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
  workerName,
  dayNumber,
  selectedMonth,
  initialAdvance,
  initialNote,
  initialPaymentMethod,
  onSave,
  onDelete,
  onClose
}) => {
  if (!isOpen) return null;

  const [amountStr, setAmountStr] = useState(initialAdvance > 0 ? String(initialAdvance) : '');
  const [note, setNote] = useState(initialNote || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initialPaymentMethod || 'CASH');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(amountStr) || 0;
    onSave(amount, note, paymentMethod);
    onClose();
  };

  const quickAmounts = [200, 500, 1000, 2000, 5000];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Advance Amount</h3>
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
          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Advance Amount (₹)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold">
                ₹
              </div>
              <input
                type="number"
                step="any"
                min="0"
                autoFocus
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                placeholder="Enter advance amount (e.g. 500)"
                className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Quick amount chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {quickAmounts.map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setAmountStr(String(amt))}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-xs font-semibold text-slate-600 rounded-lg transition"
                >
                  +₹{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method Toggle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Payment Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('CASH')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                  paymentMethod === 'CASH'
                    ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Banknote className="w-4 h-4" />
                Cash
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('ONLINE')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                  paymentMethod === 'ONLINE'
                    ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                Online / UPI
              </button>
            </div>
          </div>

          {/* Note Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Note / Remarks (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Festival advance, emergency"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {initialAdvance > 0 && (
              <button
                type="button"
                onClick={() => {
                  onDelete();
                  onClose();
                }}
                className="p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl flex items-center justify-center transition border border-red-200"
                title="Remove Advance"
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
              Save Advance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
