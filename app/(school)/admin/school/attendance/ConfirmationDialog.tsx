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

function ConfirmationDialog({ open, onClose, onConfirm, absentStudents }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Absentees</DialogTitle>
          <DialogDescription>
            {absentStudents.length > 0 ? (
              <>
                <p className="text-sm">
                  The following students will be marked as absent:
                </p>
                <ul className="mt-2 space-y-1">
                  {absentStudents.map((student) => (
                    <li key={student.id} className="text-sm">
                      {`${student.firstName} ${student.lastName}`}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-sm">
                No students are marked as absent. All students will be marked as
                present.
              </p>
            )}
          </DialogDescription>
        </DialogHeader>
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
