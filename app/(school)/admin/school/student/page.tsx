'use client';

import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import Header from './Header';
import Results from './Results';
import client from '@/graphql/client';

function StudentListView() {
  const [isNewStudentModalOpen, setIsNewStudentModalOpen] = useState(false);

  return (
    <ApolloProvider client={client}>
      <div className="flex h-screen flex-col bg-gray-100">
        <Header onNewStudent={() => setIsNewStudentModalOpen(true)} />
        <div className="flex-grow overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Results
              isNewStudentModalOpen={isNewStudentModalOpen}
              setIsNewStudentModalOpen={setIsNewStudentModalOpen}
            />
          </div>
        </div>
      </div>
    </ApolloProvider>
  );
}

export default StudentListView;
