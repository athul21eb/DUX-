import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface DatePickerProps {
  selected?: Date;
  onChange: (date: Date | undefined) => void;
  placeholderText?: string;
}

export function DatePicker({ selected, onChange, placeholderText }: DatePickerProps) {
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
      <PopoverContent align="start" className="p-0">
        <Calendar mode="single" selected={selected} onSelect={onChange} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
