import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { GET_LEAVES_BY_RANGE } from './LeaveService';
import dayjs from 'dayjs';

function CalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const { data, loading, error } = useQuery(GET_LEAVES_BY_RANGE, {
    variables: {
      rangeStart: dayjs(date).startOf('month').format('YYYY-MM-DD'),
      rangeEnd: dayjs(date).endOf('month').format('YYYY-MM-DD')
    },
    errorPolicy: 'all'
  });

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    toast({
      title: 'Error',
      description: 'Something went wrong. Please try again.',
      variant: 'destructive'
    });
    return (
      <div className="text-center text-muted-foreground">
        An error occurred. Please try again later.
      </div>
    );
  }

  const leavesByDate = data?.leavesByRange.reduce((acc, leave) => {
    const leaveDate = dayjs(leave.from).format('YYYY-MM-DD');
    if (!acc[leaveDate]) {
      acc[leaveDate] = [];
    }
    acc[leaveDate].push(leave);
    return acc;
  }, {});

  return (
    <Card>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          modifiers={{
            hasLeaves: (date) => {
              const dateString = dayjs(date).format('YYYY-MM-DD');
              return !!leavesByDate?.[dateString];
            }
          }}
          modifiersStyles={{
            hasLeaves: { backgroundColor: '#cbd5e1' }
          }}
        />
        {date && leavesByDate?.[dayjs(date).format('YYYY-MM-DD')] && (
          <div className="mt-4">
            <h3 className="mb-2 text-lg font-semibold">
              Leaves on {dayjs(date).format('MMMM D, YYYY')}
            </h3>
            <ul className="space-y-2">
              {leavesByDate[dayjs(date).format('YYYY-MM-DD')].map((leave) => (
                <li key={leave.id} className="text-sm">
                  {leave.student.firstName} {leave.student.lastName} -{' '}
                  {leave.summary}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CalendarView;
