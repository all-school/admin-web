// File: components/Timetable/CustomDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { DateTimePicker } from './DateTimePicker';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import dayjs from 'dayjs';

interface CustomDialogProps {
  title: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  event: any;
  setRecurrence: (recurrence: string) => void;
  setRecurrenceType: (type: string) => void;
  recurrenceType: string;
  setFrequency: (frequency: number) => void;
  frequency: number;
  endType: string;
  setEndType: (type: string) => void;
  occurrence: number;
  setOccurrence: (occurrence: number) => void;
  endsOn: Date;
  setEndsOn: (date: Date) => void;
  monthlyDate: Date;
  setMonthlyDate: (date: Date) => void;
  monthlyDay: string;
  setMonthlyDay: (day: string) => void;
  currentDay: string;
  sun: boolean;
  setSun: (sun: boolean) => void;
  mon: boolean;
  setMon: (mon: boolean) => void;
  tue: boolean;
  setTue: (tue: boolean) => void;
  wed: boolean;
  setWed: (wed: boolean) => void;
  thu: boolean;
  setThu: (thu: boolean) => void;
  fri: boolean;
  setFri: (fri: boolean) => void;
  sat: boolean;
  setSat: (sat: boolean) => void;
  mode: 'add' | 'edit';
  editDialog: boolean;
  selectedStartDate: Date;
  monthlyOn: string;
  setMonthlyOn: (on: string) => void;
  timeZone: string;
}

const CustomDialog: React.FC<CustomDialogProps> = ({
  title,
  open,
  setOpen,
  event,
  setRecurrence,
  setRecurrenceType,
  recurrenceType,
  setFrequency,
  frequency,
  endType,
  setEndType,
  occurrence,
  setOccurrence,
  endsOn,
  setEndsOn,
  monthlyDate,
  setMonthlyDate,
  monthlyDay,
  setMonthlyDay,
  currentDay,
  sun,
  setSun,
  mon,
  setMon,
  tue,
  setTue,
  wed,
  setWed,
  thu,
  setThu,
  fri,
  setFri,
  sat,
  setSat,
  mode,
  editDialog,
  selectedStartDate,
  monthlyOn,
  setMonthlyOn,
  timeZone
}) => {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const dayStates = [sun, mon, tue, wed, thu, fri, sat];
  const setDayStates = [setSun, setMon, setTue, setWed, setThu, setFri, setSat];

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setFrequency(value < 1 ? 1 : value);
  };

  const handleOccurrenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setOccurrence(value < 1 ? 1 : value);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="frequency">Repeat every</Label>
            <Input
              id="frequency"
              type="number"
              value={frequency}
              onChange={handleFrequencyChange}
              className="w-16"
              min={1}
            />
            <Select value={recurrenceType} onValueChange={setRecurrenceType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DAY">day</SelectItem>
                <SelectItem value="WEEK">week</SelectItem>
                <SelectItem value="MONTH">month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {recurrenceType === 'WEEK' && (
            <div>
              <Label>Repeat on</Label>
              <div className="mt-2 flex gap-2">
                {days.map((day, index) => (
                  <Avatar
                    key={day}
                    className={`cursor-pointer ${
                      dayStates[index]
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary'
                    }`}
                    onClick={() => setDayStates[index](!dayStates[index])}
                  >
                    <AvatarFallback>{day}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
          )}

          {recurrenceType === 'MONTH' && (
            <div>
              <Select value={monthlyOn} onValueChange={setMonthlyOn}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select monthly repeat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value={`Monthly on day ${dayjs(monthlyDate).format('D')}`}
                  >
                    Monthly on day {dayjs(monthlyDate).format('D')}
                  </SelectItem>
                  <SelectItem
                    value={`Monthly on the ${getWeekOfMonth(monthlyDate)}`}
                  >
                    Monthly on the {getWeekOfMonth(monthlyDate)}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label>Ends</Label>
            <RadioGroup value={endType} onValueChange={setEndType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ON" id="on" />
                <Label htmlFor="on">On</Label>
                <DateTimePicker
                  date={endsOn}
                  setDate={setEndsOn}
                  disabled={endType !== 'ON'}
                />
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="OCCURENCES" id="after" />
                <Label htmlFor="after">After</Label>
                <Input
                  type="number"
                  value={occurrence}
                  onChange={handleOccurrenceChange}
                  disabled={endType !== 'OCCURENCES'}
                  className="w-16"
                  min={1}
                />
                <span>occurrences</span>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              setRecurrence('Does not repeat');
              setRecurrenceType('DAY');
              setFrequency(1);
              setEndType('ON');
              setOccurrence(30);
              setEndsOn(dayjs(selectedStartDate).toDate());
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              setRecurrence('Custom');
            }}
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;

// Helper function to get week of the month
function getWeekOfMonth(date: Date) {
  const d = dayjs(date);
  const firstDayOfMonth = d.startOf('month');
  const firstDayOfWeek = firstDayOfMonth.startOf('week');
  const offset = firstDayOfMonth.diff(firstDayOfWeek, 'day');
  return Math.ceil((d.date() + offset) / 7);
}
