// AddAccountDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface AddAccountDialogProps {
  title: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  handlePaymentAccountOnboard: () => void;
  paymentAccountOnboardLoading: boolean;
}

const AddAccountDialog: React.FC<AddAccountDialogProps> = ({
  title,
  open,
  setOpen,
  handlePaymentAccountOnboard,
  paymentAccountOnboardLoading
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            all.school partners with Stripe for secure payments. In order for
            school to receive payments school needs to onboard into Stripe.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            By clicking Onboard, you agree to the{' '}
            <a
              href="https://stripe.com/gb/legal/connect-account"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Connected Account Agreement
            </a>
            , and you certify that the information you provide will be complete
            and correct.
          </p>
        </div>
        <DialogFooter>
          <Button
            onClick={handlePaymentAccountOnboard}
            disabled={paymentAccountOnboardLoading}
          >
            {paymentAccountOnboardLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Onboarding
                with stripe
              </>
            ) : (
              'Onboard with stripe'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddAccountDialog;
