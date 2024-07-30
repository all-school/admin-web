import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, ClockIcon, FileIcon } from 'lucide-react';
import { format } from 'date-fns';

interface AssignmentDetailProps {
  assignment: any;
}

const AssignmentDetail: React.FC<AssignmentDetailProps> = ({ assignment }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-4 flex items-center">
          <Avatar className="mr-3 h-10 w-10">
            <AvatarImage
              src={assignment.createdBy.user.profilePicture?.signedUrl}
            />
            <AvatarFallback>
              {assignment.createdBy.user.firstName[0]}
              {assignment.createdBy.user.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">
              {assignment.createdBy.user.firstName}{' '}
              {assignment.createdBy.user.lastName}
            </p>
            <p className="text-xs text-muted-foreground">
              Created on{' '}
              {format(new Date(assignment.createdAt), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>

        <h2 className="mb-2 text-xl font-semibold">{assignment.title}</h2>
        <p className="mb-4 text-muted-foreground">{assignment.description}</p>

        <div className="mb-4 flex flex-wrap gap-2">
          {assignment.dueDateTime && (
            <Badge variant="secondary" className="flex items-center">
              <CalendarIcon className="mr-1 h-3 w-3" />
              Due{' '}
              {format(new Date(assignment.dueDateTime), 'MMMM d, yyyy h:mm a')}
            </Badge>
          )}
          {assignment.closeDateTime && (
            <Badge variant="secondary" className="flex items-center">
              <ClockIcon className="mr-1 h-3 w-3" />
              Closes{' '}
              {format(
                new Date(assignment.closeDateTime),
                'MMMM d, yyyy h:mm a'
              )}
            </Badge>
          )}
          {assignment.points && (
            <Badge variant="secondary" className="flex items-center">
              <FileIcon className="mr-1 h-3 w-3" />
              {assignment.points} points
            </Badge>
          )}
        </div>

        {assignment.attachments && assignment.attachments.length > 0 && (
          <div>
            <h3 className="mb-2 text-lg font-semibold">Attachments</h3>
            <ul className="list-inside list-disc">
              {assignment.attachments.map((file, index) => (
                <li
                  key={index}
                  className="text-sm text-blue-600 hover:underline"
                >
                  <a href={file.signedUrl} download>
                    {file.fileName}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssignmentDetail;
