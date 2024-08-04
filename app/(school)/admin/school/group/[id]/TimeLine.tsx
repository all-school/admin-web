import React, { useState, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { GET_POSTS_BY_GROUP } from './GroupExService';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import PostCreationForm from './PostCreationForm';
import PostCard from './PostCard';
import About from './About';
import LoadMoreButton from './LoadMoreButton';
import { PAGINATION_POST_ITEMS_PER_PAGE } from '@/constants';

const Timeline = ({ group, userName, pic }) => {
  const { toast } = useToast();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { data, loading, error, fetchMore, refetch } = useQuery(
    GET_POSTS_BY_GROUP,
    {
      variables: { queryById: group.id, top: PAGINATION_POST_ITEMS_PER_PAGE },
      errorPolicy: 'all'
    }
  );

  const handleRefetch = useCallback(() => refetch(), [refetch]);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !data?.posts?.pageInfo.hasNext) return;

    setIsLoadingMore(true);
    try {
      await fetchMore({
        variables: {
          queryById: group.id,
          top: PAGINATION_POST_ITEMS_PER_PAGE,
          afterCursor: data.posts.pageInfo.endCursor
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResult;
          return {
            posts: {
              ...fetchMoreResult.posts,
              edges: [...prevResult.posts.edges, ...fetchMoreResult.posts.edges]
            }
          };
        }
      });
    } catch (error) {
      console.error('Error loading more posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load more posts. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, data, fetchMore, group.id, toast]);

  if (loading && !data) return <Skeleton className="h-64 w-full rounded-lg" />;
  if (error) {
    toast({
      title: 'Error',
      description: 'Error loading posts: ' + error.message,
      variant: 'destructive'
    });
    return null;
  }

  const posts = data?.posts?.edges || [];
  const pageInfo = data?.posts?.pageInfo;

  return (
    <div className="w-full">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="w-full lg:w-1/3">
            <About user={userName} group={group} />
          </div>
          <div className="w-full space-y-6 lg:w-2/3">
            <PostCreationForm
              userName={userName}
              pic={pic}
              onPostCreated={handleRefetch}
            />
            <div className="space-y-4">
              {posts.map(({ node: post }) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onPostUpdated={handleRefetch}
                  currentUser={userName}
                />
              ))}
            </div>
            <LoadMoreButton
              pageInfo={pageInfo}
              isLoadingMore={isLoadingMore}
              onLoadMore={handleLoadMore}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
