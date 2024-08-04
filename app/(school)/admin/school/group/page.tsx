'use client';
import React, { useRef, useState, useCallback } from 'react';
import { ApolloProvider, useQuery, useMutation } from '@apollo/client';
import { useToast } from '@/components/ui/use-toast';
import AddDialog from './AddDialog';
import EditGroupDialog from './EditGroupDialog';
import SetAttendanceTypeDialog from './SetAttendanceTypeDialog';
import DeleteDialog from './DeleteDialog';
import { Loader2, Plus } from 'lucide-react';
import { GET_GROUPS, DELETE_GROUP } from './GroupExService';
import Results from './Results';
import client from '@/graphql/client';
import { Button } from '@/components/ui/button';

const DIALOG_TYPES = {
  ADD: 'add',
  EDIT: 'edit',
  DELETE: 'delete',
  ATTENDANCE_TYPE: 'attendanceType'
};

function GroupExView() {
  const { toast } = useToast();
  const idRefs = useRef({ update: null, delete: null, attendanceType: null });
  const [dialogState, setDialogState] = useState({
    [DIALOG_TYPES.ADD]: false,
    [DIALOG_TYPES.EDIT]: false,
    [DIALOG_TYPES.DELETE]: false,
    [DIALOG_TYPES.ATTENDANCE_TYPE]: false
  });

  const { data, loading, error, refetch } = useQuery(GET_GROUPS, {
    errorPolicy: 'all'
  });

  const [deleteGroup, { loading: deleteGroupLoading }] = useMutation(
    DELETE_GROUP,
    {
      onCompleted: (data) => {
        if (data.deleteGroup && data.deleteGroup.group) {
          toast({
            title: 'Success',
            description: 'Group deleted successfully'
          });
          refetch();
          handleDialogClose(DIALOG_TYPES.DELETE);
        } else {
          toast({
            title: 'Error',
            description: 'Failed to delete group',
            variant: 'destructive'
          });
        }
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description:
            error.message || 'Something went wrong. Please try again',
          variant: 'destructive'
        });
      }
    }
  );

  const handleDialogOpen = useCallback((dialogType, id = null) => {
    setDialogState((prev) => ({ ...prev, [dialogType]: true }));
    if (id) {
      idRefs.current[dialogType === DIALOG_TYPES.EDIT ? 'update' : dialogType] =
        id;
    }
  }, []);

  const handleDialogClose = useCallback((dialogType) => {
    setDialogState((prev) => ({ ...prev, [dialogType]: false }));
  }, []);

  const handleDelete = useCallback(
    (value) => {
      deleteGroup({ variables: { groupId: value } });
    },
    [deleteGroup]
  );

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
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
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="border-b p-4">
        <Button
          onClick={() => handleDialogOpen(DIALOG_TYPES.ADD)}
          className="flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" /> Create New Group
        </Button>
      </div>
      <div className="flex-grow overflow-auto">
        <Results
          groups={data?.groups || []}
          handleRemove={(id) => handleDialogOpen(DIALOG_TYPES.DELETE, id)}
          handleEdit={(id) => handleDialogOpen(DIALOG_TYPES.EDIT, id)}
          handleSetAttendanceType={(id) =>
            handleDialogOpen(DIALOG_TYPES.ATTENDANCE_TYPE, id)
          }
          handleCreate={() => handleDialogOpen(DIALOG_TYPES.ADD)}
        />
      </div>
      <AddDialog
        title="New group"
        open={dialogState[DIALOG_TYPES.ADD]}
        setOpen={() => handleDialogClose(DIALOG_TYPES.ADD)}
        groupsRefetch={refetch}
      />
      <EditGroupDialog
        title="Edit group"
        open={dialogState[DIALOG_TYPES.EDIT]}
        setOpen={() => handleDialogClose(DIALOG_TYPES.EDIT)}
        groupId={idRefs.current.update}
      />
      <DeleteDialog
        title="Delete group?"
        open={dialogState[DIALOG_TYPES.DELETE]}
        setOpen={() => handleDialogClose(DIALOG_TYPES.DELETE)}
        handleDelete={handleDelete}
        groupId={idRefs.current.delete}
        deleteGroupLoading={deleteGroupLoading}
      />
      <SetAttendanceTypeDialog
        title="Set attendance type"
        open={dialogState[DIALOG_TYPES.ATTENDANCE_TYPE]}
        setOpen={() => handleDialogClose(DIALOG_TYPES.ATTENDANCE_TYPE)}
        groupId={idRefs.current.attendanceType}
      />
    </div>
  );
}

function GroupExViewWrapper() {
  return (
    <ApolloProvider client={client}>
      <div className="h-full w-full">
        <GroupExView />
      </div>
    </ApolloProvider>
  );
}

export default GroupExViewWrapper;
