// app/posts/page.tsx
'use client';

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';
import client from '@/graphql/client';
import { CURRENT_USER } from '@/graphql/useraccounts';
import Header from './Header';
import Timeline from './Timeline';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

const tabs = [{ value: 'timeline', label: 'Timeline' }];

function PostView() {
  const [currentTab, setCurrentTab] = useState('timeline');
  const { data, refetch } = useQuery(CURRENT_USER);

  return (
    <div id="scrollableDiv" className="h-full overflow-auto">
      <div className="min-h-screen bg-background">
        {data && (
          <Header
            useraccount={data.myCurrentUserAccount}
            refetch={refetch}
            profileurl={data.myCurrentUserAccount.school.profilePicture}
            coverPicture={data.myCurrentUserAccount.school.coverPicture}
          />
        )}
        <div className="container mx-auto max-w-7xl">
          <div className="mt-14">
            <Tabs
              defaultValue={currentTab}
              onValueChange={(value) => setCurrentTab(value as string)}
            >
              <TabsList>
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <Separator className="my-4" />
          <div className="py-12">
            {/* Timeline component will be added here later */}

            {data && currentTab === 'timeline' && (
              <Timeline
                school={data.myCurrentUserAccount.school}
                role={data.myCurrentUserAccount.role}
                userName={data.myCurrentUserAccount.user}
                headline={data.myCurrentUserAccount.headline}
                pic={
                  data.myCurrentUserAccount.user.profilePicture !== null &&
                  data.myCurrentUserAccount.user.profilePicture.signedUrl
                }
              />
            )}
          </div>
        </div>
      </div>
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
