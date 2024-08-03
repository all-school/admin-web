import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LIKE_POST } from './PostViewService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { ThumbsUp, MessageSquare, Share2 } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import CommentSection from './CommentSection';

dayjs.extend(relativeTime);

const PostCard = ({ post, onPostUpdated, currentUser }) => {
  const [showComments, setShowComments] = useState(false);
  const { toast } = useToast();

  const [likePost] = useMutation(LIKE_POST, {
    onCompleted: (data) => {
      toast({
        description: data.likePost ? 'Post liked successfully' : 'Post unliked',
        duration: 3000
      });
      onPostUpdated();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Unable to process your request. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const handleLikePost = () => {
    likePost({
      variables: {
        postId: post.id,
        like: !post.liked
      }
    });
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <Card className="mb-4 w-full shadow-sm transition-shadow duration-200 hover:shadow-md">
      <CardContent className="p-4">
        <div className="mb-3 flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={post.createdBy?.user?.profilePicture?.signedUrl}
              alt={`${post.createdBy?.user?.firstName} ${post.createdBy?.user?.lastName}`}
            />
            <AvatarFallback className="bg-gray-200 text-gray-600">
              {post.createdBy?.user?.firstName?.[0]}
              {post.createdBy?.user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {post.createdBy?.user?.firstName} {post.createdBy?.user?.lastName}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {dayjs(post.createdAt).fromNow()}
            </p>
          </div>
        </div>

        <p className="mb-3 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
          {post.text}
        </p>

        {post.content && post.content.contentType.startsWith('image/') && (
          <div className="mb-3 overflow-hidden rounded-md">
            <img
              src={post.content.signedUrl}
              alt="Post content"
              className="h-auto w-full object-cover"
              onError={(e) => {
                console.error('Image failed to load:', e);
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
      </CardContent>

      <Separator />

      <CardFooter className="flex justify-between px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center ${
            post.liked
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400'
          }`}
          onClick={handleLikePost}
        >
          <ThumbsUp className="mr-1 h-4 w-4" />
          <span className="text-xs">{post.noOfLikes}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center text-gray-600 dark:text-gray-400"
          onClick={toggleComments}
        >
          <MessageSquare className="mr-1 h-4 w-4" />
          <span className="text-xs">{post.noOfComments}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center text-gray-600 dark:text-gray-400"
        >
          <Share2 className="mr-1 h-4 w-4" />
          <span className="text-xs">Share</span>
        </Button>
      </CardFooter>

      {showComments && (
        <div className="bg-gray-50 px-4 py-3 dark:bg-gray-800">
          <CommentSection postId={post.id} currentUser={currentUser} />
        </div>
      )}
    </Card>
  );
};

export default PostCard;
