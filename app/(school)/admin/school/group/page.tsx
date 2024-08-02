'use client';
import React, { useRef, useState, useCallback } from 'react';
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
  const idRefs = useRef({ update: null, delete: null, attendanceType: null });
  const [dialogState, setDialogState] = useState({
    add: false,
    edit: false,
    delete: false,
    attendanceType: false
  });
  const { data, loading, error, refetch } = useQuery(GET_GROUPS, {
    errorPolicy: 'all'
  });
  const [deleteGroup, { loading: deleteGroupLoading }] = useMutation(
    DELETE_GROUP,
    {
      onCompleted: (data) => {
        if (!data.deleteGroup.error) {
          toast({
            title: 'Success',
            description: 'Group deleted successfully'
          });
          refetch();
          setDialogState((prev) => ({ ...prev, delete: false }));
        } else {
          toast({
            title: 'Error',
            description: data.deleteGroup.error || 'Failed to delete group',
            variant: 'destructive'
          });
        }
      },
      onError: (error) =>
        toast({
          title: 'Error',
          description:
            error.message || 'Something went wrong. Please try again',
          variant: 'destructive'
        })
    }
  );

  const handleDialogOpen = useCallback((dialogType, id = null) => {
    setDialogState((prev) => ({ ...prev, [dialogType]: true }));
    if (id) idRefs.current[dialogType === 'edit' ? 'update' : dialogType] = id;
  }, []);

  const handleDialogClose = useCallback(
    (dialogType) =>
      setDialogState((prev) => ({ ...prev, [dialogType]: false })),
    []
  );
  const handleDelete = useCallback(
    (value) => deleteGroup({ variables: { groupId: value } }),
    [deleteGroup]
  );

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  if (error) {
    toast({
      title: 'Error',
      description: 'Something went wrong. Please try again',
      variant: 'destructive'
    });
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <Results
        groups={data?.groups || []}
        handleRemove={(id) => handleDialogOpen('delete', id)}
        handleEdit={(id) => handleDialogOpen('edit', id)}
        handleSetAttendanceType={(id) => handleDialogOpen('attendanceType', id)}
      />
      <AddDialog
        title="New group"
        open={dialogState.add}
        setOpen={() => handleDialogClose('add')}
        groupsRefetch={refetch}
      />
      <EditGroupDialog
        title="Edit group"
        open={dialogState.edit}
        setOpen={() => handleDialogClose('edit')}
        groupId={idRefs.current.update}
      />
      <DeleteDialog
        title="Delete group?"
        open={dialogState.delete}
        setOpen={() => handleDialogClose('delete')}
        handleDelete={handleDelete}
        groupId={idRefs.current.delete}
        deleteGroupLoading={deleteGroupLoading}
      />
      <SetAttendanceTypeDialog
        title="Set attendance type"
        open={dialogState.attendanceType}
        setOpen={() => handleDialogClose('attendanceType')}
        groupId={idRefs.current.attendanceType}
      />
    </div>
  );
}

export default function GroupExViewWrapper() {
  return (
    <ApolloProvider client={client}>
      <GroupExView />
    </ApolloProvider>
  );
}
