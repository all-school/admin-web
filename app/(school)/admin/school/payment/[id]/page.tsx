// app/(school)/admin/school/payment/[id]/page.tsx
'use client';

import React, { useState } from 'react';
import { ApolloProvider, useQuery } from '@apollo/client';
import client from '@/graphql/client';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Header from './Header';
import PaymentDetail from './PaymentDetail';
import ResponseTab from './ResponseTab';
import {
  GET_PAYMENT_BY_ID,
  DELETE_PAYMENT,
  ACCEPT_PAYMENT
} from './PaymentService';

function PaymentsContent() {
  const { toast } = useToast();
  const params = useParams();
  const paymentId = params.id as string;
  const [currentTab, setCurrentTab] = useState('payment');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data, loading, refetch, error } = useQuery(GET_PAYMENT_BY_ID, {
    variables: { id: paymentId },
    errorPolicy: 'all'
  });

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
        <p className="text-lg font-semibold">Not Found</p>
      </div>
    );
  }

  const handleRemove = (value: string) => {
    setDeleteDialogOpen(true);
  };

  const handleAcceptPayment = (id: string, isAccepted: boolean) => {
    // Implement acceptPayment mutation here
  };

  if (data?.payment) {
    return (
      <div
        className="h-full overflow-auto bg-background p-6"
        id="scrollableDiv"
      >
        <div className="mx-auto max-w-5xl">
          <Header />
          <Tabs
            value={currentTab}
            onValueChange={(value) => setCurrentTab(value)}
            className="mt-6"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="payment">PAYMENT</TabsTrigger>
              <TabsTrigger value="submission">
                SUBMISSION
                <Badge variant="secondary" className="ml-2">
                  {data.payment.noOfResponses}
                </Badge>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="payment">
              <PaymentDetail
                payment={data.payment}
                handleRemove={handleRemove}
                handleAcceptPayment={handleAcceptPayment}
              />
            </TabsContent>
            <TabsContent value="submission">
              <ResponseTab
                paymentId={paymentId}
                paymentAccounts={data.payment.paymentAccounts}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return null;
}

export default function PaymentsDetailView() {
  return (
    <ApolloProvider client={client}>
      <PaymentsContent />
    </ApolloProvider>
  );
}
