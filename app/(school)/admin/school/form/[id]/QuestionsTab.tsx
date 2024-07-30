'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';

interface QuestionsTabProps {
  form: any; // Replace 'any' with a proper type for your form
  onUpdate: (updatedForm: any) => void; // Function to call when form is updated
  isEditing: boolean;
}

export default function QuestionsTab({
  form,
  onUpdate,
  isEditing
}: QuestionsTabProps) {
  const handleQuestionChange = (
    questionId: string,
    field: string,
    value: any
  ) => {
    const updatedQuestions = form.questions.map((q: any) =>
      q.id === questionId ? { ...q, [field]: value } : q
    );
    onUpdate({ ...form, questions: updatedQuestions });
  };

  const handleOptionChange = (
    questionId: string,
    optionIndex: number,
    value: string
  ) => {
    const updatedQuestions = form.questions.map((q: any) =>
      q.id === questionId
        ? {
            ...q,
            options: q.options.map((opt: string, index: number) =>
              index === optionIndex ? value : opt
            )
          }
        : q
    );
    onUpdate({ ...form, questions: updatedQuestions });
  };

  const addOption = (questionId: string) => {
    const updatedQuestions = form.questions.map((q: any) =>
      q.id === questionId
        ? {
            ...q,
            options: [...q.options, `Option ${q.options.length + 1}`]
          }
        : q
    );
    onUpdate({ ...form, questions: updatedQuestions });
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    const updatedQuestions = form.questions.map((q: any) =>
      q.id === questionId
        ? {
            ...q,
            options: q.options.filter(
              (_: any, index: number) => index !== optionIndex
            )
          }
        : q
    );
    onUpdate({ ...form, questions: updatedQuestions });
  };

  return (
    <div className="space-y-6">
      {form.questions.map((question: any) => (
        <Card key={question.id}>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                {isEditing ? (
                  <Input
                    value={question.question}
                    onChange={(e) =>
                      handleQuestionChange(
                        question.id,
                        'question',
                        e.target.value
                      )
                    }
                  />
                ) : (
                  <h3 className="text-lg font-semibold">{question.question}</h3>
                )}
                {question.isRequired && <span className="text-red-500">*</span>}
              </div>
              {isEditing && (
                <Textarea
                  value={question.description}
                  onChange={(e) =>
                    handleQuestionChange(
                      question.id,
                      'description',
                      e.target.value
                    )
                  }
                  placeholder="Description"
                />
              )}
              {renderQuestionInput(
                question,
                isEditing,
                handleOptionChange,
                addOption,
                removeOption
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function renderQuestionInput(
  question: any,
  isEditing: boolean,
  handleOptionChange: any,
  addOption: any,
  removeOption: any
) {
  switch (question.questionType) {
    case 'SHORT_ANSWER':
      return <Input disabled placeholder="Short answer text" />;
    case 'PARAGRAPH':
      return <Textarea disabled placeholder="Long answer text" />;
    case 'MULTIPLE_CHOICE_SINGLE_OPTION':
      return (
        <RadioGroup disabled={!isEditing}>
          {question.options.map((option: string, index: number) => (
            <div className="flex items-center space-x-2" key={index}>
              <RadioGroupItem value={option} id={`option-${index}`} />
              {isEditing ? (
                <Input
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(question.id, index, e.target.value)
                  }
                />
              ) : (
                <Label htmlFor={`option-${index}`}>{option}</Label>
              )}
              {isEditing && (
                <Button onClick={() => removeOption(question.id, index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          {isEditing && (
            <Button onClick={() => addOption(question.id)}>
              <Plus className="h-4 w-4" /> Add Option
            </Button>
          )}
        </RadioGroup>
      );
    case 'MULTIPLE_CHOICE_MULTIPLE_OPTION':
      return (
        <div className="space-y-2">
          {question.options.map((option: string, index: number) => (
            <div className="flex items-center space-x-2" key={index}>
              <Checkbox disabled id={`option-${index}`} />
              {isEditing ? (
                <Input
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(question.id, index, e.target.value)
                  }
                />
              ) : (
                <Label htmlFor={`option-${index}`}>{option}</Label>
              )}
              {isEditing && (
                <Button onClick={() => removeOption(question.id, index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          {isEditing && (
            <Button onClick={() => addOption(question.id)}>
              <Plus className="h-4 w-4" /> Add Option
            </Button>
          )}
        </div>
      );
    case 'DROPDOWN':
      return (
        <Select disabled={!isEditing}>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {question.options.map((option: string, index: number) => (
              <SelectItem key={index} value={option}>
                {isEditing ? (
                  <Input
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(question.id, index, e.target.value)
                    }
                  />
                ) : (
                  option
                )}
              </SelectItem>
            ))}
          </SelectContent>
          {isEditing && (
            <>
              <Button onClick={() => addOption(question.id)}>
                <Plus className="h-4 w-4" /> Add Option
              </Button>
              {question.options.map((_: any, index: number) => (
                <Button
                  key={index}
                  onClick={() => removeOption(question.id, index)}
                >
                  <Trash2 className="h-4 w-4" /> Remove Option {index + 1}
                </Button>
              ))}
            </>
          )}
        </Select>
      );
    case 'DATE':
      return (
        <div className="relative">
          <Input disabled placeholder="dd-mm-yyyy" />
          <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
        </div>
      );
    default:
      return null;
  }
}
