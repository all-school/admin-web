// File: components/Timetable/DeleteDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useMutation } from '@apollo/client';
import { useToast } from '@/components/ui/use-toast';
import { DELETE_FROM_TIMETABLE } from './TimetableService';

interface DeleteDialogProps {
  title: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  recurrence: string;
  id: string;
  handleTimetable: (start: string, end: string) => void;
  rangeStartDateTimeValue: string;
  rangeEndDateTimeValue: string;
  onCancel: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  title,
  open,
  setOpen,
  recurrence,
  id,
  handleTimetable,
  rangeStartDateTimeValue,
  rangeEndDateTimeValue,
  onCancel
}) => {
  const { toast } = useToast();
  const [recurringEventType, setRecurringEventType] =
    React.useState('THIS_EVENT');

  const [deleteFromTimetable, { loading: deleteFromTimetableLoading }] =
    useMutation(DELETE_FROM_TIMETABLE, {
      onCompleted() {
        toast({
          title: 'Period deleted',
          description:
            'The period has been successfully deleted from the timetable.'
        });
        setOpen(false);
        onCancel();
        handleTimetable(rangeStartDateTimeValue, rangeEndDateTimeValue);
      },
      onError(error) {
        toast({
          title: 'Error',
          description: 'Something went wrong. Please try again.',
          variant: 'destructive'
        });
        setOpen(false);
        onCancel();
        console.error(error);
      }
    });

  const handleDelete = () => {
    deleteFromTimetable({
      variables: {
        id: id,
        recurringEventType:
          recurrence === 'Custom' ? recurringEventType : undefined
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {recurrence === 'Custom' ? (
          <RadioGroup
            value={recurringEventType}
            onValueChange={setRecurringEventType}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="THIS_EVENT" id="this-event" />
              <Label htmlFor="this-event">This event</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="THIS_AND_FOLLOWING_EVENTS"
                id="this-and-following"
              />
              <Label htmlFor="this-and-following">
                This and following events
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ALL_EVENTS" id="all-events" />
              <Label htmlFor="all-events">All events</Label>
            </div>
          </RadioGroup>
        ) : (
          <p className="text-sm text-gray-500">
            Period will be deleted from timetable permanently.
          </p>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={deleteFromTimetableLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteFromTimetableLoading}
          >
            {deleteFromTimetableLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
