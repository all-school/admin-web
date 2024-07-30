// PaymentCard.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import { MoreVertical, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import dayjs from 'dayjs';

interface PaymentCardProps {
  payment: any;
  paymentAccounts: any[];
  handleRemove: (id: string) => void;
  handleAcceptPayment: (id: string, accept: boolean) => void;
  index: number;
  setItemIndex: (index: number) => void;
}

const PaymentCard: React.FC<PaymentCardProps> = ({
  payment,
  paymentAccounts,
  handleRemove,
  handleAcceptPayment,
  index,
  setItemIndex
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4">
        <Avatar className="h-10 w-10">
          {payment.createdBy.user.profilePicture ? (
            <img
              src={payment.createdBy.user.profilePicture.signedUrl}
              alt="User"
            />
          ) : (
            <div className="bg-primary text-primary-foreground">
              {getInitials(
                `${payment.createdBy.user.firstName} ${payment.createdBy.user.lastName}`
              )}
            </div>
          )}
        </Avatar>
        <div className="flex-1">
          <Link href={{ pathname: `/admin/school/payment/${payment.id}` }}>
            <h3 className="text-lg font-semibold hover:underline">
              {payment.title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground">
            by{' '}
            <span className="font-semibold">{`${payment.createdBy.user.firstName} ${payment.createdBy.user.lastName}`}</span>{' '}
            | {payment.formattedCurrency}
            {payment.dueDateTime && (
              <>
                {' '}
                | Due {dayjs(payment.dueDateTime).format(
                  'MMMM D, YYYY h:mm A'
                )}{' '}
                | {payment.noOfResponses}/{payment.noOfRecipients} paid
                {!payment.acceptPayment && (
                  <span className="ml-2 rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">
                    Closed
                  </span>
                )}
              </>
            )}
          </p>
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
                handleAcceptPayment(payment.id, !payment.acceptPayment);
                setItemIndex(index);
              }}
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
              onClick={() => {
                handleRemove(payment.id);
                setItemIndex(index);
              }}
              disabled={!payment.canDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
    </Card>
  );
};

export default PaymentCard;
