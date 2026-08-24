import React from 'react';
import { createPortal } from 'react-dom';
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

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 select-none"
      onClick={onClose}
      style={{ zIndex: 9999 }}
    >
      <div 
        className="w-full max-w-sm bg-white rounded-t-2xl p-4 sm:p-5 shadow-2xl relative pb-8 sm:pb-6 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-11 right-3 w-8 h-8 bg-white hover:bg-slate-100 rounded-full shadow-md flex items-center justify-center text-slate-800 z-10 cursor-pointer"
          title="Close"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Advance Details</h3>
            <p className="text-[11px] text-slate-500">{workerName} • Day {dayNumber}, {selectedMonth}</p>
          </div>
        </div>

        {/* Content Details */}
        <div className="space-y-3 py-3">
          {/* Amount Card */}
          <div className="bg-red-50/70 border border-red-100 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                <IndianRupee className="w-5 h-5 font-bold" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block">Advance Given</span>
                <span className="text-xl font-extrabold text-red-600">₹{advanceAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-full border border-slate-200">
              {paymentMethod === 'ONLINE' ? (
                <>
                  <CreditCard className="w-3 h-3 text-blue-600" />
                  <span>Online/UPI</span>
                </>
              ) : (
                <>
                  <Banknote className="w-3 h-3 text-emerald-600" />
                  <span>Cash</span>
                </>
              )}
            </div>
          </div>

          {/* Date & Note Info */}
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Date
              </span>
              <span className="font-bold text-slate-800">Day {dayNumber}, {selectedMonth}</span>
            </div>

            {note && (
              <div className="pt-2 border-t border-slate-200/60 flex items-start gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-500 font-semibold block text-[11px]">Note / Remarks:</span>
                  <p className="text-slate-800 font-medium text-xs mt-0.5">{note}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons: Edit and Delete */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              onDelete();
              onClose();
            }}
            className="flex-1 py-2.5 px-3 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-full flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit();
            }}
            className="flex-1 py-2.5 px-3 bg-[#1862D6] hover:bg-blue-700 text-white font-bold text-xs rounded-full shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
};
