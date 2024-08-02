import React, { useState, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AddPostDialog from './AddPostDialog';

function PostAdd({ refetch, group, userName, pic }) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleOpenDialog = useCallback(() => setAddDialogOpen(true), []);
  const handleCloseDialog = useCallback(() => setAddDialogOpen(false), []);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={pic} alt={userName.firstName} />
            <AvatarFallback>
              {userName.firstName[0]}
              {userName.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <Button
            variant="outline"
            className="h-10 flex-grow justify-start text-left text-muted-foreground"
            onClick={handleOpenDialog}
          >
            What's on your mind?
          </Button>
        </div>
      </CardContent>
      <AddPostDialog
        open={addDialogOpen}
        onOpenChange={handleCloseDialog}
        group={group}
        userName={userName}
        pic={pic}
        refetch={refetch}
      />
    </Card>
  );
}

export default React.memo(PostAdd);
