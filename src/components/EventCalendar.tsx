"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

// TEMPORARY
const events = [
  {
    id: 1,
    title: "Lorem ipsum dolor",
    time: "12:00 PM - 2:00 PM",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 2,
    title: "Lorem ipsum dolor",
    time: "12:00 PM - 2:00 PM",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 3,
    title: "Lorem ipsum dolor",
    time: "12:00 PM - 2:00 PM",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(() => {
    if (typeof window === "undefined") return new Date();
    const dateParam = new URLSearchParams(window.location.search).get("date");
    if (dateParam) {
      const parts = dateParam.split("-").map(Number);
      const [y, m, d] = parts;
      if (y && m && d) return new Date(y, m - 1, d);
    }
    return new Date();
  });

  function formatLocalYMD(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  const router = useRouter();

  useEffect(() => {
    if (!(value instanceof Date) || typeof window === "undefined") return;
    const newDate = formatLocalYMD(value);
    const url = new URL(window.location.href);
    const currentDate = url.searchParams.get("date");
    url.searchParams.set("date", newDate);
    const target = url.pathname + url.search + url.hash;
    const current =
      window.location.pathname + window.location.search + window.location.hash;
    if (newDate && currentDate !== newDate && target !== current) {
      // use router.replace to trigger server-side re-render via App Router
      router.replace(target);
    }
    // intentionally only depend on value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <Calendar onChange={onChange} value={value} />;
};

export default EventCalendar;
