import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface LoadMoreButtonProps {
  pageInfo:
    | {
        hasNext?: boolean;
        startCursor?: string;
      }
    | undefined;
  isLoadingMore: boolean;
  onLoadMore: () => void;
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({
  pageInfo,
  isLoadingMore,
  onLoadMore
}) => {
  const loadMoreRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pageInfo?.hasNext && !isLoadingMore) {
          onLoadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [pageInfo?.hasNext, isLoadingMore, onLoadMore]);

  if (!pageInfo?.hasNext) return null;

  return (
    <Button
      ref={loadMoreRef}
      onClick={onLoadMore}
      disabled={isLoadingMore}
      className="mt-4 w-full"
    >
      {isLoadingMore ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        'Load More'
      )}
    </Button>
  );
};

export default LoadMoreButton;
