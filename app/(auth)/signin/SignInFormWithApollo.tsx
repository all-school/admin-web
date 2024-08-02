'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ApolloProvider } from '@apollo/client';
import client from '@/graphql/client';
import { SignInForm } from './SignInForm';
import { useAuthStore } from '@/stores/authStore'; // Adjust this import path as needed

export default function SignInFormWithApollo() {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
    };

    initAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log('User is authenticated, redirecting to admin');
      router.push('/admin');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <div>Loading...</div>; // Replace with your loading component
  }

  if (isAuthenticated) {
    return null; // Prevent rendering while redirecting
  }

  return (
    <ApolloProvider client={client}>
      <SignInForm />
    </ApolloProvider>
  );
}
