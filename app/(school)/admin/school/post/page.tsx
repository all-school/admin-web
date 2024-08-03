'use client';

import React from 'react';
import { useQuery } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';
import client from '@/graphql/client';
import { CURRENT_USER } from '@/graphql/useraccounts';
import Header from './Header';
import Timeline from './Timeline';

function PostView() {
  const { data, refetch } = useQuery(CURRENT_USER);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {data?.myCurrentUserAccount && (
        <Header
          useraccount={data.myCurrentUserAccount}
          refetch={refetch}
          profileurl={data.myCurrentUserAccount.school.profilePicture}
          coverPicture={data.myCurrentUserAccount.school.coverPicture}
        />
      )}
      <main className="flex-grow overflow-auto">
        <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {data?.myCurrentUserAccount && (
            <Timeline
              school={data.myCurrentUserAccount.school}
              role={data.myCurrentUserAccount.role}
              userName={data.myCurrentUserAccount.user}
              headline={data.myCurrentUserAccount.headline}
              pic={data.myCurrentUserAccount.user.profilePicture?.signedUrl}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default function PostViewWrapper() {
  return (
    <ApolloProvider client={client}>
      <PostView />
    </ApolloProvider>
  );
}
