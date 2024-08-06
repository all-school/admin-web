'use client';

import React, { useState } from 'react';
import client from '@/graphql/client';
import { ApolloProvider } from '@apollo/client';
import Header from './Header';
import ListView from './ListView';
import CalendarView from './CalendarView';

function LeaveCardView({ initialMode = false }) {
  const [mode, setMode] = useState(initialMode);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header setMode={setMode} mode={mode} />
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-7xl">
          {mode ? <CalendarView /> : <ListView />}
        </div>
      </main>
    </div>
  );
}

function LeaveCardViewWrapper() {
  return (
    <ApolloProvider client={client}>
      <LeaveCardView />
    </ApolloProvider>
  );
}

export default LeaveCardViewWrapper;
