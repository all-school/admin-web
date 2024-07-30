'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface QuestionTabProps {
  form: any; // Replace 'any' with a proper type for your form
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function QuestionTab({ form }: QuestionTabProps) {
  const [selectedQuestion, setSelectedQuestion] = useState(form.questions[0]);

  return (
    <div className="space-y-6">
      <Select
        onValueChange={(value) =>
          setSelectedQuestion(form.questions.find((q) => q.id === value))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a question" />
        </SelectTrigger>
        <SelectContent>
          {form.questions.map((question: any) => (
            <SelectItem key={question.id} value={question.id}>
              {question.question}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Card>
        <CardHeader>
          <CardTitle>{selectedQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedQuestion.noOfResponses > 0 ? (
            <>
              <p className="mb-4">
                {selectedQuestion.noOfResponses}{' '}
                {selectedQuestion.noOfResponses === 1
                  ? 'response'
                  : 'responses'}
              </p>
              {renderResponses(selectedQuestion)}
            </>
          ) : (
            <p>No responses yet for this question.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function renderResponses(question: any) {
  const data = question.responsesCounts.map((rc: any) => ({
    name: rc.answer,
    value: rc.count
  }));

  switch (question.questionType) {
    case 'MULTIPLE_CHOICE_SINGLE_OPTION':
    case 'DROPDOWN':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    case 'MULTIPLE_CHOICE_MULTIPLE_OPTION':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8">
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    case 'SHORT_ANSWER':
    case 'PARAGRAPH':
    case 'DATE':
      return (
        <ul className="list-disc pl-5">
          {data.map((item, index) => (
            <li key={index}>
              {item.name}: {item.value}{' '}
              {item.value === 1 ? 'response' : 'responses'}
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}
