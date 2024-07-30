'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { gql } from '@apollo/client';
import apolloClient from '@/lib/apolloClient';
import { useToast } from '@/components/ui/use-toast';
import { useUserStore } from '@/stores/userStore';
import { Loader2, User, UserPlus, UserMinus, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const SIGN_OUT = gql`
  mutation {
    signOut
  }
`;

const CHECK_AUTH = gql`
  query {
    me {
      id
      firstName
      lastName
      email
      profilePicture {
        url
      }
    }
  }
`;

const MY_USER_ACCOUNTS = gql`
  query {
    myUserAccounts {
      id
      email
      user {
        id
        firstName
        lastName
        profilePicture {
          signedUrl
        }
      }
      school {
        id
        name
      }
      userType
      linkedTo {
        __typename
        ... on Person {
          id
          firstName
          lastName
          profilePicture {
            signedUrl
          }
        }
      }
      role
      status
      isPrimary
    }
  }
`;

const SET_USER = gql`
  mutation setCurrentUserAccount($userAccessId: ID!) {
    setCurrentUserAccount(userAccessId: $userAccessId) {
      id
      email
      user {
        id
        firstName
        lastName
      }
      school {
        id
        name
      }
      userType
      linkedTo {
        __typename
        ... on Person {
          id
          firstName
          lastName
        }
      }
      role
      status
      isPrimary
    }
  }
`;

let authCheckPerformed = false;

const getInitials = (firstName: string, lastName: string) => {
  const firstInitial =
    firstName && firstName.length > 0 ? firstName[0].toUpperCase() : '';
  const lastInitial =
    lastName && lastName.length > 0 ? lastName[0].toUpperCase() : '';
  return firstInitial + lastInitial || 'U'; // 'U' for Unknown if both are empty
};

export function UserNav() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(!authCheckPerformed);
  const [userAccountsData, setUserAccountsData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const user = useUserStore((state) => state.user);
  const setUserData = useUserStore((state) => state.setUserData);
  const clearUserData = useUserStore((state) => state.clearUserData);

  useEffect(() => {
    const checkAuth = async () => {
      if (authCheckPerformed) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await apolloClient.query({
          query: CHECK_AUTH,
          fetchPolicy: 'network-only'
        });
        if (data.me) {
          setUserData({ user: data.me });
          fetchUserAccounts();
        } else {
          clearUserData();
          router.push('/signin');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        clearUserData();
        router.push('/signin');
      } finally {
        setLoading(false);
        authCheckPerformed = true;
      }
    };

    checkAuth();
  }, [router, setUserData, clearUserData]);

  const fetchUserAccounts = async () => {
    try {
      const { data } = await apolloClient.query({
        query: MY_USER_ACCOUNTS,
        fetchPolicy: 'network-only'
      });
      setUserAccountsData(data);
    } catch (error) {
      console.error('Fetch user accounts error:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch user accounts. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await apolloClient.mutate({
        mutation: SIGN_OUT
      });
      clearUserData();
      authCheckPerformed = false;
      router.push('/signin');
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleSwitchAccount = async (userAccessId: string) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: SET_USER,
        variables: { userAccessId }
      });
      const { role } = data.setCurrentUserAccount;
      if (role === 'ADMIN')
        window.location.href = process.env.NEXT_PUBLIC_ADMIN_URL || '/';
      else if (role === 'USER')
        window.location.href = process.env.NEXT_PUBLIC_USER_URL || '/';
      else if (role === 'SUPER_ADMIN')
        window.location.href = process.env.NEXT_PUBLIC_SUPERADMIN_URL || '/';
      fetchUserAccounts();
    } catch (error) {
      console.error('Switch account error:', error);
      toast({
        title: 'Error',
        description: 'Failed to switch account. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement your search logic here
    console.log('Searching for:', searchQuery);
    // You can add your search functionality here, such as navigating to a search results page
    // or filtering content based on the search query
  };

  if (loading) {
    return (
      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  if (!user) {
    return null;
  }

  const getIcon = (userType: string) => {
    switch (userType) {
      case 'STUDENT':
        return <User className="mr-2 h-4 w-4" />;
      case 'SUPPORT_STAFF':
        return <UserPlus className="mr-2 h-4 w-4" />;
      case 'TEACHER':
        return <UserMinus className="mr-2 h-4 w-4" />;
      default:
        return <User className="mr-2 h-4 w-4" />;
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="search"
          placeholder="Search..."
          className="w-[300px] pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
      </form>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user.profilePicture?.url}
                alt={`${user.firstName} ${user.lastName}`}
              />
              <AvatarFallback>
                {getInitials(user.firstName || '', user.lastName || '')}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{`${
                user.firstName || ''
              } ${user.lastName || ''}`}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>New Team</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          {userAccountsData &&
            userAccountsData.myUserAccounts &&
            userAccountsData.myUserAccounts.length > 1 && (
              <>
                <DropdownMenuLabel>Switch to</DropdownMenuLabel>
                <ScrollArea className="h-[200px]">
                  {userAccountsData.myUserAccounts.map(
                    (account: any) =>
                      account.id !== user.id && (
                        <DropdownMenuItem
                          key={account.id}
                          onSelect={() => handleSwitchAccount(account.id)}
                        >
                          <div className="flex items-center">
                            <Avatar className="mr-2 h-8 w-8">
                              <AvatarImage
                                src={
                                  account.userType === 'STUDENT'
                                    ? account.linkedTo?.profilePicture
                                        ?.signedUrl
                                    : account.user?.profilePicture?.signedUrl
                                }
                                alt={
                                  account.userType === 'STUDENT'
                                    ? `${account.linkedTo?.firstName || ''} ${
                                        account.linkedTo?.lastName || ''
                                      }`
                                    : `${account.user?.firstName || ''} ${
                                        account.user?.lastName || ''
                                      }`
                                }
                              />
                              <AvatarFallback>
                                {account.userType === 'STUDENT'
                                  ? getInitials(
                                      account.linkedTo?.firstName || '',
                                      account.linkedTo?.lastName || ''
                                    )
                                  : getInitials(
                                      account.user?.firstName || '',
                                      account.user?.lastName || ''
                                    )}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {account.userType === 'STUDENT'
                                  ? `${account.linkedTo?.firstName || ''} ${
                                      account.linkedTo?.lastName || ''
                                    }`
                                  : account.userType === 'SUPPORT_STAFF'
                                  ? 'Administrator'
                                  : 'Super Admin'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {account.userType === 'STUDENT' && 'Student '}
                                {account.school?.name || ''}
                              </p>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      )
                  )}
                </ScrollArea>
                <DropdownMenuSeparator />
              </>
            )}
          <DropdownMenuItem onSelect={handleSignOut}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
