// app/(school)/admin/school/payment/submission/[studentPaymentId]/page.tsx
'use client';

import React from 'react';
import { ApolloProvider, useQuery } from '@apollo/client';
import client from '@/graphql/client';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { GET_STUDENT_PAYMENT_BY_ID } from './StudentPaymentService';
import Header from './Header';
import StudentPayment from './StudentPayment';

function PaymentStudentDetailContent() {
  const { toast } = useToast();
  const params = useParams();
  const recordId = params.studentPaymentId as string;

  const { data, loading, refetch, error } = useQuery(
    GET_STUDENT_PAYMENT_BY_ID,
    {
      variables: { id: recordId },
      errorPolicy: 'all'
    }
  );

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

  if (data) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-4xl">
          <Header
            paymentId={data.studentPayment.payment.id}
            paymentAccounts={[]}
          />
          {data.studentPayment && (
            <div className="mt-6">
              <StudentPayment
                studentPayment={data.studentPayment}
                refetch={refetch}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

export default function PaymentStudentDetailView() {
  return (
    <ApolloProvider client={client}>
      <PaymentStudentDetailContent />
    </ApolloProvider>
  );
}
