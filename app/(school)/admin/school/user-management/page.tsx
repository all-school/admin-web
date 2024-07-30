'use client';
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from '@/graphql/client';
import UserManagementView from './UserManagementView';

const UserManagementPage: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <UserManagementView />
    </ApolloProvider>
  );
};

export default UserManagementPage;
