// AddEditEventModal.tsx
import React from 'react';
import { EventForm } from './EventForm';

interface AddEditEventModalProps {
  event: any;
  mode: 'add' | 'edit';
  onAdd: (event: any) => void;
  onEdit: (event: any) => void;
  onCancel: () => void;
  onDelete: (eventId: string) => void;
  open: boolean;
  refetch: () => void;
}

function AddEditEventModal({
  event,
  mode,
  onAdd,
  onEdit,
  onCancel,
  onDelete,
  open,
  refetch
}: AddEditEventModalProps) {
  return (
    <EventForm
      event={event}
      mode={mode}
      onAdd={onAdd}
      onEdit={onEdit}
      onCancel={onCancel}
      onDelete={onDelete}
      refetch={refetch}
    />
  );
}

export default AddEditEventModal;
