// app/admin/school/form/page.tsx
'use client';

import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import client from '@/graphql/client';
import Header from './Header';
import FormListContent from './FormListContent';

function FormListView() {
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <ApolloProvider client={client}>
      <div className="flex h-screen flex-col bg-gray-100">
        <Header />
        <div className="flex-grow overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <FormListContent
              isSendDialogOpen={isSendDialogOpen}
              setIsSendDialogOpen={setIsSendDialogOpen}
              isDeleteDialogOpen={isDeleteDialogOpen}
              setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            />
          </div>
        </div>
      </div>
    </ApolloProvider>
  );
}

export default FormListView;
