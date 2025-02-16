import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface DatePickerProps {
  selected?: Date;
  onChange: (date: Date | undefined) => void;
  placeholderText?: string;
}

export function DatePicker({ selected, onChange, placeholderText }: DatePickerProps) {
  const [currentDate, setCurrentDate] = useState(selected || new Date(2000, 0, 1));

  const handleYearChange = (change: number) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setFullYear(prev.getFullYear() + change);
      return newDate;
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", !selected && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "PPP") : placeholderText || "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0 w-[300px] h-[400px]">
        {/* Year Selector */}
        <div className="flex items-center justify-between px-4 py-2 border-b ">
          <button onClick={() => handleYearChange(-1)} className="p-1">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="font-medium text-lg">{currentDate.getFullYear()}</span>
          <button onClick={() => handleYearChange(1)} className="p-1">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Calendar Component */}
        <div className="p-2">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={onChange}
            initialFocus
            month={currentDate} // Controls the displayed month & year
            onMonthChange={setCurrentDate} // Updates when switching months
            fromYear={1900}
            toYear={2100}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
