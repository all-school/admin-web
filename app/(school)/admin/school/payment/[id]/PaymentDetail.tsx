// app/(school)/admin/school/payment/[id]/PaymentDetail.tsx
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  MoreVertical,
  CheckCircle,
  XCircle,
  Trash2,
  Clock
} from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Extend dayjs with the relativeTime plugin
dayjs.extend(relativeTime);

interface PaymentDetailProps {
  payment: any;
  handleRemove: (id: string) => void;
  handleAcceptPayment: (id: string, accept: boolean) => void;
}

const PaymentDetail: React.FC<PaymentDetailProps> = ({
  payment,
  handleRemove,
  handleAcceptPayment
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4">
        <Avatar>
          <AvatarImage src={payment.createdBy.user.profilePicture?.signedUrl} />
          <AvatarFallback>{`${payment.createdBy.user.firstName[0]}${payment.createdBy.user.lastName[0]}`}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{`${payment.createdBy.user.firstName} ${payment.createdBy.user.lastName}`}</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            {dayjs(payment.createdAt).fromNow()}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                handleAcceptPayment(payment.id, !payment.acceptPayment)
              }
            >
              {payment.acceptPayment ? (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  <span>Stop Payment</span>
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  <span>Accept Payment</span>
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleRemove(payment.id)}
              disabled={!payment.canDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <h2 className="mb-2 text-2xl font-bold">{payment.title}</h2>
        {payment.dueDateTime && (
          <p className="mb-4 text-sm text-muted-foreground">
            Due {dayjs(payment.dueDateTime).format('MMMM D, YYYY h:mm A')}
          </p>
        )}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold">Description</h4>
            <p className="text-muted-foreground">{payment.description}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Amount</h4>
            <p className="text-muted-foreground">{payment.formattedCurrency}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Pay to</h4>
            <p className="text-muted-foreground">{payment.payTo.accountName}</p>
          </div>
        </div>
        {!payment.acceptPayment && (
          <p className="mt-4 text-red-500">No longer accepting payment</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentDetail;
