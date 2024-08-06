// page.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { Calendar, dayjsLocalizer, Views } from 'react-big-calendar';
import dayjs from 'dayjs';
import { useTheme } from 'next-themes';
import { ApolloProvider, useQuery, useMutation } from '@apollo/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { GET_EVENTS, DELETE_FROM_CALENDAR } from './CalendarService';
import AddEditEventModal from './AddEditEventModal';
import client from '@/graphql/client';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './custom-calendar-styles.css';

const localizer = dayjsLocalizer(dayjs);

const CalendarView = () => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(dayjs().toDate());

  const { data, loading, error, refetch } = useQuery(GET_EVENTS, {
    variables: {
      rangeStartDateTime: dayjs(date).startOf('month').toISOString(),
      rangeEndDateTime: dayjs(date).endOf('month').toISOString()
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first'
  });

  const [deleteFromCalendar] = useMutation(DELETE_FROM_CALENDAR, {
    onCompleted: () => {
      toast({
        title: 'Event deleted',
        description:
          'The event has been successfully removed from the calendar.'
      });
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

  React.useEffect(() => {
    if (data && data.calendar) {
      const formattedEvents = data.calendar.map((event) => ({
        id: event.id,
        title: event.title,
        start: dayjs(event.startDateTime).toDate(),
        end: dayjs(event.endDateTime).toDate(),
        allDay: event.allDay,
        description: event.description,
        sharedWith: event.sharedWith,
        type: event.calendarEntryType
      }));
      setEvents(formattedEvents);
    }
  }, [data]);

  const handleSelectSlot = (slotInfo) => {
    setSelectedEvent({
      start: slotInfo.start,
      end: slotInfo.end,
      allDay: slotInfo.slots.length === 1
    });
    setIsAddModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  const handleEventAdd = (newEvent) => {
    setEvents([...events, newEvent]);
    setIsAddModalOpen(false);
    refetch();
  };

  const handleEventEdit = (updatedEvent) => {
    setEvents(
      events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
    setIsEditModalOpen(false);
    refetch();
  };

  const handleEventDelete = (eventId) => {
    deleteFromCalendar({ variables: { entryId: eventId } });
    setIsEditModalOpen(false);
  };

  const handleNavigate = useCallback((newDate) => setDate(newDate), [setDate]);

  const handleViewChange = useCallback(
    (newView) => setView(newView),
    [setView]
  );

  const eventStyleGetter = (event, start, end, isSelected) => {
    let className = 'rbc-event';

    if (event.type === 'EVENT') {
      className += ' event-type-1';
    } else if (event.type === 'TASK') {
      className += ' event-type-2';
    }

    return {
      className: className
    };
  };

  const CustomToolbar = ({ label, onNavigate, onView }) => (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <Button variant="outline" onClick={() => onNavigate('TODAY')}>
          Today
        </Button>
        <Button variant="outline" onClick={() => onNavigate('PREV')}>
          Back
        </Button>
        <Button variant="outline" onClick={() => onNavigate('NEXT')}>
          Next
        </Button>
      </span>
      <span className="rbc-toolbar-label">{label}</span>
      <span className="rbc-btn-group">
        <Button variant="outline" onClick={() => onView('month')}>
          Month
        </Button>
        <Button variant="outline" onClick={() => onView('week')}>
          Week
        </Button>
        <Button variant="outline" onClick={() => onView('day')}>
          Day
        </Button>
        <Button variant="outline" onClick={() => onView('agenda')}>
          Agenda
        </Button>
      </span>
    </div>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading calendar</div>;

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>Add Event</Button>
      </div>
      <div className="flex-grow">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable
          popup
          views={['month', 'week', 'day', 'agenda']}
          view={view}
          onView={handleViewChange}
          date={date}
          onNavigate={handleNavigate}
          components={{
            toolbar: CustomToolbar
          }}
          eventPropGetter={eventStyleGetter}
        />
      </div>
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <AddEditEventModal
            event={selectedEvent}
            mode="add"
            onAdd={handleEventAdd}
            onEdit={handleEventEdit}
            onCancel={() => setIsAddModalOpen(false)}
            onDelete={handleEventDelete}
            refetch={refetch}
            open={isAddModalOpen}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <AddEditEventModal
            event={selectedEvent}
            mode="edit"
            onAdd={handleEventAdd}
            onEdit={handleEventEdit}
            onCancel={() => setIsEditModalOpen(false)}
            onDelete={handleEventDelete}
            refetch={refetch}
            open={isEditModalOpen}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const WrappedCalendarView = () => (
  <ApolloProvider client={client}>
    <CalendarView />
  </ApolloProvider>
);

export default WrappedCalendarView;
