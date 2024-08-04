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
    <div className="min-h-screen bg-background py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Header setMode={setMode} mode={mode} />
        {mode ? <CalendarView /> : <ListView />}
      </div>
    </div>
  );
}

function LeaveCardViewWrapper() {
  return (
    <ApolloProvider client={client}>
      <div className="h-full w-full">
        <LeaveCardView />
      </div>
    </ApolloProvider>
  );
}

export default LeaveCardViewWrapper;
