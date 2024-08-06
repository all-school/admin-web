import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_EVENTS } from './DashboardService';
import { CalendarIcon, MapPinIcon, MoreVerticalIcon } from 'lucide-react';
import Link from 'next/link';

const UpcomingEvents = () => {
  const today = useMemo(() => new Date(), []);
  const oneWeekLater = useMemo(
    () => new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
    [today]
  );

  const { loading, error, data } = useQuery(GET_EVENTS, {
    variables: {
      rangeStartDateTime: today.toISOString(),
      rangeEndDateTime: oneWeekLater.toISOString()
    },
    fetchPolicy: 'cache-and-network'
  });

  const events = useMemo(() => {
    if (data && data.calendar) {
      return data.calendar.slice(0, 5); // Show only the next 5 events
    }
    return [];
  }, [data]);

  if (loading) return <p className="py-4 text-center">Loading events...</p>;
  if (error)
    return (
      <p className="py-4 text-center text-red-500">Error loading events</p>
    );

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-bold">Upcoming Events</h2>
      <div className="space-y-4">
        {events.length === 0 ? (
          <p className="py-4 text-center">No upcoming Events</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                <span className="text-xl font-bold text-gray-600">
                  {event.title.charAt(0)}
                </span>
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold">{event.title}</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <CalendarIcon className="mr-1 h-4 w-4" />
                  <span>{new Date(event.startDateTime).toLocaleString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPinIcon className="mr-1 h-4 w-4" />
                  <span>{event.description || 'No location specified'}</span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVerticalIcon className="h-5 w-5" />
              </button>
            </div>
          ))
        )}
      </div>
      <Link href="/admin/school/calendar" passHref>
        <button className="mt-6 w-full rounded-md bg-indigo-600 py-2 text-white transition duration-300 hover:bg-indigo-700">
          View all
        </button>
      </Link>
    </div>
  );
};

export default UpcomingEvents;
