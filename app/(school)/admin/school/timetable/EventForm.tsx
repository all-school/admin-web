// File: components/Timetable/EventForm.tsx
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import dayjs from 'dayjs';
import { useMutation } from '@apollo/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ADD_TO_TIMETABLE, UPDATE_TIMETABLE } from './TimetableService';
import { DateTimePicker } from './DateTimePicker';
import CustomDialog from './CustomDialog';
import DeleteDialog from './DeleteDialog';

const eventSchema = z.object({
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(32, 'Must be at most 32 characters'),
  startDateTime: z.date(),
  endDateTime: z.date()
});

interface EventFormProps {
  event: any | null;
  mode: 'add' | 'edit';
  onAdd: (event: any) => void;
  onEdit: (event: any) => void;
  onCancel: () => void;
  onDelete: (eventId: string) => void;
  refetch: () => void;
  headline: string;
  userName: { firstName: string; lastName: string };
  pic: string;
  groupId: string;
  handleTimetable: (start: string, end: string) => void;
  setGroupName: (name: string) => void;
  groupName: string;
  groups: any[];
  timeZone: string;
  setTimetable: (timetable: any[]) => void;
  rangeStartDateTimeValue: string;
  rangeEndDateTimeValue: string;
}

const EventForm: React.FC<EventFormProps> = ({
  event,
  mode,
  onAdd,
  onEdit,
  onCancel,
  onDelete,
  refetch,
  headline,
  userName,
  pic,
  groupId,
  handleTimetable,
  setGroupName,
  groupName,
  groups,
  timeZone,
  setTimetable,
  rangeStartDateTimeValue,
  rangeEndDateTimeValue
}) => {
  const { toast } = useToast();
  const [customDialogOpen, setCustomDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recurrence, setRecurrence] = useState(
    event?.extendedProps?.recurrence || 'Does not repeat'
  );
  const [recurrenceType, setRecurrenceType] = useState(
    event?.extendedProps?.recurrenceType || 'DAY'
  );
  const [frequency, setFrequency] = useState(
    event?.extendedProps?.frequency || 1
  );
  const [endType, setEndType] = useState(event?.extendedProps?.endType || 'ON');
  const [occurrence, setOccurrence] = useState(
    event?.extendedProps?.endsAfterOccurrences || 30
  );
  const [endsOn, setEndsOn] = useState(
    event?.extendedProps?.endsOn
      ? new Date(event.extendedProps.endsOn)
      : dayjs().add(1, 'month').toDate()
  );
  const [monthlyDate, setMonthlyDate] = useState(
    event?.start ? dayjs(event.start).toDate() : dayjs().toDate()
  );
  const [monthlyDay, setMonthlyDay] = useState('');
  const [monthlyOn, setMonthlyOn] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      subject: event?.title || '',
      startDateTime: event?.start ? new Date(event.start) : new Date(),
      endDateTime: event?.end
        ? new Date(event.end)
        : dayjs().add(30, 'minutes').toDate()
    }
  });

  const [addToTimetable] = useMutation(ADD_TO_TIMETABLE, {
    onCompleted() {
      toast({
        title: 'Period added',
        description: 'The period has been successfully added to the timetable.'
      });
      handleTimetable(rangeStartDateTimeValue, rangeEndDateTimeValue);
      onCancel();
    },
    onError(error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
      console.error(error);
      onCancel();
    }
  });

  const [updateTimetableEntry] = useMutation(UPDATE_TIMETABLE, {
    onCompleted() {
      toast({
        title: 'Timetable updated',
        description: 'The timetable has been successfully updated.'
      });
      handleTimetable(rangeStartDateTimeValue, rangeEndDateTimeValue);
      onCancel();
    },
    onError(error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
      console.error(error);
      onCancel();
    }
  });

  const onSubmit = (data: z.infer<typeof eventSchema>) => {
    const commonVariables = {
      group: groupId,
      subject: data.subject,
      start: dayjs(data.startDateTime).format(),
      end: dayjs(data.endDateTime).format()
    };

    if (recurrence === 'Custom') {
      const recurrenceVariables = {
        recurrence: {
          recurrenceType: recurrenceType,
          [recurrenceType.toLowerCase() + 'Recurrence']: {
            frequency: frequency,
            ...(recurrenceType === 'WEEK' && {
              repeatOn: [sun, mon, tue, wed, thu, fri, sat]
            }),
            ...(recurrenceType === 'MONTH' && { repeatOn: monthlyDay })
          },
          endType: endType,
          ...(endType === 'ON' && {
            endsOn: dayjs(endsOn).format('YYYY-MM-DD')
          }),
          ...(endType === 'OCCURENCES' && { endsAfterOccurrences: occurrence })
        }
      };

      if (mode === 'add') {
        addToTimetable({
          variables: { ...commonVariables, ...recurrenceVariables }
        });
      } else if (event?.id) {
        updateTimetableEntry({
          variables: {
            id: event.id,
            ...commonVariables,
            ...recurrenceVariables
          }
        });
      }
    } else {
      if (mode === 'add') {
        addToTimetable({ variables: commonVariables });
      } else if (event?.id) {
        updateTimetableEntry({
          variables: { id: event.id, ...commonVariables }
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={pic} alt={userName.firstName} />
          <AvatarFallback>
            {userName.firstName[0]}
            {userName.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{`${userName.firstName} ${userName.lastName}`}</p>
          <p className="text-sm text-gray-500">{headline}</p>
        </div>
      </div>

      <div>
        <Label htmlFor="group">Group</Label>
        <Select
          value={groupName}
          onValueChange={(value) => {
            if (mode === 'add') {
              setGroupName(value);
            }
          }}
        >
          <SelectTrigger id="group">
            <SelectValue placeholder="Select group" />
          </SelectTrigger>
          <SelectContent>
            {groups.map((group) => (
              <SelectItem key={group.id} value={group.name}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="subject">Subject</Label>
        <Controller
          name="subject"
          control={control}
          render={({ field }) => <Input id="subject" {...field} />}
        />
        {errors.subject && (
          <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="startDateTime">Start Date and Time</Label>
        <Controller
          name="startDateTime"
          control={control}
          render={({ field }) => (
            <DateTimePicker
              date={field.value}
              setDate={(date) => field.onChange(date)}
            />
          )}
        />
      </div>

      <div>
        <Label htmlFor="endDateTime">End Date and Time</Label>
        <Controller
          name="endDateTime"
          control={control}
          render={({ field }) => (
            <DateTimePicker
              date={field.value}
              setDate={(date) => field.onChange(date)}
            />
          )}
        />
      </div>

      <div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setCustomDialogOpen(true)}
        >
          {recurrence}
        </Button>
      </div>

      <div className="flex justify-between">
        <Button type="submit">
          {mode === 'add' ? 'Add Period' : 'Update Period'}
        </Button>
        {mode === 'edit' && (
          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete
          </Button>
        )}
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      <CustomDialog
        title="Custom recurrence"
        open={customDialogOpen}
        setOpen={setCustomDialogOpen}
        event={event}
        setRecurrence={setRecurrence}
        setRecurrenceType={setRecurrenceType}
        recurrenceType={recurrenceType}
        setFrequency={setFrequency}
        frequency={frequency}
        endType={endType}
        setEndType={setEndType}
        occurrence={occurrence}
        setOccurrence={setOccurrence}
        endsOn={endsOn}
        setEndsOn={setEndsOn}
        monthlyDate={monthlyDate}
        setMonthlyDate={setMonthlyDate}
        monthlyDay={monthlyDay}
        setMonthlyDay={setMonthlyDay}
        currentDay={
          event?.start
            ? dayjs(event.start).format('ddd')
            : dayjs().format('ddd')
        }
        sun={false}
        setSun={() => {}}
        mon={false}
        setMon={() => {}}
        tue={false}
        setTue={() => {}}
        wed={false}
        setWed={() => {}}
        thu={false}
        setThu={() => {}}
        fri={false}
        setFri={() => {}}
        sat={false}
        setSat={() => {}}
        mode={mode}
        editDialog={false}
        selectedStartDate={event?.start ? new Date(event.start) : new Date()}
        monthlyOn={monthlyOn}
        setMonthlyOn={setMonthlyOn}
        timeZone={timeZone}
      />

      <DeleteDialog
        title={
          recurrence === 'Custom' ? 'Delete recurring event' : 'Delete period?'
        }
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        recurrence={recurrence}
        id={event?.id || ''}
        handleTimetable={handleTimetable}
        rangeStartDateTimeValue={rangeStartDateTimeValue}
        rangeEndDateTimeValue={rangeEndDateTimeValue}
        onCancel={onCancel}
      />
    </form>
  );
};

export default EventForm;
