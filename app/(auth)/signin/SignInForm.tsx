'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { SIGN_IN, RESENDEMAIL } from '@/graphql/mutations/auth';
import { useUserStore } from '@/stores/userStore';
import { useMutation } from '@apollo/client';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

interface Country {
  name: string;
  code: string;
  dial_code: string;
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

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showResendConfirmation, setShowResendConfirmation] = useState(false);
  const [isPhoneSignIn, setIsPhoneSignIn] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [showNoAccessDialog, setShowNoAccessDialog] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const setUserData = useUserStore((state) => state.setUserData);

  const [signIn, { loading: signInLoading }] = useMutation(SIGN_IN);
  const [resendConfirmationEmail, { loading: resendLoading }] =
    useMutation(RESENDEMAIL);

  useEffect(() => {
    setIsLoadingCountries(true);
    fetch('https://restcountries.com/v3.1/all?fields=name,idd,cca2')
      .then((response) => response.json())
      .then((data) => {
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
            dial_code:
              country.idd.root +
              (country.idd.suffixes ? country.idd.suffixes[0] : '')
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
        setSelectedCountry(
          filteredCountries.find((c: Country) => c.name === 'India') ||
            filteredCountries[0]
        );
        setIsLoadingCountries(false);
      })
      .catch((error) => {
        console.error('Error fetching countries:', error);
        setIsLoadingCountries(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await signIn({
        variables: {
          email: isPhoneSignIn ? undefined : email,
          phoneNumber: isPhoneSignIn
            ? selectedCountry?.dial_code + phoneNumber
            : undefined,
          password,
          signUpType: isPhoneSignIn ? 'PHONE' : 'EMAIL'
        }
      });

      if (data?.signIn?.user) {
        setUserData({
          user: data.signIn.user,
          currentUserAccount: data.signIn.currentUserAccount
        });

        if (data.signIn.currentUserAccount) {
          // Perform a full page refresh to /admin
          window.location.href = '/admin';
        } else {
          setShowNoAccessDialog(true);
        }
      } else {
        throw new Error('An unexpected error occurred during sign-in');
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('Email not confirmed')
      ) {
        setShowResendConfirmation(true);
        toast({
          title: 'Email not confirmed',
          description: 'Please confirm your email address to sign in.',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Error',
          description:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
          variant: 'destructive'
        });
      }
    }
  };

  const handleResendConfirmation = async () => {
    try {
      const { data } = await resendConfirmationEmail({
        variables: { email }
      });
      if (data?.resendConfirmationEmail) {
        toast({
          title: 'Confirmation email sent',
          description:
            'Please check your inbox and confirm your email address.',
          variant: 'default'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to resend confirmation email. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="mx-auto w-full max-w-md space-y-8 rounded-xl bg-white p-6 shadow-md">
      <h2 className="text-center text-2xl font-bold text-gray-800">Sign In</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="signin-type"
            className="text-sm font-medium text-gray-700"
          >
            Sign in with Phone
          </Label>
          <Switch
            id="signin-type"
            checked={isPhoneSignIn}
            onCheckedChange={setIsPhoneSignIn}
          />
        </div>

        {isPhoneSignIn ? (
          <div className="space-y-4">
            <Label
              htmlFor="phone"
              className="text-sm font-medium text-gray-700"
            >
              Phone Number
            </Label>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
              <Select
                disabled={isLoadingCountries}
                value={selectedCountry?.code}
                onValueChange={(value) =>
                  setSelectedCountry(
                    countries.find((c) => c.code === value) || null
                  )
                }
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue
                    placeholder={isLoadingCountries ? 'Loading...' : 'Country'}
                  />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name} ({country.dial_code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="flex-grow"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link
            href="signin/forgot-password"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Forgot your password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={signInLoading || isLoadingCountries}
        >
          {signInLoading ? 'Signing In...' : 'Sign in to account'}
        </Button>

        {showResendConfirmation && !isPhoneSignIn && (
          <Button
            type="button"
            variant="outline"
            className="mt-4 w-full"
            onClick={handleResendConfirmation}
            disabled={resendLoading}
          >
            {resendLoading ? 'Sending...' : 'Resend confirmation email'}
          </Button>
        )}
      </form>

      <div className="text-center">
        <Link
          href="/signup"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Don't have an account? Sign up
        </Link>
      </div>

      <Dialog open={showNoAccessDialog} onOpenChange={setShowNoAccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>No Account Access</DialogTitle>
            <DialogDescription>
              We apologize, but it appears you don't have access to any accounts
              at the moment. Please contact your institution's administrator to
              request access. They will be able to assist you in gaining the
              necessary permissions.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowNoAccessDialog(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
