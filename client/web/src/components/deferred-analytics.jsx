"use client";

import { useEffect } from "react";

const GA_ID = "G-9HCDEP5C1R";
const FALLBACK_MS = 5000;
const EVENTS = ["pointerdown", "keydown", "scroll", "touchstart"];

// Google Analytics (gtag) without slowing the first load: it is added on the
// visitor's first interaction, or FALLBACK_MS after the page has loaded,
// whichever comes first. The nonce keeps it allowed by the CSP (proxy.js).
export default function DeferredAnalytics({ nonce }) {
  useEffect(() => {
    if (window.__gaLoaded) return;
    let timer;

    const load = () => {
      if (window.__gaLoaded) return;
      window.__gaLoaded = true;
      cleanup();

      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", GA_ID);

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      if (nonce) script.nonce = nonce;
      document.head.appendChild(script);
    };

    const startTimer = () => {
      timer = window.setTimeout(load, FALLBACK_MS);
    };

    function cleanup() {
      EVENTS.forEach((e) => window.removeEventListener(e, load));
      window.removeEventListener("load", startTimer);
      window.clearTimeout(timer);
    }

    EVENTS.forEach((e) =>
      window.addEventListener(e, load, { once: true, passive: true }),
    );
    if (document.readyState === "complete") startTimer();
    else window.addEventListener("load", startTimer, { once: true });

    return cleanup;
  }, [nonce]);

  return null;
}


