import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_POSTS } from './PostViewService';
import PostCreationForm from './PostCreationForm';
import PostCard from './PostCard';
import LoadMoreButton from './LoadMoreButton';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const POSTS_PER_PAGE = 10;

interface TimelineProps {
  userName: any;
  headline: string;
  pic: string;
}

const Timeline: React.FC<TimelineProps> = ({ userName, headline, pic }) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { data, loading, error, fetchMore, refetch } = useQuery(GET_POSTS, {
    variables: { first: POSTS_PER_PAGE },
    errorPolicy: 'all'
  });

  const handleRefetch = () => {
    refetch();
  };

  const handleLoadMore = async () => {
    if (isLoadingMore || !data?.posts?.pageInfo.hasNext) return;

    setIsLoadingMore(true);
    try {
      await fetchMore({
        variables: {
          first: POSTS_PER_PAGE,
          afterCursor: data.posts.pageInfo.startCursor
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
    } finally {
      setIsLoadingMore(false);
    }
  };

  const posts = data?.posts?.edges || [];
  const pageInfo = data?.posts?.pageInfo;

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-8">
      <Card className="p-6 shadow-md">
        <PostCreationForm
          userName={userName}
          pic={pic}
          onPostCreated={handleRefetch}
        />
      </Card>

      <div className="space-y-6">
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
  );
};

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, index) => (
      <Card key={index} className="space-y-4 p-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </Card>
    ))}
  </div>
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <Card className="border-red-300 bg-red-100 p-4 text-red-700">
    Error loading posts: {message}
  </Card>
);

export default Timeline;
