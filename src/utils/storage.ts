import { LaborWorker, CashTransaction, UserProfile, AttendanceStatus, PaymentMethod, TransactionType, SalaryType } from '../types';
import { formatCurrentMonth, getDateKey, getTodayYear, getTodayMonth, getTodayDay } from './calendar';

const STORAGE_KEY_WORKERS = 'laborbook_workers_v1';
const STORAGE_KEY_TRANSACTIONS = 'laborbook_transactions_v1';
const STORAGE_KEY_PROFILE = 'laborbook_profile_v1';

export const INITIAL_PROFILE: UserProfile = {
  name: "Site Manager",
  businessName: "LabourBook Construction",
  mobile: "+91 9876543210",
  email: "manager@labourbook.app",
  language: "en",
  isPro: true,
  authProvider: "Google"
};

// Seed 3 realistic workers with some recent attendance for demonstration
export function getInitialWorkers(): LaborWorker[] {
  const currentYear = getTodayYear();
  const currentMonth = getTodayMonth();
  const todayDay = getTodayDay();

  const w1Id = "worker-1";
  const w2Id = "worker-2";

  const makeDateKey = (day: number) => getDateKey(currentYear, currentMonth, day);

  const w1Attendance: Record<string, any> = {};
  const w2Attendance: Record<string, any> = {};

  for (let d = 1; d <= Math.min(todayDay, 28); d++) {
    const dKey = makeDateKey(d);
    if (d % 7 === 0) {
      // Sunday
      w1Attendance[dKey] = { fullDate: dKey, dayNumber: d, dayOfWeek: "Sun", status: "UNMARKED", overtimeHours: 0, advanceAmount: 0, note: "", overtimeRate: 0, paymentMethod: "CASH" };
      w2Attendance[dKey] = { fullDate: dKey, dayNumber: d, dayOfWeek: "Sun", status: "UNMARKED", overtimeHours: 0, advanceAmount: 0, note: "", overtimeRate: 0, paymentMethod: "CASH" };
    } else {
      w1Attendance[dKey] = {
        fullDate: dKey,
        dayNumber: d,
        dayOfWeek: "Mon",
        status: d % 5 === 0 ? "HALF_DAY" : "PRESENT",
        overtimeHours: d % 4 === 0 ? 2 : 0,
        advanceAmount: d === 10 ? 500 : 0,
        note: d === 10 ? "Weekly advance" : "",
        overtimeRate: 80,
        paymentMethod: "CASH"
      };

      w2Attendance[dKey] = {
        fullDate: dKey,
        dayNumber: d,
        dayOfWeek: "Mon",
        status: d % 6 === 0 ? "ABSENT" : "PRESENT",
        overtimeHours: d % 3 === 0 ? 1.5 : 0,
        advanceAmount: d === 5 ? 1000 : 0,
        note: d === 5 ? "Site advance" : "",
        overtimeRate: 100,
        paymentMethod: "ONLINE"
      };
    }
  }

  return [
    {
      id: w1Id,
      name: "Akash",
      phoneNumber: "7848894498",
      dailyWage: 650,
      avatarColorHex: "#FFE7D6", // Peach / light orange
      createdAt: Date.now() - 30 * 86400000,
      salaryType: "Daily",
      attendance: w1Attendance
    },
    {
      id: w2Id,
      name: "Vikash",
      phoneNumber: "7848894498",
      dailyWage: 800,
      avatarColorHex: "#E6FAF2", // Mint green
      createdAt: Date.now() - 40 * 86400000,
      salaryType: "Daily",
      attendance: w2Attendance
    }
  ];
}

export function getInitialTransactions(): CashTransaction[] {
  const currentYear = getTodayYear();
  const currentMonth = getTodayMonth();
  const makeDateKey = (day: number) => getDateKey(currentYear, currentMonth, day);

  return [
    {
      id: "tx-1",
      dateDisplay: `${makeDateKey(1)}`,
      fullDate: makeDateKey(1),
      type: "CASH_IN",
      amount: 25000,
      paymentMethod: "ONLINE",
      notes: "Client Site Advance Payment",
      timestamp: Date.now() - 15 * 86400000
    },
    {
      id: "tx-2",
      dateDisplay: `${makeDateKey(5)}`,
      fullDate: makeDateKey(5),
      type: "CASH_OUT",
      amount: 1000,
      paymentMethod: "ONLINE",
      notes: "Advance to Suresh Sharma",
      timestamp: Date.now() - 10 * 86400000
    },
    {
      id: "tx-3",
      dateDisplay: `${makeDateKey(10)}`,
      fullDate: makeDateKey(10),
      type: "CASH_OUT",
      amount: 500,
      paymentMethod: "CASH",
      notes: "Advance to Ramesh Kumar",
      timestamp: Date.now() - 5 * 86400000
    },
    {
      id: "tx-4",
      dateDisplay: `${makeDateKey(12)}`,
      fullDate: makeDateKey(12),
      type: "CASH_OUT",
      amount: 3200,
      paymentMethod: "CASH",
      notes: "Cement bags & Sand delivery",
      timestamp: Date.now() - 3 * 86400000
    }
  ];
}

