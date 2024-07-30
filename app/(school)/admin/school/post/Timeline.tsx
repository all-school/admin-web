import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_POSTS } from './PostViewService';
import PostCreationForm from './PostCreationForm';
import PostCard from './PostCard';
import LoadMoreButton from './LoadMoreButton';

const POSTS_PER_PAGE = 10;

const Timeline: React.FC<{ userName: any; headline: string; pic: string }> = ({
  userName,
  headline,
  pic
}) => {
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

  if (loading && !data)
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  if (error)
    return (
      <div className="alert alert-error">
        Error loading posts: {error.message}
      </div>
    );

  const posts = data?.posts?.edges || [];
  const pageInfo = data?.posts?.pageInfo;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <PostCreationForm
          userName={userName}
          pic={pic}
          onPostCreated={handleRefetch}
        />

        {posts.map(({ node: post }) => (
          <PostCard
            key={post.id}
            post={post}
            onPostUpdated={handleRefetch}
            currentUser={userName}
          />
        ))}

        <LoadMoreButton
          pageInfo={pageInfo}
          isLoadingMore={isLoadingMore}
          onLoadMore={handleLoadMore}
        />
      </div>
    </div>
  );
};

export default Timeline;
