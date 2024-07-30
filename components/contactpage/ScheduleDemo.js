import { useState } from 'react';
import { useSnackbar } from 'notistack';
import countryList from './countryList';

const Scheduledemocomponent = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [country, setCountry] = useState('');
  const [schoolSize, setSchoolSize] = useState('');
  const [firstNameCheck, setFirstNameCheck] = useState(false);
  const [lastNameCheck, setLastNameCheck] = useState(false);
  const [emailCheck, setEmailCheck] = useState(false);
  const [phoneNumberCheck, setPhoneNumberCheck] = useState(false);
  const [schoolNameCheck, setSchoolNameCheck] = useState(false);
  const [countryCheck, setCountryCheck] = useState(false);

  /*const scheduleDemo = JSON.stringify({
        query: ` mutation {
            scheduleDemo(
                firstName:      "${firstName}"
                lastName:      "${lastName}"
                email:          "${email}"
                phoneNumber:    "${phoneNumber}"
                schoolName:    "${schoolName}"
                country:       "${country}"
                schoolSize:    ${schoolSize}
            )
            {
                id
            }
        }`,
    })*/

  const submitScheduleDemo = async () => {
    //e.preventDefault() // prevents page reload
    const graphqlQuery = {
      query: ` mutation scheduleDemo($firstName: String!, $lastName:String!, $email:String!, $phoneNumber:String, $schoolName:String!, $country: String!, $schoolSize:SchoolSize){
                scheduleDemo(
                    firstName:      $firstName
                    lastName:       $lastName
                    email:          $email
                    phoneNumber:    $phoneNumber
                    schoolName:     $schoolName
                    country:        $country
                    schoolSize:     $schoolSize
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
        schoolName: schoolName,
        country: country,
        schoolSize: schoolSize === '' ? 'UNDEF' : schoolSize
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
    //console.log(responseJson)
    if (
      responseJson &&
      responseJson.data &&
      responseJson.data.scheduleDemo !== null
    ) {
      enqueueSnackbar(
        "Your details have been sent. We'll get in touch with you shortly",
        { autoHideDuration: 5000, variant: 'success' }
      );
      setEmail('');
      setFirstName('');
      setLastName('');
      setPhoneNumber('');
      setSchoolName('');
      setCountry('');
      setSchoolSize('');
      setFirstNameCheck(false);
      setLastNameCheck(false);
      setEmailCheck(false);
      setPhoneNumberCheck(false);
      setSchoolNameCheck(false);
      setCountryCheck(false);
    } else if (responseJson && responseJson.errors) {
      enqueueSnackbar('Something went wrong. Please try again', {
        autoHideDuration: 3000,
        variant: 'error'
      });
      setEmail('');
      setFirstName('');
      setLastName('');
      setPhoneNumber('');
      setSchoolName('');
      setCountry('');
      setSchoolSize('');
      setFirstNameCheck(false);
      setLastNameCheck(false);
      setEmailCheck(false);
      setPhoneNumberCheck(false);
      setSchoolNameCheck(false);
      setCountryCheck(false);
    }
  };

  return (
    <section class="font-Ubuntu relative bg-white py-0 lg:py-20">
      <div class="mx-auto flex max-w-7xl flex-col items-center justify-between px-10 lg:flex-row xl:px-5">
        <div class="flex w-full flex-col items-center px-10 pb-20 pt-5 lg:flex-row lg:pt-20">
          <div class="relative w-full max-w-md bg-cover lg:w-7/12 lg:max-w-2xl">
            <div class="relative flex h-full w-full flex-col items-center justify-center lg:pr-10">
              <img src="/images/demo.jpg" />
            </div>
          </div>

          <div class="relative z-10 mt-20 w-full max-w-2xl lg:mt-0 lg:w-5/12">
            <div class="relative z-10 flex flex-col items-start justify-start rounded-xl bg-white p-10 shadow-2xl">
              <h4 class="w-full text-4xl font-medium leading-snug">
                Schedule a Demo
              </h4>
              <div class="relative mt-6 w-full space-y-8">
                <div class="-mx-2 mb-4 flex flex-wrap">
                  <div class="mb-4 w-full px-2 lg:mb-0 lg:w-1/2">
                    <input
                      class={
                        ((!firstNameCheck ||
                          (firstName.length > 1 &&
                            firstName.length < 33 &&
                            firstName.match(/^[a-z0-9]+$/i))) &&
                          'mt-2 block w-full rounded border border-gray-300 bg-white px-4 py-4 text-base placeholder-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-90') ||
                        (firstNameCheck &&
                          (firstName.length < 2 ||
                            firstName.length > 32 ||
                            (firstName.length > 1 &&
                              firstName.length < 33 &&
                              !firstName.match(/^[a-z0-9]+$/i))) &&
                          'mt-2 block w-full rounded border border-red-500 bg-red-50 px-4 py-4 text-base text-red-900 placeholder-red-800 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-opacity-90')
                      }
                      type="text"
                      name="firstName"
                      placeholder="First Name"
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

                  <div class="w-full px-2 lg:w-1/2">
                    <input
                      class={
                        ((!lastNameCheck ||
                          (lastName.length > 0 &&
                            lastName.length < 33 &&
                            lastName.match(/^[a-z0-9]+$/i))) &&
                          'mt-2 block w-full rounded border border-gray-300 bg-white px-4 py-4 text-base placeholder-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-90') ||
                        (lastNameCheck &&
                          (lastName.length === 0 ||
                            lastName.length > 32 ||
                            (lastName.length > 0 &&
                              lastName.length < 33 &&
                              !lastName.match(/^[a-z0-9]+$/i))) &&
                          'mt-2 block w-full rounded border border-red-500 bg-red-50 px-4 py-4 text-base text-red-900 placeholder-red-800 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-opacity-90')
                      }
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
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
                </div>

                <div class="relative">
                  <input
                    type="email"
                    name="email"
                    class={
                      ((!emailCheck ||
                        (email.length > 0 &&
                          email.match(
                            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                          ))) &&
                        'mt-2 block w-full rounded border border-gray-300 bg-white px-4 py-4 text-base placeholder-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-90') ||
                      (emailCheck &&
                        (email.length === 0 ||
                          !email.match(
                            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                          )) &&
                        'mt-2 block w-full rounded border border-red-500 bg-red-50 px-4 py-4 text-base text-red-900 placeholder-red-800 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-opacity-90')
                    }
                    placeholder="Email Address"
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
                        <span class="font-medium">
                          Must be a valid email address
                        </span>
                      </p>
                    )}
                </div>

                <div class="relative">
                  <input
                    type="text"
                    name="phoneNumber"
                    class={
                      ((!phoneNumberCheck ||
                        phoneNumber.length === 0 ||
                        (phoneNumber.length > 0 &&
                          phoneNumber.match(
                            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
                          ))) &&
                        'mt-2 block w-full rounded border border-gray-300 bg-white px-4 py-4 text-base placeholder-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-90') ||
                      (phoneNumberCheck &&
                        phoneNumber.length > 0 &&
                        !phoneNumber.match(
                          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
                        ) &&
                        'mt-2 block w-full rounded border border-red-500 bg-red-50 px-4 py-4 text-base text-red-900 placeholder-red-800 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-opacity-90')
                    }
                    placeholder="Phone Number (optional)"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  {phoneNumberCheck &&
                    phoneNumber.length > 0 &&
                    !phoneNumber.match(
                      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
                    ) && (
                      <p class="mt-0 text-sm text-red-600 dark:text-red-500">
                        <span class="font-medium">
                          Must be a valid phone number
                        </span>
                      </p>
                    )}
                </div>

                <div class="relative">
                  <input
                    type="text"
                    name="schoolName"
                    class={
                      ((!schoolNameCheck ||
                        (schoolName.length > 7 && schoolName.length < 65)) &&
                        'mt-2 block w-full rounded border border-gray-300 bg-white px-4 py-4 text-base placeholder-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-90') ||
                      (schoolNameCheck &&
                        (schoolName.length === 0 ||
                          (schoolName.length > 0 && schoolName.length < 8) ||
                          schoolName.length > 64) &&
                        'mt-2 block w-full rounded border border-red-500 bg-red-50 px-4 py-4 text-base text-red-900 placeholder-red-800 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-opacity-90')
                    }
                    placeholder="School Name"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                  />
                  {schoolNameCheck && schoolName.length === 0 && (
                    <p class="mt-0 text-sm text-red-600 dark:text-red-500">
                      <span class="font-medium">School name is required</span>
                    </p>
                  )}
                  {schoolNameCheck &&
                    schoolName.length > 0 &&
                    schoolName.length < 8 && (
                      <p class="mt-0 text-sm text-red-600 dark:text-red-500">
                        <span class="font-medium">
                          School name must be at least 8 characters
                        </span>
                      </p>
                    )}
                  {schoolNameCheck && schoolName.length > 64 && (
                    <p class="mt-0 text-sm text-red-600 dark:text-red-500">
                      <span class="font-medium">
                        School name must be at most 64 characters
                      </span>
                    </p>
                  )}
                </div>

                <div class="relative">
                  <select
                    id="country"
                    name="country"
                    class={
                      ((!countryCheck || country !== '') &&
                        'mt-2 block w-full rounded border border-gray-300 bg-white px-4 py-4 text-base placeholder-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-90') ||
                      (countryCheck &&
                        country === '' &&
                        'mt-2 block w-full rounded border border-red-500 bg-red-50 px-4 py-4 text-base text-red-900 placeholder-red-800 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-opacity-90')
                    }
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    {countryList.map((country) => (
                      <option
                        selected={country.countryName === ''}
                        disabled={country.countryName === ''}
                        hidden={country.countryName === ''}
                        value={country.countryName}
                      >
                        {country.countryValue}
                      </option>
                    ))}
                  </select>
                  {countryCheck && country === '' && (
                    <p class="mt-0 text-sm text-red-600 dark:text-red-500">
                      <span class="font-medium">Country is required</span>
                    </p>
                  )}
                </div>

                <div class="relative">
                  <select
                    id="size"
                    name="schoolSize"
                    class="mt-2 block w-full rounded border border-gray-300 bg-white px-4 py-4 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-90"
                    value={schoolSize}
                    onChange={(e) =>
                      setSchoolSize(
                        e.target.value === 'UNDEF' ? '' : e.target.value
                      )
                    }
                  >
                    <option value="" selected hidden>
                      Number of students (optional)
                    </option>
                    <option value="UNDEF" /*class="bg-gray-100"*/>
                      &nbsp;
                    </option>
                    <option value="LESS_THAN_10">Less than 10</option>
                    <option value="FROM_11_TO_25">11 - 25</option>
                    <option value="FROM_26_TO_50">26 - 50</option>
                    <option value="FROM_51_TO_200">51 - 200</option>
                    <option value="FROM_201_TO_1000">201 - 1000</option>
                    <option value="MORE_THAN_1000">More than 1000</option>
                  </select>
                </div>

                <div class="relative">
                  <button
                    class="ease inline-block w-full rounded-lg bg-indigo-500 px-4 py-4 text-center text-xl font-medium text-white transition duration-200 hover:bg-indigo-600"
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
                        schoolName.length < 8 ||
                        schoolName.length > 64 ||
                        country === ''
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
                        if (schoolName.length < 8 || schoolName.length > 64)
                          setSchoolNameCheck(true);
                        if (country === '') setCountryCheck(true);
                      } else submitScheduleDemo();
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
            <svg
              class="absolute left-0 top-0 z-0 -ml-12 -mt-12 h-32 w-32 fill-current text-indigo-700"
              viewBox="0 0 91 91"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g stroke="none" stroke-width="1" fill-rule="evenodd">
                <g fill-rule="nonzero">
                  <g>
                    <g>
                      <circle cx="3.261" cy="3.445" r="2.72"></circle>
                      <circle cx="15.296" cy="3.445" r="2.719"></circle>
                      <circle cx="27.333" cy="3.445" r="2.72"></circle>
                      <circle cx="39.369" cy="3.445" r="2.72"></circle>
                      <circle cx="51.405" cy="3.445" r="2.72"></circle>
                      <circle cx="63.441" cy="3.445" r="2.72"></circle>
                      <circle cx="75.479" cy="3.445" r="2.72"></circle>
                      <circle cx="87.514" cy="3.445" r="2.719"></circle>
                    </g>
                    <g transform="translate(0 12)">
                      <circle cx="3.261" cy="3.525" r="2.72"></circle>
                      <circle cx="15.296" cy="3.525" r="2.719"></circle>
                      <circle cx="27.333" cy="3.525" r="2.72"></circle>
                      <circle cx="39.369" cy="3.525" r="2.72"></circle>
                      <circle cx="51.405" cy="3.525" r="2.72"></circle>
                      <circle cx="63.441" cy="3.525" r="2.72"></circle>
                      <circle cx="75.479" cy="3.525" r="2.72"></circle>
                      <circle cx="87.514" cy="3.525" r="2.719"></circle>
                    </g>
                    <g transform="translate(0 24)">
                      <circle cx="3.261" cy="3.605" r="2.72"></circle>
                      <circle cx="15.296" cy="3.605" r="2.719"></circle>
                      <circle cx="27.333" cy="3.605" r="2.72"></circle>
                      <circle cx="39.369" cy="3.605" r="2.72"></circle>
                      <circle cx="51.405" cy="3.605" r="2.72"></circle>
                      <circle cx="63.441" cy="3.605" r="2.72"></circle>
                      <circle cx="75.479" cy="3.605" r="2.72"></circle>
                      <circle cx="87.514" cy="3.605" r="2.719"></circle>
                    </g>
                    <g transform="translate(0 36)">
                      <circle cx="3.261" cy="3.686" r="2.72"></circle>
                      <circle cx="15.296" cy="3.686" r="2.719"></circle>
                      <circle cx="27.333" cy="3.686" r="2.72"></circle>
                      <circle cx="39.369" cy="3.686" r="2.72"></circle>
                      <circle cx="51.405" cy="3.686" r="2.72"></circle>
                      <circle cx="63.441" cy="3.686" r="2.72"></circle>
                      <circle cx="75.479" cy="3.686" r="2.72"></circle>
                      <circle cx="87.514" cy="3.686" r="2.719"></circle>
                    </g>
                    <g transform="translate(0 49)">
                      <circle cx="3.261" cy="2.767" r="2.72"></circle>
                      <circle cx="15.296" cy="2.767" r="2.719"></circle>
                      <circle cx="27.333" cy="2.767" r="2.72"></circle>
                      <circle cx="39.369" cy="2.767" r="2.72"></circle>
                      <circle cx="51.405" cy="2.767" r="2.72"></circle>
                      <circle cx="63.441" cy="2.767" r="2.72"></circle>
                      <circle cx="75.479" cy="2.767" r="2.72"></circle>
                      <circle cx="87.514" cy="2.767" r="2.719"></circle>
                    </g>
                    <g transform="translate(0 61)">
                      <circle cx="3.261" cy="2.846" r="2.72"></circle>
                      <circle cx="15.296" cy="2.846" r="2.719"></circle>
                      <circle cx="27.333" cy="2.846" r="2.72"></circle>
                      <circle cx="39.369" cy="2.846" r="2.72"></circle>
                      <circle cx="51.405" cy="2.846" r="2.72"></circle>
                      <circle cx="63.441" cy="2.846" r="2.72"></circle>
                      <circle cx="75.479" cy="2.846" r="2.72"></circle>
                      <circle cx="87.514" cy="2.846" r="2.719"></circle>
                    </g>
                    <g transform="translate(0 73)">
                      <circle cx="3.261" cy="2.926" r="2.72"></circle>
                      <circle cx="15.296" cy="2.926" r="2.719"></circle>
                      <circle cx="27.333" cy="2.926" r="2.72"></circle>
                      <circle cx="39.369" cy="2.926" r="2.72"></circle>
                      <circle cx="51.405" cy="2.926" r="2.72"></circle>
                      <circle cx="63.441" cy="2.926" r="2.72"></circle>
                      <circle cx="75.479" cy="2.926" r="2.72"></circle>
                      <circle cx="87.514" cy="2.926" r="2.719"></circle>
                    </g>
                    <g transform="translate(0 85)">
                      <circle cx="3.261" cy="3.006" r="2.72"></circle>
                      <circle cx="15.296" cy="3.006" r="2.719"></circle>
                      <circle cx="27.333" cy="3.006" r="2.72"></circle>
                      <circle cx="39.369" cy="3.006" r="2.72"></circle>
                      <circle cx="51.405" cy="3.006" r="2.72"></circle>
                      <circle cx="63.441" cy="3.006" r="2.72"></circle>
                      <circle cx="75.479" cy="3.006" r="2.72"></circle>
                      <circle cx="87.514" cy="3.006" r="2.719"></circle>
                    </g>
                  </g>
                </g>
              </g>
            </svg>
            <svg
              class="absolute bottom-0 right-0 z-0 -mb-12 -mr-12 h-32 w-32 fill-current text-green-400"
              viewBox="0 0 91 91"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g stroke="none" stroke-width="1" fill-rule="evenodd">
                <g fill-rule="nonzero">
                  <g>
                    <g>
                      <circle cx="3.261" cy="3.445" r="2.72"></circle>
                      <circle cx="15.296" cy="3.445" r="2.719"></circle>
                      <circle cx="27.333" cy="3.445" r="2.72"></circle>
                      <circle cx="39.369" cy="3.445" r="2.72"></circle>
                      <circle cx="51.405" cy="3.445" r="2.72"></circle>
                      <circle cx="63.441" cy="3.445" r="2.72"></circle>
                      <circle cx="75.479" cy="3.445" r="2.72"></circle>
                      <circle cx="87.514" cy="3.445" r="2.719"></circle>
                    </g>
                    <g transform="translate(0 12)">
                      <circle cx="3.261" cy="3.525" r="2.72"></circle>
                      <circle cx="15.296" cy="3.525" r="2.719"></circle>
                      <circle cx="27.333" cy="3.525" r="2.72"></circle>
                      <circle cx="39.369" cy="3.525" r="2.72"></circle>
                      <circle cx="51.405" cy="3.525" r="2.72"></circle>
                      <circle cx="63.441" cy="3.525" r="2.72"></circle>
                      <circle cx="75.479" cy="3.525" r="2.72"></circle>
                      <circle cx="87.514" cy="3.525" r="2.719"></circle>
                    </g>
                    <g transform="translate(0 24)">
                      <circle cx="3.261" cy="3.605" r="2.72"></circle>
                      <circle cx="15.296" cy="3.605" r="2.719"></circle>
                      <circle cx="27.333" cy="3.605" r="2.72"></circle>
                      <circle cx="39.369" cy="3.605" r="2.72"></circle>
                      <circle cx="51.405" cy="3.605" r="2.72"></circle>
                      <circle cx="63.441" cy="3.605" r="2.72"></circle>
                      <circle cx="75.479" cy="3.605" r="2.72"></circle>
                      <circle cx="87.514" cy="3.605" r="2.719"></circle>
                    </g>
                    <g transform="translate(0 36)">
                      <circle cx="3.261" cy="3.686" r="2.72"></circle>
                      <circle cx="15.296" cy="3.686" r="2.719"></circle>
                      <circle cx="27.333" cy="3.686" r="2.72"></circle>
                      <circle cx="39.369" cy="3.686" r="2.72"></circle>
                      <circle cx="51.405" cy="3.686" r="2.72"></circle>
                      <circle cx="63.441" cy="3.686" r="2.72"></circle>
                      <circle cx="75.479" cy="3.686" r="2.72"></circle>
                      <circle cx="87.514" cy="3.686" r="2.719"></circle>
                    </g>
                    <g transform="translate(0 49)">
                      <circle cx="3.261" cy="2.767" r="2.72"></circle>
                      <circle cx="15.296" cy="2.767" r="2.719"></circle>
                      <circle cx="27.333" cy="2.767" r="2.72"></circle>
                      <circle cx="39.369" cy="2.767" r="2.72"></circle>
                      <circle cx="51.405" cy="2.767" r="2.72"></circle>
                      <circle cx="63.441" cy="2.767" r="2.72"></circle>
                      <circle cx="75.479" cy="2.767" r="2.72"></circle>
                      <circle cx="87.514" cy="2.767" r="2.719"></circle>
                    </g>
                    <g transform="translate(0 61)">
                      <circle cx="3.261" cy="2.846" r="2.72"></circle>
                      <circle cx="15.296" cy="2.846" r="2.719"></circle>
                      <circle cx="27.333" cy="2.846" r="2.72"></circle>
                      <circle cx="39.369" cy="2.846" r="2.72"></circle>
                      <circle cx="51.405" cy="2.846" r="2.72"></circle>
                      <circle cx="63.441" cy="2.846" r="2.72"></circle>
                      <circle cx="75.479" cy="2.846" r="2.72"></circle>
                      <circle cx="87.514" cy="2.846" r="2.719"></circle>
                    </g>
                    <g transform="translate(0 73)">
                      <circle cx="3.261" cy="2.926" r="2.72"></circle>
                      <circle cx="15.296" cy="2.926" r="2.719"></circle>
                      <circle cx="27.333" cy="2.926" r="2.72"></circle>
                      <circle cx="39.369" cy="2.926" r="2.72"></circle>
                      <circle cx="51.405" cy="2.926" r="2.72"></circle>
                      <circle cx="63.441" cy="2.926" r="2.72"></circle>
                      <circle cx="75.479" cy="2.926" r="2.72"></circle>
                      <circle cx="87.514" cy="2.926" r="2.719"></circle>
                    </g>
                    <g transform="translate(0 85)">
                      <circle cx="3.261" cy="3.006" r="2.72"></circle>
                      <circle cx="15.296" cy="3.006" r="2.719"></circle>
                      <circle cx="27.333" cy="3.006" r="2.72"></circle>
                      <circle cx="39.369" cy="3.006" r="2.72"></circle>
                      <circle cx="51.405" cy="3.006" r="2.72"></circle>
                      <circle cx="63.441" cy="3.006" r="2.72"></circle>
                      <circle cx="75.479" cy="3.006" r="2.72"></circle>
                      <circle cx="87.514" cy="3.006" r="2.719"></circle>
                    </g>
                  </g>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Scheduledemocomponent;
