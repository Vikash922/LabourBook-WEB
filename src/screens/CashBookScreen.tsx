import React, { useState, useMemo } from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  FileText,
  Plus,
  CreditCard,
  Banknote,
  Calendar,
  Trash2,
  Edit2
} from 'lucide-react';
import { useLabor } from '../context/LaborContext';
import { CashTransaction, TransactionType, PaymentMethod } from '../types';
import { TransactionModal } from '../components/TransactionModal';
import { parseYearMonth, formatDisplayDate } from '../utils/calendar';
import { t } from '../utils/strings';

export const CashBookScreen: React.FC = () => {
  const {
    transactions,
    selectedMonth,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    navigateTo,
    userProfile
  } = useLabor();

  const lang = userProfile.language || 'en';

  const [search, setSearch] = useState('');
  const [activeModalType, setActiveModalType] = useState<TransactionType | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<CashTransaction | null>(null);

  const { year, month } = parseYearMonth(selectedMonth);
  const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Month filter
      if (selectedMonth !== "All Months") {
        if (t.fullDate && !t.fullDate.startsWith(monthPrefix)) {
          return false;
        }
      }
      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesNote = (t.notes || '').toLowerCase().includes(q);
        const matchesAmount = String(t.amount).includes(q);
        const matchesDate = (t.fullDate || t.dateDisplay || '').toLowerCase().includes(q);
        if (!matchesNote && !matchesAmount && !matchesDate) return false;
      }
      return true;
    }).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }, [transactions, selectedMonth, monthPrefix, search]);

  // Compute Totals
  const { totalIn, totalOut, netBalance } = useMemo(() => {
    let inSum = 0;
    let outSum = 0;
    for (const t of filteredTransactions) {
      if (t.type === 'CASH_IN') {
        inSum += t.amount || 0;
      } else {
        outSum += t.amount || 0;
      }
    }
    return {
      totalIn: inSum,
      totalOut: outSum,
      netBalance: inSum - outSum
    };
  }, [filteredTransactions]);

  return (
    <div className="pb-32 pt-2 px-3 max-w-4xl mx-auto space-y-3">
      {/* 1. KPI Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4">
        <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Wallet className="w-4 h-4 text-emerald-600" />
            <span>Cash Book Balance</span>
          </div>
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {selectedMonth}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          {/* Cash In */}
          <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl">
            <span className="text-[10px] text-emerald-700 font-semibold block">{t('cash_in', lang)}</span>
            <span className="text-base font-black text-emerald-600">₹{totalIn.toFixed(0)}</span>
          </div>

          {/* Cash Out */}
          <div className="p-2.5 bg-red-50 border border-red-100 rounded-xl">
            <span className="text-[10px] text-red-700 font-semibold block">{t('cash_out', lang)}</span>
            <span className="text-base font-black text-red-600">₹{totalOut.toFixed(0)}</span>
          </div>

          {/* Net Balance */}
          <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl">
            <span className="text-[10px] text-blue-700 font-semibold block">{t('balance', lang)}</span>
            <span className="text-base font-black text-blue-700">₹{netBalance.toFixed(0)}</span>
          </div>
        </div>
      </div>

      {/* 2. Open Cash Book Report Banner */}
      <button
        onClick={() => navigateTo({ type: 'CASH_BOOK_REPORT' })}
        className="w-full p-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl flex items-center justify-between font-bold text-xs shadow-md shadow-emerald-500/20 transition"
      >
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span>Generate Cash Book PDF Report & Statements</span>
        </div>
        <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">Open</span>
      </button>

      {/* 3. Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('search_transactions', lang)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs placeholder:text-slate-400 transition"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-bold text-slate-400 hover:text-slate-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* 4. Transactions List */}
      {filteredTransactions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Wallet className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">No transactions found</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Record payments, site expenses, advances, or incoming client funds using the buttons below.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTransactions.map((tx) => {
            const isCashIn = tx.type === 'CASH_IN';
            return (
              <div
                key={tx.id}
                onClick={() => setEditingTransaction(tx)}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-sm transition p-3.5 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isCashIn ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {isCashIn ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-xs line-clamp-1">
                        {tx.notes || (isCashIn ? 'Cash In' : 'Cash Out')}
                      </h4>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600">
                        {tx.paymentMethod}
                      </span>
                    </div>
                    <span className="text-[10px] font-medium text-slate-400">
                      {formatDisplayDate(tx.fullDate || tx.dateDisplay)}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-sm font-black block ${
                      isCashIn ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {isCashIn ? '+' : '-'} ₹{tx.amount}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Floating Action Buttons for Cash In & Cash Out */}
      <div className="fixed bottom-20 left-4 right-4 max-w-4xl mx-auto z-30 flex items-center gap-3">
        <button
          onClick={() => setActiveModalType('CASH_IN')}
          className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-2xl font-bold text-xs shadow-lg shadow-emerald-500/30 transition flex items-center justify-center gap-2"
        >
          <ArrowDownLeft className="w-4 h-4" />
          <span>+ {t('cash_in', lang)}</span>
        </button>

        <button
          onClick={() => setActiveModalType('CASH_OUT')}
          className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 active:scale-98 text-white rounded-2xl font-bold text-xs shadow-lg shadow-red-500/30 transition flex items-center justify-center gap-2"
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>- {t('cash_out', lang)}</span>
        </button>
      </div>

      {/* Add / Edit Transaction Modal */}
      {(activeModalType !== null || editingTransaction !== null) && (
        <TransactionModal
          isOpen={true}
          defaultType={activeModalType || 'CASH_IN'}
          initialTransaction={editingTransaction}
          onSave={(amount, type, method, date, notes) => {
            if (editingTransaction) {
              updateTransaction({
                ...editingTransaction,
                amount,
                type,
                paymentMethod: method,
                fullDate: date,
                dateDisplay: date,
                notes
              });
            } else {
              addTransaction(amount, type, method, date, notes);
            }
            setActiveModalType(null);
            setEditingTransaction(null);
          }}
          onDelete={(id) => {
            deleteTransaction(id);
            setEditingTransaction(null);
          }}
          onClose={() => {
            setActiveModalType(null);
            setEditingTransaction(null);
          }}
        />
      )}
    </div>
  );
};
