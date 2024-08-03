'use client';
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useToast } from '@/components/ui/use-toast';
import { ApolloProvider } from '@apollo/client';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import client from '@/graphql/client';
import {
  GET_GROUPS,
  GET_STUDENTS_BY_GROUP,
  TAKE_ATTENDANCE,
  GET_ATTENDANCE_BY_GROUP
} from './AttendanceService';
import GroupSelector from './GroupSelector';
import StudentList from './StudentList';
import AbsentStudentList from './AbsentStudentList';
import ConfirmationDialog from './ConfirmationDialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

function AttendanceView() {
  const { toast } = useToast();
  const [selectedGroup, setSelectedGroup] = useState('');
  const [absentStudents, setAbsentStudents] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState<Date>(new Date());
  const [attendanceExists, setAttendanceExists] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const {
    data: groupsData,
    loading: groupsLoading,
    error: groupsError
  } = useQuery(GET_GROUPS);
  const {
    data: studentsData,
    loading: studentsLoading,
    error: studentsError,
    refetch: refetchStudents
  } = useQuery(GET_STUDENTS_BY_GROUP, {
    variables: { groupId: selectedGroup },
    skip: !selectedGroup
  });
  const {
    data: attendanceData,
    loading: attendanceLoading,
    error: attendanceError,
    refetch: refetchAttendance
  } = useQuery(GET_ATTENDANCE_BY_GROUP, {
    variables: {
      groupId: selectedGroup,
      date: attendanceDate.toISOString().split('T')[0]
    },
    skip: !selectedGroup,
    onCompleted: (data) => {
      if (data?.getAttendance) {
        setAbsentStudents(data.getAttendance.absentStudents);
        setAttendanceExists(true);
      }
    },
    onError: () => console.log('Error fetching attendance data')
  });

  const [takeAttendance, { loading: takeAttendanceLoading }] = useMutation(
    TAKE_ATTENDANCE,
    {
      onCompleted(data) {
        setAbsentStudents(data.takeAttendance.absentStudents);
        setAttendanceExists(true);
        toast({
          title: 'Success',
          description: 'Attendance submitted successfully'
        });
        setConfirmDialogOpen(false);
      },
      onError(error) {
        toast({
          title: 'Error',
          description: `Error submitting attendance: ${error.message}`,
          variant: 'destructive'
        });
        setConfirmDialogOpen(false);
      }
    }
  );

  useEffect(() => {
    if (
      attendanceError?.message.includes(
        'Attendance not found for the specified date'
      )
    ) {
      setAttendanceExists(false);
      setAbsentStudents([]);
      toast({
        title: 'Info',
        description:
          'No attendance record found for this date. You can create a new one.'
      });
    } else if (attendanceError) {
      toast({
        title: 'Error',
        description: `Error fetching attendance data: ${attendanceError.message}`,
        variant: 'destructive'
      });
    }
  }, [attendanceError, toast]);

  useEffect(() => {
    if (selectedGroup) {
      refetchStudents();
      refetchAttendance().catch((error) =>
        console.error('Error refetching attendance:', error)
      );
    }
  }, [selectedGroup, attendanceDate, refetchStudents, refetchAttendance]);

  const handleGroupChange = (value: string) => setSelectedGroup(value);
  const handleDateChange = (date: Date | undefined) =>
    date && setAttendanceDate(date);
  const handleToggleAbsent = (student) =>
    setAbsentStudents((prev) =>
      prev.some((s) => s.id === student.id)
        ? prev.filter((s) => s.id !== student.id)
        : [...prev, student]
    );
  const handleOpenConfirmDialog = () => setConfirmDialogOpen(true);
  const handleCloseConfirmDialog = () => setConfirmDialogOpen(false);
  const handleConfirmSubmit = async () => {
    try {
      await takeAttendance({
        variables: {
          groupId: selectedGroup,
          date: attendanceDate.toISOString().split('T')[0],
          absentStudentIds: absentStudents.map((student) => student.id)
        }
      });
      refetchAttendance().catch((error) =>
        console.error('Error refetching attendance after submission:', error)
      );
    } catch (error) {
      console.error('Error submitting attendance:', error);
    }
  };

  if (groupsError || studentsError) {
    toast({
      title: 'Error',
      description: 'Error loading data. Please refresh.',
      variant: 'destructive'
    });
    return null;
  }

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Take Attendance</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-lg bg-card p-4 shadow">
            <GroupSelector
              groups={groupsData?.groups || []}
              selectedGroup={selectedGroup}
              onChange={handleGroupChange}
              loading={groupsLoading}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'mt-4 w-full justify-start text-left font-normal',
                    !attendanceDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {attendanceDate ? (
                    format(attendanceDate, 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={attendanceDate}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          {studentsLoading || attendanceLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            studentsData && (
              <div className="rounded-lg bg-card p-4 shadow">
                {!attendanceExists && (
                  <p className="mb-4 text-muted-foreground">
                    No attendance record found for this date. You can create a
                    new one.
                  </p>
                )}
                <StudentList
                  students={studentsData.students}
                  absentStudents={absentStudents}
                  onToggleAbsent={handleToggleAbsent}
                  onSubmit={handleOpenConfirmDialog}
                  loading={takeAttendanceLoading}
                />
              </div>
            )
          )}
        </div>
        <div className="rounded-lg bg-card p-4 shadow">
          <AbsentStudentList absentStudents={absentStudents} />
        </div>
      </div>
      <ConfirmationDialog
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleConfirmSubmit}
        absentStudents={absentStudents}
      />
    </div>
  );
}

function AttendanceViewWrapper() {
  return (
    <ApolloProvider client={client}>
      <AttendanceView />
    </ApolloProvider>
  );
}

export default AttendanceViewWrapper;
