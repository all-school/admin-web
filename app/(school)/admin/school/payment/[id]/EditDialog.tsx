// EditDialog.tsx
import React from 'react';
import { useMutation } from '@apollo/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { UPDATE_PAYMENT } from './PaymentService';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

const formSchema = z.object({
  title: z
    .string()
    .min(2, 'Must be at least 2 characters')
    .max(256, 'Must be at most 256 characters'),
  description: z.string().max(1024, 'Must be at most 1024 characters'),
  amount: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      'Must be a positive number'
    ),
  payTo: z.string().min(1, 'Pay to is required'),
  dueDate: z.date().optional(),
  dueTime: z.date().optional()
});

interface EditDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  payment: any;
  recordId: string;
  refetch: () => void;
  paymentAccounts: any[];
}

const EditDialog: React.FC<EditDialogProps> = ({
  open,
  setOpen,
  payment,
  recordId,
  refetch,
  paymentAccounts
}) => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: payment.title,
      description: payment.description,
      amount: payment.amount.toString(),
      payTo: payment.payTo.id,
      dueDate: payment.dueDateTime ? new Date(payment.dueDateTime) : undefined,
      dueTime: payment.dueDateTime ? new Date(payment.dueDateTime) : undefined
    }
  });

  const [updatePayment, { loading: updatePaymentLoading }] = useMutation(
    UPDATE_PAYMENT,
    {
      onCompleted(data) {
        toast({
          title: 'Success',
          description: 'Payment updated successfully'
        });
        refetch();
        setOpen(false);
      },
      onError(error) {
        toast({
          title: 'Error',
          description: 'Failed to update payment. Please try again.'
        });
      }
    }
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { title, description, amount, payTo, dueDate, dueTime } = values;
    let dueDateTime = null;
    if (dueDate && dueTime) {
      dueDateTime = new Date(dueDate);
      dueDateTime.setHours(dueTime.getHours(), dueTime.getMinutes());
    }

    updatePayment({
      variables: {
        paymentId: recordId,
        title,
        description,
        amount: parseInt(amount),
        currency: payment.currency,
        payTo,
        dueDateTime: dueDateTime?.toISOString()
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Payment</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pay To</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment account" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.accountName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-[240px] pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date < new Date('1900-01-01')
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-[240px] pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'HH:mm')
                            ) : (
                              <span>Pick a time</span>
                            )}
                            <Clock className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <div className="grid gap-2">
                          <div className="grid grid-cols-2 gap-2">
                            <Select
                              onValueChange={(value) => {
                                const newDate = new Date();
                                newDate.setHours(parseInt(value));
                                newDate.setMinutes(
                                  field.value ? field.value.getMinutes() : 0
                                );
                                field.onChange(newDate);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Hour" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 24 }, (_, i) => i).map(
                                  (hour) => (
                                    <SelectItem
                                      key={hour}
                                      value={hour.toString()}
                                    >
                                      {hour.toString().padStart(2, '0')}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                            <Select
                              onValueChange={(value) => {
                                const newDate = new Date();
                                newDate.setHours(
                                  field.value ? field.value.getHours() : 0
                                );
                                newDate.setMinutes(parseInt(value));
                                field.onChange(newDate);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Minute" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 60 }, (_, i) => i).map(
                                  (minute) => (
                                    <SelectItem
                                      key={minute}
                                      value={minute.toString()}
                                    >
                                      {minute.toString().padStart(2, '0')}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updatePaymentLoading}>
                {updatePaymentLoading ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
