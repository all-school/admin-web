// page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { ApolloProvider, useQuery } from '@apollo/client';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { GET_PAYMENT_ACCOUNTS } from './PaymentService';
import PaymentList from './PaymentList';
import Header from './Header'; // Make sure this import is correct
import client from '@/graphql/client';

function PaymentsContent() {
  const [paymentAccounts, setPaymentAccounts] = useState([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const { data, loading, error } = useQuery(GET_PAYMENT_ACCOUNTS, {
    variables: { type: 'ONBOARDED' },
    errorPolicy: 'all'
  });

  useEffect(() => {
    if (data?.paymentAccounts.length > 0) {
      setPaymentAccounts(data.paymentAccounts);
    }
  }, [data?.paymentAccounts]);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h2 className="text-xl font-semibold">
          An error occurred. Please try again.
        </h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <Header
          setAddDialogOpen={setAddDialogOpen}
          isCreateButtonEnabled={data?.paymentAccounts.length > 0}
        />
        {data?.paymentAccounts.length === 0 ? (
          <div className="mx-auto mt-4 max-w-sm">
            <Card>
              <CardContent>
                <h3 className="text-center text-lg font-semibold">
                  No stripe accounts onboarded
                </h3>
                <div className="mb-2 mt-4">
                  <p>
                    all.school partners with Stripe for secure payments. In
                    order for school to receive payments, school needs to
                    onboard into Stripe. Go to
                    <Link
                      href="/admin/school/paymentaccounts"
                      className="mx-1 text-primary hover:underline"
                    >
                      Payment Accounts
                    </Link>
                    to add stripe account.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <PaymentList paymentAccounts={paymentAccounts} />
        )}
      </div>
    </div>
  );
}

export default function PaymentsView() {
  return (
    <ApolloProvider client={client}>
      <PaymentsContent />
    </ApolloProvider>
  );
}
