import React, { useMemo } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { useLabor } from '../context/LaborContext';
import { getAvatarBgWithOpacity, AVATAR_PALETTE } from '../utils/avatar';

export const HomeScreen: React.FC = () => {
  const { 
    workers, 
    searchQuery, 
    setSearchQuery, 
    navigateTo 
  } = useLabor();

  // Filter workers based on search
  const filteredWorkers = useMemo(() => {
    if (!searchQuery.trim()) return workers;
    const q = searchQuery.toLowerCase().trim();
    return workers.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        (w.phoneNumber && w.phoneNumber.includes(q))
    );
  }, [workers, searchQuery]);

  return (
    <div className="min-h-[calc(100vh-8rem)] pb-24 pt-3 px-3.5 max-w-md md:max-w-xl mx-auto space-y-3">
      {/* 1. Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4 text-slate-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Name or Mobile number"
          className="w-full pl-9 pr-9 py-2.5 bg-white border border-slate-200/75 rounded-full text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1862D6]/20 focus:border-[#1862D6] shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-semibold text-slate-400 hover:text-slate-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* 2. Section Header: MY LABORS */}
      <div>
        <h2 className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-1 mb-1.5">
          MY LABORS
        </h2>

        {/* 3. Labor List Container Card */}
        {filteredWorkers.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-100 p-6 text-center space-y-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="w-11 h-11 rounded-full bg-blue-50 text-[#1862D6] flex items-center justify-center mx-auto">
              <UserPlus className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">
              {searchQuery ? "No labor found" : "No labors added yet"}
            </h3>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">
              {searchQuery
                ? "Try searching with another name or mobile number."
                : "Add your first labor to track attendance, wages, advances, and cash book."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-100/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden divide-y divide-slate-100">
            {filteredWorkers.map((worker, index) => {
              const initial = (worker.name.trim()[0] || 'L').toUpperCase();
              const avatarBg = getAvatarBgWithOpacity(
                worker.avatarColorHex || AVATAR_PALETTE[index % AVATAR_PALETTE.length],
                0.1
              );

              return (
                <div
                  key={worker.id}
                  onClick={() => navigateTo({ type: 'LABOR_DETAIL', workerId: worker.id })}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50/70 active:bg-slate-100/70 cursor-pointer transition select-none"
                >
                  {/* 10% Opacity Avatar */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-slate-800 text-xs shrink-0"
                    style={{ backgroundColor: avatarBg }}
                  >
                    {initial}
                  </div>

                  {/* Name and Mobile */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 text-xs sm:text-sm leading-tight truncate">
                      {worker.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-normal mt-0.5 tracking-tight">
                      {worker.phoneNumber || "No mobile number"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Floating Action Button: ADD LABOR */}
      <button
        onClick={() => navigateTo({ type: 'ADD_LABOR' })}
        className="fixed bottom-20 right-4 sm:right-6 z-30 flex items-center gap-1.5 px-4 py-2.5 bg-[#1862D6] hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-full shadow-md shadow-[#1862D6]/30 uppercase tracking-wider transition"
      >
        <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>ADD LABOR</span>
      </button>
    </div>
  );
};

