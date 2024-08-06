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
      <div className="flex min-h-screen flex-col border-0">
        <Header onNewStudent={() => setIsNewStudentModalOpen(true)} />
        <main className="flex-grow overflow-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">
            <Results
              isNewStudentModalOpen={isNewStudentModalOpen}
              setIsNewStudentModalOpen={setIsNewStudentModalOpen}
            />
          </div>
        </main>
      </div>
    </ApolloProvider>
  );
}

export default StudentListView;
