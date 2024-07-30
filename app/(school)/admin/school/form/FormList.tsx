// app/admin/school/form/FormList.tsx
import { useState } from 'react';
import Link from 'next/link';
import { FileText, MoreVertical, Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
}

interface FormListProps {
  forms: Form[];
  onSend: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function FormList({ forms, onSend, onDelete }: FormListProps) {
  return (
    <div className="space-y-4">
      {forms.map((form) => (
        <Card key={form.id}>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <FileText className="h-6 w-6 text-gray-500" />
              <div>
                <Link
                  href={`/admin/school/form/${form.id}`}
                  className="text-lg font-medium hover:underline"
                >
                  {form.title}
                </Link>
                <div className="text-sm text-gray-500">
                  Type: {form.formType === 'GENERAL' ? 'General' : 'Consent'}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge
                variant={form.status === 'OPEN' ? 'success' : 'destructive'}
              >
                {form.status === 'OPEN' ? 'Accepting Response' : 'Closed'}
              </Badge>
              <div className="text-sm">
                Responses: {form.noOfResponses}/{form.noOfRecipients}
              </div>
              <div className="text-sm">
                Created: {new Date(form.createdAt).toLocaleDateString()}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
