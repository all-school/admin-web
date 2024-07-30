// app/admin/school/form/create/page.tsx
'use client';

import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from '@/graphql/client';
import CreateFormContent from './CreateFormContent';

function CreateFormPage() {
  return (
    <ApolloProvider client={client}>
      <div className="flex h-screen flex-col bg-gray-100">
        <div className="flex-grow overflow-auto">
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <CreateFormContent />
          </div>
        </div>
      </div>
    </ApolloProvider>
  );
}

export default CreateFormPage;
