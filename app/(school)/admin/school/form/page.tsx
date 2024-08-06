'use client';

import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import client from '@/graphql/client';
import Header from './Header';
import FormListContent from './FormListContent';

export default function FormListView() {
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <ApolloProvider client={client}>
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header />
        <main className="w-full flex-grow">
          <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <FormListContent
              isSendDialogOpen={isSendDialogOpen}
              setIsSendDialogOpen={setIsSendDialogOpen}
              isDeleteDialogOpen={isDeleteDialogOpen}
              setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            />
          </div>
        </main>
      </div>
    </ApolloProvider>
  );
}
