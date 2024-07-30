// app/admin/school/form/DeleteDialog.tsx
'use client';

import { useMutation } from '@apollo/client';
import { DELETE_FORM } from './FormService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  formId: string | null;
  onDelete: () => void;
}

export default function DeleteDialog({
  open,
  onClose,
  formId,
  onDelete
}: DeleteDialogProps) {
  const { toast } = useToast();

  const [deleteForm, { loading }] = useMutation(DELETE_FORM, {
    onCompleted: () => {
      toast({
        title: 'Form deleted successfully',
        description: 'The form has been permanently removed.'
      });
      onDelete();
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error deleting form',
        description: error.message
      });
    }
  });

  const handleDelete = () => {
    if (!formId) return;
    deleteForm({ variables: { formId } });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Form</DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to delete this form? This action cannot be
          undone.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
