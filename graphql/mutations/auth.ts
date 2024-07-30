import { gql } from '@apollo/client';
import client from '@/graphql/client';
export const SIGN_IN = gql`
  mutation signIn(
    $signUpType: signUpType!
    $email: String
    $phoneNumber: String
    $password: String!
  ) {
    signIn(
      email: $email
      password: $password
      signUpType: $signUpType
      phoneNumber: $phoneNumber
    ) {
      user {
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
      }
      currentUserAccount {
        id
        role
        isPrimary
        school {
          id
          name
          profilePicture {
            id
            fileName
            contentType
            objectKey
            url
            signedUrl
          }
        }
      }
    }
  }
`;

export const RESENDEMAIL = gql`
  mutation resendConfirmationEmail($email: String!) {
    resendConfirmationEmail(email: $email)
  }
`;
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

const SIGN_OUT = gql`
  mutation {
    signOut
  }
`;

export const logout = async () => {
  await new Promise((resolve, reject) => {
    client
      .mutate({
        mutation: SIGN_OUT
      })
      .then((response) => {
        if (response.data.signOut) {
          resolve(response.data.signOut);
        } else {
          reject(response);
        }
      })
      .catch((error) => {
        console.log('Error in signout');
        reject(error);
      });
  });
};

export const CURRENT_USER = gql`
  {
    myCurrentUserAccount {
      id
      role
      school {
        id
        name
        type
        board
        caption
        headTeacher {
          id
          firstName
          lastName
          profilePicture {
            id
            fileName
            contentType
            objectKey
            url
            signedUrl
          }
        }
        profilePicture {
          id
          fileName
          contentType
          objectKey
          url
          signedUrl
        }
        coverPicture {
          id
          fileName
          contentType
          objectKey
          url
          signedUrl
        }
        city
        country
        contactNumber
        contactEmail
      }
    }
  }
`;

export const getCurrentUser = () =>
  new Promise((resolve, reject) => {
    client
      .query({
        query: GET_ME
      })
      .then((response) => {
        if (response.data.me) {
          resolve(response.data.me);
        } else {
          reject(response);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getCurrentUserAccount = () =>
  new Promise((resolve, reject) => {
    client
      .query({
        query: CURRENT_USER
      })
      .then((response) => {
        if (response.data.myCurrentUserAccount) {
          resolve(response.data.myCurrentUserAccount);
        } else {
          reject(response);
          console(response);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });

export const CHANGE_PASSWORD = gql`
  mutation changePassword(
    $userId: ID!
    $existingPassword: String!
    $password: String!
  ) {
    changePassword(
      userId: $userId
      existingPassword: $existingPassword
      password: $password
    )
  }
`;
export const DELETE_USER = gql`
  mutation {
    deleteUser {
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
export const login = (signUpType, email, phoneNumber, password) => {
  let variables = {};
  if (signUpType === 'EMAIL')
    variables = {
      signUpType: signUpType,

      email: email,
      password: password
    };
  else
    variables = {
      signUpType: signUpType,
      phoneNumber: phoneNumber,

      password: password
    };
  new Promise((resolve, reject) => {
    client
      .mutate({
        variables: {
          ...variables
        },
        mutation: SIGN_IN,
        errorPolicy: 'all'
      })
      .then((response) => {
        console.log(response.data.signIn);
        if (response.data.signIn) {
          resolve(response.data.signIn);
        } else {
          reject(response);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};
