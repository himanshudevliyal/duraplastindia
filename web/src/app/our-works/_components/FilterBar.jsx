"use client";

export default function FilterBar({ options, active, onChange }) {
  return (
    <div className="inline-flex flex-wrap items-center gap-1 rounded-full bg-[#EDEBE6] p-1.5">
      {options.map((opt) => {
        const isActive = opt.value === active;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`
              relative rounded-full px-5 py-2.5 text-sm font-medium tracking-wide
              transition-all duration-200 whitespace-nowrap
              ${
                isActive
                  ? "bg-white text-[#191D22] shadow-[0_1px_2px_rgba(25,29,34,0.12)]"
                  : "text-[#6B7178] hover:text-[#191D22]"
              }
            `}
          >
            {opt.label}
            <span
              className={`ml-1.5 font-mono text-[11px] ${
                isActive ? "text-[#C1602E]" : "text-[#9BA0A6]"
              }`}
            >
              {String(opt.count).padStart(2, "0")}
            </span>
          </button>
        );
      })}
    </div>
  );
}
