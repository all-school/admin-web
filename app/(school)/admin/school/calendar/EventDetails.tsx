import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { CalendarIcon, ClockIcon, UsersIcon } from 'lucide-react';

export function EventDetails({ event }) {
  if (!event) return null;

  return (
    <Card className="mb-4 w-full">
      <CardContent className="p-4">
        <h2 className="mb-2 text-xl font-bold">{event.title}</h2>

        <div className="space-y-2">
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
            <span>
              {event.allDay
                ? format(new Date(event.start), 'MMMM d, yyyy')
                : `${format(new Date(event.start), 'MMMM d, yyyy')} - ${format(
                    new Date(event.end),
                    'MMMM d, yyyy'
                  )}`}
            </span>
          </div>

          {!event.allDay && (
            <div className="flex items-center">
              <ClockIcon className="mr-2 h-4 w-4 text-gray-500" />
              <span>{`${format(new Date(event.start), 'h:mm a')} - ${format(
                new Date(event.end),
                'h:mm a'
              )}`}</span>
            </div>
          )}

          {event.description && (
            <div className="mt-2">
              <h3 className="text-md mb-1 font-semibold">Description</h3>
              <p className="text-sm">{event.description}</p>
            </div>
          )}

          {event.sharedWith && event.sharedWith.length > 0 && (
            <div className="mt-2">
              <h3 className="text-md mb-1 flex items-center font-semibold">
                <UsersIcon className="mr-2 h-4 w-4" /> Shared with
              </h3>
              <div className="flex flex-wrap gap-2">
                {event.sharedWith.map((shared) => (
                  <div
                    key={shared.id}
                    className="flex items-center rounded-full bg-gray-100 px-2 py-1"
                  >
                    <Avatar className="mr-2 h-6 w-6">
                      <AvatarImage
                        src={shared.receiver?.profilePicture?.signedUrl}
                      />
                      <AvatarFallback>
                        {shared.receiver?.name?.[0] ||
                          shared.receiver?.firstName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      {shared.receiver?.name ||
                        `${shared.receiver?.firstName} ${shared.receiver?.lastName}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
