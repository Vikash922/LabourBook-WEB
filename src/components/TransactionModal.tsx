import React, { useState } from 'react';
import { X, Trash2, ArrowDownLeft, ArrowUpRight, IndianRupee, CreditCard, Banknote, Calendar } from 'lucide-react';
import { CashTransaction, PaymentMethod, TransactionType } from '../types';
import { getDateKey, getTodayYear, getTodayMonth, getTodayDay } from '../utils/calendar';

interface TransactionModalProps {
  isOpen: boolean;
  initialTransaction?: CashTransaction | null;
  defaultType?: TransactionType;
  onSave: (amount: number, type: TransactionType, paymentMethod: PaymentMethod, fullDate: string, notes: string) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  initialTransaction,
  defaultType = 'CASH_IN',
  onSave,
  onDelete,
  onClose
}) => {
  if (!isOpen) return null;

  const todayStr = getDateKey(getTodayYear(), getTodayMonth(), getTodayDay());

  const [type, setType] = useState<TransactionType>(initialTransaction?.type || defaultType);
  const [amountStr, setAmountStr] = useState<string>(initialTransaction ? String(initialTransaction.amount) : '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initialTransaction?.paymentMethod || 'CASH');
  const [date, setDate] = useState<string>(initialTransaction?.fullDate || todayStr);
  const [notes, setNotes] = useState<string>(initialTransaction?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(amountStr) || 0;
    if (amount <= 0) return;
    onSave(amount, type, paymentMethod, date, notes);
    onClose();
  };

  const quickAmounts = [500, 1000, 2000, 5000, 10000];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {initialTransaction ? 'Edit Cash Entry' : type === 'CASH_IN' ? 'Add Cash In (Income/Receipt)' : 'Add Cash Out (Expense/Payment)'}
            </h3>
            <p className="text-xs text-slate-500">Record in Cash Book Ledger</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Type Toggle: CASH IN vs CASH OUT */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setType('CASH_IN')}
              className={`py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                type === 'CASH_IN'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" />
              Cash In (+)
            </button>
            <button
              type="button"
              onClick={() => setType('CASH_OUT')}
              className={`py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                type === 'CASH_OUT'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              Cash Out (-)
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Amount (₹)
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
                required
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                placeholder="0.00"
                className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-black text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

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

          {/* Date & Payment Mode */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mode
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="CASH">Cash</option>
                <option value="ONLINE">Online / UPI</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Description / Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Cement, Tea/Snacks, Client payment"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            {initialTransaction && onDelete && (
              <button
                type="button"
                onClick={() => {
                  onDelete(initialTransaction.id);
                  onClose();
                }}
                className="p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl flex items-center justify-center transition border border-red-200"
                title="Delete Entry"
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
              className={`flex-2 py-3 text-white font-bold text-sm rounded-xl shadow-md transition ${
                type === 'CASH_IN'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                  : 'bg-red-600 hover:bg-red-700 shadow-red-500/20'
              }`}
            >
              {type === 'CASH_IN' ? 'Save Cash In' : 'Save Cash Out'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
