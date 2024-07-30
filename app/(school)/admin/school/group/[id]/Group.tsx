import React, { useState, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import Timeline from './Timeline';
import Members from './Members';
import { REMOVE_MEMBERS, GET_GROUP_BY_ID } from './GroupExService';
import DeleteDialog from './DeleteDialog';
import Header from './Header';

const tabs = [
  { value: 'timeline', label: 'Timeline' },
  { value: 'members', label: 'Members' }
];

function Group({ groupId, useraccount }) {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState('timeline');
  const idToBeDeleted = useRef();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_GROUP_BY_ID, {
    variables: { id: groupId },
    errorPolicy: 'all'
  });

  const [removeMembers] = useMutation(REMOVE_MEMBERS, {
    onCompleted(data) {
      if (data.removeMembers.error) {
        toast({
          title: 'Error',
          description: data.removeMembers.error,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Success',
          description: 'Member removed'
        });
        refetch();
      }
      setDeleteDialogOpen(false);
    },
    onError() {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again',
        variant: 'destructive'
      });
    }
  });

  const handleRemove = (value) => {
    setDeleteDialogOpen(true);
    idToBeDeleted.current = value;
  };

  const handleDelete = (value) => {
    removeMembers({
      variables: {
        groupId: groupId,
        members: [value]
      }
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    toast({
      title: 'Error',
      description: 'Error loading group details',
      variant: 'destructive'
    });
    return <div>Error loading group details.</div>;
  }

  if (!data || !data.group) {
    return null;
  }

  return (
    <div className="flex h-screen flex-col">
      <Header
        group={data.group}
        useraccount={useraccount}
        groupRefetch={refetch}
        profileurl={data.group.profilePicture}
        coverPicture={data.group.coverPicture}
      />
      <div className="flex-grow overflow-hidden">
        <Card className="mx-auto mt-6 h-full max-w-7xl">
          <CardContent className="h-full p-0">
            <Tabs
              value={currentTab}
              onValueChange={setCurrentTab}
              className="flex h-full flex-col"
            >
              <TabsList>
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value="timeline" className="flex-grow overflow-auto">
                <Timeline
                  group={data.group}
                  school={useraccount.school}
                  role={useraccount.role}
                  userName={useraccount.user}
                  headline={useraccount.headline}
                  pic={useraccount.user.profilePicture?.signedUrl}
                />
              </TabsContent>
              <TabsContent value="members" className="flex-grow overflow-auto">
                <TabsContent
                  value="members"
                  className="flex-grow overflow-auto"
                >
                  <Members group={data.group} refetch={refetch} />
                </TabsContent>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <DeleteDialog
        title="Remove member from group?"
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        handleDelete={handleDelete}
        groupId={idToBeDeleted.current}
        refetch={refetch}
      />
    </div>
  );
}

export default Group;
