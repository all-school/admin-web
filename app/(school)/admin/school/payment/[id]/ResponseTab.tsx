// ResponseTab.tsx
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Loader2 } from 'lucide-react';
import { GET_STUDENT_PAYMENTS_BY_PAYMENT } from './PaymentService';
import Response from './Response';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

const PAGINATION_POST_ITEMS_PER_PAGE = 10;

interface ResponseTabProps {
  paymentId: string;
  paymentAccounts: any[];
}

const ResponseTab: React.FC<ResponseTabProps> = ({
  paymentId,
  paymentAccounts
}) => {
  const { toast } = useToast();
  const [data, setData] = useState([]);
  const [lastCursor, setLastCursor] = useState('');
  const [hasMore, setHasMore] = useState(false);

  const {
    data: queryData,
    loading,
    fetchMore,
    refetch,
    error
  } = useQuery(GET_STUDENT_PAYMENTS_BY_PAYMENT, {
    variables: { paymentId: paymentId, first: PAGINATION_POST_ITEMS_PER_PAGE },
    errorPolicy: 'all'
  });

  useEffect(() => {
    if (queryData?.studentPaymentsByPayment && data.length === 0) {
      setData(
        queryData.studentPaymentsByPayment.edges.map((payment) => payment.node)
      );
      setLastCursor(queryData.studentPaymentsByPayment.pageInfo.startCursor);
      setHasMore(queryData.studentPaymentsByPayment.pageInfo.hasNext);
    }
  }, [queryData]);

  const fetchMoreData = () => {
    if (fetchMore) {
      fetchMore({
        variables: {
          paymentId: paymentId,
          first: PAGINATION_POST_ITEMS_PER_PAGE,
          afterCursor: lastCursor
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return prevResult;
          }
          setData([
            ...data,
            ...fetchMoreResult.studentPaymentsByPayment.edges.map(
              (payment) => payment.node
            )
          ]);
          setLastCursor(
            fetchMoreResult.studentPaymentsByPayment.pageInfo.startCursor
          );
          setHasMore(fetchMoreResult.studentPaymentsByPayment.pageInfo.hasNext);
        }
      });
    }
  };

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
      <div className="flex h-64 items-center justify-center">
        <p className="text-lg font-semibold">Not Found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((payment) => (
        <Response
          key={payment.id}
          payment={payment}
          paymentAccounts={paymentAccounts}
          refetch={refetch}
        />
      ))}
      {hasMore && (
        <div className="mt-4 flex justify-center">
          <Button onClick={fetchMoreData}>Load More</Button>
        </div>
      )}
    </div>
  );
};

export default ResponseTab;
