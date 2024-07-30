// Response.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { useLazyQuery } from '@apollo/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { MoreVertical, Receipt } from 'lucide-react';
import dayjs from 'dayjs';
import { VIEW_RECEIPT } from './PaymentService';

interface ResponseProps {
  payment: any;
  paymentAccounts: any[];
  refetch: () => void;
}

const Response: React.FC<ResponseProps> = ({
  payment,
  paymentAccounts,
  refetch
}) => {
  const { toast } = useToast();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [studentPaymentReceipt, { loading: studentPaymentReceiptLoading }] =
    useLazyQuery(VIEW_RECEIPT, {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
      onCompleted(data) {
        if (data?.studentPaymentReceipt) {
          if (data.studentPaymentReceipt.returnStatus) {
            window.open(data.studentPaymentReceipt.receiptUrl);
          } else {
            toast({
              title: 'Error',
              description: 'Something went wrong. Please try again.',
              variant: 'destructive'
            });
          }
        }
      },
      onError() {
        toast({
          title: 'Error',
          description: 'Something went wrong. Please try again.',
          variant: 'destructive'
        });
      }
    });

  const handleViewReceipt = () => {
    studentPaymentReceipt({
      variables: {
        studentPaymentId: payment.id
      }
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4">
        <Avatar>
          <AvatarImage src={payment.student.profilePicture?.signedUrl} />
          <AvatarFallback>{`${payment.student.firstName[0]}${payment.student.lastName[0]}`}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Link
            href={{
              pathname: `/admin/school/payment/submission/${payment.id}`
            }}
          >
            <h3 className="text-lg font-semibold hover:underline">
              {payment.student.firstName} {payment.student.lastName}
            </h3>
          </Link>
          {payment.status === 'SUCCEEDED' ? (
            <p className="text-sm text-muted-foreground">
              Paid on {dayjs(payment.respondedAt).format('MMMM D, YYYY h:mm A')}
            </p>
          ) : (
            <Badge variant="destructive">UNPAID</Badge>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                handleViewReceipt();
                toast({
                  title: 'Receipt',
                  description: 'Receipt is getting ready...'
                });
              }}
              disabled={
                payment.status !== 'SUCCEEDED' || studentPaymentReceiptLoading
              }
            >
              <Receipt className="mr-2 h-4 w-4" />
              <span>View Receipt</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
    </Card>
  );
};

export default Response;
