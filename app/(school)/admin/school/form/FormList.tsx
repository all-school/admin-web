import React from 'react';
import {
  FileText,
  MoreVertical,
  Send,
  Trash2,
  Calendar,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface Form {
  id: string;
  title: string;
  formType: string;
  status: string;
  noOfResponses: number;
  noOfRecipients: number;
  createdAt: string;
  createdBy?: {
    user?: {
      firstName?: string;
      lastName?: string;
      profilePicture?: { signedUrl?: string };
    };
  };
}

interface FormListProps {
  forms: Form[];
  onSend: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function FormList({ forms, onSend, onDelete }: FormListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {forms.map((form) => (
        <Card
          key={form.id}
          className="overflow-hidden transition-all hover:shadow-lg"
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={form.createdBy?.user?.profilePicture?.signedUrl}
                  />
                  <AvatarFallback>
                    {form.createdBy?.user?.firstName?.[0] ?? ''}
                    {form.createdBy?.user?.lastName?.[0] ?? ''}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {form.createdBy?.user?.firstName}{' '}
                    {form.createdBy?.user?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Created on {new Date(form.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onSend(form.id)}>
                    <Send className="mr-2 h-4 w-4" />
                    <span>Send</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(form.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <Link href={`/admin/school/form/${form.id}`}>
              <CardTitle className="mb-2 cursor-pointer text-xl hover:underline">
                {form.title}
              </CardTitle>
            </Link>
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>
                  {form.formType === 'GENERAL' ? 'General' : 'Consent'}
                </span>
              </Badge>
              <Badge
                variant={form.status === 'OPEN' ? 'success' : 'destructive'}
                className="flex items-center gap-1"
              >
                <Calendar className="h-4 w-4" />
                <span>
                  {form.status === 'OPEN' ? 'Accepting Response' : 'Closed'}
                </span>
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Submission Progress</span>
                <span>
                  {form.noOfResponses}/{form.noOfRecipients} submitted
                </span>
              </div>
              <Progress
                value={(form.noOfResponses / form.noOfRecipients) * 100}
                className="w-full"
              />
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="mr-2 h-4 w-4" />
              <span>{form.noOfRecipients} recipients</span>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
