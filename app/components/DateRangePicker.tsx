"use client";
import { DateRange, DayPicker } from "react-day-picker";
import "./DateRangePicker.css";
import { useState } from "react";

export default function DateRangePicker({
  onChange,
}: {
  onChange: (range: DateRange | undefined) => void;
}) {
  const [range, setRange] = useState<DateRange | undefined>();
  return (
    <DayPicker
      mode="range"
      selected={range}
      onSelect={(r) => {
        setRange(r);
        onChange(r);
      }}
      numberOfMonths={2}
      disabled={{ before: new Date() }}
    />
  );
}



