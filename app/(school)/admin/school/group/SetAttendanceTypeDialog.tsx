'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { X, Plus, Loader2 } from 'lucide-react';
import {
  GET_ATTENDANCE_TYPE,
  SET_ATTENDANCE_TYPE,
  CLEAR_ATTENDANCE_TYPE
} from './GroupExService';

const SetAttendanceTypeDialog = ({ open, setOpen, groupId }) => {
  const { toast } = useToast();
  const [type, setType] = useState('SESSION');
  const [sessionName, setSessionName] = useState(['Session 1']);

  const { data, loading, error, refetch } = useQuery(GET_ATTENDANCE_TYPE, {
    variables: { group: groupId },
    skip: !groupId
  });

  const [setAttendanceType, { loading: setLoading }] = useMutation(
    SET_ATTENDANCE_TYPE,
    {
      onCompleted(data) {
        if (data.setAttendanceType.error) {
          toast({
            title: 'Error',
            description: data.setAttendanceType.error,
            variant: 'destructive'
          });
        } else {
          toast({
            title: 'Success',
            description: 'Attendance type set successfully.'
          });
          refetch();
          setOpen(false);
        }
      },
      onError(error) {
        toast({
          title: 'Error',
          description: 'Something went wrong. Please try again',
          variant: 'destructive'
        });
      }
    }
  );

  const [clearAttendanceType, { loading: clearLoading }] = useMutation(
    CLEAR_ATTENDANCE_TYPE,
    {
      onCompleted(data) {
        if (data.clearAttendanceType.error) {
          toast({
            title: 'Error',
            description: data.clearAttendanceType.error,
            variant: 'destructive'
          });
        } else {
          toast({
            title: 'Success',
            description: 'Attendance type cleared successfully.'
          });
          refetch();
          setOpen(false);
        }
      },
      onError(error) {
        toast({
          title: 'Error',
          description: 'Something went wrong. Please try again',
          variant: 'destructive'
        });
      }
    }
  );

  useEffect(() => {
    if (data && data.attendanceType) {
      setType(data.attendanceType.type);
      setSessionName(
        data.attendanceType.type === 'SESSION'
          ? data.attendanceType.sessionName
          : ['Session 1']
      );
    }
  }, [data]);

  const handleSetAttendanceType = () => {
    setAttendanceType({
      variables: {
        group: groupId,
        type: type,
        ...(type === 'SESSION' && { sessionName: sessionName })
      }
    });
  };

  const handleClearAttendanceType = () => {
    clearAttendanceType({
      variables: {
        group: groupId
      }
    });
  };

  const addSession = () => {
    if (sessionName.length < 32) {
      setSessionName([...sessionName, `Session ${sessionName.length + 1}`]);
    }
  };

  const removeSession = (index) => {
    if (sessionName.length > 1) {
      const newSessionName = sessionName.filter((_, i) => i !== index);
      setSessionName(newSessionName);
    }
  };

  if (loading) return null;
  if (error) {
    toast({
      title: 'Error',
      description: 'Failed to fetch attendance type. Please try again.',
      variant: 'destructive'
    });
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Attendance Type</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage
                src={data?.attendanceType.group.profilePicture?.signedUrl}
              />
              <AvatarFallback>
                {data?.attendanceType.group.name[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-bold">{data?.attendanceType.group.name}</span>
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select attendance type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SESSION">Session</SelectItem>
                <SelectItem value="TIMETABLE">Timetable</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {type === 'SESSION' && (
            <div className="space-y-2">
              {sessionName.map((session, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={session}
                    onChange={(e) => {
                      const newSessionName = [...sessionName];
                      newSessionName[index] = e.target.value;
                      setSessionName(newSessionName);
                    }}
                    placeholder="Session name"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeSession(index)}
                    disabled={sessionName.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {sessionName.length < 32 && (
                <Button variant="outline" onClick={addSession}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Session
                </Button>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClearAttendanceType}
            disabled={
              data?.attendanceType.type === 'UNDEF' ||
              clearLoading ||
              setLoading
            }
          >
            {clearLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Clear
          </Button>
          <Button
            onClick={handleSetAttendanceType}
            disabled={
              setLoading ||
              clearLoading ||
              (data?.attendanceType.type === type &&
                JSON.stringify(data?.attendanceType.sessionName) ===
                  JSON.stringify(sessionName))
            }
          >
            {setLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Set
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SetAttendanceTypeDialog;
