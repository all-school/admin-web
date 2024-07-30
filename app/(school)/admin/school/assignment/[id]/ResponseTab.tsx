import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_STUDENT_ASSIGNMENT_BY_ASSIGNMENT } from './AssignmentService';
import { useToast } from '@/components/ui/use-toast';
import Results from './Results';

interface ResponseTabProps {
  assignmentId: string;
}

const ResponseTab: React.FC<ResponseTabProps> = ({ assignmentId }) => {
  const { toast } = useToast();

  const { data, loading, error, refetch } = useQuery(
    GET_STUDENT_ASSIGNMENT_BY_ASSIGNMENT,
    {
      variables: { assignmentId },
      errorPolicy: 'all'
    }
  );

  if (loading) return <div>Loading responses...</div>;

  if (error) {
    toast({
      title: 'Error',
      description: 'Failed to load responses. Please try again.',
      variant: 'destructive'
    });
    return <div>Error loading responses.</div>;
  }

  return (
    <Results
      assignments={data?.studentAssignmentsByAssignment || []}
      refetch={refetch}
    />
  );
};

export default ResponseTab;
