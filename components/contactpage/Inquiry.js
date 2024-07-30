import { useState } from 'react';
import { useSnackbar } from 'notistack';

const Inquirycomponent = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [type, setType] = useState('');
  const [question, setQuestion] = useState('');
  const [firstNameCheck, setFirstNameCheck] = useState(false);
  const [lastNameCheck, setLastNameCheck] = useState(false);
  const [emailCheck, setEmailCheck] = useState(false);
  const [phoneNumberCheck, setPhoneNumberCheck] = useState(false);
  const [typeCheck, setTypeCheck] = useState(false);
  const [questionCheck, setQuestionCheck] = useState(false);

  const submitInquiry = async () => {
    //e.preventDefault() // prevents page reload
    const graphqlQuery = {
      query: ` mutation submitInquiry($firstName: String!, $lastName:String!, $email:String!, $phoneNumber:String, $type:InquiryType!, $question: String!){
                submitInquiry(
                    firstName:      $firstName
                    lastName:       $lastName
                    email:          $email
                    phoneNumber:    $phoneNumber
                    type:           $type
                    question:       $question
                )
                {
                    id
                }
            }`,
      variables: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        type: type,
        question: question
      }
    };
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    };
    const response = await fetch(process.env.REACT_APP_API_URL, options);
    const responseJson = await response.json();
    if (
      responseJson &&
      responseJson.data &&
      responseJson.data.submitInquiry !== null
    ) {
      enqueueSnackbar(
        "Your details have been sent. We'll get in touch with you shortly",
        { autoHideDuration: 5000, variant: 'success' }
      );
      setEmail('');
      setFirstName('');
      setLastName('');
      setPhoneNumber('');
      setType('');
      setQuestion('');
      setFirstNameCheck(false);
      setLastNameCheck(false);
      setEmailCheck(false);
      setPhoneNumberCheck(false);
      setTypeCheck(false);
      setQuestionCheck(false);
    } else if (responseJson && responseJson.errors) {
      enqueueSnackbar('Something went wrong. Please try again', {
        autoHideDuration: 3000,
        variant: 'error'
      });
      setEmail('');
      setFirstName('');
      setLastName('');
      setPhoneNumber('');
      setType('');
      setQuestion('');
      setFirstNameCheck(false);
      setLastNameCheck(false);
      setEmailCheck(false);
      setPhoneNumberCheck(false);
      setTypeCheck(false);
      setQuestionCheck(false);
    }
  };

  return (
    <div class="font-Ubuntu bg-white py-10 md:py-16">
      <div class="mx-auto max-w-7xl px-10 md:px-16">
        <div class="mx-auto mb-10 max-w-3xl md:mb-16">
          <p class="text-xs font-bold uppercase text-indigo-600">
            General inquiries
          </p>
          <h2 class="mt-1 text-left text-2xl font-bold text-gray-800 md:mt-2 lg:text-3xl">
            Need to ask us a question?
          </h2>

          {/* <p class="max-w-screen-md mx-auto mt-4 text-left text-gray-500 md:text-lg md:mt-6">
                        Fill out the form below and we'll do some research on our end and get back to you within 24-48 hours.
                    </p> */}
        </div>

        <div class="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
          <div>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              class={
                ((!firstNameCheck ||
                  (firstName.length > 1 &&
                    firstName.length < 33 &&
                    firstName.match(/^[a-z0-9]+$/i))) &&
                  'w-full rounded-md border bg-gray-50 px-3 py-2 text-gray-800 placeholder-gray-800 outline-none ring-indigo-500 transition duration-100 focus:ring') ||
                (firstNameCheck &&
                  (firstName.length < 2 ||
                    firstName.length > 32 ||
                    (firstName.length > 1 &&
                      firstName.length < 33 &&
                      !firstName.match(/^[a-z0-9]+$/i))) &&
                  'w-full rounded-md border border-red-500 bg-red-50 px-3 py-2 text-red-900 placeholder-red-800 outline-none ring-red-300 transition duration-100 focus:ring-2')
              }
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            {firstNameCheck && firstName.length === 0 && (
              <p class="mt-0 text-sm text-red-600 dark:text-red-500">
                <span class="font-medium">First name is required</span>
              </p>
            )}
            {firstNameCheck && firstName.length === 1 && (
              <p class="mt-0 text-sm text-red-600 dark:text-red-500">
                <span class="font-medium">
                  First name must be at least 2 characters
                </span>
              </p>
            )}
            {firstNameCheck && firstName.length > 32 && (
              <p class="mt-0 text-sm text-red-600 dark:text-red-500">
                <span class="font-medium">
                  First name must be at most 32 characters
                </span>
              </p>
            )}
            {firstNameCheck &&
              firstName.length > 1 &&
              firstName.length < 33 &&
              !firstName.match(/^[a-z0-9]+$/i) && (
                <p class="mt-0 text-sm text-red-600 dark:text-red-500">
                  <span class="font-medium">
                    First name must be alphanumeric
                  </span>
                </p>
              )}
          </div>

          <div>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              class={
                ((!lastNameCheck ||
                  (lastName.length > 0 &&
                    lastName.length < 33 &&
                    lastName.match(/^[a-z0-9]+$/i))) &&
                  'w-full rounded-md border bg-gray-50 px-3 py-2 text-gray-800 placeholder-gray-800 outline-none ring-indigo-500 transition duration-100 focus:ring') ||
                (lastNameCheck &&
                  (lastName.length === 0 ||
                    lastName.length > 32 ||
                    (lastName.length > 0 &&
                      lastName.length < 33 &&
                      !lastName.match(/^[a-z0-9]+$/i))) &&
                  'w-full rounded-md border border-red-500 bg-red-50 px-3 py-2 text-red-900 placeholder-red-800 outline-none ring-red-300 transition duration-100 focus:ring-2')
              }
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            {lastNameCheck && lastName.length === 0 && (
              <p class="mt-0 text-sm text-red-600 dark:text-red-500">
                <span class="font-medium">Last name is required</span>
              </p>
            )}
            {lastNameCheck && lastName.length > 32 && (
              <p class="mt-0 text-sm text-red-600 dark:text-red-500">
                <span class="font-medium">
                  Last name must be at most 32 characters
                </span>
              </p>
            )}
            {lastNameCheck &&
              lastName.length > 0 &&
              lastName.length < 33 &&
              !lastName.match(/^[a-z0-9]+$/i) && (
                <p class="mt-0 text-sm text-red-600 dark:text-red-500">
                  <span class="font-medium">
                    Last name must be alphanumeric
                  </span>
                </p>
              )}
          </div>

          <div class="sm:col-span-2">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              class={
                ((!emailCheck ||
                  (email.length > 0 &&
                    email.match(
                      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    ))) &&
                  'w-full rounded-md border bg-gray-50 px-3 py-2 text-gray-800 placeholder-gray-800 outline-none ring-indigo-500 transition duration-100 focus:ring') ||
                (emailCheck &&
                  (email.length === 0 ||
                    !email.match(
                      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    )) &&
                  'w-full rounded-md border border-red-500 bg-red-50 px-3 py-2 text-red-900 placeholder-red-800 outline-none ring-red-300 transition duration-100 focus:ring-2')
              }
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailCheck && email.length === 0 && (
              <p class="mt-0 text-sm text-red-600 dark:text-red-500">
                <span class="font-medium">Email address is required</span>
              </p>
            )}
            {emailCheck &&
              email.length > 0 &&
              !email.match(
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              ) && (
                <p class="mt-0 text-sm text-red-600 dark:text-red-500">
                  <span class="font-medium">Must be a valid email address</span>
                </p>
              )}
          </div>

          <div class="sm:col-span-2">
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number (optional)"
              class={
                ((!phoneNumberCheck ||
                  phoneNumber.length === 0 ||
                  (phoneNumber.length > 0 &&
                    phoneNumber.match(
                      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
                    ))) &&
                  'w-full rounded-md border bg-gray-50 px-3 py-2 text-gray-800 placeholder-gray-800 outline-none ring-indigo-500 transition duration-100 focus:ring') ||
                (phoneNumberCheck &&
                  phoneNumber.length > 0 &&
                  !phoneNumber.match(
                    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
                  ) &&
                  'w-full rounded-md border border-red-500 bg-red-50 px-3 py-2 text-red-900 placeholder-red-800 outline-none ring-red-300 transition duration-100 focus:ring-2')
              }
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            {phoneNumberCheck &&
              phoneNumber.length > 0 &&
              !phoneNumber.match(
                /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
              ) && (
                <p class="mt-0 text-sm text-red-600 dark:text-red-500">
                  <span class="font-medium">Must be a valid phone number</span>
                </p>
              )}
          </div>

          <div class="sm:col-span-2">
            <select
              id="type"
              name="type"
              class={
                ((!typeCheck || type !== '') &&
                  'w-full rounded-md border bg-gray-50 px-3 py-2 text-gray-800 placeholder-gray-800 outline-none ring-indigo-500 transition duration-100 focus:ring') ||
                (typeCheck &&
                  type === '' &&
                  'w-full rounded-md border border-red-500 bg-red-50 px-3 py-2 text-red-900 placeholder-red-800 outline-none ring-red-300 transition duration-100 focus:ring-2')
              }
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option class="text-white" value="" disabled selected hidden>
                Type
              </option>
              <option value="HELP_WITH_ACCOUNT">Help with my account</option>
              <option value="OTHER">Other</option>
            </select>
            {typeCheck && type === '' && (
              <p class="mt-0 text-sm text-red-600 dark:text-red-500">
                <span class="font-medium">Type is required</span>
              </p>
            )}
          </div>

          <div class="sm:col-span-2">
            <textarea
              name="question"
              placeholder="Question"
              class={
                ((!questionCheck || question.length > 0) &&
                  'h-64 w-full rounded-md border bg-gray-50 px-3 py-2 text-gray-800 placeholder-gray-800 outline-none ring-indigo-500 transition duration-100 focus:ring') ||
                (questionCheck &&
                  question.length === 0 &&
                  'h-64 w-full rounded-md border border-red-500 bg-red-50 px-3 py-2 text-red-900 placeholder-red-800 outline-none ring-red-300 transition duration-100 focus:ring-2')
              }
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            ></textarea>
            {questionCheck && question === '' && (
              <p class="mt-0 text-sm text-red-600 dark:text-red-500">
                <span class="font-medium">Question is required</span>
              </p>
            )}
          </div>

          <div class="flex items-center justify-between sm:col-span-2">
            <button
              //href="#_"
              class="inline-block rounded-md bg-indigo-600 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-500 transition duration-100 hover:bg-indigo-500 active:bg-indigo-700 md:text-base"
              type="submit"
              onClick={() => {
                if (
                  firstName.length < 2 ||
                  firstName.length > 32 ||
                  !firstName.match(/^[a-z0-9]+$/i) ||
                  lastName.length < 1 ||
                  lastName.length > 32 ||
                  !lastName.match(/^[a-z0-9]+$/i) ||
                  email.length === 0 ||
                  !email.match(
                    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                  ) ||
                  (phoneNumber.length > 0 &&
                    !phoneNumber.match(
                      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
                    )) ||
                  type === '' ||
                  question.length === 0
                ) {
                  if (
                    firstName.length < 2 ||
                    firstName.length > 32 ||
                    !firstName.match(/^[a-z0-9]+$/i)
                  )
                    setFirstNameCheck(true);
                  if (
                    lastName.length < 1 ||
                    lastName.length > 32 ||
                    !lastName.match(/^[a-z0-9]+$/i)
                  )
                    setLastNameCheck(true);
                  if (
                    email.length === 0 ||
                    !email.match(
                      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    )
                  )
                    setEmailCheck(true);
                  if (
                    phoneNumber.length > 0 &&
                    !phoneNumber.match(
                      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
                    )
                  )
                    setPhoneNumberCheck(true);
                  if (type === '') setTypeCheck(true);
                  if (question.length === 0) setQuestionCheck(true);
                } else submitInquiry();
              }}
            >
              Send
            </button>
          </div>
        </div>

        <p class="mx-auto mt-5 max-w-3xl text-xs text-gray-400">
          Please allow up to 24-48 hour response during the weekdays.
        </p>
      </div>
    </div>
  );
};

export default Inquirycomponent;
