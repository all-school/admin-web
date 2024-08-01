import { useState } from 'react';
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

const FeedbackComponent = ({ onNavigateHome }) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [type, setType] = useState('');
  const [comment, setComment] = useState('');
  const [firstNameCheck, setFirstNameCheck] = useState(false);
  const [lastNameCheck, setLastNameCheck] = useState(false);
  const [emailCheck, setEmailCheck] = useState(false);
  const [phoneNumberCheck, setPhoneNumberCheck] = useState(false);
  const [typeCheck, setTypeCheck] = useState(false);
  const [commentCheck, setCommentCheck] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });

  const submitFeedback = async () => {
    const graphqlQuery = {
      query: `
                mutation submitFeedback($firstName: String!, $lastName:String!, $email:String!, $phoneNumber:String, $type:FeedbackType!, $comment: String!){
                    submitFeedback(
                        firstName: $firstName
                        lastName: $lastName
                        email: $email
                        phoneNumber: $phoneNumber
                        type: $type
                        comment: $comment
                    ) {
                        id
                    }
                }
            `,
      variables: {
        firstName,
        lastName,
        email,
        phoneNumber,
        type,
        comment
      }
    };

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(graphqlQuery)
      });
      const responseJson = await response.json();

      if (
        responseJson &&
        responseJson.data &&
        responseJson.data.submitFeedback !== null
      ) {
        setModalContent({
          title: 'Success',
          message: 'Your feedback has been submitted. Thank you for your input!'
        });
        resetForm();
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      setModalContent({
        title: 'Error',
        message: 'Something went wrong. Please try again.'
      });
    }

    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEmail('');
    setFirstName('');
    setLastName('');
    setPhoneNumber('');
    setType('');
    setComment('');
    setFirstNameCheck(false);
    setLastNameCheck(false);
    setEmailCheck(false);
    setPhoneNumberCheck(false);
    setTypeCheck(false);
    setCommentCheck(false);
  };

  const validateForm = () => {
    let isValid = true;
    if (
      firstName.length < 2 ||
      firstName.length > 32 ||
      !firstName.match(/^[a-z0-9]+$/i)
    ) {
      setFirstNameCheck(true);
      isValid = false;
    }
    if (
      lastName.length < 1 ||
      lastName.length > 32 ||
      !lastName.match(/^[a-z0-9]+$/i)
    ) {
      setLastNameCheck(true);
      isValid = false;
    }
    if (email.length === 0 || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setEmailCheck(true);
      isValid = false;
    }
    if (
      phoneNumber.length > 0 &&
      !phoneNumber.match(
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
      )
    ) {
      setPhoneNumberCheck(true);
      isValid = false;
    }
    if (type === '') {
      setTypeCheck(true);
      isValid = false;
    }
    if (comment.length === 0) {
      setCommentCheck(true);
      isValid = false;
    }
    return isValid;
  };

  return (
    <div className="font-Ubuntu bg-white py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-10 md:px-16">
        <div className="mx-auto mb-10 max-w-3xl md:mb-16">
          <p className="text-xs font-bold uppercase text-indigo-600">
            Feedback
          </p>
          <h2 className="mt-1 text-left text-2xl font-bold text-gray-800 md:mt-2 lg:text-3xl">
            Give us feedback about allschool
          </h2>
        </div>

        <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
          <Input
            type="text"
            name="firstName"
            placeholder="First Name"
            className={
              firstNameCheck &&
              (firstName.length < 2 ||
                firstName.length > 32 ||
                !firstName.match(/^[a-z0-9]+$/i))
                ? 'border-red-500'
                : ''
            }
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          {firstNameCheck && firstName.length === 0 && (
            <p className="mt-0 text-sm text-red-600 dark:text-red-500">
              <span className="font-medium">First name is required</span>
            </p>
          )}
          {/* Add similar error messages for other firstName conditions */}

          <Input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className={
              lastNameCheck &&
              (lastName.length === 0 ||
                lastName.length > 32 ||
                !lastName.match(/^[a-z0-9]+$/i))
                ? 'border-red-500'
                : ''
            }
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          {/* Add error messages for lastName */}

          <Input
            type="email"
            name="email"
            placeholder="Email Address"
            className={`sm:col-span-2 ${
              emailCheck &&
              (email.length === 0 || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
                ? 'border-red-500'
                : ''
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* Add error messages for email */}

          <Input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number (optional)"
            className={`sm:col-span-2 ${
              phoneNumberCheck &&
              phoneNumber.length > 0 &&
              !phoneNumber.match(
                /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
              )
                ? 'border-red-500'
                : ''
            }`}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          {/* Add error message for phoneNumber */}

          <Select value={type} onValueChange={(value) => setType(value)}>
            <SelectTrigger
              className={`sm:col-span-2 ${
                typeCheck && type === '' ? 'border-red-500' : ''
              }`}
            >
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PRODUCT_FEEDBACK">Product feedback</SelectItem>
              <SelectItem value="FEATURE_REQUEST">Feature request</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
          {/* Add error message for type */}

          <Textarea
            name="comment"
            placeholder="Comment"
            className={`sm:col-span-2 ${
              commentCheck && comment.length === 0 ? 'border-red-500' : ''
            }`}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          {/* Add error message for comment */}

          <div className="flex items-center justify-between sm:col-span-2">
            <Button
              onClick={() => {
                if (validateForm()) {
                  submitFeedback();
                }
              }}
            >
              Send
            </Button>
          </div>
        </div>

        <p className="mx-auto mt-5 max-w-3xl text-xs text-gray-400">
          Please allow up to 24-48 hour response during the weekdays.
        </p>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modalContent.title}</DialogTitle>
          </DialogHeader>
          <p>{modalContent.message}</p>
          <Button
            onClick={() => {
              setIsModalOpen(false);
              onNavigateHome();
            }}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeedbackComponent;
