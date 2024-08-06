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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
      <div className="p-4 text-center text-muted-foreground">
        <p>An error occurred. Please try again later.</p>
        <button
          onClick={() => refetch()}
          className="mt-4 rounded bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 w-full">
      {data?.leaves ? (
        <Results leaves={data.leaves} refetch={refetch} />
      ) : (
        <p className="text-center text-muted-foreground">No leaves found.</p>
      )}
    </div>
  );
}

export default ListView;
