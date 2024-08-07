'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, ApolloProvider } from '@apollo/client';
import { useToast } from '@/components/ui/use-toast';
import client from '@/graphql/client';
import {
  GET_STUDENT_BY_ID,
  RESEND_INVITATION,
  UPDATE_STUDENT
} from './StudentDetailService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Edit, Loader2 } from 'lucide-react';
import Details from './Details';
import Attendance from './Attendance';
import UserAccess from './UserAccess';
import EditDialog from './EditDialog';
import dayjs from 'dayjs';

const StudentDetailsContent = ({ params }) => {
  const studentId = params.id;
  const [currentTab, setCurrentTab] = useState('profile');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data, loading, error, refetch } = useQuery(GET_STUDENT_BY_ID, {
    variables: { id: studentId },
    errorPolicy: 'all'
  });

  const [updateStudent, { loading: updateStudentLoading }] = useMutation(
    UPDATE_STUDENT,
    {
      onCompleted() {
        toast({
          title: 'Success',
          description: 'Student updated successfully',
          variant: 'default'
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
        console.error('Update student error:', error);
      }
    }
  );

  const [resendInvitation] = useMutation(RESEND_INVITATION, {
    onCompleted() {
      toast({
        title: 'Success',
        description: 'Invitation email has been resent',
        variant: 'default'
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
    updateStudent({
      variables: {
        studentId: studentId,
        firstName: values.firstName,
        lastName: values.lastName,
        dob: dayjs(values.dob).format('YYYY-MM-DD') + 'T00:00:00.000Z',
        bloodGroup: values.bloodGroup,
        fatherName: values.fatherName,
        motherName: values.motherName
      }
    });
  };

  const handleResend = (value) => {
    resendInvitation({ variables: { userAccessId: value } });
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  if (error)
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  if (!data || !data.student)
    return <div className="p-4">No student data found</div>;

  const { student } = data;
  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <h1 className="truncate text-2xl font-bold">
          {student.firstName} {student.lastName}
        </h1>
        <Button onClick={handleEdit} size="sm">
          <Edit className="mr-2 h-4 w-4" /> Edit
        </Button>
      </div>

      <Tabs
        value={currentTab}
        onValueChange={setCurrentTab}
        className="flex flex-grow flex-col"
      >
        <TabsList className="border-b px-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="useraccess">Access</TabsTrigger>
        </TabsList>
        <div className="flex-grow overflow-auto p-1">
          <TabsContent value="profile" className="mt-0 h-full">
            <Details student={student} refetch={refetch} />
          </TabsContent>
          <TabsContent value="attendance" className="mt-0 h-full">
            <Attendance student={student} />
          </TabsContent>
          <TabsContent value="useraccess" className="mt-0 h-full">
            <UserAccess student={student} handleResend={handleResend} />
          </TabsContent>
        </div>
      </Tabs>

      <EditDialog
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        handleUpdate={handleUpdate}
        student={student}
        loading={updateStudentLoading}
      />
    </div>
  );
};

const StudentDetailsView = ({ params }) => {
  return (
    <ApolloProvider client={client}>
      <StudentDetailsContent params={params} />
    </ApolloProvider>
  );
};

export default StudentDetailsView;
