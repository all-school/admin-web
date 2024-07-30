// File: components/Timetable/Toolbar.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import dayjs from 'dayjs';

interface ToolbarProps {
  date: Date;
  onDatePrev: () => void;
  onDateNext: () => void;
  onDateToday: () => void;
  onViewChange: (view: string) => void;
  view: string;
}

const Toolbar: React.FC<ToolbarProps> = ({
  date,
  onDatePrev,
  onDateNext,
  onDateToday,
  onViewChange,
  view
}) => {
  const viewOptions = [
    { label: 'Month', value: 'dayGridMonth' },
    { label: 'Week', value: 'timeGridWeek' },
    { label: 'Day', value: 'timeGridDay' },
    { label: 'List', value: 'listWeek' }
  ];

  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={onDatePrev}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onDateToday}>
          Today
        </Button>
        <Button variant="outline" size="sm" onClick={onDateNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <h2 className="text-xl font-semibold">
        {view === 'dayGridMonth' && dayjs(date).format('MMMM YYYY')}
        {view === 'timeGridWeek' &&
          `${dayjs(date).startOf('week').format('MMM D')} - ${dayjs(date)
            .endOf('week')
            .format('MMM D, YYYY')}`}
        {view === 'timeGridDay' && dayjs(date).format('MMMM D, YYYY')}
        {view === 'listWeek' &&
          `${dayjs(date).startOf('week').format('MMM D')} - ${dayjs(date)
            .endOf('week')
            .format('MMM D, YYYY')}`}
      </h2>
      <Select value={view} onValueChange={onViewChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Select view" />
        </SelectTrigger>
        <SelectContent>
          {viewOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Toolbar;
