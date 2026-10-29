"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { heroBgUrl } from "@/lib/optimized-image";

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
  // progress ring <circle>: updated directly every frame (no React re-render)
  const ringRef = useRef(null);

  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  // Preload every slide image once so the reveal never shows a blank/half-loaded frame.
  // Waits for page load + idle time so it does not compete with the first paint
  // (the first slide change is AUTOPLAY_MS after mount).
  useEffect(() => {
    let idleId;
    const preload = () => {
      images.forEach((src) => {
        const url = src && heroBgUrl(src);
        if (!url || preloadedRef.current.has(url)) return;
        const img = new window.Image();
        img.src = url;
        preloadedRef.current.add(url);
      });
    };
    const schedule = () => {
      idleId = window.requestIdleCallback
        ? window.requestIdleCallback(preload, { timeout: 2000 })
        : window.setTimeout(preload, 200);
    };

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      window.removeEventListener("load", schedule);
      if (idleId === undefined) return;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idleId);
      else window.clearTimeout(idleId);
    };
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
      inner.style.backgroundImage = `url(${heroBgUrl(images[currentRef.current])})`;

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

  // ring offset = circumference * (1 - p); circumference is its dasharray
  const drawRing = useCallback((p) => {
    const ring = ringRef.current;
    if (!ring) return;
    const circumference = Number(ring.getAttribute("stroke-dasharray")) || 0;
    ring.setAttribute("stroke-dashoffset", String(circumference * (1 - p)));
  }, []);

  const stopProgress = useCallback(() => {
    if (progressRafRef.current) cancelAnimationFrame(progressRafRef.current);
    progressRafRef.current = null;
    drawRing(0);
    setProgress(0);
  }, [drawRing]);

  // The ring moves every frame via the DOM; React state (used for the
  // seconds label) only changes when the shown whole second changes.
  const startProgress = useCallback(() => {
    stopProgress();
    const start = performance.now();
    const seconds = AUTOPLAY_MS / 1000;
    let shownSecond = Math.ceil(seconds);
    const tick = (now) => {
      const p = Math.min((now - start) / AUTOPLAY_MS, 1);
      drawRing(p);
      const second = Math.ceil((1 - p) * seconds);
      if (second !== shownSecond || p >= 1) {
        shownSecond = second;
        setProgress(p);
      }
      if (p < 1) progressRafRef.current = requestAnimationFrame(tick);
    };
    progressRafRef.current = requestAnimationFrame(tick);
  }, [stopProgress, drawRing]);

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

      const nextBg = heroBgUrl(images[nextIndex]);
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

  return { heroRef, morphRef, ringRef, current, progress, goTo: morphTo };
}
