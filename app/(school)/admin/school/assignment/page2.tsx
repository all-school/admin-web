'use client';

import React, { useState } from 'react';
import { ApolloProvider, useQuery, gql } from '@apollo/client';
import client from '@/graphql/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const GET_ALL_DETAILS_BY_NAME = gql`
  query search($searchType: [SearchType!]!, $text: String!) {
    search(searchType: $searchType, text: $text) {
      __typename
      ... on Student {
        id
        firstName
        lastName
        profilePicture {
          signedUrl
        }
      }
      ... on Group {
        id
        name
        profilePicture {
          signedUrl
        }
      }
    }
  }
`;

function HiComponent() {
  const [searchText, setSearchText] = useState('');

  // Apollo Client Query
  const { data, loading, error, refetch } = useQuery(GET_ALL_DETAILS_BY_NAME, {
    variables: {
      searchType: ['STUDENT', 'GROUP'],
      text: searchText
    },
    skip: true // Skip initial query execution
  });

  // Handle search button click
  const handleSearch = () => {
    if (searchText.trim() !== '') {
      refetch();
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-start space-y-6 p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="search" className="text-sm font-medium text-gray-700">
            Enter Search Text:
          </Label>
          <Input
            id="search"
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Enter name..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button variant="outline" onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>
        {error && <p className="text-red-500">Error: {error.message}</p>}
      </div>

      <div className="w-full max-w-3xl">
        {loading && <p className="text-gray-500">Loading...</p>}
        {!loading && data && data.search.length === 0 && (
          <p className="text-gray-500">No results found.</p>
        )}
        {!loading && data && data.search.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.search.map((result: any) => (
              <Card
                key={result.id}
                className="rounded-lg border shadow-sm hover:shadow-lg"
              >
                <CardHeader className="flex items-center p-4">
                  <img
                    src={
                      result.profilePicture
                        ? result.profilePicture.signedUrl
                        : '/default-avatar.png'
                    }
                    alt={`${result.__typename} avatar`}
                    className={cn(
                      'h-16 w-16 rounded-full object-cover',
                      result.__typename === 'Student'
                        ? 'border-green-500'
                        : 'border-blue-500'
                    )}
                  />
                  <CardTitle className="ml-4">
                    {result.__typename === 'Student' ? (
                      <p className="text-lg font-semibold text-gray-800">
                        {result.firstName} {result.lastName}
                      </p>
                    ) : (
                      <p className="text-lg font-semibold text-gray-800">
                        {result.name}
                      </p>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result.__typename === 'Student' && (
                    <p className="text-sm text-gray-500">
                      Student ID: {result.id}
                    </p>
                  )}
                  {result.__typename === 'Group' && (
                    <p className="text-sm text-gray-500">
                      Group ID: {result.id}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AssignmentPage() {
  return (
    <ApolloProvider client={client}>
      <HiComponent />
    </ApolloProvider>
  );
}
