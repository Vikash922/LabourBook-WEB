import React from 'react';
import { Users, Wallet, FileText, Settings, UserPlus } from 'lucide-react';
import { useLabor } from '../context/LaborContext';
import { t } from '../utils/strings';

export const BottomNav: React.FC = () => {
  const { currentScreen, navigateTo, userProfile } = useLabor();
  const lang = userProfile.language || 'en';

  const isTabActive = (tabName: string) => {
    switch (tabName) {
      case 'HOME':
        return currentScreen.type === 'HOME' || currentScreen.type === 'LABOR_DETAIL' || currentScreen.type === 'LABOR_REPORT';
      case 'CASH_BOOK':
        return currentScreen.type === 'CASH_BOOK' || currentScreen.type === 'CASH_BOOK_REPORT';
      case 'REPORTS':
        return currentScreen.type === 'BATCH_PDF_HUB';
      case 'SETTINGS':
        return currentScreen.type === 'SETTINGS';
      default:
        return false;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-lg">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-around">
        {/* Tab 1: Staff / Attendance */}
        <button
          onClick={() => navigateTo({ type: 'HOME' })}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            isTabActive('HOME') ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className={`w-5 h-5 mb-0.5 ${isTabActive('HOME') ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[11px] leading-none">{t('total_staff', lang)}</span>
        </button>

        {/* Tab 2: Cash Book */}
        <button
          onClick={() => navigateTo({ type: 'CASH_BOOK' })}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            isTabActive('CASH_BOOK') ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Wallet className={`w-5 h-5 mb-0.5 ${isTabActive('CASH_BOOK') ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[11px] leading-none">{t('cash_book', lang)}</span>
        </button>

        {/* Center Quick Action: Add Staff */}
        <button
          onClick={() => navigateTo({ type: 'ADD_LABOR' })}
          className="flex flex-col items-center justify-center -mt-5 mx-1"
          title="Add Staff"
        >
          <div className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 transition-all">
            <UserPlus className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-blue-600 mt-0.5">Add</span>
        </button>

        {/* Tab 3: Reports */}
        <button
          onClick={() => navigateTo({ type: 'BATCH_PDF_HUB' })}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            isTabActive('REPORTS') ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className={`w-5 h-5 mb-0.5 ${isTabActive('REPORTS') ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[11px] leading-none">{t('pdf_reports', lang)}</span>
        </button>

        {/* Tab 4: Settings */}
        <button
          onClick={() => navigateTo({ type: 'SETTINGS' })}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            isTabActive('SETTINGS') ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className={`w-5 h-5 mb-0.5 ${isTabActive('SETTINGS') ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[11px] leading-none">{t('settings', lang)}</span>
        </button>
      </div>
    </div>
  );
};
