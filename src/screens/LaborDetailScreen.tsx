import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  MoreVertical,
  FileText,
  RotateCw
} from 'lucide-react';
import { useLabor } from '../context/LaborContext';
import { LaborWorker, AttendanceStatus, SalaryType, DayInfo } from '../types';
import { getMonthDays, parseYearMonth, getDateKey } from '../utils/calendar';
import { calculateMonthStats } from '../utils/stats';
import { AttendanceSheet } from '../components/AttendanceSheet';
import { AdvanceModal } from '../components/AdvanceModal';
import { OvertimeModal } from '../components/OvertimeModal';
import { DayAdvanceDetailModal } from '../components/DayAdvanceDetailModal';
import { MonthSelectorModal } from '../components/MonthSelectorModal';
import { SwipeToDeleteSheet } from '../components/SwipeToDeleteSheet';
import { generateWorkerReportText } from '../utils/pdfGenerator';

interface LaborDetailScreenProps {
  workerId: string;
}

export const LaborDetailScreen: React.FC<LaborDetailScreenProps> = ({ workerId }) => {
  const {
    workers,
    selectedMonth,
    setSelectedMonth,
    navigateTo,
    setAttendance,
    updateDayDetails,
    updateWorker,
    deleteWorker,
    showToast
  } = useLabor();

  const worker = workers.find((w) => w.id === workerId);

  // Modals state
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);
  const [showMonthModal, setShowMonthModal] = useState(false);
  const [sheetDay, setSheetDay] = useState<number | null>(null);
  const [advanceDay, setAdvanceDay] = useState<number | null>(null);
  const [otDay, setOtDay] = useState<number | null>(null);
  const [viewDetailDay, setViewDetailDay] = useState<number | null>(null);
  const [showEditWorkerModal, setShowEditWorkerModal] = useState(false);
  const [showDeleteWorkerModal, setShowDeleteWorkerModal] = useState(false);

  if (!worker) {
    return (
      <div className="p-8 text-center max-w-md mx-auto">
        <p className="text-slate-600 mb-4">Labor not found.</p>
        <button
          onClick={() => navigateTo({ type: 'HOME' })}
          className="px-4 py-2 bg-[#1862D6] text-white rounded-xl text-xs font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const stats = useMemo(() => calculateMonthStats(worker, selectedMonth), [worker, selectedMonth]);
  const days = useMemo(() => getMonthDays(selectedMonth), [selectedMonth]);
  const { year, month } = parseYearMonth(selectedMonth);

  const formatFullDateDisplay = (monthStr: string, dayNum: number) => {
    const parts = monthStr.split(' ');
    const mName = parts[0] || 'Aug';
    const yr = parts[1] || '2026';
    const dayPad = String(dayNum).padStart(2, '0');
    return `${mName} ${dayPad}, ${yr}`;
  };

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

  const firstName = worker.name.trim().split(' ')[0] || 'Labor';

  return (
    <div className="min-h-screen bg-white pb-28">
      {/* 1. Exact Header Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-2xs">
        <div className="max-w-md md:max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Left: Back Arrow and Worker Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo({ type: 'HOME' })}
              className="p-1 -ml-1 text-slate-900 hover:text-slate-600 transition"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">
              {worker.name}
            </h1>
          </div>

          {/* Right: Edit outline button & Red Trash button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEditWorkerModal(true)}
              className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-50 border border-slate-300 rounded-md text-xs font-semibold text-slate-800 shadow-2xs active:scale-95 transition"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>

            <button
              onClick={() => setShowDeleteWorkerModal(true)}
              className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition cursor-pointer"
              title="Delete Labor"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-md md:max-w-xl mx-auto px-4 pt-3 space-y-3">
        {/* 2. Overview Row: Subtitle + Month Selector */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500">
            Overview
          </span>

          <button
            onClick={() => setShowMonthModal(true)}
            className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 shadow-2xs transition"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-slate-900" />
            <span>{selectedMonth}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-700" />
          </button>
        </div>

        {/* 3. Summary 4-Column Metrics Row */}
        <div className="py-1">
          <div className="flex items-center justify-between">
            <div className="grid grid-cols-4 gap-2 flex-1 text-center">
              {/* Total Present */}
              <div>
                <span className="text-base font-bold text-[#10B981] block">
                  {stats.presentCount.toFixed(1)}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Total Present
                </span>
              </div>

              {/* Total Absent */}
              <div>
                <span className="text-base font-bold text-[#EF4444] block">
                  {stats.absentCount.toFixed(1)}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Total Absent
                </span>
              </div>

              {/* Over time */}
              <div>
                <span className="text-base font-bold text-slate-900 block">
                  {stats.overtimeHours}h
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Over time
                </span>
              </div>

              {/* Total Advance */}
              <div>
                <span className="text-base font-bold text-slate-900 block">
                  ₹{stats.totalAdvance.toFixed(1)}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Total Advance
                </span>
              </div>
            </div>

            {/* Expand/Collapse Chevron */}
            <button
              onClick={() => setIsOverviewExpanded(!isOverviewExpanded)}
              className="p-1 ml-2 text-[#1862D6] hover:bg-blue-50 rounded transition"
            >
              {isOverviewExpanded ? (
                <ChevronUp className="w-5 h-5 text-[#1862D6]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#1862D6]" />
              )}
            </button>
          </div>

          {/* Expandable Breakdown Row (Screenshot 1) */}
          {isOverviewExpanded && (
            <div className="pt-3 pb-1 border-t border-slate-100 mt-2 animate-in fade-in duration-150">
              <div className="grid grid-cols-4 gap-2 text-center">
                {/* Half day */}
                <div>
                  <span className="text-base font-bold text-slate-900 block">
                    {stats.halfDayCount.toFixed(1)}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Half day
                  </span>
                </div>

                {/* Total P+P */}
                <div>
                  <span className="text-base font-bold text-slate-900 block">
                    {stats.doubleCount.toFixed(1)}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Total P+P
                  </span>
                </div>

                {/* Total P+1/2 */}
                <div>
                  <span className="text-base font-bold text-slate-900 block">
                    {stats.presentHalfCount.toFixed(1)}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Total P+1/2
                  </span>
                </div>

                {/* Balance */}
                <div>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-base font-bold text-[#1862D6]">
                      ₹ {stats.balance.toFixed(1)}
                    </span>
                    <RotateCw className="w-3 h-3 text-slate-700 stroke-[2.5]" />
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Balance
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Open Report Link Banner */}
        <button
          onClick={() => navigateTo({ type: 'LABOR_REPORT', workerId: worker.id })}
          className="w-full py-2.5 bg-[#F0F5FF] hover:bg-blue-100/70 text-[#1862D6] rounded-md flex items-center justify-center gap-2 font-semibold text-xs sm:text-sm shadow-2xs transition"
        >
          <FileText className="w-4 h-4 text-[#1862D6]" />
          <span>Open Report</span>
        </button>
      </div>

      <div className="max-w-md md:max-w-xl mx-auto pt-2">
        <div className="grid grid-cols-[3.5rem_1fr_9rem] sm:grid-cols-[4rem_1fr_10rem] border-b border-t border-slate-200 text-xs font-bold text-slate-900 items-center bg-white">
          <div className="py-2.5 border-r border-slate-200 text-center">Date</div>
          <div className="py-2.5 border-r border-slate-200 text-left pl-3">Attendance</div>
          <div className="py-2.5 text-left pl-3">₹ / Notes</div>
        </div>

        <div className="divide-y divide-slate-200 border-b border-slate-200">
          {days.map((day: DayInfo) => {
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
            const isUnmarked = status === 'UNMARKED';
            const hasOT = (record.overtimeHours || 0) > 0;
            const hasAdvance = (record.advanceAmount || 0) > 0;
            const hasNote = Boolean(record.note);

            const dayTwoDigit = String(day.dayNumber).padStart(2, '0');

            return (
              <div
                key={day.dayNumber}
                className="grid grid-cols-[3.5rem_1fr_9rem] sm:grid-cols-[4rem_1fr_10rem] items-stretch hover:bg-slate-50/60 transition select-none"
              >
                <div className="flex flex-col items-center justify-center border-r border-slate-200 py-2.5">
                  <span className="text-[13px] sm:text-sm font-bold text-slate-900 leading-tight">
                    {dayTwoDigit}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 font-normal mt-0.5">
                    {day.dayOfWeek}
                  </span>
                </div>

                <div className="flex items-center justify-between pr-2 pl-3 border-r border-slate-200 py-2.5">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {isUnmarked ? (
                      <>
                        {/* A Button (Red Outline) */}
                        <button
                          type="button"
                          onClick={() => setAttendance(worker.id, day.dayNumber, 'ABSENT', selectedMonth)}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-red-400 text-red-500 bg-white hover:bg-red-50 flex items-center justify-center text-[13px] font-bold shadow-2xs cursor-pointer"
                          title="Mark Absent"
                        >
                          A
                        </button>

                        {/* P Button (Green Outline) */}
                        <button
                          type="button"
                          onClick={() => setAttendance(worker.id, day.dayNumber, 'PRESENT', selectedMonth)}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-emerald-400 text-emerald-600 bg-white hover:bg-emerald-50 flex items-center justify-center text-[13px] font-bold shadow-2xs cursor-pointer"
                          title="Mark Present"
                        >
                          P
                        </button>

                        {/* OT Button */}
                        <button
                          type="button"
                          onClick={() => setOtDay(day.dayNumber)}
                          className={`h-7 sm:h-8 px-2 min-w-[32px] rounded-lg border flex items-center justify-center text-xs cursor-pointer ${
                            hasOT
                              ? 'bg-purple-600 text-white border-purple-600 font-bold shadow-2xs'
                              : 'border-purple-400 text-purple-600 bg-white hover:bg-purple-50 font-bold shadow-2xs'
                          }`}
                          title="Overtime"
                        >
                          OT
                        </button>
                      </>
                    ) : (
                      <>
                        {status === 'ABSENT' && (
                          <button
                            type="button"
                            onClick={() => setSheetDay(day.dayNumber)}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-500 text-white font-bold text-[13px] flex items-center justify-center shadow-2xs cursor-pointer"
                            title="Absent - Tap to edit"
                          >
                            A
                          </button>
                        )}

                        {status === 'PRESENT' && (
                          <button
                            type="button"
                            onClick={() => setSheetDay(day.dayNumber)}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500 text-white font-bold text-[13px] flex items-center justify-center shadow-2xs cursor-pointer"
                            title="Present - Tap to edit"
                          >
                            P
                          </button>
                        )}

                        {status === 'HALF_DAY' && (
                          <button
                            type="button"
                            onClick={() => setSheetDay(day.dayNumber)}
                            className="h-7 sm:h-8 px-2.5 rounded-lg bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow-2xs cursor-pointer"
                            title="Half Day - Tap to edit"
                          >
                            1/2
                          </button>
                        )}

                        {status === 'PRESENT_HALF' && (
                          <button
                            type="button"
                            onClick={() => setSheetDay(day.dayNumber)}
                            className="h-7 sm:h-8 px-2 rounded-lg bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow-2xs cursor-pointer"
                            title="P + 1/2 - Tap to edit"
                          >
                            P + 1/2
                          </button>
                        )}

                        {status === 'DOUBLE' && (
                          <button
                            type="button"
                            onClick={() => setSheetDay(day.dayNumber)}
                            className="h-7 sm:h-8 px-2 rounded-lg bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow-2xs cursor-pointer"
                            title="Double - Tap to edit"
                          >
                            P + P
                          </button>
                        )}

                        {status === 'PAID_LEAVE' && (
                          <button
                            type="button"
                            onClick={() => setSheetDay(day.dayNumber)}
                            className="h-7 sm:h-8 px-2.5 rounded-lg bg-[#5B5BD6] text-white font-bold text-xs flex items-center justify-center shadow-2xs cursor-pointer"
                            title="Paid Leave - Tap to edit"
                          >
                            PA
                          </button>
                        )}

                        {/* OT Button */}
                        <button
                          type="button"
                          onClick={() => setOtDay(day.dayNumber)}
                          className={`h-7 sm:h-8 px-2 min-w-[32px] rounded-lg border flex items-center justify-center text-xs cursor-pointer ${
                            hasOT
                              ? 'bg-purple-600 text-white border-purple-600 font-bold shadow-2xs'
                              : 'border-purple-400 text-purple-600 bg-white hover:bg-purple-50 font-bold shadow-2xs'
                          }`}
                          title="Overtime"
                        >
                          OT
                        </button>
                      </>
                    )}
                  </div>

                  {/* 3 Dots Menu Button */}
                  <button
                    type="button"
                    onClick={() => setSheetDay(day.dayNumber)}
                    className="w-7 h-7 flex items-center justify-center text-slate-800 hover:bg-slate-100 rounded-md transition cursor-pointer shrink-0 ml-auto"
                    title="More Attendance Options"
                  >
                    <MoreVertical className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </div>

                <div
                  onClick={() => {
                    if (hasAdvance || hasNote) {
                      setViewDetailDay(day.dayNumber);
                    } else {
                      setAdvanceDay(day.dayNumber);
                    }
                  }}
                  className="flex items-center justify-between pl-3 pr-2 py-2 cursor-pointer hover:bg-slate-100/60 transition"
                >
                  <div className="flex items-center gap-1 min-w-0 truncate">
                    {hasAdvance ? (
                      <span className="text-xs font-bold text-red-500">
                        ₹ {record.advanceAmount}
                      </span>
                    ) : hasNote ? (
                      <span className="text-xs font-medium text-red-500 truncate max-w-[80px]">
                        {record.note}
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-slate-400">
                        ₹
                      </span>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Floating Action Button: Share to Worker */}
      <div className="fixed bottom-20 right-4 z-30">
        <button
          onClick={handleShareSlip}
          className="flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-slate-900 active:scale-95 text-white font-semibold text-xs rounded-full shadow-lg shadow-black/25 transition"
        >
          <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
            <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.92-9.91-9.92zm5.79 13.99c-.24.67-1.4 1.28-1.95 1.33-.51.05-1.18.07-3.87-1.04-3.27-1.34-5.38-4.66-5.54-4.88-.16-.22-1.33-1.78-1.33-3.39 0-1.61.85-2.4 1.15-2.73.3-.33.65-.41.87-.41.22 0 .43 0 .62.01.2.01.47-.08.73.55.27.65.92 2.25 1 2.41.08.16.13.36.03.57-.1.22-.16.36-.31.54-.16.18-.34.4-.48.54-.16.16-.33.33-.14.65.19.33.84 1.39 1.8 2.24 1.23 1.1 2.27 1.44 2.59 1.6.33.16.52.14.71-.08.2-.22.85-.99 1.08-1.33.22-.34.45-.29.75-.18.3.11 1.9.9 2.23 1.06.33.16.55.24.63.38.08.14.08.82-.16 1.49z"/>
            </svg>
          </div>
          <span>Share to {firstName}</span>
        </button>
      </div>

      {/* 7. Month Selector Modal */}
      {showMonthModal && (
        <MonthSelectorModal
          isOpen={true}
          selectedMonth={selectedMonth}
          onSelectMonth={(m) => {
            setSelectedMonth(m);
            setShowMonthModal(false);
          }}
          onClose={() => setShowMonthModal(false)}
        />
      )}

      {/* 8. Attendance Sheet Modal (Screenshot 1: Mark Attendance) */}
      {sheetDay !== null && (
        <AttendanceSheet
          isOpen={true}
          workerName={worker.name}
          formattedDate={formatFullDateDisplay(selectedMonth, sheetDay)}
          dayNumber={sheetDay}
          currentStatus={
            worker.attendance[getDateKey(year, month, sheetDay)]?.status || 'UNMARKED'
          }
          hasOvertime={
            (worker.attendance[getDateKey(year, month, sheetDay)]?.overtimeHours || 0) > 0
          }
          overtimeHours={
            worker.attendance[getDateKey(year, month, sheetDay)]?.overtimeHours || 0
          }
          onSelectStatus={(status) => {
            setAttendance(worker.id, sheetDay, status, selectedMonth);
            setSheetDay(null);
          }}
          onOpenOvertime={() => {
            const currentDay = sheetDay;
            setSheetDay(null);
            setOtDay(currentDay);
          }}
          onClose={() => setSheetDay(null)}
        />
      )}

      {/* 9. Advance Modal */}
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

      {/* 10. Overtime Modal (Screenshot 3 & 4) */}
      {otDay !== null && (
        <OvertimeModal
          isOpen={true}
          workerName={worker.name}
          formattedDate={formatFullDateDisplay(selectedMonth, otDay)}
          dayNumber={otDay}
          selectedMonth={selectedMonth}
          defaultHourlyRate={0}
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

      {/* 11. Day Advance & Note Detail Modal */}
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

      {/* 12. Edit Labor Details Modal */}
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
          onDelete={() => {
            setShowEditWorkerModal(false);
            setShowDeleteWorkerModal(true);
          }}
          onClose={() => setShowEditWorkerModal(false)}
        />
      )}

      {/* 13. Delete Confirmation Modal (Swipe to delete) */}
      {showDeleteWorkerModal && (
        <SwipeToDeleteSheet
          isOpen={true}
          workerName={worker.name}
          onConfirm={() => {
            deleteWorker(worker.id);
            setShowDeleteWorkerModal(false);
            navigateTo({ type: 'HOME' });
          }}
          onClose={() => setShowDeleteWorkerModal(false)}
        />
      )}
    </div>
  );
};

// Edit Labor Modal Subcomponent
const EditWorkerModal: React.FC<{
  worker: LaborWorker;
  onSave: (name: string, phone: string, wage: number, salaryType: SalaryType) => void;
  onDelete: () => void;
  onClose: () => void;
}> = ({ worker, onSave, onDelete, onClose }) => {
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 select-none">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-base">Edit Labor Details</h3>
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
            title="Delete Labor"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Labor Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1862D6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1862D6]"
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
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#1862D6]"
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
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#1862D6]"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 font-bold text-xs rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-2 py-2.5 bg-[#1862D6] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
