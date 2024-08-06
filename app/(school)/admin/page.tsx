'use client';

import { ApolloProvider } from '@apollo/client';
import client from '@/graphql/client';

import Groups from './Groups';
import Students from './Students';
import Teachers from './Teachers';
import Users from './Users';
import Admins from './Admins';
import LatestPosts from './LatestPosts';
import Leaves from './Leaves';
import AbsenteesByGroup from './AbsenteesByGroup';
import { cn } from '@/lib/utils';
import GridPattern from '@/components/magicui/grid-pattern';
export default function DashboardPage() {
  return (
    <ApolloProvider client={client}>
      <div className="min-h-screen  py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12">
            <div className="sm:col-span-1 lg:col-span-3">
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
            <div className="sm:col-span-2 lg:col-span-9">
              <LatestPosts />
            </div>
            <div className="sm:col-span-1 lg:col-span-3">
              <AbsenteesByGroup />
            </div>
            {/*  <div className="lg:col-span-3 sm:col-span-1">
              <Leaves />
            </div>  */}
          </div>
        </div>
      </div>
    </ApolloProvider>
  );
}
