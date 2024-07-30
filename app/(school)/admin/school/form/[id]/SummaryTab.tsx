'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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

interface SummaryTabProps {
  form: any; // Replace 'any' with a proper type for your form
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function SummaryTab({ form }: SummaryTabProps) {
  return (
    <div className="space-y-6">
      {form.questions.map((question: any, index: number) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{question.question}</CardTitle>
          </CardHeader>
          <CardContent>
            {question.noOfResponses > 0 ? (
              <>
                <p className="mb-4">
                  {question.noOfResponses}{' '}
                  {question.noOfResponses === 1 ? 'response' : 'responses'}
                </p>
                {renderChart(question)}
              </>
            ) : (
              <p>No responses yet for this question.</p>
            )}
          </CardContent>
          <Separator />
        </Card>
      ))}
    </div>
  );
}

function renderChart(question: any) {
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
