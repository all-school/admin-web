import { create } from 'zustand';
import { gql } from '@apollo/client';
import client from '@/graphql/client'; // Adjust this import based on your Apollo Client setup

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  setUser: (user: any) => void;
  logout: () => void;
}

const GET_ME = gql`
  {
    me {
      firstName
      id
      lastName
      phoneNumber
      isPhoneNumberConfirmed
      isEmailConfirmed
      email
      profilePicture {
        id
        fileName
        contentType
        objectKey
        url
        signedUrl
      }
      timezone
    }
  }
`;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const { data } = await client.query({ query: GET_ME });
      if (data.me) {
        set({ user: data.me, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error('Authentication error:', error);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
  setUser: (user) => set({ user, isAuthenticated: true, isLoading: false }),
  logout: () => set({ user: null, isAuthenticated: false, isLoading: false })
}));
