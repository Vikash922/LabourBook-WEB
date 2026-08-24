import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronDown, 
  Languages, 
  User, 
  FileSpreadsheet, 
  Users, 
  Wallet,
  Settings as SettingsIcon,
  Plus
} from 'lucide-react';
import { useLabor } from '../context/LaborContext';
import { MonthSelectorModal } from './MonthSelectorModal';
import { t } from '../utils/strings';

export const Navbar: React.FC = () => {
  const { 
    selectedMonth, 
    setSelectedMonth, 
    userProfile, 
    setLanguage, 
    currentScreen, 
    navigateTo 
  } = useLabor();
  
  const [showMonthModal, setShowMonthModal] = useState(false);
  const lang = userProfile.language || 'en';

  const toggleLanguage = () => {
    setLanguage(lang === 'hi' ? 'en' : 'hi');
  };

  const getScreenTitle = () => {
    switch (currentScreen.type) {
      case 'HOME':
        return t('app_name', lang);
      case 'LABOR_DETAIL':
        return t('worker_details', lang);
      case 'ADD_LABOR':
        return t('add_staff', lang);
      case 'CASH_BOOK':
        return t('cash_book', lang);
      case 'CASH_BOOK_REPORT':
        return 'Cash Book Report';
      case 'LABOR_REPORT':
        return 'Worker Wage Slip';
      case 'BATCH_PDF_HUB':
        return t('pdf_reports', lang);
      case 'SETTINGS':
        return t('settings', lang);
      default:
        return t('app_name', lang);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-2">
          {/* Logo & Title */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => navigateTo({ type: 'HOME' })}
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
              L
            </div>
            <div className="flex flex-col">
              <h1 className="font-bold text-slate-900 text-base leading-tight tracking-tight">
                {getScreenTitle()}
              </h1>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                {userProfile.businessName || "Site Ledger"}
              </span>
            </div>
          </div>

          {/* Month Selector & Language Pill */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMonthModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 transition shadow-2xs"
            >
              <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>{selectedMonth}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Language Switch */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition border border-blue-200/60"
              title="Toggle English / Hindi"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'EN' : 'हिन्दी'}</span>
            </button>
          </div>
        </div>
      </header>

      <MonthSelectorModal
        isOpen={showMonthModal}
        selectedMonth={selectedMonth}
        onSelectMonth={setSelectedMonth}
        onClose={() => setShowMonthModal(false)}
      />
    </>
  );
};
