import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
}

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  absentStudents: Student[];
}

function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  absentStudents
}: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Absentees</DialogTitle>
          <DialogDescription>
            {absentStudents.length > 0
              ? `${absentStudents.length} student(s) will be marked as absent.`
              : 'No students are marked as absent. All students will be marked as present.'}
          </DialogDescription>
        </DialogHeader>
        {absentStudents.length > 0 && (
          <ScrollArea className="mt-2 max-h-[200px] pr-4">
            <ul className="space-y-1">
              {absentStudents.map((student) => (
                <li key={student.id} className="text-sm">
                  {`${student.firstName} ${student.lastName}`}
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm and Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmationDialog;
