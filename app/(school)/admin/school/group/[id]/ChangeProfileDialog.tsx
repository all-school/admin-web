import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Upload, Delete } from '@/lib/fileHandlers';
import { Camera, Users } from 'lucide-react';

const ChangeProfileDialog = ({ title, open, setOpen, group, groupRefetch }) => {
  const [uploading, setUploading] = useState(false);
  const [deletePic, setDeletePic] = useState(false);
  const [isPicExist, setIsPicExist] = useState(!!group.profilePicture);
  const { toast } = useToast();

  useEffect(() => {
    groupRefetch();
  }, []);

  useEffect(() => {
    if (group.profilePicture) {
      setIsPicExist(true);
    } else {
      setIsPicExist(false);
      setDeletePic(false);
    }
  }, [group.profilePicture]);

  const onFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    Upload(file, group.id, 'GROUP_PROFILE_PICTURE', groupRefetch, setUploading);
  };

  const handleDelete = () => {
    Delete(
      group.id,
      group.profilePicture.id,
      'GROUP_PROFILE_PICTURE',
      groupRefetch,
      setDeletePic
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 flex flex-col items-center text-center">
          <Badge className="mb-2" variant="secondary">
            <Avatar className="h-24 w-24">
              {group.profilePicture ? (
                <AvatarImage
                  src={group.profilePicture.signedUrl}
                  alt={group.name}
                />
              ) : (
                <AvatarFallback>
                  <Users className="h-12 w-12" />
                </AvatarFallback>
              )}
            </Avatar>
            <div className="absolute bottom-0 right-0 rounded-full bg-primary p-1">
              <label htmlFor="profile-upload" className="cursor-pointer">
                <Camera className="h-4 w-4 text-primary-foreground" />
              </label>
              <input
                id="profile-upload"
                type="file"
                className="hidden"
                onChange={onFileChange}
                disabled={deletePic || uploading}
                accept="image/*"
              />
            </div>
          </Badge>

          <h3 className="text-lg font-semibold">{group.name}</h3>

          <Button
            variant="destructive"
            size="sm"
            className="mt-2"
            onClick={handleDelete}
            disabled={deletePic || !isPicExist || (isPicExist && uploading)}
          >
            {!deletePic ? 'Remove Picture' : 'Removing Picture...'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeProfileDialog;
