'use client';

import React from 'react';
import { ApolloProvider, useQuery } from '@apollo/client';
import client from '@/graphql/client';
import { MY_CURRENT_SCHOOL } from './SchoolDetailService';
import UpdateSchool from './UpdateSchool';
import ProfilePicture from './ProfilePicture';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

function SchoolDetailsContent() {
  const { data, loading, error, refetch } = useQuery(MY_CURRENT_SCHOOL);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading school details. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (data && data.myCurrentSchool) {
    return (
      <div className="p-4 md:p-8">
        <h1 className="mb-6 text-3xl font-bold">School Details</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <ProfilePicture datas={data.myCurrentSchool} refetch={refetch} />
          </div>
          <div className="md:col-span-2">
            <UpdateSchool schoolData={data.myCurrentSchool} refetch={refetch} />
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function SchoolDetailsView() {
  return (
    <ApolloProvider client={client}>
      <div className="flex h-screen flex-col bg-background">
        <div className="flex-grow overflow-y-auto">
          <SchoolDetailsContent />
        </div>
      </div>
    </ApolloProvider>
  );
}
