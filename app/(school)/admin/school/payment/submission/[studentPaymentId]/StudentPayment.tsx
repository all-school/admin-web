// StudentPayment.tsx
import React from 'react';
import { useLazyQuery } from '@apollo/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Clock, Receipt } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import { VIEW_RECEIPT } from './StudentPaymentService';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'now',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '1mo',
    MM: '%dmo',
    y: '1y',
    yy: '%dy'
  }
});

interface StudentPaymentProps {
  studentPayment: any;
  refetch: () => void;
}

const StudentPayment: React.FC<StudentPaymentProps> = ({
  studentPayment,
  refetch
}) => {
  const { toast } = useToast();

  const [studentPaymentReceipt, { loading: studentPaymentReceiptLoading }] =
    useLazyQuery(VIEW_RECEIPT, {
      onCompleted(data) {
        if (data?.studentPaymentReceipt?.returnStatus) {
          window.open(data.studentPaymentReceipt.receiptUrl);
        } else {
          toast({
            title: 'Error',
            description: 'Something went wrong. Please try again.',
            variant: 'destructive'
          });
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
        studentPaymentId: studentPayment.id
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <Avatar>
              <AvatarImage
                src={
                  studentPayment.payment.createdBy.user.profilePicture
                    ?.signedUrl
                }
              />
              <AvatarFallback>{`${studentPayment.payment.createdBy.user.firstName[0]}${studentPayment.payment.createdBy.user.lastName[0]}`}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{`${studentPayment.payment.createdBy.user.firstName} ${studentPayment.payment.createdBy.user.lastName}`}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-4 w-4" />
                {dayjs(studentPayment.payment.createdAt).fromNow(true)}
              </div>
            </div>
          </div>
          <h2 className="mt-4 text-2xl font-bold">
            {studentPayment.payment.title}
          </h2>
          {studentPayment.payment.dueDateTime && (
            <p className="mt-2 text-sm text-muted-foreground">
              Due{' '}
              {dayjs(studentPayment.payment.dueDateTime).format(
                'MMMM D, YYYY h:mm A'
              )}
            </p>
          )}
          <div className="mt-4 space-y-2">
            <p className="text-sm font-semibold">Description</p>
            <p className="text-sm text-muted-foreground">
              {studentPayment.payment.description}
            </p>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-sm font-semibold">Amount</p>
            <p className="text-sm text-muted-foreground">
              {studentPayment.payment.formattedCurrency}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage
                  src={studentPayment.student.profilePicture?.signedUrl}
                />
                <AvatarFallback>{`${studentPayment.student.firstName[0]}${studentPayment.student.lastName[0]}`}</AvatarFallback>
              </Avatar>
              <p className="font-semibold">{`${studentPayment.student.firstName} ${studentPayment.student.lastName}`}</p>
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
                    studentPayment.status !== 'SUCCEEDED' ||
                    studentPaymentReceiptLoading
                  }
                >
                  <Receipt className="mr-2 h-4 w-4" />
                  <span>View Receipt</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="mt-4">
            {studentPayment.status === 'SUCCEEDED' ? (
              <>
                <Badge variant="success">PAID</Badge>
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-semibold">Paid at</p>
                  <p className="text-sm text-muted-foreground">
                    {dayjs(studentPayment.respondedAt).format(
                      'MMMM D, YYYY h:mm A'
                    )}
                  </p>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-semibold">Paid by</p>
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage
                        src={
                          studentPayment.respondedBy.user.profilePicture
                            ?.signedUrl
                        }
                      />
                      <AvatarFallback>{`${studentPayment.respondedBy.user.firstName[0]}${studentPayment.respondedBy.user.lastName[0]}`}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">{`${studentPayment.respondedBy.user.firstName} ${studentPayment.respondedBy.user.lastName}`}</p>
                      {studentPayment.respondedBy.headline && (
                        <p className="text-xs text-muted-foreground">
                          {studentPayment.respondedBy.headline}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <Badge variant="destructive">UNPAID</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentPayment;
