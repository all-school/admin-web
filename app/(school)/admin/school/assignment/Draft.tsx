import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ASSIGNMENTS } from './AssignmentService';
import Results from './Results';
import { useToast } from '@/components/ui/use-toast';

const Draft = ({ handleRemove, handleSend }) => {
  const { toast } = useToast();
  const { data, loading, error } = useQuery(GET_ASSIGNMENTS, {
    variables: { type: 'DRAFT' },
    errorPolicy: 'all'
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    toast({
      title: 'Error',
      description: 'Failed to load draft assignments.',
      variant: 'destructive'
    });
    return <div>Error loading draft assignments.</div>;
  }

  return (
    <Results
      assignments={data?.assignments || []}
      handleRemove={handleRemove}
      handleSend={handleSend}
    />
  );
};

export default Draft;
