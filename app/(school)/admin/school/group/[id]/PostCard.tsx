import React, { useState, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { LIKE_POST } from '@/graphql/PostViewService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Heart, MessageCircle, Share } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import CommentSection from './CommentSection';

dayjs.extend(relativeTime);

const PostCard = React.forwardRef(
  ({ post, onPostUpdated, currentUser }, ref) => {
    const [showComments, setShowComments] = useState(false);
    const { toast } = useToast();

    const [likePost] = useMutation(LIKE_POST, {
      onCompleted: (data) => {
        toast({ description: data.likePost ? 'Post liked' : 'Post unliked' });
        onPostUpdated();
      },
      onError: (error) => {
        toast({
          title: 'Error liking post',
          description: error.message,
          variant: 'destructive'
        });
      }
    });

    const handleLikePost = useCallback(() => {
      likePost({ variables: { postId: post.id, like: !post.liked } });
    }, [likePost, post.id, post.liked]);

    const toggleComments = useCallback(() => {
      setShowComments((prev) => !prev);
    }, []);

    const renderPostContent = () => {
      if (post.content && post.content.contentType.startsWith('image/')) {
        return (
          <img
            src={post.content.signedUrl}
            alt="Post content"
            className="h-auto w-full rounded-lg object-cover shadow-sm"
            onError={(e) => {
              console.error('Image failed to load:', e);
              e.target.style.display = 'none';
            }}
          />
        );
      }
      return null;
    };

    return (
      <Card
        ref={ref}
        className="w-full overflow-hidden bg-white shadow-md transition-shadow duration-300 hover:shadow-lg dark:bg-gray-800"
      >
        <CardHeader className="flex flex-row items-center space-x-4 bg-gray-50 p-4 dark:bg-gray-700">
          <Avatar className="h-12 w-12 border-2 border-white dark:border-gray-600">
            <AvatarImage
              src={post.createdBy?.user?.profilePicture?.signedUrl}
              alt={`${post.createdBy?.user?.firstName} ${post.createdBy?.user?.lastName}`}
            />
            <AvatarFallback>
              {post.createdBy?.user?.firstName?.[0]}
              {post.createdBy?.user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold text-gray-800 dark:text-gray-100">
              {post.createdBy?.user?.firstName} {post.createdBy?.user?.lastName}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {dayjs(post.createdAt).fromNow()}
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <p className="mb-4 whitespace-pre-wrap text-base text-gray-700 dark:text-gray-300">
            {post.text}
          </p>
          {renderPostContent()}
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t border-gray-200 px-4 pt-4 dark:border-gray-700">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center space-x-2 ${
              post.liked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
            }`}
            onClick={handleLikePost}
          >
            <Heart className={`h-5 w-5 ${post.liked ? 'fill-current' : ''}`} />
            <span>{post.noOfLikes} Likes</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center space-x-2 ${
              post.noOfComments > 0
                ? 'text-blue-500'
                : 'text-gray-500 dark:text-gray-400'
            }`}
            onClick={toggleComments}
          >
            <MessageCircle className="h-5 w-5" />
            <span>{post.noOfComments} Comments</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2 text-gray-500 dark:text-gray-400"
          >
            <Share className="h-5 w-5" />
            <span>Share</span>
          </Button>
        </CardFooter>
        {showComments && (
          <div className="bg-gray-50 px-4 pb-4 dark:bg-gray-700">
            <CommentSection postId={post.id} currentUser={currentUser} />
          </div>
        )}
      </Card>
    );
  }
);

PostCard.displayName = 'PostCard';

export default PostCard;
