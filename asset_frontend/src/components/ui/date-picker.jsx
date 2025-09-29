import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled = false,
  className = "",
  ...props
}) {
  const [date, setDate] = React.useState(value ? new Date(value) : undefined);

  React.useEffect(() => {
    if (value) {
      setDate(new Date(value));
    } else {
      setDate(undefined);
    }
  }, [value]);

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
    if (onChange) {
      // Format date as YYYY-MM-DD for form compatibility
      const formattedDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
      onChange(formattedDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
          disabled={disabled}
          {...props}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
          fromYear={1900}
          toYear={new Date().getFullYear() + 10}
          captionLayout="dropdown-buttons"
        />
      </PopoverContent>
    </Popover>
  );
}
