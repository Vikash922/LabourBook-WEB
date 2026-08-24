import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronDown, 
  ArrowLeft,
  MessageCircle,
  Share2
} from 'lucide-react';
import { useLabor } from '../context/LaborContext';
import { MonthSelectorModal } from './MonthSelectorModal';

export const Navbar: React.FC = () => {
  const { 
    selectedMonth, 
    setSelectedMonth, 
    currentScreen, 
    navigateTo,
    showToast 
  } = useLabor();
  
  const [showMonthModal, setShowMonthModal] = useState(false);

  if (currentScreen.type === 'LABOR_DETAIL') {
    return null;
  }

  const isHomeScreen = currentScreen.type === 'HOME';

  const handleShare = () => {
    const text = `Laborbook - Staff Attendance & Cash Book App`;
    if (navigator.share) {
      navigator.share({ title: 'Laborbook', text, url: window.location.href }).catch(() => {});
    } else {
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + '\n' + window.location.href)}`;
      window.open(url, '_blank');
      showToast('Opening WhatsApp Share');
    }
  };

  const getScreenTitle = () => {
    switch (currentScreen.type) {
      case 'HOME':
        return 'Laborbook';
      case 'ADD_LABOR':
        return 'Add Labor';
      case 'CASH_BOOK':
        return 'Cash Book';
      case 'CASH_BOOK_REPORT':
        return 'Cash Book Report';
      case 'LABOR_REPORT':
        return 'Wage Slip';
      case 'BATCH_PDF_HUB':
        return 'PDF Reports';
      case 'SETTINGS':
        return 'Settings';
      default:
        return 'Laborbook';
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-2xs">
        <div className="max-w-md md:max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
          {isHomeScreen ? (
            <>
              {/* Left Brand Title */}
              <h1 className="text-2xl font-bold text-[#1862D6] tracking-tight">
                Laborbook
              </h1>

              {/* Right WhatsApp Share Pill */}
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3.5 py-1 bg-white hover:bg-emerald-50/50 text-[#25D366] border border-[#25D366]/90 rounded-full text-xs font-semibold shadow-2xs active:scale-95 transition"
              >
                <svg className="w-4 h-4 fill-[#25D366]" viewBox="0 0 24 24">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.92-9.91-9.92zm5.79 13.99c-.24.67-1.4 1.28-1.95 1.33-.51.05-1.18.07-3.87-1.04-3.27-1.34-5.38-4.66-5.54-4.88-.16-.22-1.33-1.78-1.33-3.39 0-1.61.85-2.4 1.15-2.73.3-.33.65-.41.87-.41.22 0 .43 0 .62.01.2.01.47-.08.73.55.27.65.92 2.25 1 2.41.08.16.13.36.03.57-.1.22-.16.36-.31.54-.16.18-.34.4-.48.54-.16.16-.33.33-.14.65.19.33.84 1.39 1.8 2.24 1.23 1.1 2.27 1.44 2.59 1.6.33.16.52.14.71-.08.2-.22.85-.99 1.08-1.33.22-.34.45-.29.75-.18.3.11 1.9.9 2.23 1.06.33.16.55.24.63.38.08.14.08.82-.16 1.49z"/>
                </svg>
                <span className="text-slate-800 font-semibold text-xs">Share</span>
              </button>
            </>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => navigateTo({ type: 'HOME' })}
                  className="p-1.5 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
                  title="Back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-base font-bold text-slate-900 leading-tight">
                  {getScreenTitle()}
                </h1>
              </div>

              {currentScreen.type === 'CASH_BOOK' && (
                <button
                  onClick={() => setShowMonthModal(true)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 transition"
                >
                  <CalendarIcon className="w-3.5 h-3.5 text-[#1862D6]" />
                  <span>{selectedMonth}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
              )}
            </div>
          )}
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

