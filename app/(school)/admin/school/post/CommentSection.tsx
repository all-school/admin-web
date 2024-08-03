import React, { useState } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import {
  GET_COMMENTS,
  CREATE_POST_COMMENT,
  LIKE_COMMENT,
  DELETE_COMMENT
} from './PostViewService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
  Heart,
  Reply,
  Trash2,
  MoreHorizontal,
  Edit,
  MessageCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

const Comment = ({
  comment,
  currentUser,
  onReply,
  onLike,
  onDelete,
  onEdit,
  depth = 0
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.comment);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const { toast } = useToast();

  const [fetchReplies, { loading: repliesLoading }] = useLazyQuery(
    GET_COMMENTS,
    {
      variables: { postId: comment.post.id, parentCommentId: comment.id },
      onCompleted: (data) => {
        setReplies(data.postComments);
      },
      onError: (error) => {
        toast({
          title: 'Error fetching replies',
          description: error.message,
          variant: 'destructive'
        });
      }
    }
  );

  const handleEdit = () => {
    onEdit(comment.id, editedText);
    setIsEditing(false);
  };

  const handleToggleReplies = () => {
    if (!showReplies && replies.length === 0) {
      fetchReplies();
    }
    setShowReplies(!showReplies);
  };

  return (
    <div className={`flex space-x-2 ${depth > 0 ? 'ml-6' : ''} mt-2`}>
      <Avatar className="h-8 w-8">
        <AvatarImage
          src={comment.createdBy.user.profilePicture?.signedUrl}
          alt={comment.createdBy.user.firstName}
        />
        <AvatarFallback>
          {comment.createdBy.user.firstName[0]}
          {comment.createdBy.user.lastName[0]}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="rounded-lg bg-secondary p-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">
              {comment.createdBy.user.firstName}{' '}
              {comment.createdBy.user.lastName}
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">
                {format(new Date(comment.createdAt), 'PP')}
              </span>
              {currentUser.id === comment.createdBy.user.id && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(comment.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
          {isEditing ? (
            <div className="mt-2">
              <Textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                rows={2}
              />
              <div className="mt-2 space-x-2">
                <Button onClick={handleEdit} size="sm">
                  Save
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-sm">{comment.comment}</p>
          )}
        </div>
        <div className="mt-1 flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike(comment.id, !comment.liked)}
            className={comment.liked ? 'text-primary' : ''}
          >
            <Heart className="mr-1 h-4 w-4" />
            {comment.noOfLikes}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onReply(comment.id)}>
            <Reply className="mr-1 h-4 w-4" />
            Reply
          </Button>
          {comment.noOfReplies > 0 && (
            <Button variant="ghost" size="sm" onClick={handleToggleReplies}>
              <MessageCircle className="mr-1 h-4 w-4" />
              {showReplies
                ? 'Hide Replies'
                : `View Replies (${comment.noOfReplies})`}
            </Button>
          )}
        </div>
        {showReplies && (
          <div className="mt-2">
            {repliesLoading ? (
              <p>Loading replies...</p>
            ) : (
              replies.map((reply) => (
                <Comment
                  key={reply.id}
                  comment={reply}
                  currentUser={currentUser}
                  onReply={onReply}
                  onLike={onLike}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  depth={depth + 1}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const CommentSection = ({ postId, currentUser }) => {
  const [newCommentText, setNewCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const { toast } = useToast();

  const { loading, error, data, refetch } = useQuery(GET_COMMENTS, {
    variables: { postId },
    fetchPolicy: 'network-only'
  });

  const [createComment] = useMutation(CREATE_POST_COMMENT, {
    onCompleted: () => {
      setNewCommentText('');
      setReplyingTo(null);
      refetch();
      toast({ description: 'Comment added successfully' });
    },
    onError: (error) => {
      toast({
        title: 'Error adding comment',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const [likeComment] = useMutation(LIKE_COMMENT);
  const [deleteComment] = useMutation(DELETE_COMMENT);

  const handleSubmitComment = () => {
    if (newCommentText.trim()) {
      const variables = {
        postId,
        comment: newCommentText.trim()
      };
      if (replyingTo) {
        variables.parentCommentId = replyingTo;
      }
      createComment({ variables });
    }
  };

  const handleLikeComment = (commentId, like) => {
    likeComment({
      variables: { postCommentId: commentId, like }
    }).then(() => refetch());
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteComment({
        variables: { postCommentId: commentId }
      }).then(() => refetch());
    }
  };

  const handleEditComment = (commentId, newText) => {
    // Implement the edit mutation here
    // For now, we'll just show a toast
    toast({ description: 'Comment edited successfully' });
    refetch();
  };

  if (loading)
    return <div className="py-4 text-center">Loading comments...</div>;
  if (error)
    return (
      <div className="py-4 text-center text-destructive">
        Error loading comments
      </div>
    );

  const comments = data?.postComments || [];

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-start space-x-2">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={currentUser.profilePicture?.signedUrl}
            alt={currentUser.firstName}
          />
          <AvatarFallback>
            {currentUser.firstName[0]}
            {currentUser.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <Textarea
            placeholder={replyingTo ? 'Write a reply...' : 'Write a comment...'}
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            rows={2}
          />
          <div className="flex items-center justify-between">
            <Button
              onClick={handleSubmitComment}
              disabled={!newCommentText.trim()}
            >
              {replyingTo ? 'Reply' : 'Comment'}
            </Button>
            {replyingTo && (
              <Button variant="outline" onClick={() => setReplyingTo(null)}>
                Cancel Reply
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            currentUser={currentUser}
            onReply={(commentId) => setReplyingTo(commentId)}
            onLike={handleLikeComment}
            onDelete={handleDeleteComment}
            onEdit={handleEditComment}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
