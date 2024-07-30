'use client';

import { useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import { useUserStore } from '@/stores/userStore';

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const client = useApolloClient();
  const { currentUser, fetchCurrentUser } = useUserStore();

  useEffect(() => {
    if (!currentUser) {
      fetchCurrentUser(client);
    }
  }, [client, currentUser, fetchCurrentUser]);

  return <>{children}</>;
}
