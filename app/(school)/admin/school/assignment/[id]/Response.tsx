import React from 'react';
import { format } from 'date-fns';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface ResponseProps {
  assignment: any;
  refetch: () => void;
}

const Response: React.FC<ResponseProps> = ({ assignment, refetch }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <Avatar>
          <AvatarImage src={assignment.student.profilePicture?.signedUrl} />
          <AvatarFallback>
            {assignment.student.firstName[0]}
            {assignment.student.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <Link
            href={`/admin/school/assignment/submission/${assignment.id}`}
            className="font-semibold hover:underline"
          >
            {assignment.student.firstName} {assignment.student.lastName}
          </Link>
          <p className="text-sm text-muted-foreground">
            {assignment.submittedAt
              ? `Submitted at ${format(
                  new Date(assignment.submittedAt),
                  'MMMM d, yyyy h:mm a'
                )}`
              : 'Not submitted'}
          </p>
        </div>
        <div className="ml-auto">
          {assignment.status === 'GRADED' && <Badge>Graded</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        {assignment.comment && (
          <p className="mb-2 text-sm">{assignment.comment}</p>
        )}
        {assignment.attachments && assignment.attachments.length > 0 && (
          <div>
            <h4 className="mb-1 text-sm font-semibold">Attachments:</h4>
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

export default Response;
