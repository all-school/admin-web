'use client';

import { ApolloProvider } from '@apollo/client';
import client from '@/graphql/client';
import { SignInForm } from './SignInForm';

export default function SignInFormWithApollo() {
  return (
    <ApolloProvider client={client}>
      <SignInForm />
    </ApolloProvider>
  );
}
