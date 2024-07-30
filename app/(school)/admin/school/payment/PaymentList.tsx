// PaymentList.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react'; // Import Loader2 icon
import PaymentCard from './PaymentCard';
import { GET_PAYMENTS, DELETE_PAYMENT, ACCEPT_PAYMENT } from './PaymentService';
import AddPaymentDialog from './AddPaymentDialog';
import Header from './Header';
import DeleteDialog from './DeleteDialog';

const PAGINATION_POST_ITEMS_PER_PAGE = 10; // Adjust as needed

const PaymentList: React.FC<{ paymentAccounts: any[] }> = ({
  paymentAccounts
}) => {
  const { toast } = useToast();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const idToBeDeleted = useRef<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [lastCursor, setLastCursor] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [itemIndex, setItemIndex] = useState<number | null>(null);

  const {
    data: queryData,
    loading,
    fetchMore,
    refetch,
    error
  } = useQuery(GET_PAYMENTS, {
    variables: {
      queryByType: 'SCHOOL',
      first: PAGINATION_POST_ITEMS_PER_PAGE
    },
    errorPolicy: 'all',
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    if (queryData?.payments && data.length === 0) {
      setData(queryData.payments.edges.map((payment: any) => payment.node));
      setLastCursor(queryData.payments.pageInfo.startCursor);
      setHasMore(queryData.payments.pageInfo.hasNext);
    }
  }, [queryData]);

  const fetchMoreData = () => {
    if (fetchMore) {
      fetchMore({
        variables: {
          queryByType: 'SCHOOL',
          first: PAGINATION_POST_ITEMS_PER_PAGE,
          afterCursor: lastCursor
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return prevResult;
          }
          setData([
            ...data,
            ...fetchMoreResult.payments.edges.map(
              (payment: any) => payment.node
            )
          ]);
          setLastCursor(fetchMoreResult.payments.pageInfo.startCursor);
          setHasMore(fetchMoreResult.payments.pageInfo.hasNext);
        }
      });
    }
  };

  const [deletePayment, { loading: deletePaymentLoading }] = useMutation(
    DELETE_PAYMENT,
    {
      onCompleted(data) {
        if (data?.deletePayment) {
          handleDeletePayment();
          toast({
            title: 'Payment deleted',
            description: 'The payment has been successfully deleted.'
          });
          refetch();
        } else {
          toast({
            title: 'Error',
            description: 'Something went wrong. Please try again.',
            variant: 'destructive'
          });
        }
        setDeleteDialogOpen(false);
      },
      onError(error) {
        toast({
          title: 'Error',
          description: 'Something went wrong. Please try again.',
          variant: 'destructive'
        });
      }
    }
  );

  const handleDeletePayment = () => {
    if (itemIndex !== null) {
      const allPayment = [...data];
      allPayment.splice(itemIndex, 1);
      setData(allPayment);
    }
  };

  const handleRemove = (value: string) => {
    setDeleteDialogOpen(true);
    idToBeDeleted.current = value;
  };

  const handleDelete = () => {
    if (idToBeDeleted.current) {
      deletePayment({
        variables: {
          paymentId: idToBeDeleted.current
        }
      });
    }
  };

  const [acceptPayment] = useMutation(ACCEPT_PAYMENT, {
    onCompleted(data) {
      if (data?.acceptPayment?.acceptPayment === true) {
        toast({
          title: 'Payment opened',
          description: 'The payment is now open for acceptance.'
        });
      } else if (data?.acceptPayment?.acceptPayment === false) {
        toast({
          title: 'Payment closed',
          description: 'The payment is now closed for acceptance.'
        });
      }
      handleUpdatePayment(data.acceptPayment);
      refetch();
    },
    onError(error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const handleUpdatePayment = (updatedPayment: any) => {
    if (itemIndex !== null) {
      const allPayments = [...data];
      allPayments[itemIndex] = updatedPayment;
      setData(allPayments);
    }
  };

  const handleAcceptPayment = (id: string, isAccepted: boolean) => {
    acceptPayment({
      variables: {
        paymentId: id,
        accept: isAccepted
      }
    });
  };

  if (error) {
    toast({
      title: 'Error',
      description: 'Something went wrong. Please try again.',
      variant: 'destructive'
    });
    return (
      <Box className="flex h-screen items-center justify-center">
        <Typography>An error occurred. Please try again.</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto" id="scrollableDiv">
      <div className="container mx-auto px-4">
        {/* <Header setAddDialogOpen={setAddDialogOpen} isCreateButtonEnabled={paymentAccounts.length > 0} /> */}
        {data.length === 0 ? (
          <div className="mt-4">
            <p className="text-center">Sorry, no matching records found</p>
          </div>
        ) : (
          <div>
            {data.map((payment, index) => (
              <div key={payment.id} className="mt-6">
                <PaymentCard
                  payment={payment}
                  paymentAccounts={paymentAccounts}
                  handleRemove={handleRemove}
                  handleAcceptPayment={handleAcceptPayment}
                  index={index}
                  setItemIndex={setItemIndex}
                />
              </div>
            ))}
            {hasMore && (
              <div className="mt-4 flex justify-center">
                <Button onClick={fetchMoreData}>Load More</Button>
              </div>
            )}
          </div>
        )}
      </div>
      <AddPaymentDialog
        open={addDialogOpen}
        setOpen={setAddDialogOpen}
        datas={data}
        setDatas={setData}
        paymentAccounts={paymentAccounts}
        refetch={refetch}
      />
      <DeleteDialog
        title="Delete Payment?"
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        handleDelete={handleDelete}
        deletePaymentLoading={deletePaymentLoading}
      />
    </div>
  );
};

export default PaymentList;
