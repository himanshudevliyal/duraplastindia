"use client";

import { useEffect, useRef, useState } from "react";

export function AnimatedCounter({ value, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    const target = Number(String(value).replace(/,/g, ""));

    if (isNaN(target)) return;

    let startTime = null;

    const animate = (time) => {
      if (!startTime) startTime = time;

      const progress = Math.min(
        (time - startTime) / duration,
        1
      );

      // ease-out
      const eased = 1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(eased * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animate);
  }, [started, value, duration]);

  return (
 <div ref={ref}>
            <h3  className="text-2xl! font-bold text-white !lg:text-3xl">

      {count.toLocaleString("en-IN")}
    </h3>
    </div>
  );
}
