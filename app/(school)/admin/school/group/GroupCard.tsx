'use client';

import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Edit, Trash2, Settings, MoreVertical, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const groupTypeMap = {
  ACADEMIC: 'Academic',
  NONACADEMIC: 'Non Academic',
  OTHER: 'Other'
};

const GroupCard = ({
  group,
  handleEdit,
  handleRemove,
  handleSetAttendanceType
}) => {
  const pathname = usePathname();

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="relative p-0">
        {group.coverPicture && (
          <div className="relative h-48">
            <Image
              src={group.coverPicture.signedUrl}
              alt={group.name}
              layout="fill"
              objectFit="cover"
            />
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(group.id)}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleRemove(group.id)}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSetAttendanceType(group.id)}>
              <Settings className="mr-2 h-4 w-4" /> Attendance type
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-4 flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={group.profilePicture?.signedUrl}
              alt={group.name}
            />
            <AvatarFallback>
              {group.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <Link href={`${pathname}/${group.id}`}>
              <h3 className="cursor-pointer text-lg font-semibold hover:underline">
                {group.name}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground">
              {groupTypeMap[group.type] || group.type}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex items-center">
          <Users className="mr-2 h-4 w-4" />
          <span className="text-sm text-muted-foreground">
            {group.noOfStudents} students
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default GroupCard;
