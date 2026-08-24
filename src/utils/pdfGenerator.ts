import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LaborWorker, CashTransaction, WorkerMonthStats } from '../types';
import { calculateMonthStats } from './stats';
import { parseYearMonth, getMonthDays, formatDisplayDate, MONTHS_FULL } from './calendar';

export function generateWorkerReportText(worker: LaborWorker, monthStr: string, stats: WorkerMonthStats): string {
  const isMonthly = (worker.salaryType || "").toLowerCase() === "monthly";
  const wageLabel = isMonthly ? `Rs.${worker.dailyWage}/month` : `Rs.${worker.dailyWage}/day`;

  return `*LABOUR ATTENDANCE & WAGE SLIP*
📅 *Month:* ${monthStr}
👤 *Name:* ${worker.name}
📞 *Phone:* ${worker.phoneNumber || 'N/A'}
💰 *Salary Type:* ${wageLabel}

*Summary:*
✅ Present Days: ${stats.presentCount}
❌ Absent Days: ${stats.absentCount}
⏳ Half Days: ${stats.halfDayCount}
⏩ Double Days: ${stats.doubleCount}
⏰ Overtime Hours: ${stats.overtimeHours} hrs (Rs.${stats.totalOvertimeAmount.toFixed(0)})
💵 Total Advance: Rs.${stats.totalAdvance.toFixed(0)}
───────────────────
*Gross Earnings:* Rs.${stats.grossWage.toFixed(0)}
*NET PAYABLE BALANCE:* Rs.${stats.balance.toFixed(0)}

_Generated via Laborbook App_`;
}

