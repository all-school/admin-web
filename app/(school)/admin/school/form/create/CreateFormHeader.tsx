// app/admin/school/form/create/CreateFormHeader.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface CreateFormHeaderProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  formType: string;
  setFormType: (formType: string) => void;
}

export default function CreateFormHeader({
  title,
  setTitle,
  description,
  setDescription,
  formType,
  setFormType
}: CreateFormHeaderProps) {
  return (
    <div className="space-y-4">
      <Input
        placeholder="Form Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        placeholder="Form Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Select value={formType} onValueChange={setFormType}>
        <SelectTrigger>
          <SelectValue placeholder="Form Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="GENERAL">General</SelectItem>
          <SelectItem value="CONSENT">Consent</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
