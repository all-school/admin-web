import React from 'react';
import { useMutation } from '@apollo/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { DELETE_USER_ACCESS } from './UserManagementService';

interface DeleteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  userId: string;
  refetch: () => void;
  mail: string;
  name: string;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  open,
  setOpen,
  userId,
  refetch,
  mail,
  name
}) => {
  const { toast } = useToast();

  const [deleteUserAccess, { loading }] = useMutation(DELETE_USER_ACCESS, {
    onCompleted(data) {
      if (data.deleteUserAccess.id) {
        toast({
          title: 'Access revoked',
          description: 'User access has been revoked successfully.'
        });
        refetch();
      }
    },
    onError(error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const handleDelete = () => {
    deleteUserAccess({
      variables: {
        userAccessId: userId
      }
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Revoke access for this user?</DialogTitle>
          <DialogDescription>
            You are about to revoke site access for {name || mail}
            <br />
            <br />
            This user won't be able to access the site. You can give them access
            at any time.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Revoking...' : 'Revoke'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
