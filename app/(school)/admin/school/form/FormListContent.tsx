// app/admin/school/form/FormListContent.tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { useToast } from '@/components/ui/use-toast';
import { GET_FORMS } from './FormService';
import FormList from './FormList';
import SendDialog from './SendDialog';
import DeleteDialog from './DeleteDialog';

interface FormListContentProps {
  isSendDialogOpen: boolean;
  setIsSendDialogOpen: (isOpen: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
}

export default function FormListContent({
  isSendDialogOpen,
  setIsSendDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen
}: FormListContentProps) {
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data, loading, error, refetch } = useQuery(GET_FORMS);

  if (loading) return <div>Loading...</div>;
  if (error) {
    toast({
      variant: 'destructive',
      title: 'Error loading forms',
      description: 'Please try again.'
    });
    return <div>Error loading forms.</div>;
  }

  const handleSend = (formId: string) => {
    setSelectedFormId(formId);
    setIsSendDialogOpen(true);
  };

  const handleDelete = (formId: string) => {
    setSelectedFormId(formId);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <FormList
        forms={data.forms}
        onSend={handleSend}
        onDelete={handleDelete}
      />
      <SendDialog
        open={isSendDialogOpen}
        onClose={() => setIsSendDialogOpen(false)}
        formId={selectedFormId}
        onSend={() => {
          setIsSendDialogOpen(false);
          refetch();
        }}
      />
      <DeleteDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        formId={selectedFormId}
        onDelete={() => {
          setIsDeleteDialogOpen(false);
          refetch();
        }}
      />
    </>
  );
}
