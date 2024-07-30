import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  MoreVertical,
  Send,
  Trash,
  Calendar,
  Users,
  Clock,
  FileText,
  AlertTriangle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { format, isAfter, differenceInDays } from 'date-fns';

const AssignmentCard = ({ assignment, handleSend, handleRemove }) => {
  const isDueSoon =
    assignment.dueDateTime &&
    isAfter(new Date(assignment.dueDateTime), new Date()) &&
    isAfter(
      new Date(assignment.dueDateTime),
      new Date(Date.now() + 24 * 60 * 60 * 1000)
    );
  const isOverdue =
    assignment.dueDateTime &&
    isAfter(new Date(), new Date(assignment.dueDateTime));
  const daysUntilDue = assignment.dueDateTime
    ? differenceInDays(new Date(assignment.dueDateTime), new Date())
    : null;
  const submissionRate =
    (assignment.noOfResponses / assignment.noOfRecipients) * 100;

  const getDueDateGradient = () => {
    if (isOverdue) {
      return 'bg-gradient-to-r from-red-500 to-red-300';
    } else if (isDueSoon) {
      return 'bg-gradient-to-r from-yellow-500 to-yellow-300';
    } else {
      return 'bg-gradient-to-r from-green-500 to-green-300';
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={assignment.createdBy.user.profilePicture?.signedUrl}
              />
              <AvatarFallback>{`${assignment.createdBy.user.firstName[0]}${assignment.createdBy.user.lastName[0]}`}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {`${assignment.createdBy.user.firstName} ${assignment.createdBy.user.lastName}`}
              </p>
              <p className="text-xs text-muted-foreground">
                Created on{' '}
                {format(new Date(assignment.createdAt), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {assignment.status === 'DRAFT' && (
                <DropdownMenuItem onClick={() => handleSend(assignment.id)}>
                  <Send className="mr-2 h-4 w-4" />
                  <span>Send</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => handleRemove(assignment.id)}>
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <Link href={`/admin/school/assignment/${assignment.id}`}>
          <CardTitle className="mb-2 cursor-pointer text-xl hover:underline">
            {assignment.title}
          </CardTitle>
        </Link>
        <CardDescription className="mb-4 line-clamp-2 text-sm">
          {assignment.description}
        </CardDescription>
        <div className="mb-4 flex flex-wrap gap-3 text-sm">
          {assignment.dueDateTime && (
            <Badge
              variant="outline"
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-white ${getDueDateGradient()}`}
            >
              {isOverdue ? (
                <Clock className="h-4 w-4" />
              ) : (
                <Calendar className="h-4 w-4" />
              )}
              <span>
                {isOverdue ? 'Overdue' : 'Due'}{' '}
                {format(new Date(assignment.dueDateTime), 'MMM d, h:mm a')}
              </span>
            </Badge>
          )}
          {assignment.points && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 border-purple-300 bg-purple-100 px-2 py-1 text-purple-800"
            >
              <FileText className="h-4 w-4" />
              <span>{assignment.points} points</span>
            </Badge>
          )}
          {daysUntilDue !== null && daysUntilDue > 0 && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 border-blue-300 bg-blue-100 px-2 py-1 text-blue-800"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>
                {daysUntilDue} {daysUntilDue === 1 ? 'day' : 'days'} left
              </span>
            </Badge>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Submission Progress</span>
            <span>
              {assignment.noOfResponses}/{assignment.noOfRecipients} submitted
            </span>
          </div>
          <Progress value={submissionRate} className="w-full" />
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        {assignment.closeDateTime && (
          <p className="text-xs text-muted-foreground">
            Closes on{' '}
            {format(new Date(assignment.closeDateTime), 'MMM d, yyyy h:mm a')}
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default AssignmentCard;
