import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";

interface TimeWheelPickerProps {
  value: string; // e.g. '09:30 AM'
  onChange: (value: string) => void;
  className?: string;
  error?: boolean;
}

const ITEM_HEIGHT = 40;
const VISIBLE_COUNT = 5;

const hoursArray = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const minutesArray = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
const ampmArray = ['AM', 'PM'];

function parse12h(value: string) {
  // value: '09:30 AM' or '12:45 PM'
  const match = value.match(/^(\d{2}):(\d{2})\s?(AM|PM)$/i);
  if (!match) return { hour: '12', minute: '00', ampm: 'AM' };
  return { hour: match[1], minute: match[2], ampm: match[3].toUpperCase() };
}

function format12h(hour: string, minute: string, ampm: string) {
  return `${hour}:${minute} ${ampm}`;
}

export function TimeWheelPicker({ value, onChange, className, error }: TimeWheelPickerProps) {
  const { hour, minute, ampm } = parse12h(value || '12:00 AM');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hourListRef = useRef<HTMLDivElement>(null);
  const minuteListRef = useRef<HTMLDivElement>(null);
  const ampmListRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll to selected value when opening
  useEffect(() => {
    if (isOpen) {
      if (hourListRef.current) {
        hourListRef.current.scrollTo({
          top: hoursArray.indexOf(hour) * ITEM_HEIGHT,
          behavior: 'auto',
        });
      }
      if (minuteListRef.current) {
        minuteListRef.current.scrollTo({
          top: minutesArray.indexOf(minute) * ITEM_HEIGHT,
          behavior: 'auto',
        });
      }
      if (ampmListRef.current) {
        ampmListRef.current.scrollTo({
          top: ampmArray.indexOf(ampm) * ITEM_HEIGHT,
          behavior: 'auto',
        });
      }
    }
  }, [isOpen, hour, minute, ampm]);

  // Snap to nearest value on scroll end
  const handleScroll = (type: 'hour' | 'minute' | 'ampm') => {
    let ref, arr, current;
    if (type === 'hour') {
      ref = hourListRef;
      arr = hoursArray;
      current = hour;
    } else if (type === 'minute') {
      ref = minuteListRef;
      arr = minutesArray;
      current = minute;
    } else {
      ref = ampmListRef;
      arr = ampmArray;
      current = ampm;
    }
    if (!ref.current) return;
    const scrollTop = ref.current.scrollTop;
    const idx = Math.round(scrollTop / ITEM_HEIGHT);
    ref.current.scrollTo({ top: idx * ITEM_HEIGHT, behavior: 'smooth' });
    if (type === 'hour') {
      onChange(format12h(arr[idx], minute, ampm));
    } else if (type === 'minute') {
      onChange(format12h(hour, arr[idx], ampm));
    } else {
      onChange(format12h(hour, minute, arr[idx]));
    }
  };

  // Debounce scroll end
  function debounce(fn: (...args: any[]) => void, delay: number) {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }
  const debouncedHourScroll = debounce(() => handleScroll('hour'), 100);
  const debouncedMinuteScroll = debounce(() => handleScroll('minute'), 100);
  const debouncedAmpmScroll = debounce(() => handleScroll('ampm'), 100);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full px-4 py-2 rounded-lg border text-left bg-white dark:bg-gray-900",
          error ? "border-red-500" : "border-gray-200",
          "focus:ring-2 focus:ring-[rgb(93,224,230)] focus:border-[rgb(93,224,230)]",
          className
        )}
      >
        {value || "Select time"}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 p-2">
          <div className="flex gap-2 justify-center relative" style={{ height: ITEM_HEIGHT * VISIBLE_COUNT }}>
            {/* Hours Wheel */}
            <div className="flex-1 flex flex-col items-center">
              <div className="text-xs font-medium text-gray-500 mb-1 text-center">Hours</div>
              <div
                ref={hourListRef}
                className="overflow-y-scroll scrollbar-hide w-16 select-none"
                style={{ height: ITEM_HEIGHT * VISIBLE_COUNT }}
                onScroll={debouncedHourScroll}
              >
                {hoursArray.map((h, idx) => {
                  const isSelected = h === hour;
                  return (
                    <div
                      key={h}
                      style={{
                        height: ITEM_HEIGHT,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: isSelected ? 22 : 16,
                        fontWeight: isSelected ? 600 : 400,
                        opacity: isSelected ? 1 : 0.4,
                        color: isSelected ? 'rgb(93,224,230)' : undefined,
                        transition: 'all 0.2s',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        onChange(format12h(h, minute, ampm));
                        if (hourListRef.current) {
                          hourListRef.current.scrollTo({ top: idx * ITEM_HEIGHT, behavior: 'smooth' });
                        }
                      }}
                    >
                      {h}
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Minutes Wheel */}
            <div className="flex-1 flex flex-col items-center">
              <div className="text-xs font-medium text-gray-500 mb-1 text-center">Minutes</div>
              <div
                ref={minuteListRef}
                className="overflow-y-scroll scrollbar-hide w-16 select-none"
                style={{ height: ITEM_HEIGHT * VISIBLE_COUNT }}
                onScroll={debouncedMinuteScroll}
              >
                {minutesArray.map((m, idx) => {
                  const isSelected = m === minute;
                  return (
                    <div
                      key={m}
                      style={{
                        height: ITEM_HEIGHT,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: isSelected ? 22 : 16,
                        fontWeight: isSelected ? 600 : 400,
                        opacity: isSelected ? 1 : 0.4,
                        color: isSelected ? 'rgb(93,224,230)' : undefined,
                        transition: 'all 0.2s',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        onChange(format12h(hour, m, ampm));
                        if (minuteListRef.current) {
                          minuteListRef.current.scrollTo({ top: idx * ITEM_HEIGHT, behavior: 'smooth' });
                        }
                      }}
                    >
                      {m}
                    </div>
                  );
                })}
              </div>
            </div>
            {/* AM/PM Wheel */}
            <div className="flex-1 flex flex-col items-center">
              <div className="text-xs font-medium text-gray-500 mb-1 text-center">AM/PM</div>
              <div
                ref={ampmListRef}
                className="overflow-y-scroll scrollbar-hide w-16 select-none"
                style={{ height: ITEM_HEIGHT * VISIBLE_COUNT }}
                onScroll={debouncedAmpmScroll}
              >
                {ampmArray.map((ap, idx) => {
                  const isSelected = ap === ampm;
                  return (
                    <div
                      key={ap}
                      style={{
                        height: ITEM_HEIGHT,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: isSelected ? 22 : 16,
                        fontWeight: isSelected ? 600 : 400,
                        opacity: isSelected ? 1 : 0.4,
                        color: isSelected ? 'rgb(93,224,230)' : undefined,
                        transition: 'all 0.2s',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        onChange(format12h(hour, minute, ap));
                        if (ampmListRef.current) {
                          ampmListRef.current.scrollTo({ top: idx * ITEM_HEIGHT, behavior: 'smooth' });
                        }
                      }}
                    >
                      {ap}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Add this to your global CSS or tailwind.config.js
// .scrollbar-hide::-webkit-scrollbar {
//   display: none;
// }
// .scrollbar-hide {
//   -ms-overflow-style: none;
//   scrollbar-width: none;
// } 