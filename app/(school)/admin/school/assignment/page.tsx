'use client';

import React, { useState } from 'react';
import { ApolloProvider, useQuery, useMutation } from '@apollo/client';
import client from '@/graphql/client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  GET_ASSIGNMENTS,
  DELETE_ASSIGNMENT,
  CREATE_ASSIGNMENT,
  CREATE_AND_SEND_ASSIGNMENT,
  SEND_ASSIGNMENT
} from './AssignmentService';
import AddDialog from './AddDialog';
import SendDialog from './SendDialog';
import DeleteDialog from './DeleteDialog';
import Header from './Header';
import Results from './Results';
import Draft from './Draft';
import Assigned from './Assigned';
import { useToast } from '@/components/ui/use-toast';

function AssignmentPageContent() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notifyMail, setNotifyMail] = useState(true);
  const [checkSender, setCheckSender] = useState(false);
  const [value, setValue] = useState([]);
  const [currentTab, setCurrentTab] = useState('all');
  const [selectedValue, setSelectedValue] = useState('School');
  const { toast } = useToast();

  const idToBeSent = React.useRef(null);
  const idToBeDeleted = React.useRef(null);

  const { data, loading, error, refetch } = useQuery(GET_ASSIGNMENTS, {
    variables: { type: currentTab.toUpperCase() },
    errorPolicy: 'all'
  });

  const [deleteAssignment, { loading: deleteLoading }] = useMutation(
    DELETE_ASSIGNMENT,
    {
      onCompleted: () => {
        toast({
          title: 'Success',
          description: 'Assignment deleted successfully'
        });
        setDeleteDialogOpen(false);
        refetch();
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: 'Failed to delete assignment. Please try again.',
          variant: 'destructive'
        });
        console.error('Delete Assignment Error:', error);
      }
    }
  );

  const [createAssignment] = useMutation(CREATE_ASSIGNMENT, {
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Assignment created successfully'
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create assignment. Please try again.',
        variant: 'destructive'
      });
      console.error('Create Assignment Error:', error);
    }
  });

  const [createAndSendAssignment] = useMutation(CREATE_AND_SEND_ASSIGNMENT, {
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Assignment created and sent successfully'
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create and send assignment. Please try again.',
        variant: 'destructive'
      });
      console.error('Create and Send Assignment Error:', error);
    }
  });

  const [sendAssignment, { loading: sendAssignmentLoading }] = useMutation(
    SEND_ASSIGNMENT,
    {
      onCompleted: () => {
        toast({
          title: 'Success',
          description: 'Assignment sent successfully'
        });
        setSendDialogOpen(false);
        refetch();
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: 'Failed to send assignment. Please try again.',
          variant: 'destructive'
        });
        console.error('Send Assignment Error:', error);
      }
    }
  );

  const handleDelete = async () => {
    if (!idToBeDeleted.current) return;
    try {
      await deleteAssignment({
        variables: { id: idToBeDeleted.current }
      });
    } catch (error) {
      console.error('Delete Assignment Error:', error);
    }
  };

  const handleSave = async (assignmentData, recipients) => {
    try {
      const mutationVariables = {
        title: assignmentData.title,
        description: assignmentData.description,
        attachments: assignmentData.attachments,
        dueDateTime: assignmentData.dueDateTime,
        points: assignmentData.points
      };

      // Only include closeDateTime if it's provided
      if (assignmentData.closeDateTime) {
        mutationVariables.closeDateTime = assignmentData.closeDateTime;
      }

      if (recipients === null) {
        // Saving as draft
        await createAssignment({
          variables: mutationVariables
        });
      } else {
        // Saving and sending
        await createAndSendAssignment({
          variables: {
            ...mutationVariables,
            sendTo: recipients.map((recipient) => ({
              receiverType: recipient.__typename.toUpperCase(),
              receiverId: recipient.id
            })),
            notifyByEmail: notifyMail
          }
        });
      }
      setAddDialogOpen(false);
      toast({
        title: 'Success',
        description:
          recipients === null
            ? 'Assignment saved as draft'
            : 'Assignment created and sent successfully'
      });
      refetch();
    } catch (error) {
      console.error('Save Assignment Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to save assignment. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleSendAssignment = (recipients, notifyByEmail) => {
    if (!idToBeSent.current) return;
    sendAssignment({
      variables: {
        assignmentId: idToBeSent.current,
        sendTo: recipients,
        notifyByEmail
      }
    });
  };

  const tabs = [
    { value: 'all', label: 'ALL' },
    { value: 'draft', label: 'DRAFT' },
    { value: 'assigned', label: 'ASSIGNED' }
  ];

  const handleSend = (id) => {
    idToBeSent.current = id;
    setSendDialogOpen(true);
  };

  const handleRemove = (id) => {
    idToBeDeleted.current = id;
    setDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    toast({
      title: 'Error',
      description: 'Something went wrong. Please try again.',
      variant: 'destructive'
    });
    console.error('GraphQL Error:', error);
    return <div>Error loading assignments. Please try again.</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto">
        <Header setAddDialogOpen={setAddDialogOpen} />
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="all">
            {data && (
              <Results
                assignments={data.assignments}
                handleRemove={handleRemove}
                handleSend={handleSend}
                refetch={refetch}
              />
            )}
          </TabsContent>
          <TabsContent value="draft">
            <Draft handleRemove={handleRemove} handleSend={handleSend} />
          </TabsContent>
          <TabsContent value="assigned">
            <Assigned handleRemove={handleRemove} handleSend={handleSend} />
          </TabsContent>
        </Tabs>

        <AddDialog
          open={addDialogOpen}
          setOpen={setAddDialogOpen}
          onSave={handleSave}
        />

        <SendDialog
          title="Send assignment"
          open={sendDialogOpen}
          setOpen={setSendDialogOpen}
          onSend={handleSendAssignment} // Changed from handleAssign to onSend
          value={value}
          setValue={setValue}
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
          notifyMail={notifyMail}
          setNotifyMail={setNotifyMail}
          checkSender={checkSender}
          setCheckSender={setCheckSender}
          assignmentId={idToBeSent.current}
        />

        <DeleteDialog
          title="Delete Assignment?"
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          handleDelete={handleDelete}
          deleteLoading={deleteLoading}
          recordId={idToBeDeleted.current}
        />
      </div>
    </div>
  );
}

export default function AssignmentPage() {
  return (
    <ApolloProvider client={client}>
      <AssignmentPageContent />
    </ApolloProvider>
  );
}
