import React from 'react';
import { useQuery } from '@apollo/client';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { GET_LEAVES } from './LeaveService';
import Results from './Results';

function ListView() {
  const { toast } = useToast();

  const { data, loading, error, refetch } = useQuery(GET_LEAVES, {
    variables: { type: 'ALL' },
    errorPolicy: 'all'
  });
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    toast({
      title: 'Error',
      description: 'Something went wrong. Please try again.',
      variant: 'destructive'
    });
    return (
      <div className="text-center text-muted-foreground">
        An error occurred. Please try again later.
      </div>
    );
  }

  if (data) {
    return (
      <div className="mt-6">
        <Results leaves={data.leaves} refetch={refetch} />
      </div>
    );
  }

  return null;
}

export default ListView;
