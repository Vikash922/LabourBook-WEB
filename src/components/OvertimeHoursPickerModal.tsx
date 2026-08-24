import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface OvertimeHoursPickerModalProps {
  isOpen: boolean;
  initialHours: number; // 0 to 23
  initialMinutes: number; // 0 to 59
  onSave: (hours: number, minutes: number) => void;
  onClose: () => void;
}

export const OvertimeHoursPickerModal: React.FC<OvertimeHoursPickerModalProps> = ({
  isOpen,
  initialHours,
  initialMinutes,
  onSave,
  onClose
}) => {
  const [hours, setHours] = useState<number>(initialHours || 0);
  const [minutes, setMinutes] = useState<number>(initialMinutes || 0);

  const touchHoursY = useRef<number | null>(null);
  const touchMinsY = useRef<number | null>(null);
  const accumHours = useRef<number>(0);
  const accumMins = useRef<number>(0);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    setHours(initialHours || 0);
    setMinutes(initialMinutes || 0);
  }, [initialHours, initialMinutes, isOpen]);

  if (!isOpen) return null;

  const prevHour = (hours - 1 + 24) % 24;
  const nextHour = (hours + 1) % 24;

  const prevMin = (minutes - 1 + 60) % 60;
  const nextMin = (minutes + 1) % 60;

  const pad = (n: number) => String(n).padStart(2, '0');

  const stepHour = (delta: number) => {
    setHours((prev) => (prev + delta + 24) % 24);
  };

  const stepMin = (delta: number) => {
    setMinutes((prev) => (prev + delta + 60) % 60);
  };

  // Touch handlers for Hours column
  const handleTouchHoursStart = (e: React.TouchEvent) => {
    touchHoursY.current = e.touches[0].clientY;
    accumHours.current = 0;
  };

  const handleTouchHoursMove = (e: React.TouchEvent) => {
    if (touchHoursY.current === null) return;
    const currentY = e.touches[0].clientY;
    const diff = touchHoursY.current - currentY;
    accumHours.current += diff;
    touchHoursY.current = currentY;

    const THRESHOLD = 14;
    if (accumHours.current > THRESHOLD) {
      stepHour(1);
      accumHours.current -= THRESHOLD;
    } else if (accumHours.current < -THRESHOLD) {
      stepHour(-1);
      accumHours.current += THRESHOLD;
    }
  };

  const handleTouchHoursEnd = () => {
    touchHoursY.current = null;
    accumHours.current = 0;
  };

  // Touch handlers for Minutes column
  const handleTouchMinsStart = (e: React.TouchEvent) => {
    touchMinsY.current = e.touches[0].clientY;
    accumMins.current = 0;
  };

  const handleTouchMinsMove = (e: React.TouchEvent) => {
    if (touchMinsY.current === null) return;
    const currentY = e.touches[0].clientY;
    const diff = touchMinsY.current - currentY;
    accumMins.current += diff;
    touchMinsY.current = currentY;

    const THRESHOLD = 14;
    if (accumMins.current > THRESHOLD) {
      stepMin(1);
      accumMins.current -= THRESHOLD;
    } else if (accumMins.current < -THRESHOLD) {
      stepMin(-1);
      accumMins.current += THRESHOLD;
    }
  };

  const handleTouchMinsEnd = () => {
    touchMinsY.current = null;
    accumMins.current = 0;
  };

  const handleConfirm = () => {
    onSave(hours, minutes);
    onClose();
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 select-none touch-none"
      onClick={onClose}
      style={{ zIndex: 9999 }}
    >
      <div
        className="w-full max-w-md bg-white rounded-t-3xl p-5 sm:p-6 shadow-2xl relative pb-8 sm:pb-6 select-none touch-none flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Circular Close (X) button outside top right */}
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-12 right-4 w-9 h-9 bg-white hover:bg-slate-100 rounded-full shadow-lg flex items-center justify-center text-slate-800 z-10 cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Header Title: Overtime Hours */}
        <div className="pb-2">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Overtime Hours
          </h3>
        </div>

        {/* Layout matching screenshot */}
        <div className="py-5 my-1 flex items-center justify-between px-2 sm:px-6">
          {/* Left Label: Hrs */}
          <div className="w-14 text-left font-bold text-base sm:text-lg text-slate-900 select-none">
            Hrs
          </div>

          {/* Center Picker: Hours, Colon, Minutes */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Hours Column */}
            <div
              className="flex flex-col items-center select-none w-16 cursor-ns-resize"
              onTouchStart={handleTouchHoursStart}
              onTouchMove={handleTouchHoursMove}
              onTouchEnd={handleTouchHoursEnd}
              onWheel={(e) => {
                e.preventDefault();
                stepHour(e.deltaY > 0 ? 1 : -1);
              }}
            >
              {/* Previous Hour (Top) */}
              <button
                type="button"
                onClick={() => stepHour(-1)}
                className="h-9 flex items-center justify-center text-base sm:text-lg font-semibold text-slate-400 hover:text-slate-700 cursor-pointer select-none"
              >
                {pad(prevHour)}
              </button>

              {/* Selected Hour (Middle) with Top and Bottom Horizontal Lines */}
              <div className="w-full border-t border-b border-slate-700 py-2 flex items-center justify-center">
                <span className="text-xl sm:text-2xl font-bold text-slate-900 font-sans tracking-wide">
                  {pad(hours)}
                </span>
              </div>

              {/* Next Hour (Bottom) */}
              <button
                type="button"
                onClick={() => stepHour(1)}
                className="h-9 flex items-center justify-center text-base sm:text-lg font-semibold text-slate-400 hover:text-slate-700 cursor-pointer select-none"
              >
                {pad(nextHour)}
              </button>
            </div>

            {/* Separator Colon */}
            <span className="text-xl font-bold text-slate-900 select-none pb-0.5">
              :
            </span>

            {/* Minutes Column */}
            <div
              className="flex flex-col items-center select-none w-16 cursor-ns-resize"
              onTouchStart={handleTouchMinsStart}
              onTouchMove={handleTouchMinsMove}
              onTouchEnd={handleTouchMinsEnd}
              onWheel={(e) => {
                e.preventDefault();
                stepMin(e.deltaY > 0 ? 1 : -1);
              }}
            >
              {/* Previous Minute (Top) */}
              <button
                type="button"
                onClick={() => stepMin(-1)}
                className="h-9 flex items-center justify-center text-base sm:text-lg font-semibold text-slate-400 hover:text-slate-700 cursor-pointer select-none"
              >
                {pad(prevMin)}
              </button>

              {/* Selected Minute (Middle) with Top and Bottom Horizontal Lines */}
              <div className="w-full border-t border-b border-slate-700 py-2 flex items-center justify-center">
                <span className="text-xl sm:text-2xl font-bold text-slate-900 font-sans tracking-wide">
                  {pad(minutes)}
                </span>
              </div>

              {/* Next Minute (Bottom) */}
              <button
                type="button"
                onClick={() => stepMin(1)}
                className="h-9 flex items-center justify-center text-base sm:text-lg font-semibold text-slate-400 hover:text-slate-700 cursor-pointer select-none"
              >
                {pad(nextMin)}
              </button>
            </div>
          </div>

          {/* Right Label: Mins */}
          <div className="w-14 text-right font-bold text-base sm:text-lg text-slate-900 select-none">
            Mins
          </div>
        </div>

        {/* Bottom Ok Button - Solid Pill Button */}
        <div className="mt-2 pt-2">
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full py-3.5 bg-[#1862D6] hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 font-bold text-base rounded-full text-center cursor-pointer"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
};
