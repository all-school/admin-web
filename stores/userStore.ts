import { create } from 'zustand';

interface ProfilePicture {
  id: string;
  fileName: string;
  contentType: string;
  objectKey: string;
  url: string;
  signedUrl: string;
}

interface User {
  firstName: string;
  id: string;
  lastName: string;
  phoneNumber: string;
  isPhoneNumberConfirmed: boolean;
  isEmailConfirmed: boolean;
  email: string;
  profilePicture: ProfilePicture;
}

interface School {
  id: string;
  name: string;
  profilePicture: ProfilePicture;
}

interface CurrentUserAccount {
  id: string;
  role: string;
  isPrimary: boolean;
  school: School;
}

interface UserState {
  user: User | null;
  currentUserAccount: CurrentUserAccount | null;
  setUserData: (userData: {
    user: User;
    currentUserAccount: CurrentUserAccount;
  }) => void;
  clearUserData: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  currentUserAccount: null,
  setUserData: (userData) => set(userData),

  clearUserData: () => set({ user: null, currentUserAccount: null })
}));
