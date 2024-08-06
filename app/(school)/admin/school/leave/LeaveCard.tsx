import React, { useState } from 'react';
import Link from 'next/link';
import { useMutation } from '@apollo/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ThumbsDown, MoreVertical } from 'lucide-react';
import { APPROVE_LEAVE } from './LeaveService';
import dayjs from 'dayjs';

interface LeaveCardProps {
  leave: any;
  refetch: () => void;
}

function LeaveCard({ leave, refetch }: LeaveCardProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [approveLeave] = useMutation(APPROVE_LEAVE, {
    onCompleted(data) {
      const action =
        data.approveLeave.status === 'APPROVED' ? 'approved' : 'rejected';
      toast({
        title: `Leave ${action}`,
        description: `The leave has been successfully ${action}.`
      });
      refetch();
      setIsLoading(false);
    },
    onError(error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
      setIsLoading(false);
    }
  });

  const handleLeaveAction = (approved: boolean) => {
    setIsLoading(true);
    approveLeave({
      variables: {
        id: leave.id,
        approved
      }
    });
  };

  const statusColors = {
    REJECTED: 'destructive',
    APPROVED: 'success',
    PENDING: 'warning'
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={leave.student.profilePicture?.signedUrl} />
              <AvatarFallback>{`${leave.student.firstName.charAt(
                0
              )}${leave.student.lastName.charAt(0)}`}</AvatarFallback>
            </Avatar>
            <div>
              <Link
                href={`/app/school/leave/${leave.id}`}
                className="font-medium hover:underline"
              >
                {leave.student.firstName} {leave.student.lastName}
              </Link>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">{leave.summary}</span>
              </p>
            </div>
          </div>
          <div className="mt-2 text-sm text-muted-foreground sm:mt-0">
            {dayjs(leave.from).format('MMM D, YYYY')} | {leave.noOfDays}{' '}
            {leave.noOfDays === 1 ? 'day' : 'days'}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-start justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
          <Label
            variant={statusColors[leave.status]}
            className="rounded px-2 py-1 text-xs"
          >
            {leave.status}
          </Label>
          {leave.status === 'PENDING' && (
            <div className="flex space-x-2">
              <Button
                onClick={() => handleLeaveAction(true)}
                disabled={isLoading}
              >
                {!isLoading ? 'Approve' : 'Processing...'}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleLeaveAction(false)}>
                    <ThumbsDown className="mr-2 h-4 w-4" />
                    <span>Reject</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default LeaveCard;
