import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload, Delete } from '@/lib/fileHandlers';
import { useToast } from '@/components/ui/use-toast';

const Details = ({ student, refetch }) => {
  const [uploading, setUploading] = useState(false);
  const [deletingPic, setDeletingPic] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setUploading(true);
        await Upload(file, student.id, 'STUDENT_PROFILE_PICTURE', refetch);
        toast({
          title: 'Success',
          description: 'Profile picture uploaded successfully.',
          variant: 'default'
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to upload profile picture. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setUploading(false);
      }
    }
  };

  const handleDeletePicture = async () => {
    if (student.profilePicture) {
      try {
        setDeletingPic(true);
        await Delete(
          student.id,
          student.profilePicture.id,
          'STUDENT_PROFILE_PICTURE',
          refetch
        );
        toast({
          title: 'Success',
          description: 'Profile picture removed successfully.',
          variant: 'default'
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete profile picture. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setDeletingPic(false);
      }
    }
  };

  return (
    <div className="w-full space-y-6 p-1">
      <Card className="shadow-md">
        <CardHeader>
          <h3 className="text-xl font-semibold">Profile Picture</h3>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Avatar className="h-40 w-40 border-2 border-gray-200">
            <AvatarImage
              src={student.profilePicture?.signedUrl}
              alt={`${student.firstName} ${student.lastName}`}
            />
            <AvatarFallback className="text-2xl">
              {student.firstName[0]}
              {student.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="mt-6 w-full max-w-xs space-y-4">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="profile-picture-upload"
              accept="image/*"
              disabled={uploading}
            />
            <label
              htmlFor="profile-picture-upload"
              className="inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload New Picture'}
            </label>
            {student.profilePicture && (
              <Button
                onClick={handleDeletePicture}
                variant="outline"
                className="w-full"
                disabled={deletingPic}
              >
                {deletingPic ? 'Removing...' : 'Remove Current Picture'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <h3 className="text-xl font-semibold">Key Information</h3>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <dt className="text-sm font-medium text-gray-500">
                Father's Name
              </dt>
              <dd className="text-base">{student.fatherName}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-sm font-medium text-gray-500">
                Mother's Name
              </dt>
              <dd className="text-base">{student.motherName}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-sm font-medium text-gray-500">Blood Group</dt>
              <dd className="text-base">
                {student.bloodGroup.replace('_', ' ')}
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="text-sm font-medium text-gray-500">
                Date of Birth
              </dt>
              <dd className="text-base">
                {new Date(student.dob).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

export default Details;
