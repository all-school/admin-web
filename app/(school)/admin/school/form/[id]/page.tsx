'use client';

import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { GET_FORM_BY_ID } from './FormUpdateService';
import UpdateForm from './UpdateForm';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import client from '@/graphql/client';

export default function FormUpdateView({ params }: { params: { id: string } }) {
  return (
    <ApolloProvider client={client}>
      <FormUpdateContent params={params} />
    </ApolloProvider>
  );
}

function FormUpdateContent({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const recordId = params.id;

  const { data, loading, error } = useQuery(GET_FORM_BY_ID, {
    variables: { id: recordId },
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
      variant: 'destructive',
      title: 'Error',
      description: 'Something went wrong. Please try again.'
    });
    return <div>Error: {error.message}</div>;
  }

  if (data) {
    return (
      <div className="container mx-auto py-8">
        {data.form === null ? (
          <div>Form not found</div>
        ) : (
          <UpdateForm recordId={recordId} form={data.form} />
        )}
      </div>
    );
  }

  return null;
}
