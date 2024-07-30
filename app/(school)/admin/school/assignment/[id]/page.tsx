'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { ApolloProvider, useQuery } from '@apollo/client';
import client from '@/graphql/client';
import { GET_ASSIGNMENT_BY_ID } from './AssignmentService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import Header from './Header';
import AssignmentDetail from './AssignmentDetail';
import ResponseTab from './ResponseTab';
import EditDialog from './EditDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const AssignmentDetailPageContent = () => {
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('assignment');

  const { data, loading, error, refetch } = useQuery(GET_ASSIGNMENT_BY_ID, {
    variables: { id },
    skip: !id,
    errorPolicy: 'all'
  });

  if (loading) return <LoadingSkeleton />;
  if (error) {
    toast({
      title: 'Error',
      description: 'Failed to load assignment details. Please try again.',
      variant: 'destructive'
    });
    return <div>Error loading assignment details.</div>;
  }

  const assignment = data?.assignment;

  return (
    <div className="container mx-auto p-4">
      <Header assignment={assignment} setEditDialogOpen={setEditDialogOpen} />
      <Card className="mt-4">
        <CardContent>
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList>
              <TabsTrigger value="assignment">Assignment</TabsTrigger>
              <TabsTrigger value="submission">
                Submission ({assignment.noOfResponses})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="assignment">
              <AssignmentDetail assignment={assignment} />
            </TabsContent>
            <TabsContent value="submission">
              <ResponseTab assignmentId={id} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <EditDialog
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        assignment={assignment}
        refetch={refetch}
      />
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="container mx-auto p-4">
    <Skeleton className="mb-4 h-10 w-1/4" />
    <Card>
      <CardContent>
        <Skeleton className="mb-4 h-8 w-1/3" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  </div>
);

export default function AssignmentDetailPage() {
  return (
    <ApolloProvider client={client}>
      <AssignmentDetailPageContent />
    </ApolloProvider>
  );
}
