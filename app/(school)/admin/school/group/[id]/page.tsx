'use client';
import { ApolloProvider } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { CURRENT_USER } from '@/graphql/useraccounts';
import client from '@/lib/apolloClient';
import Group from './Group';

function GroupExView({ params }: { params: { id: string } }) {
  const { data, loading, error } = useQuery(CURRENT_USER);

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center">
        Error loading user data
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100">
      {data?.myCurrentUserAccount && (
        <Group groupId={params.id} useraccount={data.myCurrentUserAccount} />
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
