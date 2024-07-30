import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';

export function DateTimePicker({ date, setDate }) {
  return (
    <div className="relative">
      <DatePicker
        selected={date}
        onChange={(date) => setDate(date)}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="MMMM d, yyyy h:mm aa"
        customInput={
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? date.toLocaleString() : 'Pick a date and time'}
          </Button>
        }
      />
    </div>
  );
}
