import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import dayjs from 'dayjs';
import { useMutation } from '@apollo/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { DateTimePicker } from './DateTimePicker';
import { ADD_TO_CALENDAR, UPDATE_CALENDAR } from './CalendarService';
import RecipientSelector from './RecipientSelector';
import { EventDetails } from './EventDetails';

const eventSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(256, 'Title must be at most 256 characters'),
  description: z
    .string()
    .max(512, 'Description must be at most 512 characters')
    .optional(),
  allDay: z.boolean(),
  startDateTime: z.date(),
  endDateTime: z.date(),
  sharedWith: z.string(),
  notifyByEmail: z.boolean()
});

export function EventForm({
  event,
  mode,
  onAdd,
  onEdit,
  onCancel,
  onDelete,
  refetch
}) {
  const { toast } = useToast();
  const [recipients, setRecipients] = useState([]);
  const [selectedValue, setSelectedValue] = useState('School');

  useEffect(() => {
    if (event && event.sharedWith) {
      setRecipients(event.sharedWith || []);
      setSelectedValue(event.sharedWith.length === 0 ? 'School' : 'Others');
    }
  }, [event]);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title || '',
      description: event?.description || '',
      allDay: event?.allDay || false,
      startDateTime: event?.start ? dayjs(event.start).toDate() : new Date(),
      endDateTime: event?.end
        ? dayjs(event.end).toDate()
        : dayjs().add(30, 'minutes').toDate(),
      sharedWith: 'School',
      notifyByEmail: true
    }
  });

  const [addToCalendar] = useMutation(ADD_TO_CALENDAR, {
    onCompleted: () => {
      toast({
        title: 'Event added',
        description: 'The event has been successfully added to the calendar.'
      });
      onCancel();
      refetch();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
      console.error(error);
    }
  });

  const [updateCalendar] = useMutation(UPDATE_CALENDAR, {
    onCompleted: () => {
      toast({
        title: 'Event updated',
        description: 'The event has been successfully updated.'
      });
      onCancel();
      refetch();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
      console.error(error);
    }
  });

  const getReceiverType = (recipientType) => {
    switch (recipientType) {
      case 'School':
        return 'SCHOOL';
      case 'Group':
        return 'GROUP';
      case 'Student':
        return 'STUDENT';
      default:
        return 'SCHOOL'; // Default to SCHOOL if type is unknown
    }
  };

  const onSubmit = (data) => {
    const mutationVariables = {
      calendarEntryType: 'EVENT',
      title: data.title,
      description: data.description,
      allDay: data.allDay,
      startDateTime: dayjs(data.startDateTime).toISOString(),
      endDateTime: dayjs(data.endDateTime).toISOString(),
      sendTo:
        selectedValue === 'School'
          ? [{ receiverType: 'SCHOOL', receiverId: 'schoolId' }] // Use a placeholder ID for school-wide events
          : recipients.map((recipient) => ({
              receiverType: getReceiverType(recipient.__typename),
              receiverId: recipient.id
            })),
      notifyByEmail: data.notifyByEmail
    };

    if (mode === 'add') {
      addToCalendar({ variables: mutationVariables });
    } else {
      updateCalendar({
        variables: { entryId: event.id, ...mutationVariables }
      });
    }
  };

  const handleCancel = (e) => {
    e.preventDefault(); // Prevent form submission
    onCancel(); // Call the onCancel prop
  };

  return (
    <div className="space-y-4">
      {mode === 'edit' && event && <EventDetails event={event} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          name="title"
          control={control}
          render={({ field }) => <Input {...field} placeholder="Event Title" />}
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea {...field} placeholder="Event Description" />
          )}
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}

        <Controller
          name="allDay"
          control={control}
          render={({ field }) => (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allDay"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <label htmlFor="allDay">All Day Event</label>
            </div>
          )}
        />

        <Controller
          name="startDateTime"
          control={control}
          render={({ field }) => (
            <DateTimePicker
              date={field.value}
              setDate={(date) => field.onChange(date)}
              label="Start Date"
            />
          )}
        />

        <Controller
          name="endDateTime"
          control={control}
          render={({ field }) => (
            <DateTimePicker
              date={field.value}
              setDate={(date) => field.onChange(date)}
              label="End Date"
            />
          )}
        />

        <RecipientSelector
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
          recipients={recipients}
          setRecipients={setRecipients}
        />

        <Controller
          name="notifyByEmail"
          control={control}
          render={({ field }) => (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notifyByEmail"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <label htmlFor="notifyByEmail">Notify By Email</label>
            </div>
          )}
        />

        <div className="flex justify-between">
          <Button type="submit">
            {mode === 'add' ? 'Add Event' : 'Update Event'}
          </Button>
          {mode === 'edit' && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => onDelete(event.id)}
            >
              Delete Event
            </Button>
          )}
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
