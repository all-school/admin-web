// app/(school)/admin/school/form/create/QuestionList.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import QuestionItem from './QuestionItem';

interface QuestionListProps {
  questions: any[];
  setQuestions: (questions: any[]) => void;
}

export default function QuestionList({
  questions,
  setQuestions
}: QuestionListProps) {
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionType: 'SHORT_ANSWER',
        question: '',
        description: '',
        options: [],
        isRequired: false
      }
    ]);
  };

  const updateQuestion = (index: number, updatedQuestion: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  return (
    <div className="space-y-4">
      {questions.map((question, index) => (
        <QuestionItem
          key={index}
          question={question}
          onUpdate={(updatedQuestion) => updateQuestion(index, updatedQuestion)}
          onRemove={() => removeQuestion(index)}
        />
      ))}
      <Button onClick={addQuestion} variant="outline">
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Question
      </Button>
    </div>
  );
}
