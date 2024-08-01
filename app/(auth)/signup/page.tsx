'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ApolloProvider, useMutation, gql } from '@apollo/client';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import client from '@/graphql/client';

interface Country {
  name: string;
  code: string;
  timezone: string;
}

const G20_COUNTRIES = [
  'Argentina',
  'Australia',
  'Brazil',
  'Canada',
  'China',
  'France',
  'Germany',
  'India',
  'Indonesia',
  'Italy',
  'Japan',
  'Mexico',
  'Russia',
  'Saudi Arabia',
  'South Africa',
  'South Korea',
  'Turkey',
  'United Kingdom',
  'United States'
];

const EU_COUNTRIES = [
  'Austria',
  'Belgium',
  'Bulgaria',
  'Croatia',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Estonia',
  'Finland',
  'France',
  'Germany',
  'Greece',
  'Hungary',
  'Ireland',
  'Italy',
  'Latvia',
  'Lithuania',
  'Luxembourg',
  'Malta',
  'Netherlands',
  'Poland',
  'Portugal',
  'Romania',
  'Slovakia',
  'Slovenia',
  'Spain',
  'Sweden'
];

const PRIORITY_COUNTRIES = ['India', 'United Kingdom', 'United States'];

const SIGNUP_BY_PHONE = gql`
  mutation SignUp(
    $signUpType: signUpType!
    $phoneNumber: String!
    $firstName: String!
    $lastName: String!
    $password: String!
    $timezone: String!
  ) {
    signUp(
      signUpType: $signUpType
      phoneNumber: $phoneNumber
      firstName: $firstName
      lastName: $lastName
      password: $password
      timezone: $timezone
    ) {
      id
      phoneNumber
    }
  }
`;

const SIGNUP_BY_EMAIL = gql`
  mutation SignUp(
    $signUpType: signUpType!
    $email: String!
    $firstName: String!
    $lastName: String!
    $password: String!
    $timezone: String!
  ) {
    signUp(
      signUpType: $signUpType
      email: $email
      firstName: $firstName
      lastName: $lastName
      password: $password
      timezone: $timezone
    ) {
      id
      email
    }
  }
`;

function SignUpForm() {
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    showPassword: false,
    isPhoneSignUp: false,
    selectedCountry: null as Country | null
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const [signUpByPhone] = useMutation(SIGNUP_BY_PHONE);
  const [signUpByEmail] = useMutation(SIGNUP_BY_EMAIL);
  useEffect(() => {
    let isMounted = true;
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          'https://restcountries.com/v3.1/all?fields=name,cca2,timezones'
        );
        const data = await response.json();
        if (isMounted) {
          const filteredCountries = data
            .filter(
              (country: any) =>
                PRIORITY_COUNTRIES.includes(country.name.common) ||
                G20_COUNTRIES.includes(country.name.common) ||
                EU_COUNTRIES.includes(country.name.common)
            )
            .map((country: any) => ({
              name: country.name.common,
              code: country.cca2,
              timezone: country.timezones[0] // Using the first timezone for simplicity
            }))
            .sort((a: Country, b: Country) => {
              const aPriority = PRIORITY_COUNTRIES.indexOf(a.name);
              const bPriority = PRIORITY_COUNTRIES.indexOf(b.name);
              if (aPriority !== -1 && bPriority !== -1)
                return aPriority - bPriority;
              if (aPriority !== -1) return -1;
              if (bPriority !== -1) return 1;
              return a.name.localeCompare(b.name);
            });
          setCountries(filteredCountries);
          setFormState((prev) => ({
            ...prev,
            selectedCountry:
              filteredCountries.find((c: Country) => c.name === 'India') ||
              filteredCountries[0]
          }));
          setIsLoadingCountries(false);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
        if (isMounted) {
          setIsLoadingCountries(false);
        }
      }
    };

    fetchCountries();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormState((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const togglePasswordVisibility = useCallback(() => {
    setFormState((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  }, []);

  const handleCountryChange = useCallback(
    (value: string) => {
      const country = countries.find((c) => c.code === value);
      setFormState((prev) => ({ ...prev, selectedCountry: country || null }));
    },
    [countries]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!formState.selectedCountry) {
        toast({
          title: 'Error',
          description: 'Please select a country',
          variant: 'destructive'
        });
        return;
      }
      try {
        const signUpVariables = {
          signUpType: formState.isPhoneSignUp ? 'PHONE' : 'EMAIL',
          firstName: formState.firstName,
          lastName: formState.lastName,
          password: formState.password,
          timezone: formState.selectedCountry.timezone
        };

        if (formState.isPhoneSignUp) {
          const { data } = await signUpByPhone({
            variables: {
              ...signUpVariables,
              phoneNumber: formState.phoneNumber
            }
          });
          if (data?.signUp?.id) {
            toast({
              title: 'Sign up successful',
              description:
                'Please verify your phone number to complete the registration.',
              variant: 'default'
            });
          }
        } else {
          const { data } = await signUpByEmail({
            variables: {
              ...signUpVariables,
              email: formState.email
            }
          });
          if (data?.signUp?.id) {
            toast({
              title: 'Sign up successful',
              description: 'Please check your email to verify your account.',
              variant: 'default'
            });
          }
        }

        router.push('/verify-account');
      } catch (error) {
        toast({
          title: 'Error',
          description:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred during sign-up',
          variant: 'destructive'
        });
      }
    },
    [formState, signUpByPhone, signUpByEmail, toast, router]
  );

  if (isLoadingCountries) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-8 rounded-xl bg-white p-6 shadow-md">
      <h2 className="text-center text-2xl font-bold text-gray-800">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="signup-type"
            className="text-sm font-medium text-gray-700"
          >
            Sign up with Phone
          </Label>
          <Switch
            id="signup-type"
            checked={formState.isPhoneSignUp}
            onCheckedChange={(checked) =>
              setFormState((prev) => ({ ...prev, isPhoneSignUp: checked }))
            }
          />
        </div>

        <div className="space-y-4">
          <div>
            <Label
              htmlFor="firstName"
              className="text-sm font-medium text-gray-700"
            >
              First Name
            </Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Enter your first name"
              value={formState.firstName}
              onChange={handleInputChange}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label
              htmlFor="lastName"
              className="text-sm font-medium text-gray-700"
            >
              Last Name
            </Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Enter your last name"
              value={formState.lastName}
              onChange={handleInputChange}
              required
              className="mt-1"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="country"
              className="text-sm font-medium text-gray-700"
            >
              Country
            </Label>
            <Select
              value={formState.selectedCountry?.code}
              onValueChange={handleCountryChange}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] overflow-y-auto">
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formState.isPhoneSignUp ? (
            <div>
              <Label
                htmlFor="phoneNumber"
                className="text-sm font-medium text-gray-700"
              >
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                value={formState.phoneNumber}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
            </div>
          ) : (
            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formState.email}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
            </div>
          )}

          <div>
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <div className="relative mt-1">
              <Input
                id="password"
                name="password"
                type={formState.showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formState.password}
                onChange={handleInputChange}
                required
                className="pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={togglePasswordVisibility}
              >
                {formState.showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full">
          {formState.isPhoneSignUp
            ? 'Sign up with Phone'
            : 'Sign up with Email'}
        </Button>
      </form>

      <div className="text-center">
        <Link
          href="/signin"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <ApolloProvider client={client}>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-white to-blue-100 p-4">
        <SignUpForm />
      </div>
    </ApolloProvider>
  );
}
