// File: components/Timetable/index.tsx
'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { ApolloProvider, useQuery, useLazyQuery } from '@apollo/client';
import client from '@/graphql/client';
import dayjs from 'dayjs';
import { Calendar, dayjsLocalizer, Views } from 'react-big-calendar';
import { useTheme } from 'next-themes';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { GET_GROUPS, GET_TIMETABLE } from './TimetableService';
import Header from './Header';
import AddEditTimetable from './AddEditTimetable';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './custom-calendar-styles.css';

const localizer = dayjsLocalizer(dayjs);

const TimetableComponent = () => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(dayjs().toDate());
  const [groupName, setGroupName] = useState('');
  const [groupId, setGroupId] = useState('');
  const [rangeStartDateTimeValue, setRangeStartDateTimeValue] = useState(
    dayjs().startOf('month').format()
  );
  const [rangeEndDateTimeValue, setRangeEndDateTimeValue] = useState(
    dayjs().endOf('month').format()
  );

  const { data: groupsData } = useQuery(GET_GROUPS);

  const [
    getTimetable,
    { data: timetableData, loading: timetableLoading, error: timetableError }
  ] = useLazyQuery(GET_TIMETABLE, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first'
  });

  useEffect(() => {
    if (groupId) {
      handleTimetable(rangeStartDateTimeValue, rangeEndDateTimeValue);
    }
  }, [groupId, rangeStartDateTimeValue, rangeEndDateTimeValue]);

  useEffect(() => {
    if (timetableData && timetableData.timetable) {
      const formattedEvents = timetableData.timetable.map((event) => ({
        id: event.id,
        title: event.subject,
        start: new Date(event.start),
        end: new Date(event.end),
        recurrence: event.recurrence
      }));
      setEvents(formattedEvents);
    }
  }, [timetableData]);

  const handleTimetable = (start, end) => {
    getTimetable({
      variables: {
        group: groupId,
        rangeStart: start,
        rangeEnd: end
      }
    });
  };

  const handleSelectSlot = useCallback(
    (slotInfo: { start: Date; end: Date; action: string }) => {
      if (slotInfo.action === 'click' || slotInfo.action === 'select') {
        setSelectedEvent({
          start: slotInfo.start,
          end: dayjs(slotInfo.start).add(30, 'minutes').toDate(),
          allDay: false
        });
        setModalMode('add');
        setIsModalOpen(true);
      }
    },
    []
  );

  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
    setModalMode('edit');
    setIsModalOpen(true);
  }, []);

  const handleEventAdd = (newEvent) => {
    setEvents([...events, newEvent]);
    setIsModalOpen(false);
    handleTimetable(rangeStartDateTimeValue, rangeEndDateTimeValue);
  };

  const handleEventEdit = (updatedEvent) => {
    setEvents(
      events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
    setIsModalOpen(false);
    handleTimetable(rangeStartDateTimeValue, rangeEndDateTimeValue);
  };

  const handleEventDelete = (eventId) => {
    setEvents(events.filter((event) => event.id !== eventId));
    setIsModalOpen(false);
    handleTimetable(rangeStartDateTimeValue, rangeEndDateTimeValue);
  };

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
    setRangeStartDateTimeValue(dayjs(newDate).startOf('month').format());
    setRangeEndDateTimeValue(dayjs(newDate).endOf('month').format());
  };

  const handleViewChange = (newView: string) => setView(newView);

  const CustomToolbar = (toolbarProps) => (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button type="button" onClick={() => toolbarProps.onNavigate('PREV')}>
          Back
        </button>
        <button type="button" onClick={() => toolbarProps.onNavigate('TODAY')}>
          Today
        </button>
        <button type="button" onClick={() => toolbarProps.onNavigate('NEXT')}>
          Next
        </button>
      </span>
      <span className="rbc-toolbar-label">{toolbarProps.label}</span>
      <span className="rbc-btn-group">
        {[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA].map((viewName) => (
          <button
            key={viewName}
            type="button"
            className={view === viewName ? 'rbc-active' : ''}
            onClick={() => toolbarProps.onView(viewName)}
          >
            {viewName}
          </button>
        ))}
      </span>
    </div>
  );

  return (
    <div className="flex h-screen flex-col p-4">
      <Header
        onEventAdd={() => {
          setSelectedEvent(null);
          setModalMode('add');
          setIsModalOpen(true);
        }}
      />
      <div className="mb-4">
        <Select
          value={groupName}
          onValueChange={(value) => {
            setGroupName(value);
            const selectedGroup = groupsData?.groups.find(
              (group) => group.name === value
            );
            if (selectedGroup) {
              setGroupId(selectedGroup.id);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a group" />
          </SelectTrigger>
          <SelectContent>
            {groupsData?.groups.map((group) => (
              <SelectItem key={group.id} value={group.name}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          view={view as any}
          date={date}
          onNavigate={handleNavigate as any}
          onView={handleViewChange as any}
          components={{
            toolbar: CustomToolbar
          }}
        />
      </div>
      <AddEditTimetable
        event={selectedEvent}
        mode={modalMode}
        onAdd={handleEventAdd}
        onEdit={handleEventEdit}
        onCancel={() => setIsModalOpen(false)}
        onDelete={handleEventDelete}
        open={isModalOpen}
        refetch={() =>
          handleTimetable(rangeStartDateTimeValue, rangeEndDateTimeValue)
        }
        groupId={groupId}
        handleTimetable={handleTimetable}
        setGroupName={setGroupName}
        groupName={groupName}
        groups={groupsData?.groups || []}
        timeZone="UTC" // You might want to make this dynamic based on user's timezone
        setTimetable={setEvents}
        rangeStartDateTimeValue={rangeStartDateTimeValue}
        rangeEndDateTimeValue={rangeEndDateTimeValue}
      />
    </div>
  );
};

const Timetable = () => (
  <ApolloProvider client={client}>
    <TimetableComponent />
  </ApolloProvider>
);

export default Timetable;