export function downloadWorkerSlipPdf(worker: LaborWorker, monthStr: string): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4'
  });

  const stats = calculateMonthStats(worker, monthStr);
  const { year, month } = parseYearMonth(monthStr);
  const fullMonth = `${MONTHS_FULL[month - 1] || 'August'} ${year}`;

  // Header Banner
  doc.setFillColor(22, 86, 214); // Labor Blue
  doc.rect(0, 0, 595, 75, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('LABORBOOK', 40, 42);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Worker Attendance & Wage Slip', 40, 58);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(fullMonth, 595 - 40, 48, { align: 'right' });

  // Worker Info Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(40, 95, 515, 65, 6, 6, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(worker.name, 55, 120);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Phone: ${worker.phoneNumber || 'N/A'}`, 55, 140);

  const isMonthly = (worker.salaryType || "").toLowerCase() === "monthly";
  const wageText = isMonthly ? `Rs.${worker.dailyWage} / month` : `Rs.${worker.dailyWage} / day`;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 86, 214);
  doc.text(wageText, 595 - 55, 128, { align: 'right' });

  // Monthly KPI Summary Grid
  const kpiY = 175;
  const cardW = 120;
  const cardH = 50;

  // 1. Present
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(40, kpiY, cardW, cardH, 4, 4, 'FD');
  doc.setFontSize(16);
  doc.setTextColor(16, 185, 129);
  doc.text(`${stats.presentCount}`, 40 + cardW / 2, kpiY + 25, { align: 'center' });
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Total Present', 40 + cardW / 2, kpiY + 40, { align: 'center' });

  // 2. Absent
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(172, kpiY, cardW, cardH, 4, 4, 'FD');
  doc.setFontSize(16);
  doc.setTextColor(239, 68, 68);
  doc.text(`${stats.absentCount}`, 172 + cardW / 2, kpiY + 25, { align: 'center' });
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Total Absent', 172 + cardW / 2, kpiY + 40, { align: 'center' });

  // 3. Overtime
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(304, kpiY, cardW, cardH, 4, 4, 'FD');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text(`${stats.overtimeHours}h`, 304 + cardW / 2, kpiY + 25, { align: 'center' });
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Overtime (Hrs)', 304 + cardW / 2, kpiY + 40, { align: 'center' });

  // 4. Net Balance
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(435, kpiY, cardW, cardH, 4, 4, 'FD');
  doc.setFontSize(16);
  doc.setTextColor(22, 86, 214);
  doc.text(`Rs.${stats.balance.toFixed(0)}`, 435 + cardW / 2, kpiY + 25, { align: 'center' });
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Net Balance', 435 + cardW / 2, kpiY + 40, { align: 'center' });

  // Summary Breakdown Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(40, 240, 515, 60, 4, 4, 'FD');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`Half Days: ${stats.halfDayCount}   |   Double (P+P): ${stats.doubleCount}   |   P+1/2: ${stats.presentHalfCount}`, 55, 262);
  doc.text(`Gross Wage: Rs.${stats.grossWage.toFixed(0)}   |   Total Advance Paid: Rs.${stats.totalAdvance.toFixed(0)}   |   Net Payable: Rs.${stats.balance.toFixed(0)}`, 55, 284);

  // Daily Attendance Table
  const days = getMonthDays(monthStr);
  const tableRows = days.map(d => {
    const record = worker.attendance?.[d.dateKey];
    const status = record?.status || 'UNMARKED';
    const advance = record?.advanceAmount ? `Rs.${record.advanceAmount}` : '-';
    const ot = record?.overtimeHours ? `${record.overtimeHours}h` : '-';
    const note = record?.note || '-';

    return [
      `${d.dayNumber} (${d.dayOfWeek})`,
      status,
      ot,
      advance,
      note
    ];
  });

  autoTable(doc, {
    startY: 315,
    margin: { left: 40, right: 40 },
    head: [['Date', 'Attendance', 'Overtime', 'Advance', 'Notes']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 4,
      textColor: [15, 23, 42],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    didDrawPage: (data) => {
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Generated on ${new Date().toLocaleDateString()} | Laborbook App`, 40, 820);
      doc.text(`Page ${doc.getNumberOfPages()}`, 595 - 40, 820, { align: 'right' });
    }
  });

  doc.save(`${worker.name.replace(/\s+/g, '_')}_Wage_Slip_${monthStr.replace(/\s+/g, '_')}.pdf`);
}

export function downloadBatchRosterPdf(workers: LaborWorker[], monthStr: string): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4'
  });

  // Header Banner
  doc.setFillColor(22, 86, 214);
  doc.rect(0, 0, 595, 75, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('LABORBOOK', 40, 42);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Consolidated Monthly Staff Roster - ${monthStr}`, 40, 58);

  let totalGross = 0;
  let totalAdvance = 0;
  let totalBalance = 0;

  const rows = workers.map((w, idx) => {
    const stats = calculateMonthStats(w, monthStr);
    totalGross += stats.grossWage;
    totalAdvance += stats.totalAdvance;
    totalBalance += stats.balance;

    const wageDisplay = w.salaryType === 'Monthly' ? `Rs.${w.dailyWage}/mo` : `Rs.${w.dailyWage}/d`;

    return [
      `${idx + 1}`,
      w.name,
      wageDisplay,
      `${stats.presentCount}`,
      `${stats.absentCount}`,
      `${stats.overtimeHours}h`,
      `Rs.${stats.totalAdvance.toFixed(0)}`,
      `Rs.${stats.balance.toFixed(0)}`
    ];
  });

  autoTable(doc, {
    startY: 95,
    margin: { left: 35, right: 35 },
    head: [['#', 'Staff Name', 'Rate', 'Pres.', 'Abs.', 'OT', 'Advance', 'Net Payable']],
    body: rows,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    styles: {
      fontSize: 9,
      cellPadding: 5,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    foot: [[
      'Total',
      `${workers.length} Workers`,
      '',
      '',
      '',
      '',
      `Rs.${totalAdvance.toFixed(0)}`,
      `Rs.${totalBalance.toFixed(0)}`
    ]],
    footStyles: {
      fillColor: [239, 246, 255],
      textColor: [22, 86, 214],
      fontStyle: 'bold',
      fontSize: 9.5
    }
  });

  doc.save(`Monthly_Staff_Roster_${monthStr.replace(/\s+/g, '_')}.pdf`);
}

export function downloadCashBookReportPdf(
  transactions: CashTransaction[],
  startDate: string,
  endDate: string,
  totalIn: number,
  totalOut: number,
  balance: number
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4'
  });

  // Header
  doc.setFillColor(16, 185, 129); // Green Header for Cashbook
  doc.rect(0, 0, 595, 75, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('CASH BOOK LEDGER', 40, 42);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Period: ${startDate} to ${endDate}`, 40, 58);

  // Summary KPIs
  const kpiY = 95;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(40, kpiY, 515, 55, 6, 6, 'FD');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129);
  doc.text(`Total Cash In: Rs.${totalIn.toFixed(0)}`, 60, kpiY + 32);

  doc.setTextColor(239, 68, 68);
  doc.text(`Total Cash Out: Rs.${totalOut.toFixed(0)}`, 230, kpiY + 32);

  doc.setTextColor(22, 86, 214);
  doc.text(`Net Balance: Rs.${balance.toFixed(0)}`, 410, kpiY + 32);

  const rows = transactions.map((t, idx) => {
    const inAmount = t.type === 'CASH_IN' ? `Rs.${t.amount}` : '-';
    const outAmount = t.type === 'CASH_OUT' ? `Rs.${t.amount}` : '-';

    return [
      `${idx + 1}`,
      t.fullDate || t.dateDisplay,
      t.notes || 'General Entry',
      t.paymentMethod,
      inAmount,
      outAmount
    ];
  });

  autoTable(doc, {
    startY: 165,
    margin: { left: 40, right: 40 },
    head: [['#', 'Date', 'Description / Notes', 'Mode', 'Cash In', 'Cash Out']],
    body: rows,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 5,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    }
  });

  doc.save(`Cash_Book_Ledger_${startDate}_to_${endDate}.pdf`);
}
