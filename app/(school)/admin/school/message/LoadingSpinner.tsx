import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 24 }) => {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader2 className={`h-${size} w-${size} animate-spin`} />
    </div>
  );
};

export default LoadingSpinner;
