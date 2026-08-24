import React, { useState } from 'react';
import {
  ArrowLeft,
  Phone,
  Edit2,
  Trash2,
  Share2,
  FileText,
  Clock,
  Plus,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Banknote,
  Send
} from 'lucide-react';
import { useLabor } from '../context/LaborContext';
import { LaborWorker, AttendanceStatus, PaymentMethod, SalaryType } from '../types';
import { getMonthDays, parseYearMonth, getDateKey } from '../utils/calendar';
import { calculateMonthStats } from '../utils/stats';
import { AttendanceSheet } from '../components/AttendanceSheet';
import { AdvanceModal } from '../components/AdvanceModal';
import { OvertimeModal } from '../components/OvertimeModal';
import { DayAdvanceDetailModal } from '../components/DayAdvanceDetailModal';
import { generateWorkerReportText } from '../utils/pdfGenerator';
import { t } from '../utils/strings';

interface LaborDetailScreenProps {
  workerId: string;
}

export const LaborDetailScreen: React.FC<LaborDetailScreenProps> = ({ workerId }) => {
  const {
    workers,
    selectedMonth,
    navigateTo,
    setAttendance,
    updateDayDetails,
    updateWorker,
    deleteWorker,
    showToast,
    userProfile
  } = useLabor();

  const lang = userProfile.language || 'en';
  const worker = workers.find((w) => w.id === workerId);

  // Modals state
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(true);
  const [sheetDay, setSheetDay] = useState<number | null>(null);
  const [advanceDay, setAdvanceDay] = useState<number | null>(null);
  const [otDay, setOtDay] = useState<number | null>(null);
  const [viewDetailDay, setViewDetailDay] = useState<number | null>(null);
  const [showEditWorkerModal, setShowEditWorkerModal] = useState(false);

  if (!worker) {
    return (
      <div className="p-8 text-center max-w-md mx-auto">
        <p className="text-slate-600 mb-4">Staff member not found.</p>
        <button
          onClick={() => navigateTo({ type: 'HOME' })}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const stats = calculateMonthStats(worker, selectedMonth);
  const days = getMonthDays(selectedMonth);
  const { year, month } = parseYearMonth(selectedMonth);

  const isMonthly = (worker.salaryType || '').toLowerCase() === 'monthly';
  const wageDisplay = isMonthly ? `₹${worker.dailyWage} / month` : `₹${worker.dailyWage} / day`;

  const handleShareSlip = () => {
    const text = generateWorkerReportText(worker, selectedMonth, stats);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast('Slip copied to clipboard! Opening WhatsApp...');
    }
    const cleanPhone = (worker.phoneNumber || '').replace(/\D/g, '');
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'PRESENT':
        return { label: 'P', bg: 'bg-emerald-600 text-white border-emerald-600 shadow-2xs' };
      case 'ABSENT':
        return { label: 'A', bg: 'bg-red-600 text-white border-red-600 shadow-2xs' };
      case 'HALF_DAY':
        return { label: 'H', bg: 'bg-amber-500 text-white border-amber-500 shadow-2xs' };
      case 'DOUBLE':
        return { label: 'P+P', bg: 'bg-purple-600 text-white border-purple-600 shadow-2xs' };
      case 'PRESENT_HALF':
        return { label: 'P+1/2', bg: 'bg-indigo-600 text-white border-indigo-600 shadow-2xs' };
      default:
        return { label: '-', bg: 'bg-slate-100 text-slate-400 border-slate-200 hover:border-slate-300' };
    }
  };

  return (
    <div className="pb-28 pt-2 px-3 max-w-4xl mx-auto space-y-3">
      {/* 1. Header Navigation Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo({ type: 'HOME' })}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm"
              style={{ backgroundColor: worker.avatarColorHex || '#1D61D2' }}
            >
              {worker.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm leading-tight line-clamp-1">{worker.name}</h2>
              <span className="text-[11px] font-semibold text-blue-600">{wageDisplay}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {worker.phoneNumber && (
            <a
              href={`tel:${worker.phoneNumber}`}
              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition"
              title="Call"
            >
              <Phone className="w-4 h-4" />
            </a>
          )}
          <button
            onClick={() => setShowEditWorkerModal(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition"
            title="Edit Staff Info"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (confirm(`Are you sure you want to delete ${worker.name}?`)) {
                deleteWorker(worker.id);
                navigateTo({ type: 'HOME' });
              }
            }}
            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
            title="Delete Staff"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Overview Collapsible Dashboard */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div
          onClick={() => setIsOverviewExpanded(!isOverviewExpanded)}
          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 transition select-none"
        >
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-sm">{t('monthly_overview', lang)}</span>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {selectedMonth}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Balance</span>
              <span className="text-sm font-black text-blue-600">₹{stats.balance.toFixed(0)}</span>
            </div>
            {isOverviewExpanded ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </div>
        </div>

        {isOverviewExpanded && (
          <div className="p-3.5 pt-0 border-t border-slate-100 space-y-3">
            <div className="grid grid-cols-4 gap-2 text-center mt-3">
              {/* Total Present */}
              <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-xl">
                <span className="text-[10px] text-emerald-700 font-semibold block">{t('total_present', lang)}</span>
                <span className="text-base font-black text-emerald-600">{stats.presentCount}</span>
              </div>

              {/* Total Absent */}
              <div className="p-2 bg-red-50 border border-red-100 rounded-xl">
                <span className="text-[10px] text-red-700 font-semibold block">{t('total_absent', lang)}</span>
                <span className="text-base font-black text-red-600">{stats.absentCount}</span>
              </div>

              {/* Overtime */}
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-600 font-semibold block">{t('over_time', lang)}</span>
                <span className="text-base font-black text-slate-800">{stats.overtimeHours}h</span>
              </div>

              {/* Total Advance */}
              <div className="p-2 bg-red-50/70 border border-red-200 rounded-xl">
                <span className="text-[10px] text-red-600 font-semibold block">{t('advance', lang)}</span>
                <span className="text-base font-black text-red-600">₹{stats.totalAdvance}</span>
              </div>
            </div>

            {/* Additional breakdown pills */}
            <div className="flex flex-wrap gap-2 text-xs pt-1">
              <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 font-semibold">
                Half Days: <strong>{stats.halfDayCount}</strong>
              </span>
              <span className="px-2.5 py-1 bg-purple-50 border border-purple-200 rounded-lg text-purple-800 font-semibold">
                Double (P+P): <strong>{stats.doubleCount}</strong>
              </span>
              <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-800 font-semibold">
                Present + 1/2: <strong>{stats.presentHalfCount}</strong>
              </span>
              <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-semibold">
                Gross: <strong>₹{stats.grossWage.toFixed(0)}</strong>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Open Report Banner Button */}
      <button
        onClick={() => navigateTo({ type: 'LABOR_REPORT', workerId: worker.id })}
        className="w-full p-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl flex items-center justify-between font-bold text-xs shadow-md shadow-blue-500/20 transition"
      >
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span>{t('open_report', lang)} (PDF Slip & WhatsApp Text)</span>
        </div>
        <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">View</span>
      </button>

      {/* 4. Daily Attendance Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 text-[11px] font-bold text-slate-600 flex items-center justify-between">
          <div className="w-16">DATE</div>
          <div className="w-20 text-center">ATTENDANCE</div>
          <div className="flex-1 text-right">ADVANCE / OT / NOTES</div>
        </div>

        <div className="divide-y divide-slate-100">
          {days.map((day) => {
            const dateKey = day.dateKey;
            const record = worker.attendance[dateKey] || {
              fullDate: dateKey,
              dayNumber: day.dayNumber,
              dayOfWeek: day.dayOfWeek,
              status: 'UNMARKED',
              overtimeHours: 0,
              advanceAmount: 0,
              note: '',
              overtimeRate: 0,
              paymentMethod: 'CASH'
            };

            const status = record.status || 'UNMARKED';
            const badge = getStatusBadge(status);
            const hasAdvance = (record.advanceAmount || 0) > 0;
            const hasOT = (record.overtimeHours || 0) > 0;
            const hasNote = Boolean(record.note);

            return (
              <div
                key={day.dayNumber}
                className={`px-3.5 py-2.5 flex items-center justify-between gap-2 hover:bg-slate-50/80 transition ${
                  day.isToday ? 'bg-blue-50/40' : day.isSunday ? 'bg-red-50/20' : ''
                }`}
              >
                {/* Date Column */}
                <div className="w-16 flex flex-col">
                  <span
                    className={`text-xs font-black ${
                      day.isToday ? 'text-blue-600' : day.isSunday ? 'text-red-500' : 'text-slate-800'
                    }`}
                  >
                    {day.dayNumber}{' '}
                    <span className="text-[10px] font-semibold text-slate-500">{day.dayOfWeek}</span>
                  </span>
                  {day.isToday && (
                    <span className="text-[9px] font-bold text-blue-600 uppercase tracking-tight">Today</span>
                  )}
                </div>

                {/* Attendance Status Button */}
                <div className="w-20 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setSheetDay(day.dayNumber)}
                    className={`w-14 py-1.5 rounded-xl border text-xs font-black transition active:scale-95 ${badge.bg}`}
                  >
                    {badge.label}
                  </button>
                </div>

                {/* Advance / OT / Notes Column */}
                <div className="flex-1 flex items-center justify-end gap-1.5 flex-wrap">
                  {/* Advance pill */}
                  {hasAdvance ? (
                    <button
                      onClick={() => setViewDetailDay(day.dayNumber)}
                      className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-[10px] font-black transition flex items-center gap-1"
                    >
                      <span>Adv: ₹{record.advanceAmount}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setAdvanceDay(day.dayNumber)}
                      className="px-2 py-1 bg-slate-50 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-500 border border-slate-200 rounded-lg text-[10px] font-bold transition"
                      title="Add Advance"
                    >
                      +Adv
                    </button>
                  )}

                  {/* Overtime pill */}
                  {hasOT ? (
                    <button
                      onClick={() => setOtDay(day.dayNumber)}
                      className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-[10px] font-black transition flex items-center gap-1"
                    >
                      <Clock className="w-3 h-3" />
                      <span>{record.overtimeHours}h OT</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setOtDay(day.dayNumber)}
                      className="px-2 py-1 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-500 border border-slate-200 rounded-lg text-[10px] font-bold transition"
                      title="Add Overtime"
                    >
                      +OT
                    </button>
                  )}

                  {/* Note preview if any */}
                  {hasNote && (
                    <span
                      className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded truncate max-w-[90px]"
                      title={record.note}
                    >
                      {record.note}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Floating WhatsApp Share Button */}
      <div className="fixed bottom-20 right-4 z-30">
        <button
          onClick={handleShareSlip}
          className="flex items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-full shadow-lg shadow-emerald-500/30 transition"
        >
          <Send className="w-4 h-4" />
          <span>{t('whatsapp_share', lang)}</span>
        </button>
      </div>

      {/* 6. Modals */}
      {/* Attendance Sheet */}
      {sheetDay !== null && (
        <AttendanceSheet
          isOpen={true}
          dayNumber={sheetDay}
          currentStatus={
            worker.attendance[getDateKey(year, month, sheetDay)]?.status || 'UNMARKED'
          }
          onSelectStatus={(status) => {
            setAttendance(worker.id, sheetDay, status, selectedMonth);
            setSheetDay(null);
          }}
          onClose={() => setSheetDay(null)}
        />
      )}

      {/* Advance Modal */}
      {advanceDay !== null && (
        <AdvanceModal
          isOpen={true}
          workerName={worker.name}
          dayNumber={advanceDay}
          selectedMonth={selectedMonth}
          initialAdvance={
            worker.attendance[getDateKey(year, month, advanceDay)]?.advanceAmount || 0
          }
          initialNote={
            worker.attendance[getDateKey(year, month, advanceDay)]?.note || ''
          }
          initialPaymentMethod={
            worker.attendance[getDateKey(year, month, advanceDay)]?.paymentMethod || 'CASH'
          }
          onSave={(amt, note, pMode) => {
            const currentRec = worker.attendance[getDateKey(year, month, advanceDay)];
            updateDayDetails(
              worker.id,
              advanceDay,
              amt,
              note,
              currentRec?.overtimeHours || 0,
              currentRec?.overtimeRate || 0,
              selectedMonth,
              pMode
            );
          }}
          onDelete={() => {
            const currentRec = worker.attendance[getDateKey(year, month, advanceDay)];
            updateDayDetails(
              worker.id,
              advanceDay,
              0,
              '',
              currentRec?.overtimeHours || 0,
              currentRec?.overtimeRate || 0,
              selectedMonth,
              'CASH'
            );
          }}
          onClose={() => setAdvanceDay(null)}
        />
      )}

      {/* Overtime Modal */}
      {otDay !== null && (
        <OvertimeModal
          isOpen={true}
          workerName={worker.name}
          dayNumber={otDay}
          selectedMonth={selectedMonth}
          defaultHourlyRate={worker.dailyWage > 0 ? worker.dailyWage / 8 : 0}
          initialHours={
            worker.attendance[getDateKey(year, month, otDay)]?.overtimeHours || 0
          }
          initialRate={
            worker.attendance[getDateKey(year, month, otDay)]?.overtimeRate || 0
          }
          onSave={(hours, rate) => {
            const currentRec = worker.attendance[getDateKey(year, month, otDay)];
            updateDayDetails(
              worker.id,
              otDay,
              currentRec?.advanceAmount || 0,
              currentRec?.note || '',
              hours,
              rate,
              selectedMonth,
              currentRec?.paymentMethod || 'CASH'
            );
          }}
          onDelete={() => {
            const currentRec = worker.attendance[getDateKey(year, month, otDay)];
            updateDayDetails(
              worker.id,
              otDay,
              currentRec?.advanceAmount || 0,
              currentRec?.note || '',
              0,
              0,
              selectedMonth,
              currentRec?.paymentMethod || 'CASH'
            );
          }}
          onClose={() => setOtDay(null)}
        />
      )}

      {/* Day Advance Detail Modal */}
      {viewDetailDay !== null && (
        <DayAdvanceDetailModal
          isOpen={true}
          dayNumber={viewDetailDay}
          selectedMonth={selectedMonth}
          workerName={worker.name}
          status={
            worker.attendance[getDateKey(year, month, viewDetailDay)]?.status || 'UNMARKED'
          }
          advanceAmount={
            worker.attendance[getDateKey(year, month, viewDetailDay)]?.advanceAmount || 0
          }
          paymentMethod={
            worker.attendance[getDateKey(year, month, viewDetailDay)]?.paymentMethod || 'CASH'
          }
          note={
            worker.attendance[getDateKey(year, month, viewDetailDay)]?.note || ''
          }
          onEdit={() => {
            const d = viewDetailDay;
            setViewDetailDay(null);
            setAdvanceDay(d);
          }}
          onDelete={() => {
            const currentRec = worker.attendance[getDateKey(year, month, viewDetailDay)];
            updateDayDetails(
              worker.id,
              viewDetailDay,
              0,
              '',
              currentRec?.overtimeHours || 0,
              currentRec?.overtimeRate || 0,
              selectedMonth,
              'CASH'
            );
            setViewDetailDay(null);
          }}
          onClose={() => setViewDetailDay(null)}
        />
      )}

      {/* Edit Worker Details Modal */}
      {showEditWorkerModal && (
        <EditWorkerModal
          worker={worker}
          onSave={(name, phone, wage, sType) => {
            updateWorker({
              ...worker,
              name,
              phoneNumber: phone,
              dailyWage: wage,
              salaryType: sType
            });
            setShowEditWorkerModal(false);
          }}
          onClose={() => setShowEditWorkerModal(false)}
        />
      )}
    </div>
  );
};

// Edit Worker Modal Subcomponent
const EditWorkerModal: React.FC<{
  worker: LaborWorker;
  onSave: (name: string, phone: string, wage: number, salaryType: SalaryType) => void;
  onClose: () => void;
}> = ({ worker, onSave, onClose }) => {
  const [name, setName] = useState(worker.name);
  const [phone, setPhone] = useState(worker.phoneNumber || '');
  const [wageStr, setWageStr] = useState(String(worker.dailyWage));
  const [salaryType, setSalaryType] = useState<SalaryType>(worker.salaryType || 'Daily');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name.trim(), phone.trim(), parseFloat(wageStr) || 0, salaryType);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Edit Staff Details</h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Staff Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Salary Type
              </label>
              <select
                value={salaryType}
                onChange={(e) => setSalaryType(e.target.value as SalaryType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              >
                <option value="Daily">Daily Wage</option>
                <option value="Monthly">Monthly Fixed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Rate (₹)
              </label>
              <input
                type="number"
                step="any"
                required
                value={wageStr}
                onChange={(e) => setWageStr(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 font-bold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
