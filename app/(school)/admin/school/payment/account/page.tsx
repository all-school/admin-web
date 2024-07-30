// app/(school)/admin/school/paymentaccounts/page.tsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { ApolloProvider, useQuery, useMutation } from '@apollo/client';
import client from '@/graphql/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import {
  GET_PAYMENT_ACCOUNTS,
  GET_PAYMENT_ACCOUNT_ONBOARD
} from './PaymentService';
import Header from './Header';
import PaymentAccounts from './PaymentAccounts';
import AddAccountDialog from './AddAccountDialog';

function PaymentAccountsContent() {
  const { toast } = useToast();
  const [addAccountDialogOpen, setAddAccountDialogOpen] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_PAYMENT_ACCOUNTS, {
    variables: { type: 'ALL' },
    errorPolicy: 'all'
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const [paymentAccountOnboard, { loading: paymentAccountOnboardLoading }] =
    useMutation(GET_PAYMENT_ACCOUNT_ONBOARD, {
      onCompleted(data) {
        setAddAccountDialogOpen(false);
        if (data?.paymentAccountOnboard?.returnStatus) {
          window.location.href = data.paymentAccountOnboard.accountLinkUrl;
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

  const handlePaymentAccountOnboard = useCallback(() => {
    paymentAccountOnboard({
      variables: {
        returnUrl: `${process.env.NEXT_PUBLIC_ADMIN_URL}/school/paymentaccounts`,
        refreshUrl: `${process.env.NEXT_PUBLIC_ADMIN_URL}/school/paymentaccounts/onboardrefresh`
      }
    });
  }, [paymentAccountOnboard]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    toast({
      title: 'Error',
      description: 'Something went wrong. Please try again.',
      variant: 'destructive'
    });
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-semibold">
          An error occurred. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl">
        <Header setAddAccountDialogOpen={setAddAccountDialogOpen} />
        <div className="mt-6">
          {data?.paymentAccounts.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {data.paymentAccounts.length}{' '}
                {data.paymentAccounts.length === 1 ? 'Record' : 'Records'}{' '}
                found.
              </p>
            </div>
          )}
          {data?.paymentAccounts.length > 0 ? (
            data.paymentAccounts.map((paymentAccount) => (
              <div key={paymentAccount.id} className="mb-4">
                <PaymentAccounts paymentAccount={paymentAccount} />
              </div>
            ))
          ) : (
            <p className="text-center">Sorry, no matching records found</p>
          )}
        </div>
        <AddAccountDialog
          title="Add new account"
          open={addAccountDialogOpen}
          setOpen={setAddAccountDialogOpen}
          handlePaymentAccountOnboard={handlePaymentAccountOnboard}
          paymentAccountOnboardLoading={paymentAccountOnboardLoading}
        />
      </div>
    </div>
  );
}

export default function PaymentAccountsView() {
  return (
    <ApolloProvider client={client}>
      <PaymentAccountsContent />
    </ApolloProvider>
  );
}
