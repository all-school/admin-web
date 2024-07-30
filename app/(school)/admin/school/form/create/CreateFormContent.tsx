// app/(school)/admin/school/form/create/CreateFormContent.tsx
'use client';

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { CREATE_FORM, CREATE_AND_SEND_FORM } from './FormCreateService';
import CreateFormHeader from './CreateFormHeader';
import QuestionList from './QuestionList';
import { Button } from '@/components/ui/button';
import SendDialog from '../SendDialog';

export default function CreateFormContent() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [formType, setFormType] = useState('GENERAL');
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const [createForm, { loading: createLoading }] = useMutation(CREATE_FORM, {
    onCompleted: () => {
      toast({
        title: 'Form created successfully',
        description: 'Your new form has been created.'
      });
      router.push('/admin/school/form');
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error creating form',
        description: error.message
      });
    }
  });

  const [createAndSendForm, { loading: sendLoading }] = useMutation(
    CREATE_AND_SEND_FORM,
    {
      onCompleted: () => {
        toast({
          title: 'Form created and sent successfully',
          description: 'Your new form has been created and sent.'
        });
        router.push('/admin/school/form');
      },
      onError: (error) => {
        toast({
          variant: 'destructive',
          title: 'Error creating and sending form',
          description: error.message
        });
      }
    }
  );

  const formatQuestions = (questions) => {
    return questions.map((q) => {
      const formattedQuestion = {
        questionType: q.questionType,
        question: q.question,
        description: q.description,
        isRequired: q.isRequired || false
      };

      if (
        [
          'MULTIPLE_CHOICE_SINGLE_OPTION',
          'MULTIPLE_CHOICE_MULTIPLE_OPTION',
          'DROPDOWN'
        ].includes(q.questionType)
      ) {
        formattedQuestion.options = q.options || [];
      }

      return formattedQuestion;
    });
  };

  const handleSubmit = () => {
    createForm({
      variables: {
        title,
        formType,
        description,
        questions: formatQuestions(questions)
      }
    });
  };

  const handleSendForm = (sendTo, notifyByEmail) => {
    createAndSendForm({
      variables: {
        title,
        formType,
        description,
        questions: formatQuestions(questions),
        sendTo,
        notifyByEmail
      }
    });
  };

  return (
    <div className="space-y-6">
      <CreateFormHeader
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        formType={formType}
        setFormType={setFormType}
      />
      <QuestionList questions={questions} setQuestions={setQuestions} />
      <div className="flex justify-end space-x-4">
        <Button onClick={handleSubmit} disabled={createLoading}>
          {createLoading ? 'Creating...' : 'Create Form'}
        </Button>
        <Button
          onClick={() => setIsSendDialogOpen(true)}
          disabled={sendLoading}
        >
          {sendLoading ? 'Sending...' : 'Create and Send Form'}
        </Button>
      </div>
      <SendDialog
        open={isSendDialogOpen}
        onClose={() => setIsSendDialogOpen(false)}
        onSend={handleSendForm}
      />
    </div>
  );
}
