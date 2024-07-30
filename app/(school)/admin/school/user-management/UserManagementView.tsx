import React, { useState, useRef } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useToast } from '@/components/ui/use-toast';
import { GET_USER_ACCESS, RESEND_INVITATION } from './UserManagementService';
import AddDialog from './AddDialog';
import Header from './Header';
import UserManagementList from './UserManagementList';
import DeleteDialog from './DeleteDialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

// Import the MINI_CURRENT_USER query
import { MINI_CURRENT_USER } from '@/graphql/useraccounts';

const UserManagementView: React.FC = () => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const [value, setValue] = useState<any>(null);
  const idToBeRemoved = useRef<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [mail, setMail] = useState('');

  // Query for current user
  const {
    data: currentUserData,
    loading: currentUserLoading,
    error: currentUserError
  } = useQuery(MINI_CURRENT_USER);

  const { data, loading, error, refetch } = useQuery(GET_USER_ACCESS, {
    variables: {
      queryByType: 'SCHOOL'
    },
    errorPolicy: 'all'
  });

  const [resendInvitation] = useMutation(RESEND_INVITATION, {
    onCompleted() {
      toast({ title: 'Success', description: 'Invitation mail resent' });
      refetch();
    },
    onError(error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again',
        variant: 'destructive'
      });
    }
  });

  const handleRemove = (value: string) => {
    setConfirmOpen(true);
    idToBeRemoved.current = value;
  };

  const handleResend = (value: string) => {
    resendInvitation({
      variables: {
        userAccessId: value
      }
    });
  };

  if (loading || currentUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || currentUserError) {
    const errorMessage =
      error?.graphQLErrors[0]?.message ||
      currentUserError?.message ||
      'An unknown error occurred';
    if (errorMessage === 'Access denied!, You need ADMIN rights') {
      toast({
        title: 'Access Denied',
        description: 'You need ADMIN rights to view this page',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    }
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          An error occurred while loading the user management data. Please try
          again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (data?.userAccesses && currentUserData?.myCurrentUserAccount) {
    const { userAccesses } = data;
    const currentUser = currentUserData.myCurrentUserAccount;
    console.log(userAccesses);
    return (
      <div className="container mx-auto py-8">
        <Header setAddDialogOpen={setAddDialogOpen} />
        <UserManagementList
          datas={userAccesses}
          setUserName={setUserName}
          setMail={setMail}
          handleRemove={handleRemove}
          handleResend={handleResend}
          refetch={refetch}
          currentUser={currentUser}
        />
        <AddDialog
          open={addDialogOpen}
          setOpen={setAddDialogOpen}
          refetch={refetch}
        />
        <DeleteDialog
          open={confirmOpen}
          setOpen={setConfirmOpen}
          userId={idToBeRemoved.current || ''}
          refetch={refetch}
          mail={mail}
          name={userName}
        />
      </div>
    );
  }

  return null;
};

export default UserManagementView;
