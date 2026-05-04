"use client";

import { useEffect, useState } from "react";

// 15 May 2026 09:00 at UTC+06:00 -> 03:00 UTC
const conferenceDate = Date.UTC(2026, 4, 15, 3, 0, 0);

function pad(value) {
  return String(value).padStart(2, "0");
}

function getTimeLeft() {
  const now = Date.now();
  const distance = conferenceDate - now;

  if (!Number.isFinite(distance) || distance <= 0) {
    return { days: "00", hours: "00", minutes: "00", seconds: "00" };
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return {
    days: pad(days),
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
  };
}

export default function Countdown() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeLeft());
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const display = mounted
    ? timeLeft
    : { days: "00", hours: "00", minutes: "00", seconds: "00" };

  return (
    <div className="countdown">
      <div>
        <span suppressHydrationWarning>{display.days}</span>
        <small>Days</small>
      </div>
      <div>
        <span suppressHydrationWarning>{display.hours}</span>
        <small>Hours</small>
      </div>
      <div>
        <span suppressHydrationWarning>{display.minutes}</span>
        <small>Mins</small>
      </div>
      <div>
        <span suppressHydrationWarning>{display.seconds}</span>
        <small>Secs</small>
      </div>
    </div>
  );
}
