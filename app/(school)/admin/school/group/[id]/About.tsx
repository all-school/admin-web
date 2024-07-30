import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

function About({ user, group }) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">About</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Description</h4>
            <p className="text-sm text-muted-foreground">
              {group.description || 'No description available'}
            </p>
          </div>
          <div>
            <h4 className="font-medium">Lead Teacher</h4>
            {group.leadTeacher ? (
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage
                    src={group.leadTeacher.profilePicture?.signedUrl}
                    alt={group.leadTeacher.firstName}
                  />
                  <AvatarFallback>
                    {group.leadTeacher.firstName[0]}
                    {group.leadTeacher.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {group.leadTeacher.firstName} {group.leadTeacher.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Lead teacher, {group.name}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No lead teacher available
              </p>
            )}
          </div>
          <div>
            <h4 className="font-medium">Members</h4>
            <p className="text-sm text-muted-foreground">
              {group.noOfStudents
                ? `${group.noOfStudents} member${
                    group.noOfStudents !== 1 ? 's' : ''
                  }`
                : 'No members available'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default About;
