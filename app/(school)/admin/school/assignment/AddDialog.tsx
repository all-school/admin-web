import React, { useState } from 'react';
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
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import AddSendDialog from './AddSendDialog';

interface AssignmentData {
  title: string;
  description: string;
  dueDateTime: Date | null;
  closeDateTime: Date | null;
}

interface AddDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSave?: (assignmentData: AssignmentData, recipients: any[] | null) => void;
}

const AddDialog: React.FC<AddDialogProps> = ({
  open,
  setOpen,
  onSave = () => {} // Provide a default no-op function
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [dueTime, setDueTime] = useState<string>('');
  const [closeDateEnabled, setCloseDateEnabled] = useState(false);
  const [closeDate, setCloseDate] = useState<Date | undefined>(undefined);
  const [closeTime, setCloseTime] = useState<string>('');
  const [addSendDialogOpen, setAddSendDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    if (title.trim() === '') {
      toast({
        title: 'Error',
        description: 'Please enter a title for the assignment.',
        variant: 'destructive'
      });
      return;
    }

    const assignmentData: AssignmentData = {
      title,
      description,
      dueDateTime:
        dueDate && dueTime
          ? new Date(`${format(dueDate, 'yyyy-MM-dd')}T${dueTime}:00`)
          : null,
      closeDateTime:
        closeDateEnabled && closeDate && closeTime
          ? new Date(`${format(closeDate, 'yyyy-MM-dd')}T${closeTime}:00`)
          : null
    };

    try {
      onSave(assignmentData, null); // Passing null as recipients to indicate it's a draft
      setOpen(false);
      toast({
        title: 'Success',
        description: 'Assignment saved as draft.'
      });
    } catch (error) {
      console.error('Error saving assignment:', error);
      toast({
        title: 'Error',
        description: 'Failed to save assignment. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleSend = () => {
    if (title.trim() === '') {
      toast({
        title: 'Error',
        description: 'Please enter a title for the assignment.',
        variant: 'destructive'
      });
      return;
    }

    if (!dueDate || !dueTime) {
      toast({
        title: 'Error',
        description: 'Please set a due date and time for the assignment.',
        variant: 'destructive'
      });
      return;
    }

    setAddSendDialogOpen(true);
  };

  const handleSaveAssignment = (recipients: any[]) => {
    const assignmentData: AssignmentData = {
      title,
      description,
      dueDateTime:
        dueDate && dueTime
          ? new Date(`${format(dueDate, 'yyyy-MM-dd')}T${dueTime}:00`)
          : null,
      closeDateTime:
        closeDateEnabled && closeDate && closeTime
          ? new Date(`${format(closeDate, 'yyyy-MM-dd')}T${closeTime}:00`)
          : null
    };

    try {
      onSave(assignmentData, recipients);
      setOpen(false);
      toast({
        title: 'Success',
        description: 'Assignment saved and sent.'
      });
    } catch (error) {
      console.error('Error saving and sending assignment:', error);
      toast({
        title: 'Error',
        description: 'Failed to save and send assignment. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Create Assignment</DialogTitle>
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="dueDate"
                    variant={'outline'}
                    className={cn(
                      'w-[280px] justify-start text-left font-normal',
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
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueTime" className="text-right">
                Due Time
              </Label>
              <Input
                id="dueTime"
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="closeDateEnabled"
                checked={closeDateEnabled}
                onCheckedChange={setCloseDateEnabled}
              />
              <Label htmlFor="closeDateEnabled">Enable Close Date</Label>
            </div>
            {closeDateEnabled && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="closeDate" className="text-right">
                    Close Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="closeDate"
                        variant={'outline'}
                        className={cn(
                          'w-[280px] justify-start text-left font-normal',
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
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="closeTime" className="text-right">
                    Close Time
                  </Label>
                  <Input
                    id="closeTime"
                    type="time"
                    value={closeTime}
                    onChange={(e) => setCloseTime(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleSave} variant="outline">
              Save Draft
            </Button>
            <Button onClick={handleSend}>Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddSendDialog
        open={addSendDialogOpen}
        setOpen={setAddSendDialogOpen}
        onSave={handleSaveAssignment}
        assignmentTitle={title}
      />
    </>
  );
};

export default AddDialog;
