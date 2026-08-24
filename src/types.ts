export type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "HALF_DAY"
  | "DOUBLE"
  | "PRESENT_HALF"
  | "PAID_LEAVE"
  | "OVERTIME"
  | "UNMARKED";

export type PaymentMethod = "ONLINE" | "CASH";

export type TransactionType = "CASH_IN" | "CASH_OUT";

export type SalaryType = "Daily" | "Monthly";

export interface DailyAttendance {
  fullDate: string; // "YYYY-MM-DD"
  dayNumber: number;
  dayOfWeek: string;
  status: AttendanceStatus;
  overtimeHours: number;
  advanceAmount: number;
  note: string;
  overtimeRate: number;
  paymentMethod: PaymentMethod;
}

export interface LaborWorker {
  id: string;
  name: string;
  phoneNumber: string;
  dailyWage: number;
  avatarColorHex: string;
  createdAt: number;
  salaryType: SalaryType;
  attendance: Record<string, DailyAttendance>; // key is "YYYY-MM-DD"
}

export interface CashTransaction {
  id: string;
  dateDisplay: string;
  fullDate: string; // "YYYY-MM-DD"
  type: TransactionType;
  amount: number;
  paymentMethod: PaymentMethod;
  notes: string;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  businessName: string;
  mobile: string;
  email: string;
  language: string; // "en" | "hi"
  isPro: boolean;
  authProvider: string;
}

export interface WorkerMonthStats {
  presentCount: number;
  absentCount: number;
  halfDayCount: number;
  doubleCount: number;
  presentHalfCount: number;
  paidLeaveCount: number;
  overtimeHours: number;
  totalAdvance: number;
  totalOvertimeAmount: number;
  grossWage: number;
  balance: number;
}

export interface DayInfo {
  dayNumber: number;
  dayOfWeek: string;
  dateKey: string; // "YYYY-MM-DD"
  isSunday: boolean;
  isToday: boolean;
}

export type Screen =
  | { type: "HOME" }
  | { type: "LABOR_DETAIL"; workerId: string }
  | { type: "ADD_LABOR" }
  | { type: "CASH_BOOK" }
  | { type: "CASH_BOOK_REPORT" }
  | { type: "LABOR_REPORT"; workerId: string }
  | { type: "BATCH_PDF_HUB" }
  | { type: "SETTINGS" };

export interface SavedContact {
  id: string;
  name: string;
  phone: string;
}
