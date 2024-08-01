import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import Image from 'next/image';

// Assuming this is the path to your country list file
import { COUNTRY_LIST } from './countryList';
import { on } from 'events';

const ScheduleDemoComponent = ({ onNavigateHome }) => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    schoolName: '',
    country: '',
    schoolSize: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let errors = {};
    if (
      formData.firstName.length < 2 ||
      formData.firstName.length > 32 ||
      !formData.firstName.match(/^[a-z0-9]+$/i)
    ) {
      errors.firstName = 'First name must be 2-32 characters and alphanumeric';
    }
    if (
      formData.lastName.length < 1 ||
      formData.lastName.length > 32 ||
      !formData.lastName.match(/^[a-z0-9]+$/i)
    ) {
      errors.lastName = 'Last name must be 1-32 characters and alphanumeric';
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = 'Please enter a valid email address';
    }
    if (
      formData.phoneNumber &&
      !formData.phoneNumber.match(
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
      )
    ) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }
    if (formData.schoolName.length < 8 || formData.schoolName.length > 64) {
      errors.schoolName = 'School name must be 8-64 characters';
    }
    if (!formData.country) {
      errors.country = 'Please select a country';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitScheduleDemo = async () => {
    if (!validateForm()) return;

    const graphqlQuery = {
      query: `
                mutation scheduleDemo($firstName: String!, $lastName:String!, $email:String!, $phoneNumber:String, $schoolName:String!, $country: String!, $schoolSize:SchoolSize){
                    scheduleDemo(
                        firstName: $firstName
                        lastName: $lastName
                        email: $email
                        phoneNumber: $phoneNumber
                        schoolName: $schoolName
                        country: $country
                        schoolSize: $schoolSize
                    ) {
                        id
                    }
                }
            `,
      variables: {
        ...formData,
        schoolSize: formData.schoolSize === '' ? 'UNDEF' : formData.schoolSize
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
        responseJson.data.scheduleDemo !== null
      ) {
        setModalContent({
          title: 'Success',
          message:
            "Your details have been sent. We'll get in touch with you shortly."
        });
        setFormData({
          email: '',
          firstName: '',
          lastName: '',
          phoneNumber: '',
          schoolName: '',
          country: '',
          schoolSize: ''
        });
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

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <section className="font-Ubuntu relative bg-white py-0 lg:py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-10 lg:flex-row xl:px-5">
        <div className="flex w-full flex-col items-center px-10 pb-20 pt-5 lg:flex-row lg:pt-20">
          <div className="relative w-full max-w-md bg-cover lg:w-7/12 lg:max-w-2xl">
            <div className="relative flex h-full w-full flex-col items-center justify-center lg:pr-10">
              <Image
                src="/images/demo.jpg"
                alt="Demo"
                width={500}
                height={300}
              />
            </div>
          </div>

          <div className="relative z-10 mt-20 w-full max-w-2xl lg:mt-0 lg:w-5/12">
            <div className="relative z-10 flex flex-col items-start justify-start rounded-xl bg-white p-10 shadow-2xl">
              <h4 className="w-full text-4xl font-medium leading-snug">
                Schedule a Demo
              </h4>
              <div className="relative mt-6 w-full space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="flex-1">
                    <Input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange('firstName', e.target.value)
                      }
                      className={formErrors.firstName ? 'border-red-500' : ''}
                    />
                    {formErrors.firstName && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.firstName}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange('lastName', e.target.value)
                      }
                      className={formErrors.lastName ? 'border-red-500' : ''}
                    />
                    {formErrors.lastName && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <Input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={formErrors.email ? 'border-red-500' : ''}
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.email}
                  </p>
                )}

                <Input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number (optional)"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    handleInputChange('phoneNumber', e.target.value)
                  }
                  className={formErrors.phoneNumber ? 'border-red-500' : ''}
                />
                {formErrors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.phoneNumber}
                  </p>
                )}

                <Input
                  type="text"
                  name="schoolName"
                  placeholder="School Name"
                  value={formData.schoolName}
                  onChange={(e) =>
                    handleInputChange('schoolName', e.target.value)
                  }
                  className={formErrors.schoolName ? 'border-red-500' : ''}
                />
                {formErrors.schoolName && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.schoolName}
                  </p>
                )}

                <Select
                  value={formData.country}
                  onValueChange={(value) => handleInputChange('country', value)}
                >
                  <SelectTrigger
                    className={`w-full ${
                      formErrors.country ? 'border-red-500' : ''
                    }`}
                  >
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent className="h-[250px]">
                    {COUNTRY_LIST.map((country) => (
                      <SelectItem
                        key={country.countryName}
                        value={country.countryName}
                      >
                        {country.countryValue}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.country && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.country}
                  </p>
                )}

                <Select
                  value={formData.schoolSize}
                  onValueChange={(value) =>
                    handleInputChange('schoolSize', value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Number of students (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UNDEF">&nbsp;</SelectItem>
                    <SelectItem value="LESS_THAN_10">Less than 10</SelectItem>
                    <SelectItem value="FROM_11_TO_25">11 - 25</SelectItem>
                    <SelectItem value="FROM_26_TO_50">26 - 50</SelectItem>
                    <SelectItem value="FROM_51_TO_200">51 - 200</SelectItem>
                    <SelectItem value="FROM_201_TO_1000">201 - 1000</SelectItem>
                    <SelectItem value="MORE_THAN_1000">
                      More than 1000
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button onClick={submitScheduleDemo} className="w-full">
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
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
    </section>
  );
};

export default ScheduleDemoComponent;
