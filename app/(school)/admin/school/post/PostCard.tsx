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

  const toggleComments = () => setShowComments(!showComments);

  const hasLikes = post.noOfLikes > 0;
  const hasComments = post.noOfComments > 0;

  return (
    <Card className="mb-4 overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={post.createdBy?.user?.profilePicture?.signedUrl}
              alt={`${post.createdBy?.user?.firstName} ${post.createdBy?.user?.lastName}`}
            />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {post.createdBy?.user?.firstName?.[0]}
              {post.createdBy?.user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <h3 className="text-sm font-semibold text-blue-600">
              {post.createdBy?.user?.firstName} {post.createdBy?.user?.lastName}
            </h3>
            <p className="text-xs text-gray-500">
              {dayjs(post.createdAt).fromNow()}
            </p>
          </div>
        </div>

        <p className="mt-3 whitespace-pre-wrap text-sm text-gray-700">
          {post.text}
        </p>

        {post.content && post.content.contentType.startsWith('image/') && (
          <div className="mt-3 overflow-hidden rounded-md border border-gray-200 shadow-sm">
            <img
              src={post.content.signedUrl}
              alt="Post content"
              className="h-auto w-full object-cover transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                console.error('Image failed to load:', e);
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
      </CardContent>

      <Separator className="bg-gray-200" />

      <CardFooter className="flex justify-between p-2">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-1 text-gray-600 transition-colors duration-300 hover:bg-gray-100"
          onClick={handleLikePost}
        >
          <ThumbsUp
            className={`h-4 w-4 ${
              post.liked || hasLikes ? 'text-red-500' : ''
            }`}
          />
          <span className="text-xs">{post.noOfLikes}</span>
        </Button>

        {post.acceptComment && (
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1 text-gray-600 transition-colors duration-300 hover:bg-gray-100"
            onClick={toggleComments}
          >
            <MessageSquare
              className={`h-4 w-4 ${hasComments ? 'text-green-500' : ''}`}
            />
            <span className="text-xs">{post.noOfComments}</span>
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-1 text-gray-600 transition-colors duration-300 hover:bg-gray-100"
        >
          <Share2 className="h-4 w-4" />
          <span className="text-xs">Share</span>
        </Button>
      </CardFooter>

      {showComments && post.acceptComment && (
        <div className="bg-gray-50 p-4">
          <CommentSection postId={post.id} currentUser={currentUser} />
        </div>
      )}
    </Card>
  );
};

export default PostCard;
