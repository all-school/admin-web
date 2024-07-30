import React, { useState, useRef } from 'react';
import { useMutation } from '@apollo/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CREATE_POST } from './GroupExService'; // Ensure this path is correct
import { Upload, Delete } from '@/lib/fileHandlers'; // Ensure this path is correct
import { ImagePlus, FileText, Send } from 'lucide-react';

interface AddPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: any; // Replace with proper type
  userName: any; // Replace with proper type
  pic: string;
  refetch: () => void;
}

function AddPostDialog({
  open,
  onOpenChange,
  group,
  userName,
  pic,
  refetch
}: AddPostDialogProps) {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [selectedValue, setSelectedValue] = useState('Others');
  const [notifyMail, setNotifyMail] = useState(true);
  const [acceptReply, setAcceptReply] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [createPost] = useMutation(CREATE_POST, {
    onCompleted() {
      toast({ title: 'Post created successfully' });
      onOpenChange(false);
      refetch();
    },
    onError(error) {
      toast({
        title: 'Error creating post',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setUploading(true);
    let fileUrl = '';
    if (file) {
      try {
        fileUrl = await Upload(file, group.id, 'POST_CONTENT');
      } catch (error) {
        toast({
          title: 'Error uploading file',
          description: 'Please try again',
          variant: 'destructive'
        });
        setUploading(false);
        return;
      }
    }

    const postVariables = {
      text: text.trim(),
      content: file
        ? { fileName: file.name, contentType: file.type, url: fileUrl }
        : null,
      sendTo:
        selectedValue === 'School'
          ? [{ receiverType: 'SCHOOL' }]
          : [{ receiverType: 'GROUP', receiverId: group.id }],
      notifyByEmail: notifyMail,
      acceptComment: acceptReply
    };

    createPost({ variables: postVariables });
    setUploading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={pic} alt={userName.firstName} />
              <AvatarFallback>
                {userName.firstName[0]}
                {userName.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{`${userName.firstName} ${userName.lastName}`}</p>
              <RadioGroup
                defaultValue={selectedValue}
                onValueChange={setSelectedValue}
                className="flex"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="School" id="school" />
                  <Label htmlFor="school">School</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Others" id="others" />
                  <Label htmlFor="others">Others</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <Textarea
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {file && (
            <Card>
              <CardContent className="flex items-center justify-between p-2">
                <span>{file.name}</span>
                <Button variant="ghost" onClick={() => setFile(null)}>
                  Remove
                </Button>
              </CardContent>
            </Card>
          )}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus className="mr-2 h-4 w-4" /> Photo/Video
            </Button>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileText className="mr-2 h-4 w-4" /> Document
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
              accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="notifyMail"
              checked={notifyMail}
              onCheckedChange={(checked) => setNotifyMail(checked as boolean)}
            />
            <label htmlFor="notifyMail">Notify by Email</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="acceptReply"
              checked={acceptReply}
              onCheckedChange={(checked) => setAcceptReply(checked as boolean)}
            />
            <label htmlFor="acceptReply">Accept Comments</label>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={uploading || text.trim().length === 0}
          >
            {uploading ? 'Posting...' : 'Post'}
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddPostDialog;
