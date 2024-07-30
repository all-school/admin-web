'use client';

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { STUDENT_FORMS } from './FormUpdateService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface IndividualTabProps {
  recordId: string;
  form: any; // Replace 'any' with a proper type for your form
}

export default function IndividualTab({ recordId, form }: IndividualTabProps) {
  const [activeStep, setActiveStep] = useState(0);
  const { data, loading, error } = useQuery(STUDENT_FORMS, {
    variables: { formId: recordId }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const studentForms = data.studentFormsByForm;
  const maxSteps = studentForms.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const currentResponse = studentForms[activeStep];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Response {activeStep + 1} of {maxSteps}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Button onClick={handleBack} disabled={activeStep === 0}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button onClick={handleNext} disabled={activeStep === maxSteps - 1}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{form.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Submitted by: {currentResponse.student.firstName}{' '}
            {currentResponse.student.lastName}
          </p>
          <p className="text-sm text-gray-500">
            Submitted on:{' '}
            {format(new Date(currentResponse.respondedAt), 'PPpp')}
          </p>
        </CardContent>
      </Card>

      {currentResponse.response.map((response: any, index: number) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{response.question.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              {Array.isArray(response.answers)
                ? response.answers.join(', ')
                : response.answers}
            </p>
          </CardContent>
          <Separator />
        </Card>
      ))}
    </div>
  );
}
