// app/admin/school/form/SendDialog.tsx
'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SEND_FORM } from './FormService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';

interface SendDialogProps {
  open: boolean;
  onClose: () => void;
  formId: string | null;
  onSend: () => void;
}

export default function SendDialog({
  open,
  onClose,
  formId,
  onSend
}: SendDialogProps) {
  const [recipients, setRecipients] = useState('');
  const [notifyByEmail, setNotifyByEmail] = useState(true);
  const { toast } = useToast();

  const [sendForm, { loading }] = useMutation(SEND_FORM, {
    onCompleted: () => {
      toast({
        title: 'Form sent successfully',
        description: 'The form has been sent to the specified recipients.'
      });
      onSend();
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error sending form',
        description: error.message
      });
    }
  });

  const handleSend = () => {
    if (!formId) return;
    sendForm({
      variables: {
        formId,
        sendTo: recipients.split(',').map((r) => r.trim()),
        notifyByEmail
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Form</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Enter recipients (comma-separated)"
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <Checkbox
              id="notifyByEmail"
              checked={notifyByEmail}
              onCheckedChange={(checked) =>
                setNotifyByEmail(checked as boolean)
              }
            />
            <label htmlFor="notifyByEmail">Notify by email</label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