export function loadWorkersFromStorage(): LaborWorker[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WORKERS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Failed to load workers from storage", e);
  }
  const init = getInitialWorkers();
  saveWorkersToStorage(init);
  return init;
}

export function saveWorkersToStorage(workers: LaborWorker[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_WORKERS, JSON.stringify(workers));
  } catch (e) {
    console.error("Failed to save workers to storage", e);
  }
}

export function loadTransactionsFromStorage(): CashTransaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Failed to load transactions from storage", e);
  }
  const init = getInitialTransactions();
  saveTransactionsToStorage(init);
  return init;
}

export function saveTransactionsToStorage(transactions: CashTransaction[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
  } catch (e) {
    console.error("Failed to save transactions to storage", e);
  }
}

export function loadProfileFromStorage(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Failed to load profile from storage", e);
  }
  return INITIAL_PROFILE;
}

export function saveProfileToStorage(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error("Failed to save profile to storage", e);
  }
}

// Escape / unescape CSV string matching CompactCsvBackupService.kt
function escapeCsv(val: string | number): string {
  let str = String(val ?? "").replace(/\r/g, " ").replace(/\n/g, " ");
  if (str.includes(",") || str.includes("\"") || str.includes(";")) {
    str = str.replace(/"/g, '""');
    return `"${str}"`;
  }
  return str;
}

function unescapeCsv(val: string): string {
  let str = (val || "").trim();
  if (str.startsWith('"') && str.endsWith('"') && str.length >= 2) {
    str = str.substring(1, str.length - 1).replace(/""/g, '"');
  }
  return str;
}

function parseCsvLine(line: string): string[] {
  const tokens: string[] = [];
  let sb = '';
  let inQuotes = false;
  let i = 0;
  while (i < line.length) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        sb += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      tokens.push(sb.trim());
      sb = '';
    } else {
      sb += c;
    }
    i++;
  }
  tokens.push(sb.trim());
  return tokens.map(unescapeCsv);
}

export function exportBackupCsv(
  workers: LaborWorker[],
  transactions: CashTransaction[],
  profile: UserProfile
): string {
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const lines: string[] = [];

  lines.push(`# LABORBOOK_ALL_DATA_BACKUP,VERSION=3,DATE=${escapeCsv(now)},EMAIL=${escapeCsv(profile.email)}`);
  lines.push("# FORMAT: ULTRA_LIGHTWEIGHT_CSV,STORAGE_OPTIMIZED=TRUE\n");

  // SECTION 1: PROFILE
  lines.push("[SECTION_PROFILE]");
  lines.push("Name,BusinessName,Mobile,Email,Language,IsPro,AuthProvider");
  lines.push(`${escapeCsv(profile.name)},${escapeCsv(profile.businessName)},${escapeCsv(profile.mobile)},${escapeCsv(profile.email)},${escapeCsv(profile.language)},${profile.isPro},${escapeCsv(profile.authProvider)}\n`);

  // SECTION 2: WORKERS
  lines.push("[SECTION_WORKERS]");
  lines.push("WorkerId,Name,PhoneNumber,DailyWage,AvatarColorHex,CreatedAt,SalaryType");
  for (const w of workers) {
    lines.push(`${escapeCsv(w.id)},${escapeCsv(w.name)},${escapeCsv(w.phoneNumber)},${w.dailyWage},${escapeCsv(w.avatarColorHex)},${w.createdAt},${escapeCsv(w.salaryType || "Daily")}`);
  }
  lines.push("");

  // SECTION 3: ATTENDANCE
  lines.push("[SECTION_ATTENDANCE_LOGS]");
  lines.push("WorkerId,WorkerName,FullDate,DayNumber,DayOfWeek,Status,OvertimeHours,AdvanceAmount,Note,OvertimeRate,PaymentMethod");
  for (const w of workers) {
    for (const [dateKey, att] of Object.entries(w.attendance || {})) {
      const fullDate = att.fullDate || dateKey;
      const noteClean = (att.note || "").replace(/[\r\n]+/g, " ");
      lines.push(`${escapeCsv(w.id)},${escapeCsv(w.name)},${escapeCsv(fullDate)},${att.dayNumber},${escapeCsv(att.dayOfWeek || "Mon")},${escapeCsv(att.status || "UNMARKED")},${att.overtimeHours || 0},${att.advanceAmount || 0},${escapeCsv(noteClean)},${att.overtimeRate || 0},${escapeCsv(att.paymentMethod || "CASH")}`);
    }
  }
  lines.push("");

  // SECTION 4: TRANSACTIONS
  lines.push("[SECTION_TRANSACTIONS]");
  lines.push("TransactionId,DateDisplay,FullDate,Type,Amount,PaymentMethod,Notes,Timestamp");
  for (const t of transactions) {
    const noteClean = (t.notes || "").replace(/[\r\n]+/g, " ");
    lines.push(`${escapeCsv(t.id)},${escapeCsv(t.dateDisplay)},${escapeCsv(t.fullDate)},${escapeCsv(t.type)},${t.amount},${escapeCsv(t.paymentMethod)},${escapeCsv(noteClean)},${t.timestamp}`);
  }

  return lines.join("\n");
}

