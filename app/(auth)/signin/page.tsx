'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const SignInFormWithApollo = dynamic(() => import('./SignInFormWithApollo'), {
  ssr: false
});

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-white to-blue-100">
      <Suspense fallback={<div>Loading...</div>}>
        <SignInFormWithApollo />
      </Suspense>
    </div>
  );
}
