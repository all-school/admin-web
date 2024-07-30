'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, ApolloProvider } from '@apollo/client';
import { useToast } from '@/components/ui/use-toast';
import client from '@/graphql/client';
import {
  GET_TEACHER_BY_ID,
  RESEND_INVITATION,
  UPDATE_TEACHER
} from './TeacherDetailService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import Details from './Details';
import UserAccess from './UserAccess';
import EditDialog from './EditDialog';

const TeacherDetailsContent = ({ params }) => {
  const teacherId = params.id;
  const [currentTab, setCurrentTab] = useState('profile');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data, loading, error, refetch } = useQuery(GET_TEACHER_BY_ID, {
    variables: { id: teacherId },
    errorPolicy: 'all'
  });

  const [updateTeacher, { loading: updateTeacherLoading }] = useMutation(
    UPDATE_TEACHER,
    {
      onCompleted() {
        toast({
          title: 'Success',
          description: 'Teacher updated successfully',
          variant: 'success'
        });
        refetch();
        setEditDialogOpen(false);
      },
      onError(error) {
        toast({
          title: 'Error',
          description: 'Something went wrong. Please try again',
          variant: 'destructive'
        });
        console.error('Update teacher error:', error);
      }
    }
  );

  const [resendInvitation] = useMutation(RESEND_INVITATION, {
    onCompleted() {
      toast({
        title: 'Success',
        description: 'Invitation email has been resent',
        variant: 'success'
      });
    },
    onError(error) {
      toast({
        title: 'Error',
        description: 'Failed to resend invitation. Please try again',
        variant: 'destructive'
      });
      console.error('Resend invitation error:', error);
    }
  });

  const handleEdit = () => setEditDialogOpen(true);

  const handleUpdate = (values) => {
    updateTeacher({
      variables: {
        teacherId: teacherId,
        firstName: values.firstName,
        lastName: values.lastName
      }
    });
  };

  const handleResend = (value) => {
    resendInvitation({ variables: { userAccessId: value } });
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;
  if (!data || !data.teacher) return <div>No teacher data found</div>;

  const { teacher } = data;

  return (
    <div className="container mx-auto flex h-screen flex-col p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {teacher.firstName} {teacher.lastName}
        </h1>
        <Button onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" /> Edit
        </Button>
      </div>

      <Tabs
        value={currentTab}
        onValueChange={setCurrentTab}
        className="flex flex-grow flex-col"
      >
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="useraccess">Access</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="flex-grow">
          <Details teacher={teacher} refetch={refetch} />
        </TabsContent>
        <TabsContent value="useraccess" className="flex-grow">
          <UserAccess teacher={teacher} handleResend={handleResend} />
        </TabsContent>
      </Tabs>

      <EditDialog
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        handleUpdate={handleUpdate}
        teacher={teacher}
        loading={updateTeacherLoading}
      />
    </div>
  );
};

const TeacherDetailsView = ({ params }) => {
  return (
    <ApolloProvider client={client}>
      <TeacherDetailsContent params={params} />
    </ApolloProvider>
  );
};

export default TeacherDetailsView;
