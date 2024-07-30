import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AddPostDialog from './AddPostDialog';

function PostAdd({ refetch, group, userName, headline, pic }) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  return (
    <Card>
      <CardContent className="flex items-center space-x-4 p-4">
        <Avatar>
          <AvatarImage src={pic} alt={userName.firstName} />
          <AvatarFallback>
            {userName.firstName[0]}
            {userName.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <Button
          variant="outline"
          className="flex-grow justify-start text-left"
          onClick={() => setAddDialogOpen(true)}
        >
          What's on your mind?
        </Button>
      </CardContent>
      <AddPostDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        group={group}
        userName={userName}
        pic={pic}
        refetch={refetch}
      />
    </Card>
  );
}

export default PostAdd;
