import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import dayjs from 'dayjs';
import { useMutation, useQuery } from '@apollo/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { DateTimePicker } from './DateTimePicker';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  ADD_TO_CALENDAR,
  UPDATE_CALENDAR,
  GET_SCHOOL_ID
} from './CalendarService';
import { Combobox } from './Combobox';
import { getAllDetailsByName } from './CalendarService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Globe, Users } from 'lucide-react';

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

interface AddEditEventModalProps {
  event?: any;
  onSave: (event: any) => void;
  onDelete?: (eventId: string) => void;
  onClose: () => void;
  mode: 'add' | 'edit';
}

const AddEditEventModal: React.FC<AddEditEventModalProps> = ({
  event,
  onSave,
  onDelete,
  onClose,
  mode
}) => {
  const { toast } = useToast();
  const { data: schoolData } = useQuery(GET_SCHOOL_ID);
  const [recipients, setRecipients] = useState<any[]>([]);
  const [options, setOptions] = useState<any[]>([]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
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

  const sharedWithValue = watch('sharedWith');

  const [addToCalendar] = useMutation(ADD_TO_CALENDAR, {
    onCompleted: () => {
      toast({
        title: 'Event added',
        description: 'The event has been successfully added to the calendar.'
      });
      onClose();
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
      onClose();
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

  const handleSearchQuery = async (query: string) => {
    if (query.trim() !== '') {
      try {
        const result = await getAllDetailsByName(query);
        setOptions(result || []);
      } catch (error) {
        console.error('Error fetching recipients:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch recipients. Please try again.',
          variant: 'destructive'
        });
        setOptions([]);
      }
    } else {
      setOptions([]);
    }
  };

  const getReceiverType = (recipient: any): string => {
    if (recipient.firstName && recipient.lastName) {
      return 'STUDENT';
    } else if (recipient.name) {
      return 'GROUP';
    } else {
      return 'UNKNOWN';
    }
  };

  const onSubmit = (data: z.infer<typeof eventSchema>) => {
    const mutationVariables = {
      calendarEntryType: 'EVENT',
      title: data.title,
      description: data.description,
      allDay: data.allDay,
      startDateTime: dayjs(data.startDateTime).toISOString(),
      endDateTime: dayjs(data.endDateTime).toISOString(),
      sendTo:
        data.sharedWith === 'School'
          ? [{ receiverType: 'SCHOOL', receiverId: schoolData?.school?.id }]
          : recipients.map((recipient) => ({
              receiverType: getReceiverType(recipient),
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

  return (
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
            <Label htmlFor="allDay">All Day Event</Label>
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
          />
        )}
      />
      {errors.startDateTime && (
        <p className="text-red-500">{errors.startDateTime.message}</p>
      )}

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
      {errors.endDateTime && (
        <p className="text-red-500">{errors.endDateTime.message}</p>
      )}

      <div>
        <h3 className="mb-2 text-lg font-semibold">Who can see your event?</h3>
        <Controller
          name="sharedWith"
          control={control}
          render={({ field }) => (
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="School" id="school" />
                <Label htmlFor="school" className="flex items-center">
                  <Globe className="mr-2" />
                  Entire School
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Others" id="others" />
                <Label htmlFor="others" className="flex items-center">
                  <Users className="mr-2" />
                  Others
                </Label>
              </div>
            </RadioGroup>
          )}
        />
      </div>

      {sharedWithValue === 'Others' && (
        <Combobox
          items={options}
          onChange={setRecipients}
          onInputChange={handleSearchQuery}
          placeholder="Search for recipients..."
          renderOption={(option) => (
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={option.profilePicture?.signedUrl} />
                <AvatarFallback>
                  {option.firstName
                    ? `${option.firstName[0]}${option.lastName[0]}`
                    : option.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p>
                  {option.firstName
                    ? `${option.firstName} ${option.lastName}`
                    : option.name}
                </p>
                <p className="text-sm text-gray-500">
                  {getReceiverType(option)}
                </p>
              </div>
            </div>
          )}
        />
      )}

      {recipients.length > 0 && (
        <Card>
          <CardContent className="p-2">
            {recipients.map((recipient) => (
              <div
                key={recipient.id}
                className="mb-1 flex items-center space-x-2"
              >
                <Avatar>
                  <AvatarImage src={recipient.profilePicture?.signedUrl} />
                  <AvatarFallback>
                    {recipient.firstName
                      ? `${recipient.firstName[0]}${recipient.lastName[0]}`
                      : recipient.name[0]}
                  </AvatarFallback>
                </Avatar>
                <p>
                  {recipient.firstName
                    ? `${recipient.firstName} ${recipient.lastName}`
                    : recipient.name}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

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
            <Label htmlFor="notifyByEmail">Notify By Email</Label>
          </div>
        )}
      />

      <div className="flex justify-between">
        <Button type="submit">
          {mode === 'add' ? 'Add Event' : 'Update Event'}
        </Button>
        {mode === 'edit' && onDelete && (
          <Button variant="destructive" onClick={() => onDelete(event.id)}>
            Delete Event
          </Button>
        )}
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AddEditEventModal;
