import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ASSIGNMENTS } from './AssignmentService';
import Results from './Results';
import { useToast } from '@/components/ui/use-toast';

const Assigned = ({ handleRemove, handleSend }) => {
  const { toast } = useToast();
  const { data, loading, error } = useQuery(GET_ASSIGNMENTS, {
    variables: { type: 'ASSIGNED' },
    errorPolicy: 'all'
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    toast({
      title: 'Error',
      description: 'Failed to load assigned assignments.',
      variant: 'destructive'
    });
    return <div>Error loading assigned assignments.</div>;
  }

  return (
    <Results
      assignments={data?.assignments || []}
      handleRemove={handleRemove}
      handleSend={handleSend}
    />
  );
};

export default Assigned;
