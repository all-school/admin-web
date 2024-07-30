'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { MoreHorizontal, Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useMutation } from '@apollo/client';
import { DOWNLOAD_FORM } from './FormUpdateService';
import SummaryTab from './SummaryTab';
import QuestionTab from './QuestionTab';
import IndividualTab from './IndividualTab';

interface ResponsesTabProps {
  recordId: string;
  form: any; // Replace 'any' with a proper type for your form
}

export default function ResponsesTab({ recordId, form }: ResponsesTabProps) {
  const [currentTab, setCurrentTab] = useState('summary');
  const { toast } = useToast();
  const [downloadForm, { loading: downloadLoading }] =
    useMutation(DOWNLOAD_FORM);

  const handleDownload = async () => {
    try {
      const { data } = await downloadForm({ variables: { formId: recordId } });
      if (data?.downloadFormResponsesInCSV?.returnStatus) {
        // Implement the download logic here
        toast({
          title: 'Success',
          description: 'Form responses downloaded successfully.'
        });
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to download form responses. Please try again.'
      });
    }
  };

  if (form.noOfResponses < 1) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center">Waiting for responses</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>
            {form.noOfResponses}{' '}
            {form.noOfResponses === 1 ? 'response' : 'responses'}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleDownload}
                disabled={downloadLoading || form.noOfResponses === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                <span>Download responses (.csv)</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="question">Question</TabsTrigger>
              <TabsTrigger value="individual">Individual</TabsTrigger>
            </TabsList>
            <TabsContent value="summary">
              <SummaryTab form={form} />
            </TabsContent>
            <TabsContent value="question">
              <QuestionTab form={form} />
            </TabsContent>
            <TabsContent value="individual">
              <IndividualTab recordId={recordId} form={form} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
