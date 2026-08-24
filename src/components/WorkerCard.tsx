import React, { useState } from 'react';
import { Phone, ChevronRight, MoreHorizontal, Plus } from 'lucide-react';
import { LaborWorker, AttendanceStatus } from '../types';
import { calculateMonthStats } from '../utils/stats';
import { getDateKey, getTodayYear, getTodayMonth, getTodayDay } from '../utils/calendar';
import { AttendanceSheet } from './AttendanceSheet';

interface WorkerCardProps {
  worker: LaborWorker;
  selectedMonth: string;
  onCardClick: () => void;
  onQuickAttendance: (status: AttendanceStatus) => void;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({
  worker,
  selectedMonth,
  onCardClick,
  onQuickAttendance
}) => {
  const [showSheet, setShowSheet] = useState(false);

  const stats = calculateMonthStats(worker, selectedMonth);
  const todayDay = getTodayDay();
  const todayKey = getDateKey(getTodayYear(), getTodayMonth(), todayDay);
  const todayRecord = worker.attendance[todayKey];
  const todayStatus: AttendanceStatus = todayRecord?.status || 'UNMARKED';

  const isMonthly = (worker.salaryType || '').toLowerCase() === 'monthly';
  const wageDisplay = isMonthly ? `₹${worker.dailyWage}/mo` : `₹${worker.dailyWage}/day`;

  return (
    <>
      <div 
        onClick={onCardClick}
        className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all p-3.5 cursor-pointer"
      >
        {/* Top Header: Avatar, Name, Salary, Call button */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div 
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-xs"
              style={{ backgroundColor: worker.avatarColorHex || '#1D61D2' }}
            >
              {worker.name.charAt(0).toUpperCase() || 'W'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-slate-900 text-sm leading-tight hover:text-blue-600 transition line-clamp-1">
                  {worker.name}
                </h3>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                <span className="font-medium text-slate-600">{worker.phoneNumber || 'No phone'}</span>
                <span>•</span>
                <span className="font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-[10px]">
                  {wageDisplay}
                </span>
              </div>
            </div>
          </div>

          {/* Action icons (Call & Chevron) */}
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {worker.phoneNumber && (
              <a
                href={`tel:${worker.phoneNumber}`}
                className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition"
                title="Call Worker"
              >
                <Phone className="w-4 h-4" />
              </a>
            )}
            <div className="text-slate-400 p-1">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Quick Marking Buttons Row: P, A, H, D, + */}
        <div 
          className="my-3 flex items-center gap-1.5 bg-slate-50/80 p-1 rounded-xl border border-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* P (Present) */}
          <button
            type="button"
            onClick={() => onQuickAttendance('PRESENT')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
              todayStatus === 'PRESENT'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 hover:bg-emerald-100/70'
            }`}
          >
            P
          </button>

          {/* A (Absent) */}
          <button
            type="button"
            onClick={() => onQuickAttendance('ABSENT')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
              todayStatus === 'ABSENT'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-red-700 hover:bg-red-100/70'
            }`}
          >
            A
          </button>

          {/* H (Half Day) */}
          <button
            type="button"
            onClick={() => onQuickAttendance('HALF_DAY')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
              todayStatus === 'HALF_DAY'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-700 hover:bg-amber-100/70'
            }`}
          >
            H
          </button>

          {/* D (Double) */}
          <button
            type="button"
            onClick={() => onQuickAttendance('DOUBLE')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
              todayStatus === 'DOUBLE'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-purple-700 hover:bg-purple-100/70'
            }`}
          >
            P+P
          </button>

          {/* More options button */}
          <button
            type="button"
            onClick={() => setShowSheet(true)}
            className="px-2 py-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 rounded-lg text-xs font-bold transition flex items-center justify-center"
            title="More attendance options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Stats Line: Present | Absent | OT | Advance | Balance */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-emerald-600">
              P: <strong className="font-bold">{stats.presentCount}</strong>
            </span>
            <span className="font-semibold text-red-500">
              A: <strong className="font-bold">{stats.absentCount}</strong>
            </span>
            {stats.overtimeHours > 0 && (
              <span className="font-semibold text-slate-700">
                OT: <strong className="font-bold">{stats.overtimeHours}h</strong>
              </span>
            )}
            {stats.totalAdvance > 0 && (
              <span className="font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded text-[10px]">
                Adv: ₹{stats.totalAdvance}
              </span>
            )}
          </div>

          <div className="font-bold text-blue-700 bg-blue-50/70 px-2 py-0.5 rounded-lg border border-blue-100 text-xs">
            ₹{stats.balance.toFixed(0)}
          </div>
        </div>
      </div>

      <AttendanceSheet
        isOpen={showSheet}
        dayNumber={todayDay}
        currentStatus={todayStatus}
        onSelectStatus={onQuickAttendance}
        onClose={() => setShowSheet(false)}
      />
    </>
  );
};
