import React from 'react';
import { LaborProvider, useLabor } from './context/LaborContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { LaborDetailScreen } from './screens/LaborDetailScreen';
import { AddLaborScreen } from './screens/AddLaborScreen';
import { CashBookScreen } from './screens/CashBookScreen';
import { CashBookReportScreen } from './screens/CashBookReportScreen';
import { LaborReportScreen } from './screens/LaborReportScreen';
import { BatchPdfHubScreen } from './screens/BatchPdfHubScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { AdvanceConfirmation } from './components/AdvanceConfirmation';

const MainContent: React.FC = () => {
  const { currentScreen, toastMessage, advanceConfirmation, clearAdvanceConfirmation } = useLabor();

  const renderScreen = () => {
    switch (currentScreen.type) {
      case 'HOME':
        return <HomeScreen />;
      case 'LABOR_DETAIL':
        return <LaborDetailScreen workerId={currentScreen.workerId} />;
      case 'ADD_LABOR':
        return <AddLaborScreen />;
      case 'CASH_BOOK':
        return <CashBookScreen />;
      case 'CASH_BOOK_REPORT':
        return <CashBookReportScreen />;
      case 'LABOR_REPORT':
        return <LaborReportScreen workerId={currentScreen.workerId} />;
      case 'BATCH_PDF_HUB':
        return <BatchPdfHubScreen />;
      case 'SETTINGS':
        return <SettingsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Screen View */}
      <main className="flex-1 w-full">
        {renderScreen()}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Advance Confirmation Notification */}
      <AdvanceConfirmation
        confirmation={advanceConfirmation}
        onDismiss={clearAdvanceConfirmation}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-slate-900/90 backdrop-blur-xs text-white text-xs font-semibold rounded-full shadow-xl border border-slate-700/50 animate-in fade-in slide-in-from-top-2 duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <LaborProvider>
      <MainContent />
    </LaborProvider>
  );
}

export default App;
