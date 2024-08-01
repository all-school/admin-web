'use client';

import { useState } from 'react';
import { ApolloProvider, useMutation, gql } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import client from '@/graphql/client';

const FORGOT_EMAIL_PASSWORD = gql`
  mutation resetPassword(
    $resetPasswordType: resetPasswordType!
    $phoneNumber: String
    $email: String
  ) {
    resetPassword(
      resetPasswordType: $resetPasswordType
      phoneNumber: $phoneNumber
      email: $email
    ) {
      id
      email
    }
  }
`;

function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const [resetPassword, { loading }] = useMutation(FORGOT_EMAIL_PASSWORD);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await resetPassword({
        variables: {
          resetPasswordType: 'EMAIL',
          email
        }
      });

      if (data?.resetPassword?.id) {
        toast({
          title: 'Password reset email sent',
          description:
            'Please check your inbox for instructions to reset your password.',
          variant: 'default' // Changed from 'success' to 'default'
        });
      } else {
        throw new Error('Failed to send password reset email');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-white to-blue-100">
      <h1 className="mb-4 text-2xl font-bold">Forgot Password</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Sending...' : 'Send reset instructions'}
        </Button>
      </form>
      <Link
        href="/signin"
        className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-500"
      >
        Back to Sign In
      </Link>
    </div>
  );
}

// Wrap the component with ApolloProvider
export default function ForgotPasswordFormWrapper() {
  return (
    <ApolloProvider client={client}>
      <ForgotPasswordForm />
    </ApolloProvider>
  );
}
