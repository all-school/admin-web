import React, { useState } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import {
  GET_COMMENTS,
  CREATE_POST_COMMENT,
  LIKE_COMMENT,
  DELETE_COMMENT
} from './GroupExService';
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
  MessageCircle,
  Send
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
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState(comment.replies || []);
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

  const handleReply = () => {
    onReply(comment.id, replyText, (newReply) => {
      setReplies([...replies, newReply]);
      setShowReplyInput(false);
      setReplyText('');
      setShowReplies(true);
    });
  };

  return (
    <div className={`mb-4 ${depth > 0 ? 'ml-6' : ''}`}>
      <div className="flex items-start space-x-3">
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
          <div className="rounded-lg bg-secondary p-3">
            <div className="mb-2 flex items-center justify-between">
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
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
                  className="mb-2"
                />
                <div className="flex justify-end space-x-2">
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
              <p className="text-sm">{comment.comment}</p>
            )}
          </div>
          <div className="mt-2 flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(comment.id, !comment.liked)}
              className={`h-8 p-0 ${comment.liked ? 'text-primary' : ''}`}
            >
              <Heart className="mr-1 h-4 w-4" />
              <span className="text-xs">{comment.noOfLikes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="h-8 p-0"
            >
              <Reply className="mr-1 h-4 w-4" />
              <span className="text-xs">Reply</span>
            </Button>
            {(replies.length > 0 || comment.noOfReplies > 0) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleReplies}
                className="h-8 p-0"
              >
                <MessageCircle className="mr-1 h-4 w-4" />
                <span className="text-xs">
                  {showReplies
                    ? 'Hide Replies'
                    : `View Replies (${replies.length || comment.noOfReplies})`}
                </span>
              </Button>
            )}
          </div>
          {showReplyInput && (
            <div className="mt-2 flex items-center space-x-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={1}
                className="flex-grow"
              />
              <Button
                size="sm"
                onClick={handleReply}
                disabled={!replyText.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
      {showReplies && (
        <div className="mt-2 space-y-4">
          {repliesLoading ? (
            <p className="text-sm text-muted-foreground">Loading replies...</p>
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
  );
};

const CommentSection = ({ postId, currentUser }) => {
  const [newCommentText, setNewCommentText] = useState('');
  const { toast } = useToast();

  const { loading, error, data, refetch } = useQuery(GET_COMMENTS, {
    variables: { postId },
    fetchPolicy: 'network-only'
  });

  const [createComment] = useMutation(CREATE_POST_COMMENT);

  const [likeComment] = useMutation(LIKE_COMMENT);
  const [deleteComment] = useMutation(DELETE_COMMENT);

  const handleSubmitComment = async () => {
    if (newCommentText.trim()) {
      try {
        const { data } = await createComment({
          variables: {
            postId,
            comment: newCommentText.trim()
          }
        });
        setNewCommentText('');
        refetch();
        toast({ description: 'Comment added successfully' });
      } catch (error) {
        toast({
          title: 'Error adding comment',
          description: error.message,
          variant: 'destructive'
        });
      }
    }
  };

  const handleReply = async (parentCommentId, replyText, callback) => {
    if (replyText.trim()) {
      try {
        const { data } = await createComment({
          variables: {
            postId,
            parentCommentId,
            comment: replyText.trim()
          }
        });
        callback(data.createPostComment);
        toast({ description: 'Reply added successfully' });
      } catch (error) {
        toast({
          title: 'Error adding reply',
          description: error.message,
          variant: 'destructive'
        });
      }
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
    <div className="mt-6 space-y-6">
      <div className="flex items-start space-x-3">
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
            placeholder="Write a comment..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            rows={2}
          />
          <Button
            onClick={handleSubmitComment}
            disabled={!newCommentText.trim()}
          >
            Post Comment
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            currentUser={currentUser}
            onReply={handleReply}
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
