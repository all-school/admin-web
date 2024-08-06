'use client';

import { ApolloProvider } from '@apollo/client';
import client from '@/graphql/client';

import Groups from './Groups';
import Students from './Students';
import Teachers from './Teachers';
import Users from './Users';
import Admins from './Admins';
import LatestPosts from './LatestPosts';
import UpcomingEvents from './(components)/UpcomingEvents';
import AbsenteesByGroup from './AbsenteesByGroup';

export default function DashboardPage() {
  return (
    <ApolloProvider client={client}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12">
          <div className="col-span-full lg:col-span-3">
            <UpcomingEvents />
          </div>
          <div className="col-span-full lg:col-span-3">
            <AbsenteesByGroup />
          </div>
          <div className="col-span-full lg:col-span-6">
            <LatestPosts />
          </div>
          <div className="col-span-full sm:col-span-1 lg:col-span-3">
            <Groups />
          </div>
          <div className="sm:col-span-1 lg:col-span-2">
            <Students />
          </div>
          <div className="sm:col-span-1 lg:col-span-2">
            <Teachers />
          </div>
          <div className="sm:col-span-1 lg:col-span-2">
            <Users />
          </div>
          <div className="sm:col-span-1 lg:col-span-3">
            <Admins />
          </div>
        </div>
      </div>
    </ApolloProvider>
  );
}
