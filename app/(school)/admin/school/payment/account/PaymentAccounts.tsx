// PaymentAccounts.tsx
import React from 'react';
import { useMutation } from '@apollo/client';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, CreditCard } from 'lucide-react';
import { GET_PAYMENT_ACCOUNT_CONTINUE_ONBOARD } from './PaymentService';

interface PaymentAccountProps {
  paymentAccount: any;
}

const PaymentAccounts: React.FC<PaymentAccountProps> = ({ paymentAccount }) => {
  const { toast } = useToast();

  const [
    paymentAccountContinueOnboard,
    { loading: paymentAccountContinueOnboardLoading }
  ] = useMutation(GET_PAYMENT_ACCOUNT_CONTINUE_ONBOARD, {
    onCompleted(data) {
      if (data?.paymentAccountContinueOnboard?.returnStatus) {
        window.location.href =
          data.paymentAccountContinueOnboard.accountLinkUrl;
      } else {
        toast({
          title: 'Error',
          description: 'Something went wrong. Please try again.',
          variant: 'destructive'
        });
      }
    },
    onError() {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const handlePaymentAccountContinueOnboard = () => {
    paymentAccountContinueOnboard({
      variables: {
        accountId: paymentAccount.accountId,
        returnUrl: `${process.env.NEXT_PUBLIC_ADMIN_URL}/school/paymentaccounts`,
        refreshUrl: `${process.env.NEXT_PUBLIC_ADMIN_URL}/school/paymentaccounts/onboardrefresh`
      }
    });
  };

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 bg-primary text-primary-foreground">
            <AvatarFallback>
              <CreditCard className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <p className="font-semibold">{paymentAccount.accountName}</p>
            <div className="text-sm text-muted-foreground">
              <span>
                Charges {paymentAccount.chargesEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <span className="mx-2">|</span>
              <span>
                Payouts {paymentAccount.payoutsEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>
        {!paymentAccount.onboardingComplete && (
          <Button
            variant="outline"
            size="sm"
            onClick={handlePaymentAccountContinueOnboard}
            disabled={paymentAccountContinueOnboardLoading}
          >
            {paymentAccountContinueOnboardLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resuming
                onboard
              </>
            ) : (
              'Resume onboard'
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentAccounts;
