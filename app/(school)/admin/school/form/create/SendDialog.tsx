// app/admin/school/form/create/SendDialog.tsx
import React, { useState } from 'react';
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

interface SendDialogProps {
  open: boolean;
  onClose: () => void;
  onSend: (sendTo: any[], notifyByEmail: boolean) => void;
}

export default function SendDialog({ open, onClose, onSend }: SendDialogProps) {
  const [recipients, setRecipients] = useState('');
  const [notifyByEmail, setNotifyByEmail] = useState(true);

  const handleSend = () => {
    const sendTo = recipients
      .split(',')
      .map((r) => ({ receiverType: 'STUDENT', receiverId: r.trim() }));
    onSend(sendTo, notifyByEmail);
    onClose();
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
          <Button onClick={handleSend}>Send</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
