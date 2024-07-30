'use client';

import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import Header from './Header';
import Results from './Results';
import client from '@/graphql/client';

function TeacherListView() {
  const [isNewTeacherModalOpen, setIsNewTeacherModalOpen] = useState(false);

  return (
    <ApolloProvider client={client}>
      <div className="flex h-[calc(100vh-4rem)] flex-col bg-gray-100">
        <Header onNewTeacher={() => setIsNewTeacherModalOpen(true)} />
        <div className="flex-grow overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Results
              isNewTeacherModalOpen={isNewTeacherModalOpen}
              setIsNewTeacherModalOpen={setIsNewTeacherModalOpen}
            />
          </div>
        </div>
      </div>
    </ApolloProvider>
  );
}

export default TeacherListView;
