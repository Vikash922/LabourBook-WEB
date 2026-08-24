import React from 'react';
import { X, Edit2, Trash2, IndianRupee, Calendar, FileText, CreditCard, Banknote } from 'lucide-react';
import { PaymentMethod, AttendanceStatus } from '../types';

interface DayAdvanceDetailModalProps {
  isOpen: boolean;
  dayNumber: number;
  selectedMonth: string;
  workerName: string;
  status: AttendanceStatus;
  advanceAmount: number;
  paymentMethod: PaymentMethod;
  note: string;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export const DayAdvanceDetailModal: React.FC<DayAdvanceDetailModalProps> = ({
  isOpen,
  dayNumber,
  selectedMonth,
  workerName,
  status,
  advanceAmount,
  paymentMethod,
  note,
  onEdit,
  onDelete,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Advance Details</h3>
            <p className="text-xs text-slate-500">{workerName} • Day {dayNumber}, {selectedMonth}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Banner */}
        <div className="my-5 p-4 bg-red-50/70 border border-red-100 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center font-black">
              ₹
            </div>
            <div>
              <span className="text-xs font-bold text-red-700 block">Total Advance Paid</span>
              <span className="text-2xl font-black text-slate-900">₹{advanceAmount}</span>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-white border border-red-200 rounded-full text-xs font-bold text-red-600">
            {paymentMethod === 'ONLINE' ? 'Online/UPI' : 'Cash'}
          </span>
        </div>

        {/* Details list */}
        <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Attendance Status:</span>
            <span className="font-bold text-slate-800">{status}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Payment Mode:</span>
            <span className="font-bold text-slate-800 flex items-center gap-1">
              {paymentMethod === 'ONLINE' ? <CreditCard className="w-3.5 h-3.5 text-blue-600" /> : <Banknote className="w-3.5 h-3.5 text-emerald-600" />}
              {paymentMethod}
            </span>
          </div>

          {note && (
            <div className="pt-2 border-t border-slate-200/60 text-xs">
              <span className="text-slate-500 font-medium block mb-1">Notes / Remarks:</span>
              <p className="text-slate-800 font-semibold bg-white p-2.5 rounded-lg border border-slate-200/80">
                {note}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 mt-5">
          <button
            type="button"
            onClick={() => {
              onDelete();
              onClose();
            }}
            className="flex-1 py-3 px-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit();
            }}
            className="flex-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition"
          >
            <Edit2 className="w-4 h-4" />
            Edit Amount
          </button>
        </div>
      </div>
    </div>
  );
};
