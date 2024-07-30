// app/(school)/admin/school/group/[id]/page.tsx
'use client';
import { ApolloProvider } from '@apollo/client';
import client from '@/lib/apolloClient';
import { useQuery } from '@apollo/client';
import { CURRENT_USER } from '@/graphql/useraccounts';
import Group from './Group';

function GroupExView({ params }) {
  const { data, loading, error } = useQuery(CURRENT_USER);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading user data</div>;
  console.log(params.id);
  return (
    <div className="min-h-screen bg-gray-100">
      {data && (
        <Group groupId={params.id} useraccount={data.myCurrentUserAccount} />
      )}
    </div>
  );
}

export default function GroupExViewWrapper({ params }) {
  return (
    <ApolloProvider client={client}>
      <GroupExView params={params} />
    </ApolloProvider>
  );
}