export function parseBackupCsv(rawContent: string): {
  workers: LaborWorker[];
  transactions: CashTransaction[];
  profile?: UserProfile;
} {
  const cleanContent = rawContent.startsWith("\uFEFF") ? rawContent.substring(1) : rawContent;
  const lines = cleanContent.split(/\r?\n/);

  let currentSection = "";
  let profile: UserProfile | undefined;
  const workersMap: Record<string, LaborWorker> = {};
  const transactions: CashTransaction[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    if (line.startsWith("[") && line.endsWith("]")) {
      currentSection = line;
      continue;
    }

    const tokens = parseCsvLine(line);
    if (!tokens.length) continue;

    if (currentSection === "[SECTION_PROFILE]") {
      if (tokens[0] === "Name") continue; // Header
      profile = {
        name: tokens[0] || "",
        businessName: tokens[1] || "",
        mobile: tokens[2] || "",
        email: tokens[3] || "",
        language: tokens[4] || "en",
        isPro: tokens[5] === "true",
        authProvider: tokens[6] || "Google"
      };
    } else if (currentSection === "[SECTION_WORKERS]") {
      if (tokens[0] === "WorkerId") continue; // Header
      const id = tokens[0] || `worker-${Date.now()}`;
      workersMap[id] = {
        id,
        name: tokens[1] || "Worker",
        phoneNumber: tokens[2] || "",
        dailyWage: parseFloat(tokens[3]) || 0,
        avatarColorHex: tokens[4] || "#1D61D2",
        createdAt: parseInt(tokens[5], 10) || Date.now(),
        salaryType: (tokens[6] === "Monthly" ? "Monthly" : "Daily") as SalaryType,
        attendance: {}
      };
    } else if (currentSection === "[SECTION_ATTENDANCE_LOGS]") {
      if (tokens[0] === "WorkerId") continue; // Header
      const workerId = tokens[0];
      const worker = workersMap[workerId];
      if (worker) {
        const fullDate = tokens[2] || "";
        const dayNumber = parseInt(tokens[3], 10) || 1;
        const dayOfWeek = tokens[4] || "Mon";
        const status = (tokens[5] || "UNMARKED") as AttendanceStatus;
        const overtimeHours = parseFloat(tokens[6]) || 0;
        const advanceAmount = parseFloat(tokens[7]) || 0;
        const note = tokens[8] || "";
        const overtimeRate = parseFloat(tokens[9]) || 0;
        const paymentMethod = (tokens[10] === "ONLINE" ? "ONLINE" : "CASH") as PaymentMethod;

        worker.attendance[fullDate] = {
          fullDate,
          dayNumber,
          dayOfWeek,
          status,
          overtimeHours,
          advanceAmount,
          note,
          overtimeRate,
          paymentMethod
        };
      }
    } else if (currentSection === "[SECTION_TRANSACTIONS]") {
      if (tokens[0] === "TransactionId") continue; // Header
      transactions.push({
        id: tokens[0] || `tx-${Date.now()}`,
        dateDisplay: tokens[1] || "",
        fullDate: tokens[2] || "",
        type: (tokens[3] === "CASH_OUT" ? "CASH_OUT" : "CASH_IN") as TransactionType,
        amount: parseFloat(tokens[4]) || 0,
        paymentMethod: (tokens[5] === "ONLINE" ? "ONLINE" : "CASH") as PaymentMethod,
        notes: tokens[6] || "",
        timestamp: parseInt(tokens[7], 10) || Date.now()
      });
    }
  }

  return {
    workers: Object.values(workersMap),
    transactions,
    profile
  };
}
