import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface AdvanceConfirmationProps {
  confirmation: {
    amount: number;
    workerName: string;
    type: 'added' | 'removed';
  } | null;
  onDismiss: () => void;
}

export const AdvanceConfirmation: React.FC<AdvanceConfirmationProps> = ({
  confirmation,
  onDismiss
}) => {
  if (!confirmation) return null;

  const isAdded = confirmation.type === 'added';

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 3200);
    return () => clearTimeout(timer);
  }, [confirmation, onDismiss]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in zoom-in duration-200"
      onClick={onDismiss}
    >
      <div 
        className="w-full max-w-sm bg-white rounded-3xl p-6 text-center shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${
          isAdded ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
        }`}>
          {isAdded ? (
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          ) : (
            <AlertCircle className="w-10 h-10 stroke-[2.5]" />
          )}
        </div>

        <h3 className="text-xl font-black text-slate-900 mb-1">
          {isAdded ? 'Advance Recorded!' : 'Advance Removed'}
        </h3>

        <p className="text-xs text-slate-500 mb-4 font-medium">
          {confirmation.workerName}
        </p>

        {isAdded && (
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl mb-5">
            <span className="text-xs font-bold text-emerald-700 block">Amount Added</span>
            <span className="text-3xl font-black text-slate-900">₹{confirmation.amount}</span>
          </div>
        )}

        <button
          onClick={onDismiss}
          className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-lg transition ${
            isAdded ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25' : 'bg-slate-800 hover:bg-slate-900 shadow-slate-500/25'
          }`}
        >
          Done
        </button>
      </div>
    </div>
  );
};
