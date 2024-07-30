import { gql } from '@apollo/client';
export const MY_USER_ACCOUNTS = gql`
  {
    myUserAccounts {
      id
      email
      user {
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
      school {
        id
        name
      }
      userType
      linkedTo {
        __typename
        ... on Person {
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
      }
      headline
      role
      status
      isPrimary
    }
  }
`;
export const SET_USER = gql`
  mutation setCurrentUserAccount($userAccessId: ID!) {
    setCurrentUserAccount(userAccessId: $userAccessId) {
      id
      role
      isPrimary
    }
  }
`;

export const CURRENT_USER = gql`
  {
    myCurrentUserAccount {
      id
      role
      user {
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
      headline
      school {
        id
        name
        city
        country
        contactNumber
        contactEmail
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
        caption
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
      }
    }
  }
`;
export const CURRENT_USER_ACCOUNT = gql`
  {
    myCurrentUserAccount {
      id
      email
      user {
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
      school {
        id
        name
        country
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
      }
      userType
      linkedTo {
        __typename
        ... on Person {
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
      }
      role
      status
      isPrimary
    }
  }
`;
export const SET_PRIMARY_USER = gql`
  mutation setPrimaryUserAccess($userAccessId: ID!) {
    setPrimaryUserAccess(userAccessId: $userAccessId) {
      id
      isPrimary
    }
  }
`;

export const MINI_CURRENT_USER = gql`
  {
    myCurrentUserAccount {
      id
      role
      user {
        id
        firstName
        lastName
      }
    }
  }
`;
