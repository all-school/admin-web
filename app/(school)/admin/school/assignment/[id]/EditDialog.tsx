'use client';

import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { UPDATE_ASSIGNMENT } from './AssignmentService';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDateTime: z.date().optional(),
  closeDateTime: z.date().optional(),
  points: z.number().int().positive().optional()
});

interface EditDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  assignment: any;
  refetch: () => void;
}

const EditDialog: React.FC<EditDialogProps> = ({
  open,
  setOpen,
  assignment,
  refetch
}) => {
  const [title, setTitle] = useState(assignment?.title || '');
  const [description, setDescription] = useState(assignment?.description || '');
  const [dueDate, setDueDate] = useState<Date | undefined>(
    assignment?.dueDateTime ? new Date(assignment.dueDateTime) : undefined
  );
  const [dueTime, setDueTime] = useState(
    assignment?.dueDateTime
      ? format(new Date(assignment.dueDateTime), 'HH:mm')
      : ''
  );
  const [closeDateEnabled, setCloseDateEnabled] = useState(
    !!assignment?.closeDateTime
  );
  const [closeDate, setCloseDate] = useState<Date | undefined>(
    assignment?.closeDateTime ? new Date(assignment.closeDateTime) : undefined
  );
  const [closeTime, setCloseTime] = useState(
    assignment?.closeDateTime
      ? format(new Date(assignment.closeDateTime), 'HH:mm')
      : ''
  );
  const [points, setPoints] = useState(assignment?.points?.toString() || '');
  const { toast } = useToast();

  const [updateAssignment, { loading: updateLoading }] = useMutation(
    UPDATE_ASSIGNMENT,
    {
      onCompleted: () => {
        toast({
          title: 'Success',
          description: 'Assignment updated successfully'
        });
        setOpen(false);
        refetch();
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive'
        });
      }
    }
  );

  useEffect(() => {
    if (open && assignment) {
      setTitle(assignment.title || '');
      setDescription(assignment.description || '');
      setDueDate(
        assignment.dueDateTime ? new Date(assignment.dueDateTime) : undefined
      );
      setDueTime(
        assignment.dueDateTime
          ? format(new Date(assignment.dueDateTime), 'HH:mm')
          : ''
      );
      setCloseDateEnabled(!!assignment.closeDateTime);
      setCloseDate(
        assignment.closeDateTime
          ? new Date(assignment.closeDateTime)
          : undefined
      );
      setCloseTime(
        assignment.closeDateTime
          ? format(new Date(assignment.closeDateTime), 'HH:mm')
          : ''
      );
      setPoints(assignment.points?.toString() || '');
    }
  }, [open, assignment]);

  const handleSave = () => {
    try {
      const dueDateTime =
        dueDate && dueTime
          ? new Date(`${format(dueDate, 'yyyy-MM-dd')}T${dueTime}:00`)
          : undefined;
      const closeDateTime =
        closeDateEnabled && closeDate && closeTime
          ? new Date(`${format(closeDate, 'yyyy-MM-dd')}T${closeTime}:00`)
          : undefined;

      const validatedData = schema.parse({
        title,
        description,
        dueDateTime,
        closeDateTime,
        points: points ? parseInt(points) : undefined
      });

      updateAssignment({
        variables: {
          assignmentId: assignment.id,
          ...validatedData
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast({
            title: 'Validation Error',
            description: err.message,
            variant: 'destructive'
          });
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Assignment</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-right">
              Due Date
            </Label>
            <div className="col-span-3 flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-[240px] justify-start text-left font-normal',
                      !dueDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? (
                      format(dueDate, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-[120px]"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="closeDateEnabled"
              checked={closeDateEnabled}
              onCheckedChange={(checked) =>
                setCloseDateEnabled(checked as boolean)
              }
            />
            <Label htmlFor="closeDateEnabled">Enable Close Date</Label>
          </div>
          {closeDateEnabled && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="closeDate" className="text-right">
                Close Date
              </Label>
              <div className="col-span-3 flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] justify-start text-left font-normal',
                        !closeDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {closeDate ? (
                        format(closeDate, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={closeDate}
                      onSelect={setCloseDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Input
                  type="time"
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                  className="w-[120px]"
                />
              </div>
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="points" className="text-right">
              Points
            </Label>
            <Input
              id="points"
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={updateLoading}>
            {updateLoading ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
