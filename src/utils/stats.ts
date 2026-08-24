import { LaborWorker, WorkerMonthStats } from '../types';
import { parseYearMonth, getDaysInMonth } from './calendar';

export function calculateMonthStats(worker: LaborWorker, monthStr: string): WorkerMonthStats {
  const { year, month } = parseYearMonth(monthStr);
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  const daysInMonth = getDaysInMonth(year, month);

  let presentCount = 0;
  let absentCount = 0;
  let halfDayCount = 0;
  let doubleCount = 0;
  let presentHalfCount = 0;
  let paidLeaveCount = 0;
  let overtimeHours = 0;
  let totalAdvance = 0;
  let totalOvertimeAmount = 0;

  const defaultHourlyRate = worker.dailyWage > 0 ? worker.dailyWage / 8 : 0;

  for (const [dateKey, record] of Object.entries(worker.attendance || {})) {
    if (!dateKey.startsWith(prefix)) continue;

    switch (record.status) {
      case "PRESENT":
        presentCount += 1;
        break;
      case "ABSENT":
        absentCount += 1;
        break;
      case "HALF_DAY":
        halfDayCount += 1;
        break;
      case "DOUBLE":
        doubleCount += 1;
        break;
      case "PRESENT_HALF":
        presentHalfCount += 1;
        break;
      case "PAID_LEAVE":
        paidLeaveCount += 1;
        break;
      default:
        break;
    }

    if (record.overtimeHours > 0) {
      overtimeHours += record.overtimeHours;
      const rate = record.overtimeRate > 0 ? record.overtimeRate : defaultHourlyRate;
      totalOvertimeAmount += record.overtimeHours * rate;
    }

    if (record.advanceAmount > 0) {
      totalAdvance += record.advanceAmount;
    }
  }

  let baseEarnings = 0;
  const isMonthly = (worker.salaryType || "").toLowerCase() === "monthly";

  const effectiveDays = presentCount + (halfDayCount * 0.5) + (doubleCount * 2.0) + (presentHalfCount * 1.5) + (paidLeaveCount * 1.0);

  if (isMonthly) {
    const dailyRate = daysInMonth > 0 ? worker.dailyWage / daysInMonth : 0;
    baseEarnings = effectiveDays * dailyRate;
  } else {
    baseEarnings = effectiveDays * worker.dailyWage;
  }

  const grossWage = baseEarnings + totalOvertimeAmount;
  const balance = grossWage - totalAdvance;

  return {
    presentCount,
    absentCount,
    halfDayCount,
    doubleCount,
    presentHalfCount,
    paidLeaveCount,
    overtimeHours,
    totalAdvance,
    totalOvertimeAmount,
    grossWage,
    balance
  };
}
