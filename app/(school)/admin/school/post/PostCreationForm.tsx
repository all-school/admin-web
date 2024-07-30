import React, { useState, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_POST } from './PostViewService';
import { GET_WRITE_SIGNED_URL } from '@/graphql/document';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Image, Send, X } from 'lucide-react';
import axios from 'axios';

const PostCreationForm = ({ userName, pic, onPostCreated }) => {
  const [postText, setPostText] = useState('');
  const [postImage, setPostImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const [getWriteSignedUrl] = useMutation(GET_WRITE_SIGNED_URL);

  const [createPost, { loading: createPostLoading }] = useMutation(
    CREATE_POST,
    {
      onCompleted: () => {
        toast({ description: 'Post created successfully' });
        resetForm();
        onPostCreated();
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

  const resetForm = () => {
    setPostText('');
    setPostImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postText.trim() && !postImage) {
      toast({
        description: 'Please enter some text or upload an image',
        variant: 'destructive'
      });
      return;
    }

    setUploading(true);
    let content = null;

    try {
      if (postImage) {
        const { data: signedUrlData } = await getWriteSignedUrl({
          variables: {
            fileName: postImage.name,
            contentType: postImage.type
          }
        });

        const { writeSignedUrl, objectKey, url } =
          signedUrlData.getWriteSignedUrl;

        await axios.put(writeSignedUrl, postImage, {
          headers: { 'Content-Type': postImage.type }
        });

        content = {
          fileName: postImage.name,
          contentType: postImage.type,
          objectKey,
          url
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
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
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

  return (
    <CardContent className="pt-6">
      <form onSubmit={handleCreatePost} className="space-y-4">
        <div className="flex items-start space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={pic}
              alt={`${userName.firstName} ${userName.lastName}`}
            />
            <AvatarFallback>
              {userName.firstName[0]}
              {userName.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow space-y-4">
            <Textarea
              placeholder={`What's on your mind, ${userName.firstName}?`}
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-60 rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={removeImage}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || createPostLoading}
          >
            <Image className="h-4 w-4" />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </Button>
          <Button
            type="submit"
            disabled={
              (!postText.trim() && !postImage) || uploading || createPostLoading
            }
          >
            {uploading || createPostLoading ? (
              <>
                <span className="loading loading-spinner loading-xs mr-2"></span>
                {uploading ? 'Uploading...' : 'Posting...'}
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Post
              </>
            )}
          </Button>
        </div>
      </form>
    </CardContent>
  );
};

export default PostCreationForm;
