"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const PANEL_COUNT = 12;
const DURATION_MS = 550;
const STAGGER_MS = 40;
const AUTOPLAY_MS = 4500;

/**
 * Drives the hero background transition: a slide changes by opening and
 * closing a row of vertical louver panels, the same motion as the
 * polycarbonate louvers Dura Plast manufactures.
 */
export function useSlider(images) {
  const heroRef = useRef(null);
  const morphRef = useRef(null);
  const panelsRef = useRef([]);
  const busyRef = useRef(false);
  const currentRef = useRef(0);
  const autoTimerRef = useRef(null);
  const progressRafRef = useRef(null);
  const preloadedRef = useRef(new Set());

  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  // Preload every slide image once so the reveal never shows a blank/half-loaded frame.
  useEffect(() => {
    images.forEach((src) => {
      if (!src || preloadedRef.current.has(src)) return;
      const img = new window.Image();
      img.src = src;
      preloadedRef.current.add(src);
    });
  }, [images]);

  const buildPanels = useCallback(() => {
    const morphEl = morphRef.current;
    const hero = heroRef.current;
    if (!morphEl || !hero) return;

    const width = hero.offsetWidth;
    // Layout not settled yet (0px) — try again next frame instead of
    // building zero-width panels, which makes the shutter invisible.
    if (!width) {
      requestAnimationFrame(buildPanels);
      return;
    }

    morphEl.innerHTML = "";
    panelsRef.current = [];

    for (let i = 0; i < PANEL_COUNT; i++) {
      const left = (i / PANEL_COUNT) * width;
      const panelWidth = width / PANEL_COUNT + 1;

      const strip = document.createElement("div");
      strip.className = "louver-panel";
      strip.style.left = `${left}px`;
      strip.style.width = `${panelWidth}px`;

      const inner = document.createElement("div");
      inner.className = "louver-panel-inner";
      inner.style.left = `${-left}px`;
      inner.style.width = `${width}px`;
      inner.style.backgroundImage = `url(${images[currentRef.current]})`;

      strip.appendChild(inner);
      morphEl.appendChild(strip);
      panelsRef.current.push({ strip, inner });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  const stopAuto = useCallback(() => {
    if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    autoTimerRef.current = null;
  }, []);

  const stopProgress = useCallback(() => {
    if (progressRafRef.current) cancelAnimationFrame(progressRafRef.current);
    progressRafRef.current = null;
    setProgress(0);
  }, []);

  const startProgress = useCallback(() => {
    stopProgress();
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / AUTOPLAY_MS, 1);
      setProgress(p);
      if (p < 1) progressRafRef.current = requestAnimationFrame(tick);
    };
    progressRafRef.current = requestAnimationFrame(tick);
  }, [stopProgress]);

  const startAuto = useCallback(() => {
    stopAuto();
    autoTimerRef.current = setTimeout(() => {
      morphTo((currentRef.current + 1) % images.length);
    }, AUTOPLAY_MS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length]);

  const morphTo = useCallback(
    (nextIndex) => {
      if (
        busyRef.current ||
        nextIndex === currentRef.current ||
        !images[nextIndex]
      )
        return;
      // Panels may not exist yet (e.g. called before layout settled) — bail safely.
      if (!panelsRef.current.length) return;

      busyRef.current = true;
      stopAuto();
      stopProgress();

      const nextBg = images[nextIndex];
      const panels = panelsRef.current;

      panels.forEach(({ strip, inner }) => {
        inner.style.backgroundImage = `url(${nextBg})`;
        strip.style.transition = "none";
        strip.style.clipPath = "inset(0 0 100% 0)";
      });
      // force reflow so the "none" transition applies before we animate
      morphRef.current?.getBoundingClientRect();

      const totalOpen = DURATION_MS + (PANEL_COUNT - 1) * STAGGER_MS;
      panels.forEach(({ strip }, i) => {
        setTimeout(() => {
          strip.style.transition = `clip-path ${DURATION_MS}ms cubic-bezier(0.76,0,0.24,1)`;
          strip.style.clipPath = "inset(0 0 0% 0)";
        }, i * STAGGER_MS);
      });

      setTimeout(() => {
        currentRef.current = nextIndex;
        setCurrent(nextIndex);
        panels.forEach(({ strip }) => {
          strip.style.transition = "none";
          strip.style.clipPath = "inset(0% 0 0 0)";
        });
        morphRef.current?.getBoundingClientRect();

        const totalRetract = DURATION_MS + (PANEL_COUNT - 1) * STAGGER_MS;
        [...panels].reverse().forEach(({ strip }, i) => {
          setTimeout(() => {
            strip.style.transition = `clip-path ${DURATION_MS}ms cubic-bezier(0.76,0,0.24,1)`;
            strip.style.clipPath = "inset(100% 0 0 0)";
          }, i * STAGGER_MS);
        });

        setTimeout(() => {
          busyRef.current = false;
          startAuto();
          startProgress();
        }, totalRetract + 60);
      }, totalOpen + 60);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [images, startAuto, startProgress, stopAuto, stopProgress],
  );

  // Build panels on mount and whenever the hero actually resizes
  // (ResizeObserver catches late layout settling that a plain mount effect misses).
  useEffect(() => {
    buildPanels();
    const hero = heroRef.current;
    if (!hero || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => buildPanels());
    ro.observe(hero);
    return () => ro.disconnect();
  }, [buildPanels]);

  // Kick off autoplay + progress ring once, after mount.
  useEffect(() => {
    startAuto();
    startProgress();
    return () => {
      stopAuto();
      stopProgress();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { heroRef, morphRef, current, progress, goTo: morphTo };
}
