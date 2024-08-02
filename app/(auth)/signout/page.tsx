'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { gql } from '@apollo/client';
import client from '@/graphql/client';
import { useAuthStore } from '@/stores/authStore'; // Adjust this import path as needed

const SIGN_OUT = gql`
  mutation {
    signOut
  }
`;

export default function SignOutPage() {
  const router = useRouter();
  const [isSignedOut, setIsSignedOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuthStore();

  useEffect(() => {
    const performSignOut = async () => {
      try {
        const { data } = await client.mutate({
          mutation: SIGN_OUT
        });

        if (data.signOut) {
          logout(); // Clear the auth store
          setIsSignedOut(true);
        } else {
          setError('Sign out failed. Please try again.');
        }
      } catch (error) {
        console.error('Error during sign out:', error);
        setError('An error occurred during sign out. Please try again.');
      }
    };

    performSignOut();
  }, [logout]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        <div className="rounded-lg bg-white p-8 text-center shadow-md">
          <h1 className="mb-4 text-2xl font-bold text-red-600">
            Sign Out Error
          </h1>
          <p className="mb-6">{error}</p>
          <button
            onClick={() => router.refresh()}
            className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!isSignedOut) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="rounded-lg bg-white p-8 text-center shadow-md">
          <h1 className="mb-4 text-2xl font-bold">Signing out...</h1>
          <p>Please wait while we securely sign you out.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="rounded-lg bg-white p-8 text-center shadow-md">
        <h1 className="mb-4 text-2xl font-bold">Signed Out Successfully</h1>
        <p className="mb-6">
          You have been successfully signed out of your account.
        </p>
        <Link
          href="/signin"
          className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          Go to Sign In
        </Link>
      </div>
    </div>
  );
}
