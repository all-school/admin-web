'use client';

import React, { useState } from 'react';
import { Upload, Delete } from '@/lib/fileHandlers';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Camera, ImagePlus } from 'lucide-react';

const Header = ({ useraccount, refetch, profileurl, coverPicture }) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event, type) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    Upload(
      file,
      useraccount.school.id,
      type === 'profile' ? 'SCHOOL_PROFILE_PICTURE' : 'SCHOOL_COVER_PICTURE',
      refetch,
      setUploading
    );
  };

  const handleDelete = () => {
    Delete(
      useraccount.school.id,
      useraccount.school.coverPicture.id,
      'SCHOOL_COVER_PICTURE',
      refetch,
      () => toast({ title: 'Cover photo removed' })
    );
  };

  return (
    <Card className="mb-4 w-full">
      <div className="relative h-32 sm:h-40 md:h-48 lg:h-56">
        {coverPicture ? (
          <img
            src={useraccount.school?.coverPicture?.signedUrl}
            alt="Cover"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200">
            <ImagePlus className="h-8 w-8 text-gray-400" />
          </div>
        )}
        <div className="absolute bottom-2 right-2 space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => document.getElementById('cover-upload').click()}
            disabled={uploading}
          >
            {coverPicture ? 'Change' : 'Upload'}
          </Button>
          {coverPicture && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={uploading}
            >
              Remove
            </Button>
          )}
        </div>
        <input
          id="cover-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileChange(e, 'cover')}
          disabled={uploading}
        />
      </div>
      <CardContent className="flex items-center p-3">
        <div className="relative -mt-12 mr-4">
          <Avatar className="h-20 w-20 ring-4 ring-background">
            <AvatarImage src={profileurl?.signedUrl} alt="Profile" />
            <AvatarFallback>{useraccount.school.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <label
            htmlFor="profile-upload"
            className="absolute bottom-0 right-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-primary"
          >
            <Camera className="h-3 w-3 text-primary-foreground" />
          </label>
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e, 'profile')}
            disabled={uploading}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-bold text-foreground">
            {useraccount.school.name}
          </h1>
        </div>
      </CardContent>
    </Card>
  );
};

export default Header;
