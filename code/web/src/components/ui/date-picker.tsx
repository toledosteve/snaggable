import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type DatePickerValue = {
  month: string;
  day?: number;
  year?: number;
};

type DatePickerProps = {
  value: DatePickerValue;
  onChange: (field: keyof DatePickerValue, value: string | number) => void;
  disableDay?: boolean;
  disableYear?: boolean;
};

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  disableDay,
  disableYear,
}) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = value.month
    ? Array.from(
        {
          length: new Date(
            value.year || new Date().getFullYear(),
            months.indexOf(value.month) + 1,
            0
          ).getDate(),
        },
        (_, i) => i + 1
      )
    : [];

  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i
  );

  return (
    <div className="flex gap-4 justify-center items-center">
      {/* Month Selector */}
      <Select
        value={value.month || ""}
        onValueChange={(selectedMonth) => onChange("month", selectedMonth)}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          {months.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Day Selector */}
      <Select
        value={value.day ? value.day.toString() : ""}
        onValueChange={(selectedDay) => onChange("day", Number(selectedDay))}
        disabled={disableDay}
      >
        <SelectTrigger className="w-20">
          <SelectValue placeholder="Day" />
        </SelectTrigger>
        <SelectContent>
          {days.map((d) => (
            <SelectItem key={d} value={d.toString()}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Year Selector */}
      <Select
        value={value.year ? value.year.toString() : ""}
        onValueChange={(selectedYear) => onChange("year", Number(selectedYear))}
        disabled={disableYear}
      >
        <SelectTrigger className="w-28">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={y.toString()}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DatePicker;
