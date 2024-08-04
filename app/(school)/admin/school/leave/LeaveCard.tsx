import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const { toast } = useToast();
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  const [approveLeave] = useMutation(APPROVE_LEAVE, {
    onCompleted(data) {
      if (data.approveLeave.status === 'APPROVED') {
        toast({
          title: 'Leave approved',
          description: 'The leave has been successfully approved.'
        });
        refetch();
        setApproveLoading(false);
      } else if (data.approveLeave.status === 'REJECTED') {
        toast({
          title: 'Leave rejected',
          description: 'The leave has been successfully rejected.'
        });
        refetch();
        setRejectLoading(false);
      }
    },
    onError(error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
      setApproveLoading(false);
      setRejectLoading(false);
    }
  });

  const handleApproveLeave = () => {
    setApproveLoading(true);
    approveLeave({
      variables: {
        id: leave.id,
        approved: true
      }
    });
  };

  const handleRejectLeave = () => {
    setRejectLoading(true);
    approveLeave({
      variables: {
        id: leave.id,
        approved: false
      }
    });
  };

  const statusColors = {
    REJECTED: 'destructive',
    APPROVED: 'success'
  };

  return (
    <Card>
      <CardHeader>
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
              className="font-medium"
            >
              {leave.student.firstName} {leave.student.lastName}
            </Link>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">{leave.summary}</span> | From{' '}
              {dayjs(leave.from).format('MMM D, YYYY')} | {leave.noOfDays}{' '}
              {leave.noOfDays === 1 ? 'day' : 'days'}
              {leave.status !== 'PENDING' && (
                <>
                  {' '}
                  |{' '}
                  <Label variant={statusColors[leave.status]}>
                    {leave.status}
                  </Label>
                </>
              )}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end space-x-2">
          {leave.status === 'PENDING' && !rejectLoading && (
            <Button onClick={handleApproveLeave} disabled={approveLoading}>
              {!approveLoading ? 'Approve' : 'Approving...'}
            </Button>
          )}
          {leave.status === 'PENDING' && !rejectLoading && !approveLoading && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleRejectLeave}>
                  <ThumbsDown className="mr-2 h-4 w-4" />
                  <span>Reject</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default LeaveCard;
