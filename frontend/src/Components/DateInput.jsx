import { useRef } from "react";
import { CalendarDays } from "lucide-react";

export default function DateInput({ className = "", ...props }) {
  const inputRef = useRef(null);
  const openCalendar = () => {
    const input = inputRef.current;
    if (!input || input.disabled) return;
    input.focus();
    try {
      if (typeof input.showPicker === "function") input.showPicker();
      else input.click();
    } catch { input.click(); }
  };
  return <div className="relative mt-1">
    <input {...props} ref={inputRef} type="date" className={`${className} pr-12 [color-scheme:light] dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:hidden`} />
    <button type="button" onClick={openCalendar} disabled={props.disabled} aria-label="Open internship start date calendar" title="Choose a date" className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg bg-white text-gray-600 hover:text-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 disabled:opacity-50 dark:bg-[#0b1220] dark:text-gray-200"><CalendarDays size={19} aria-hidden="true" /></button>
  </div>;
}
