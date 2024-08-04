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
import { Edit, Trash2, Settings, MoreVertical, Users, Eye } from 'lucide-react';
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
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="relative p-0">
        {group.coverPicture && (
          <div className="relative h-40 sm:h-48">
            <Image
              src={group.coverPicture.signedUrl}
              alt={group.name}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 hover:scale-105"
            />
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 bg-white/80 backdrop-blur-sm"
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
      <CardContent className="flex-grow p-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12 ring-2 ring-primary ring-offset-2">
            <AvatarImage
              src={group.profilePicture?.signedUrl}
              alt={group.name}
            />
            <AvatarFallback>
              {group.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{group.name}</h3>
            <p className="text-sm text-muted-foreground">
              {groupTypeMap[group.type] || group.type}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t p-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="mr-2 h-4 w-4" />
          <span>{group.noOfStudents} students</span>
        </div>
        <Link href={`${pathname}/${group.id}`} passHref>
          <Button variant="outline" size="sm" className="ml-2">
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default GroupCard;
