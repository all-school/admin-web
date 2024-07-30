'use client';

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import QuestionsTab from './QuestionsTab';
import ResponsesTab from './ResponsesTab';
import { UPDATE_FORM } from './FormUpdateService';

interface UpdateFormProps {
  recordId: string;
  form: any; // Replace 'any' with a proper type for your form
}

export default function UpdateForm({ recordId, form }: UpdateFormProps) {
  const [currentTab, setCurrentTab] = useState('questions');
  const [isEditing, setIsEditing] = useState(false);
  const [editedForm, setEditedForm] = useState(form);
  const { toast } = useToast();

  const [updateForm, { loading: updateFormLoading }] = useMutation(
    UPDATE_FORM,
    {
      onCompleted: () => {
        toast({
          title: 'Success',
          description: 'Form updated successfully'
        });
        setIsEditing(false);
      },
      onError: (error) => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to update form. ' + error.message
        });
      }
    }
  );

  const handleEdit = () => {
    if (form.noOfResponses > 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Cannot edit form with responses'
      });
    } else {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setEditedForm(form);
    setIsEditing(false);
  };

  const handleSave = () => {
    const filteredQuestions = editedForm.questions.map((question: any) => ({
      questionType: question.questionType,
      question: question.question,
      description: question.description,
      options: question.options,
      isRequired: question.isRequired
    }));

    updateForm({
      variables: {
        formId: recordId,
        title: editedForm.title,
        description: editedForm.description,
        questions: filteredQuestions
      }
    });
  };

  const handleFormUpdate = (updatedForm: any) => {
    setEditedForm(updatedForm);
  };

  return (
    <div className="space-y-4">
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="responses">
              Responses
              <Badge variant="secondary" className="ml-2">
                {form.noOfResponses}
              </Badge>
            </TabsTrigger>
          </TabsList>
          {currentTab === 'questions' && !isEditing && (
            <Button onClick={handleEdit} disabled={form.noOfResponses > 0}>
              Edit
            </Button>
          )}
          {currentTab === 'questions' && isEditing && (
            <div className="space-x-2">
              <Button onClick={handleCancel} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={updateFormLoading}>
                {updateFormLoading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          )}
        </div>
        <TabsContent value="questions">
          <QuestionsTab
            form={isEditing ? editedForm : form}
            onUpdate={handleFormUpdate}
            isEditing={isEditing}
          />
        </TabsContent>
        <TabsContent value="responses">
          <ResponsesTab recordId={recordId} form={form} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
