// File: [id]/Details.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload, Delete } from '@/lib/fileHandlers';
import { useToast } from '@/components/ui/use-toast';

const Details = ({ teacher, refetch }) => {
  const [uploading, setUploading] = useState(false);
  const [deletingPic, setDeletingPic] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        await Upload(
          file,
          teacher.id,
          'TEACHER_PROFILE_PICTURE',
          refetch,
          setUploading
        );
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to upload profile picture. Please try again.',
          variant: 'destructive'
        });
      }
    }
  };

  const handleDeletePicture = async () => {
    if (teacher.profilePicture) {
      try {
        await Delete(
          teacher.id,
          teacher.profilePicture.id,
          'TEACHER_PROFILE_PICTURE',
          refetch,
          setDeletingPic
        );
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete profile picture. Please try again.',
          variant: 'destructive'
        });
      }
    }
  };

  return (
    <div className="grid h-[calc(100vh-200px)] grid-cols-1 gap-6 overflow-auto p-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Profile Picture</h3>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Avatar className="h-32 w-32">
            <AvatarImage src={teacher.profilePicture?.signedUrl} />
            <AvatarFallback>
              {teacher.firstName[0]}
              {teacher.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="mt-4 space-y-2">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="profile-picture-upload"
              disabled={uploading}
            />
            <label
              htmlFor="profile-picture-upload"
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload Picture'}
            </label>
            {teacher.profilePicture && (
              <Button
                onClick={handleDeletePicture}
                variant="destructive"
                disabled={deletingPic}
              >
                {deletingPic ? 'Deleting...' : 'Remove Picture'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Key Information</h3>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="font-medium text-gray-500">First Name</dt>
              <dd>{teacher.firstName}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Last Name</dt>
              <dd>{teacher.lastName}</dd>
            </div>
            {/* Add more teacher details here as needed */}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

export default Details;
