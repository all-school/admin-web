'use client';

import { useQuery, gql } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import apolloClient from '@/lib/apolloClient'; // Adjust this import path as needed

const GET_TODAY_TOTAL_ABSENTEES = gql`
  query GetTodayTotalAbsentees {
    getTodayTotalAbsentees
  }
`;

export function TodayAbsentees() {
  const router = useRouter();

  const { loading, error, data, refetch } = useQuery(
    GET_TODAY_TOTAL_ABSENTEES,
    {
      client: apolloClient,
      fetchPolicy: 'network-only' // This ensures we always get fresh data
    }
  );

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        await apolloClient.query({
          query: gql`
            query {
              me {
                id
              }
            }
          `
        });
      } catch (error) {
        console.error('Authentication error:', error);
        router.push('/signin');
      }
    };

    checkAuthentication();
  }, [router]);

  if (loading)
    return (
      <Card>
        <CardContent>
          <div className="text-2xl font-bold">Loading...</div>
        </CardContent>
      </Card>
    );

  if (error) {
    console.error('GraphQL Error:', error);
    if (error.message.includes('Sign in Required')) {
      router.push('/signin');
    }
    return (
      <Card>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">
            Error: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Today's Absentees</CardTitle>
        <UserX className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{data.getTodayTotalAbsentees}</div>
        <p className="text-xs text-muted-foreground">Total absentees today</p>
      </CardContent>
    </Card>
  );
}
