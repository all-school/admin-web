import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, School } from 'lucide-react';
import { Upload, Delete } from '@/lib/fileHandlers';

function ProfilePicture({ datas, className, refetch, ...rest }) {
  const [coverprofile, setCoverprofile] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletePic, setDeletePic] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState(
    datas.profilePicture?.signedUrl || ''
  );
  const [imageKey, setImageKey] = useState(Date.now());

  useEffect(() => {
    setProfilePicUrl(datas.profilePicture?.signedUrl || '');
    setImageKey(Date.now());
  }, [datas.profilePicture]);

  const onFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setCoverprofile(true);
      try {
        const result = await Upload(
          file,
          datas.id,
          'SCHOOL_PROFILE_PICTURE',
          refetch,
          setUploading
        );
        if (result) {
          setProfilePicUrl(`${result.url}?t=${result.timestamp}`);
          setImageKey(result.timestamp);
        }
      } catch (error) {
        // Error handling is done in the Upload function
      } finally {
        setCoverprofile(false);
      }
    }
  };

  const handleDelete = async () => {
    try {
      await Delete(
        datas.id,
        datas.profilePicture.id,
        'SCHOOL_PROFILE_PICTURE',
        refetch,
        setDeletePic
      );
      setProfilePicUrl('');
      setImageKey(Date.now());
    } catch (error) {
      // Error handling is done in the Delete function
    }
  };

  return (
    <Card className={className} {...rest}>
      <CardContent className="flex flex-col items-center p-6 text-center">
        <div className="relative">
          <Avatar className="h-24 w-24" key={imageKey}>
            <AvatarImage src={profilePicUrl} alt={datas.name} />
            <AvatarFallback>
              <School className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 rounded-full bg-primary p-1">
            <label htmlFor="icon-button-file" className="cursor-pointer">
              <Camera className="h-4 w-4 text-white" />
            </label>
            <input
              accept="image/*"
              id="icon-button-file"
              type="file"
              hidden
              onChange={onFileChange}
              disabled={deletePic || uploading}
            />
          </div>
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50">
              <div className="loader h-12 w-12 rounded-full border-4 border-t-4 border-gray-200 ease-linear"></div>
            </div>
          )}
        </div>
        <h4 className="mt-4 text-xl font-semibold">{datas.name}</h4>
        <p className="text-sm text-gray-500">{datas.country || '\u00A0'}</p>
      </CardContent>
      <CardFooter className="justify-center">
        <Button
          variant="destructive"
          size="sm"
          disabled={deletePic || !profilePicUrl || uploading}
          onClick={handleDelete}
        >
          {deletePic ? 'Removing Picture...' : 'Remove Picture'}
          {deletePic && (
            <div className="loader ml-2 h-4 w-4 rounded-full border-2 border-t-2 border-gray-200 ease-linear"></div>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProfilePicture;
