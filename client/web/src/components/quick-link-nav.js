"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function SectionNav({
  sections,
  offset = 128,
  showAfter = 320,
  className,
}) {
  const [activeId, setActiveId] = React.useState(sections[0]?.id);

  // Header Behaviour
  const [scrolled, setScrolled] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);

  // Progress
  const [scrollProgress, setScrollProgress] = React.useState(0);

  // Active Indicator
  const [indicator, setIndicator] = React.useState({
    left: 0,
    width: 0,
  });

  const lastScrollY = React.useRef(0);

  const navRef = React.useRef(null);
  const buttonRefs = React.useRef(new Map());

  const updateIndicator = React.useCallback((id) => {
    const btn = buttonRefs.current.get(id);
    const nav = navRef.current;

    if (!btn || !nav) return;

    const btnRect = btn.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();

    setIndicator({
      left: btnRect.left - navRect.left + nav.scrollLeft,
      width: btnRect.width,
    });
  }, []);

  React.useEffect(() => {
    updateIndicator(activeId);

    const resize = () => updateIndicator(activeId);

    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, [activeId, updateIndicator]);

  React.useEffect(() => {
    const HIDE_AFTER = 80;
    const THRESHOLD = 6;

    const evaluate = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      setScrolled(currentY > 24);

      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      setScrollProgress(totalHeight > 0 ? (currentY / totalHeight) * 100 : 0);

      if (Math.abs(delta) >= THRESHOLD) {
        if (currentY <= HIDE_AFTER) {
          setHidden(false);
        } else if (delta > 0) {
          setHidden(true);
        } else {
          setHidden(false);
        }

        lastScrollY.current = currentY;
      }
    };

    const raf = requestAnimationFrame(() => {
      lastScrollY.current = window.scrollY;
      evaluate();
    });

    window.addEventListener("scroll", evaluate, {
      passive: true,
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", evaluate);
    };
  }, []);

  React.useEffect(() => {
    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean);

    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: `-${offset}px 0px -65% 0px`,
        threshold: 0,
      },
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [sections, offset]);

  const handleClick = (e, id) => {
    e.preventDefault();

    const el = document.getElementById(id);

    if (!el) return;

    const top = el.getBoundingClientRect().top + window.scrollY - offset + 1;

    window.scrollTo({
      top,
      behavior: "smooth",
    });

    setActiveId(id);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full bg-white/85 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out",
        {
          // Initial
          "opacity-0 -translate-y-3 pointer-events-none": !hidden && !scrolled,

          // Header Hidden -> Section Nav Top
          "translate-y-0 opacity-100": hidden && scrolled,

          // Header Visible -> Section Nav Below Header
          "top-[70px] translate-y-0 opacity-100 sm:top-[75px]":
            !hidden && scrolled,
        },
        className,
      )}
      aria-label="Page sections"
      aria-hidden={!hidden && !scrolled}
    >
      <div
        ref={navRef}
        className="relative mx-auto flex max-w-7xl flex-nowrap items-center gap-1 overflow-x-auto scroll-smooth px-3 py-2 sm:gap-2 sm:px-6 sm:py-3 [&::-webkit-scrollbar]:hidden"
        style={{
          scrollSnapType: "x proximity",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Active Pill */}
        <span
          className="absolute top-1/2 z-0 h-8 -translate-y-1/2 rounded-full border border-primary/20 bg-primary/20 transition-all duration-300 sm:h-10"
          style={{
            left: indicator.left,
            width: indicator.width,
          }}
        />

        {sections.map((section, i) => (
          <button
            key={section.id}
            ref={(el) => {
              if (el) buttonRefs.current.set(section.id, el);
            }}
            onClick={(e) => handleClick(e, section.id)}
            aria-current={activeId === section.id ? "true" : undefined}
            style={{ scrollSnapAlign: "start" }}
            className={cn(
              "relative z-10 shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.06em] transition-all duration-300 sm:px-5 sm:py-2.5 sm:text-[13px] sm:tracking-[0.08em]",
              i === sections.length - 1 && "mr-3 sm:mr-6",
              activeId === section.id
                ? "text-primary"
                : "text-slate-600 hover:text-primary",
            )}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Scroll Progress */}
      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-primary/10">
        <div
          className="h-full rounded-r-full bg-primary transition-all duration-150"
          style={{
            width: `${scrollProgress}%`,
          }}
        />
      </div>
    </nav>
  );
}
