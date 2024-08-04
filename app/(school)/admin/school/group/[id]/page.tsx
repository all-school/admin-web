'use client';
import { ApolloProvider } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { CURRENT_USER } from '@/graphql/useraccounts';
import client from '@/lib/apolloClient';
import Group from './Group';
import { Loader2 } from 'lucide-react';

function GroupExView({ params }: { params: { id: string } }) {
  const { data, loading, error } = useQuery(CURRENT_USER);

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center text-red-500">
        Error loading user data
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-100">
      {data?.myCurrentUserAccount && (
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Group groupId={params.id} useraccount={data.myCurrentUserAccount} />
        </div>
      )}
    </div>
  );
}

export default function GroupExViewWrapper({
  params
}: {
  params: { id: string };
}) {
  return (
    <ApolloProvider client={client}>
      <GroupExView params={params} />
    </ApolloProvider>
  );
}
