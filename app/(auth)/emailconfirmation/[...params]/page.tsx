'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApolloProvider, useMutation, gql } from '@apollo/client';
import client from '@/graphql/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

const SET_ACTIVATION_STATUS = gql`
  mutation signUpConfirmation(
    $signUpType: signUpType!
    $userId: ID
    $token: String
  ) {
    signUpConfirmation(signUpType: $signUpType, userId: $userId, token: $token)
  }
`;

const SIGNUP_RESEND_OTP = gql`
  mutation signUpResendConfirmation($signUpType: signUpType!, $userId: ID!) {
    signUpResendConfirmation(signUpType: $signUpType, userId: $userId)
  }
`;

function EmailConfirmationContent({
  userId,
  token
}: {
  userId: string;
  token: string;
}) {
  const [status, setStatus] = useState<
    | 'loading'
    | 'success'
    | 'error'
    | 'invalid_token'
    | 'invalid_user'
    | 'used_email'
  >('loading');
  const router = useRouter();
  const { toast } = useToast();

  const [signUpConfirmation] = useMutation(SET_ACTIVATION_STATUS, {
    onCompleted(data) {
      if (data.signUpConfirmation) {
        setStatus('success');
        toast({
          title: 'Success',
          description: 'Account has been activated successfully'
        });
      }
    },
    onError(error) {
      if (error.graphQLErrors[0]?.message === 'TOKENINVALID') {
        setStatus('invalid_token');
      } else if (error.graphQLErrors[0]?.message.includes('User ID')) {
        setStatus('invalid_user');
      } else if (error.graphQLErrors[0]?.message === 'User not found!') {
        setStatus('invalid_user');
      } else if (
        error.graphQLErrors[0]?.message ===
        'Email address is already confirmed!'
      ) {
        setStatus('used_email');
      } else {
        setStatus('error');
      }
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const [signUpResendConfirmation] = useMutation(SIGNUP_RESEND_OTP, {
    onCompleted(data) {
      if (data.signUpResendConfirmation) {
        toast({
          title: 'Success',
          description: 'Activation email has been sent again successfully.'
        });
      } else {
        toast({
          title: 'Error',
          description: 'Activation email could not be sent.',
          variant: 'destructive'
        });
      }
    },
    onError(error) {
      toast({
        title: 'Error',
        description: 'Your account has already been activated.',
        variant: 'destructive'
      });
    }
  });

  useEffect(() => {
    signUpConfirmation({
      variables: {
        signUpType: 'EMAIL',
        userId,
        token
      }
    });
  }, [userId, token, signUpConfirmation]);

  const handleResend = () => {
    signUpResendConfirmation({
      variables: {
        signUpType: 'EMAIL',
        userId
      }
    });
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Email Confirmation</CardTitle>
      </CardHeader>
      <CardContent>
        {status === 'loading' && (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}
        {status === 'success' && (
          <Alert>
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              Your email address is confirmed and your account has been
              activated successfully.
            </AlertDescription>
          </Alert>
        )}
        {status === 'invalid_token' && (
          <Alert variant="destructive">
            <AlertTitle>Token Invalid</AlertTitle>
            <AlertDescription>
              Your email address is not confirmed. The token may be expired.
              Please try again.
            </AlertDescription>
          </Alert>
        )}
        {status === 'invalid_user' && (
          <Alert variant="destructive">
            <AlertTitle>User Not Found</AlertTitle>
            <AlertDescription>
              The user ID is invalid or the user was not found.
            </AlertDescription>
          </Alert>
        )}
        {status === 'used_email' && (
          <Alert>
            <AlertTitle>Already Confirmed</AlertTitle>
            <AlertDescription>
              This email address is already confirmed and your account has been
              activated.
            </AlertDescription>
          </Alert>
        )}
        {status === 'error' && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              An unexpected error occurred. Please try again later.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        {status === 'success' || status === 'used_email' ? (
          <Button onClick={() => router.push('/signin')}>Go to Login</Button>
        ) : status === 'invalid_token' ? (
          <Button onClick={handleResend}>Resend Confirmation Email</Button>
        ) : status === 'invalid_user' ? (
          <Button onClick={() => router.push('/signup')}>Register</Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}

export default function Page({ params }: { params: { params: string[] } }) {
  const [userId, token] = params.params.slice(-2);

  return (
    <ApolloProvider client={client}>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 via-white to-blue-100 p-4">
        <EmailConfirmationContent userId={userId} token={token} />
      </div>
    </ApolloProvider>
  );
}
