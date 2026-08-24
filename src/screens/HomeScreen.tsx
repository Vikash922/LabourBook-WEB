import React, { useMemo } from 'react';
import { Search, UserPlus, Users, CheckCircle, XCircle, HelpCircle, FileSpreadsheet } from 'lucide-react';
import { useLabor } from '../context/LaborContext';
import { WorkerCard } from '../components/WorkerCard';
import { getDateKey, getTodayYear, getTodayMonth, getTodayDay } from '../utils/calendar';
import { t } from '../utils/strings';

export const HomeScreen: React.FC = () => {
  const { 
    workers, 
    selectedMonth, 
    searchQuery, 
    setSearchQuery, 
    navigateTo, 
    setAttendance,
    userProfile 
  } = useLabor();

  const lang = userProfile.language || 'en';
  const todayDay = getTodayDay();
  const todayKey = getDateKey(getTodayYear(), getTodayMonth(), todayDay);

  // Compute today's summary
  const todayStats = useMemo(() => {
    let present = 0;
    let absent = 0;
    let unmarked = 0;

    for (const w of workers) {
      const rec = w.attendance[todayKey];
      const status = rec?.status || 'UNMARKED';
      if (status === 'PRESENT' || status === 'DOUBLE' || status === 'PRESENT_HALF') {
        present += 1;
      } else if (status === 'ABSENT') {
        absent += 1;
      } else if (status === 'HALF_DAY') {
        present += 0.5;
      } else {
        unmarked += 1;
      }
    }

    return { total: workers.length, present, absent, unmarked };
  }, [workers, todayKey]);

  // Filter workers based on search
  const filteredWorkers = useMemo(() => {
    if (!searchQuery.trim()) return workers;
    const q = searchQuery.toLowerCase().trim();
    return workers.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        (w.phoneNumber && w.phoneNumber.includes(q))
    );
  }, [workers, searchQuery]);

  return (
    <div className="pb-24 pt-3 px-3 max-w-4xl mx-auto space-y-3">
      {/* 1. Today Overview Dashboard Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-3.5">
        <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Today's Staff Attendance</span>
          </div>
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            Day {todayDay}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          {/* Total */}
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-500 font-medium block">{t('total_staff', lang)}</span>
            <span className="text-lg font-black text-slate-900">{todayStats.total}</span>
          </div>

          {/* Present */}
          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100">
            <span className="text-xs text-emerald-700 font-medium block">{t('today_present', lang)}</span>
            <span className="text-lg font-black text-emerald-600">{todayStats.present}</span>
          </div>

          {/* Absent */}
          <div className="p-2 rounded-xl bg-red-50 border border-red-100">
            <span className="text-xs text-red-700 font-medium block">{t('today_absent', lang)}</span>
            <span className="text-lg font-black text-red-600">{todayStats.absent}</span>
          </div>

          {/* Unmarked */}
          <div className="p-2 rounded-xl bg-amber-50 border border-amber-100">
            <span className="text-xs text-amber-700 font-medium block">{t('today_unmarked', lang)}</span>
            <span className="text-lg font-black text-amber-600">{todayStats.unmarked}</span>
          </div>
        </div>
      </div>

      {/* 2. Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('search_staff', lang)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs placeholder:text-slate-400 transition"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-bold text-slate-400 hover:text-slate-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* 3. Worker Cards List */}
      {filteredWorkers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <UserPlus className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">
            {searchQuery ? "No staff found" : "No staff registered yet"}
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {searchQuery
              ? "Try searching with a different name or phone number."
              : "Start recording worker attendance, overtime, daily wages and advances."}
          </p>
          {!searchQuery && (
            <button
              onClick={() => navigateTo({ type: 'ADD_LABOR' })}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 hover:bg-blue-700 transition"
            >
              <UserPlus className="w-4 h-4" />
              {t('add_staff', lang)}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredWorkers.map((worker) => (
            <WorkerCard
              key={worker.id}
              worker={worker}
              selectedMonth={selectedMonth}
              onCardClick={() => navigateTo({ type: 'LABOR_DETAIL', workerId: worker.id })}
              onQuickAttendance={(status) => setAttendance(worker.id, todayDay, status, selectedMonth)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
