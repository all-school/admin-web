// app/(school)/admin/school/form/create/QuestionItem.tsx
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
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
  Type,
  AlignJustify,
  Radio,
  CheckSquare,
  ChevronDown,
  Calendar
} from 'lucide-react';

interface QuestionItemProps {
  question: any;
  onUpdate: (updatedQuestion: any) => void;
  onRemove: () => void;
}

export default function QuestionItem({
  question,
  onUpdate,
  onRemove
}: QuestionItemProps) {
  const handleChange = (field: string, value: any) => {
    onUpdate({ ...question, [field]: value });
  };

  return (
    <div className="space-y-4 rounded-md border p-4">
      <div className="flex justify-between">
        <Select
          value={question.questionType}
          onValueChange={(value) => handleChange('questionType', value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Question Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SHORT_ANSWER">
              <div className="flex items-center">
                <Type className="mr-2 h-4 w-4" />
                <span>Short Answer</span>
              </div>
            </SelectItem>
            <SelectItem value="PARAGRAPH">
              <div className="flex items-center">
                <AlignJustify className="mr-2 h-4 w-4" />
                <span>Paragraph</span>
              </div>
            </SelectItem>
            <SelectItem value="MULTIPLE_CHOICE_SINGLE_OPTION">
              <div className="flex items-center">
                <Radio className="mr-2 h-4 w-4" />
                <span>Single Option</span>
              </div>
            </SelectItem>
            <SelectItem value="MULTIPLE_CHOICE_MULTIPLE_OPTION">
              <div className="flex items-center">
                <CheckSquare className="mr-2 h-4 w-4" />
                <span>Multiple Option</span>
              </div>
            </SelectItem>
            <SelectItem value="DROPDOWN">
              <div className="flex items-center">
                <ChevronDown className="mr-2 h-4 w-4" />
                <span>Dropdown</span>
              </div>
            </SelectItem>
            <SelectItem value="DATE">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Date</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <Button variant="ghost" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <Input
        placeholder="Question"
        value={question.question}
        onChange={(e) => handleChange('question', e.target.value)}
      />
      <Textarea
        placeholder="Description"
        value={question.description}
        onChange={(e) => handleChange('description', e.target.value)}
      />
      {[
        'MULTIPLE_CHOICE_SINGLE_OPTION',
        'MULTIPLE_CHOICE_MULTIPLE_OPTION',
        'DROPDOWN'
      ].includes(question.questionType) && (
        <div className="space-y-2">
          {question.options.map((option: string, index: number) => (
            <Input
              key={index}
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => {
                const newOptions = [...question.options];
                newOptions[index] = e.target.value;
                handleChange('options', newOptions);
              }}
            />
          ))}
          <Button
            variant="outline"
            onClick={() => handleChange('options', [...question.options, ''])}
          >
            Add Option
          </Button>
        </div>
      )}
      <div className="flex items-center space-x-2">
        <Switch
          checked={question.isRequired}
          onCheckedChange={(checked) => handleChange('isRequired', checked)}
        />
        <span>Required</span>
      </div>
    </div>
  );
}
