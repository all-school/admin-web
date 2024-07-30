import React, { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserPlus, ImagePlus, Trash2, Loader2 } from 'lucide-react';
import { Upload, Delete } from '@/lib/fileHandlers';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import AddMembersDialog from './AddMembersDialog';

function Header({ className, group, useraccount, groupRefetch, coverPicture }) {
  const router = useRouter();
  const [coverPic, setCoverPic] = useState(coverPicture);
  const [uploading, setUploading] = useState(false);
  const [deletePic, setDeletePic] = useState(false);
  const [addMembersDialogOpen, setAddMembersDialogOpen] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  const handleCoverPictureChange = useCallback(
    async (event) => {
      const file = event.target.files[0];
      if (file) {
        setUploading(true);
        try {
          await Upload(
            file,
            group.id,
            'GROUP_COVER_PICTURE',
            groupRefetch,
            setUploading
          );
          const updatedGroup = await groupRefetch();
          setCoverPic(updatedGroup.data.group.coverPicture);
          toast({
            title: 'Cover picture updated',
            description:
              'Your new cover picture has been successfully uploaded.'
          });
        } catch (error) {
          console.error('Error uploading cover picture:', error);
          toast({
            title: 'Upload failed',
            description:
              'There was an error uploading your cover picture. Please try again.',
            variant: 'destructive'
          });
        } finally {
          setUploading(false);
        }
      }
    },
    [group.id, groupRefetch, toast]
  );

  const handleDeleteCoverPicture = useCallback(async () => {
    if (coverPic) {
      setDeletePic(true);
      try {
        await Delete(
          group.id,
          coverPic.id,
          'GROUP_COVER_PICTURE',
          groupRefetch,
          setDeletePic
        );
        const updatedGroup = await groupRefetch();
        setCoverPic(null);
        toast({
          title: 'Cover picture removed',
          description: 'Your cover picture has been successfully removed.'
        });
      } catch (error) {
        console.error('Error deleting cover picture:', error);
        toast({
          title: 'Deletion failed',
          description:
            'There was an error removing your cover picture. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setDeletePic(false);
      }
    }
  }, [coverPic, group.id, groupRefetch, toast]);

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={`${className} relative`}>
      <div
        className="relative h-[200px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${coverPic?.signedUrl})` }}
      >
        <Button
          className="absolute left-4 top-4 bg-white/80 text-black hover:bg-white/90"
          variant="ghost"
          size="icon"
          onClick={() => router.push('/admin/school/group')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <Button
            className="bg-white/80 text-black hover:bg-white/90"
            size="sm"
            disabled={uploading || deletePic}
            onClick={triggerFileInput}
          >
            {uploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ImagePlus className="mr-2 h-4 w-4" />
            )}
            {coverPic ? 'Change Cover' : 'Add Cover'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverPictureChange}
            className="hidden"
            disabled={uploading || deletePic}
          />
          {coverPic && (
            <Button
              className="bg-white/80 text-black hover:bg-white/90"
              size="sm"
              onClick={handleDeleteCoverPicture}
              disabled={uploading || deletePic}
            >
              {deletePic ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Remove Cover
            </Button>
          )}
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="mt-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {group?.name || 'Footballedu'}
          </h1>
          <Button
            onClick={() => setAddMembersDialogOpen(true)}
            variant="default"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Members
          </Button>
        </div>
      </div>
      <AddMembersDialog
        title="Add new members"
        open={addMembersDialogOpen}
        setOpen={setAddMembersDialogOpen}
        group={group}
        groupRefetch={groupRefetch}
      />
    </div>
  );
}

export default Header;
