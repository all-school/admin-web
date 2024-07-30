// AddPaymentDialog.tsx
import React, { useState } from 'react';
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
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CREATE_PAYMENT } from './PaymentService';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import AddSendDialog from './AddSendDialog';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

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

interface AddPaymentDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  datas: any[];
  setDatas: React.Dispatch<React.SetStateAction<any[]>>;
  paymentAccounts: any[];
  refetch: () => void;
}

const AddPaymentDialog: React.FC<AddPaymentDialogProps> = ({
  open,
  setOpen,
  datas,
  setDatas,
  paymentAccounts,
  refetch
}) => {
  const { toast } = useToast();
  const [addSendDialogOpen, setAddSendDialogOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('School');
  const [value, setValue] = useState([]);
  const [notifyMail, setNotifyMail] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      amount: '',
      payTo: paymentAccounts[0]?.id || '',
      dueDate: undefined,
      dueTime: undefined
    }
  });

  const [createPayment, { loading: createPaymentLoading }] = useMutation(
    CREATE_PAYMENT,
    {
      onCompleted(data) {
        setOpen(false);
        setDatas([data.createPayment, ...datas]);
        toast({
          title: 'Payment created',
          description: 'The payment has been successfully created.'
        });
        refetch();
        form.reset();
        setValue([]);
        setSelectedValue('School');
      },
      onError(error) {
        toast({
          title: 'Error',
          description: 'Something went wrong. Please try again.',
          variant: 'destructive'
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

    let sendTo =
      selectedValue === 'School'
        ? [{ receiverType: 'SCHOOL' }]
        : value.map((val: any) => ({
            receiverType: val.__typename.toUpperCase(),
            receiverId: val.id
          }));

    createPayment({
      variables: {
        title,
        description,
        amount: parseInt(amount),
        currency:
          paymentAccounts.find((account) => account.id === payTo)
            ?.defaultCurrency || '',
        payTo,
        dueDateTime,
        sendTo,
        notifyByEmail: notifyMail
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Payment</DialogTitle>
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
                    <Input placeholder="Payment title" {...field} />
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
                    <Textarea placeholder="Payment description" {...field} />
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
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Amount" {...field} />
                  </FormControl>
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
            <Button type="button" onClick={() => setAddSendDialogOpen(true)}>
              {selectedValue === 'School'
                ? 'Entire School'
                : 'Select Recipients'}
            </Button>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createPaymentLoading}>
                {createPaymentLoading ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
      <AddSendDialog
        open={addSendDialogOpen}
        setOpen={setAddSendDialogOpen}
        value={value}
        setValue={setValue}
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
        notifyMail={notifyMail}
        setNotifyMail={setNotifyMail}
      />
    </Dialog>
  );
};

export default AddPaymentDialog;
