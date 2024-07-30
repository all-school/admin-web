'use client';

import React, { useRef, useState } from 'react';
import { ApolloProvider, useQuery, useMutation } from '@apollo/client';
import { useToast } from '@/components/ui/use-toast';
import AddDialog from './AddDialog';
import EditGroupDialog from './EditGroupDialog';
import SetAttendanceTypeDialog from './SetAttendanceTypeDialog';
import DeleteDialog from './DeleteDialog';
import { Loader2 } from 'lucide-react';
import { GET_GROUPS, DELETE_GROUP } from './GroupExService';
import Results from './Results';

import client from '@/graphql/client';

function GroupExView() {
  const { toast } = useToast();
  const idToBeUpdated = useRef(null);
  const idToBeDeleted = useRef(null);
  const idToBeSetAttendanceType = useRef(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [attendanceTypeDialogOpen, setAttendanceTypeDialogOpen] =
    useState(false);

  const { data, loading, error, refetch } = useQuery(GET_GROUPS, {
    errorPolicy: 'all'
  });

  const [deleteGroup, { loading: deleteGroupLoading }] = useMutation(
    DELETE_GROUP,
    {
      onCompleted(data) {
        if (!data.deleteGroup.error) {
          toast({
            title: 'Success',
            description: 'Group deleted successfully'
          });
          refetch();
          setDeleteDialogOpen(false);
        } else {
          toast({
            title: 'Error',
            description: data.deleteGroup.error || 'Failed to delete group',
            variant: 'destructive'
          });
        }
      },
      onError(error) {
        toast({
          title: 'Error',
          description:
            error.message || 'Something went wrong. Please try again',
          variant: 'destructive'
        });
      }
    }
  );

  const handleEdit = (value) => {
    setEditDialogOpen(true);
    idToBeUpdated.current = value;
  };

  const handleRemove = (value) => {
    setDeleteDialogOpen(true);
    idToBeDeleted.current = value;
  };

  const handleDelete = (value) => {
    deleteGroup({
      variables: {
        groupId: value
      }
    });
  };

  const handleSetAttendanceType = (value) => {
    setAttendanceTypeDialogOpen(true);
    idToBeSetAttendanceType.current = value;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    toast({
      title: 'Error',
      description: 'Something went wrong. Please try again',
      variant: 'destructive'
    });
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-8 pt-8">
      <div className="container mx-auto">
        <div className="mt-8">
          <Results
            groups={data?.groups || []}
            handleRemove={handleRemove}
            handleEdit={handleEdit}
            handleSetAttendanceType={handleSetAttendanceType}
          />
        </div>
        <AddDialog
          title="New group"
          open={addDialogOpen}
          setOpen={setAddDialogOpen}
          groupsRefetch={refetch}
        />
        <EditGroupDialog
          title="Edit group"
          open={editDialogOpen}
          setOpen={setEditDialogOpen}
          groupId={idToBeUpdated.current}
        />
        <DeleteDialog
          title="Delete group?"
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          handleDelete={handleDelete}
          groupId={idToBeDeleted.current}
          deleteGroupLoading={deleteGroupLoading}
        />
        <SetAttendanceTypeDialog
          title="Set attendance type"
          open={attendanceTypeDialogOpen}
          setOpen={setAttendanceTypeDialogOpen}
          groupId={idToBeSetAttendanceType.current}
        />
      </div>
    </div>
  );
}

// Wrap the component with ApolloProvider
export default function GroupExViewWrapper() {
  return (
    <ApolloProvider client={client}>
      <GroupExView />
    </ApolloProvider>
  );
}
