import React, { useState, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_POST } from './PostViewService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Image, X } from 'lucide-react';

const CreatePostModal = ({
  isOpen,
  onClose,
  currentUser,
  onPostCreated,
  pic
}) => {
  const [postText, setPostText] = useState('');
  const [postImage, setPostImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const [createPost, { loading: createPostLoading }] = useMutation(
    CREATE_POST,
    {
      onCompleted: () => {
        toast({ description: 'Post created successfully' });
        onPostCreated();
        handleClose();
      },
      onError: (error) => {
        toast({
          title: 'Error creating post',
          description: error.message,
          variant: 'destructive'
        });
      }
    }
  );

  const handleClose = () => {
    setPostText('');
    setPostImage(null);
    setImagePreview(null);
    onClose();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          description: 'Image size should be less than 5MB',
          variant: 'destructive'
        });
        return;
      }
      setPostImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setPostImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!postText.trim() && !postImage) return;

    let content = null;
    if (postImage) {
      // Here you would typically upload the image and get a URL
      // For this example, we'll use a placeholder
      content = {
        fileName: postImage.name,
        contentType: postImage.type,
        url: URL.createObjectURL(postImage)
      };
    }

    await createPost({
      variables: {
        text: postText.trim(),
        content,
        sendTo: [{ receiverType: 'SCHOOL' }],
        notifyByEmail: false,
        acceptComment: true
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a Post</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={pic} alt={currentUser.firstName} />
              <AvatarFallback>
                {currentUser.firstName[0]}
                {currentUser.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold">
              {currentUser.firstName} {currentUser.lastName}
            </span>
          </div>
          <Textarea
            placeholder="What's on your mind?"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            rows={4}
          />
          {imagePreview && (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Post preview"
                className="h-auto w-full rounded-md"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              type="button"
            >
              <Image className="mr-2 h-4 w-4" />
              Add Image
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleClose} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createPostLoading || (!postText.trim() && !postImage)}
          >
            {createPostLoading ? 'Creating...' : 'Create Post'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
