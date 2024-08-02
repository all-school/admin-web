'use client';

import React, { useState, Suspense } from 'react';
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Header assignment={assignment} setEditDialogOpen={setEditDialogOpen} />
      <Card className="mt-6 shadow-sm">
        <CardContent className="p-0">
          <Tabs
            value={currentTab}
            onValueChange={setCurrentTab}
            className="w-full"
          >
            <TabsList className="w-full justify-start">
              <TabsTrigger value="assignment" className="flex-1">
                Assignment
              </TabsTrigger>
              <TabsTrigger value="submission" className="flex-1">
                Submission ({assignment.noOfResponses})
              </TabsTrigger>
            </TabsList>
            <div className="p-6">
              <TabsContent value="assignment">
                <Suspense fallback={<LoadingSkeleton />}>
                  <AssignmentDetail assignment={assignment} />
                </Suspense>
              </TabsContent>
              <TabsContent value="submission">
                <Suspense fallback={<LoadingSkeleton />}>
                  <ResponseTab assignmentId={id} />
                </Suspense>
              </TabsContent>
            </div>
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
  <div className="space-y-4">
    <Skeleton className="h-10 w-full max-w-md" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <Skeleton className="h-4 w-1/2" />
  </div>
);

export default function AssignmentDetailPage() {
  return (
    <ApolloProvider client={client}>
      <AssignmentDetailPageContent />
    </ApolloProvider>
  );
}
