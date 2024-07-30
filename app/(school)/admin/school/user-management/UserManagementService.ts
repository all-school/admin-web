import { gql } from '@apollo/client';

export const GET_USER_ACCESS = gql`
  query GetUserAccess($queryByType: queryByType!) {
    userAccesses(queryByType: $queryByType) {
      id
      email
      role
      userType
      status
      user {
        id
        firstName
        lastName
        profilePicture {
          signedUrl
        }
      }
      linkedTo {
        ... on Person {
          id
          firstName
          lastName
          profilePicture {
            signedUrl
          }
        }
        ... on Student {
          id
          firstName
          lastName
          profilePicture {
            signedUrl
          }
        }
        ... on Teacher {
          id
          firstName
          lastName
          profilePicture {
            signedUrl
          }
        }
      }
    }
  }
`;
export const GRANT_USER_ACCESS = gql`
  mutation grantUserAccess(
    $email: String!
    $userType: userType!
    $userTypeId: ID
    $notifyUserByEmail: Boolean!
  ) {
    grantUserAccess(
      email: $email
      userType: $userType
      userTypeId: $userTypeId
      notifyUserByEmail: $notifyUserByEmail
    ) {
      id
      email
      status
    }
  }
`;

export const DELETE_USER_ACCESS = gql`
  mutation deleteUserAccess($userAccessId: ID!) {
    deleteUserAccess(userAccessId: $userAccessId) {
      id
    }
  }
`;

export const RESEND_INVITATION = gql`
  mutation resendInvitation($userAccessId: ID!) {
    resendInvitation(userAccessId: $userAccessId) {
      id
    }
  }
`;

export const GET_STUDENT_BY_ID = gql`
  query GetStudentById($id: ID!) {
    student(id: $id) {
      id
      firstName
      lastName
    }
  }
`;

export const GET_TEACHER_BY_ID = gql`
  query GetTeacherById($id: ID!) {
    teacher(id: $id) {
      id
      firstName
      lastName
    }
  }
`;

export const GET_STUDENT_ID_BY_NAME = gql`
  query GetStudentIdByName($searchType: [SearchType!]!, $text: String!) {
    search(searchType: $searchType, text: $text) {
      ... on Student {
        id
        firstName
        lastName
        profilePicture {
          signedUrl
        }
      }
    }
  }
`;

export const getStudentIdByName = (text) =>
  new Promise((resolve, reject) => {
    client
      .query({
        variables: {
          searchType: 'STUDENT',
          text: text
        },
        query: GET_STUDENT_ID_BY_NAME
      })
      .then((response) => {
        if (response.data.search) {
          resolve(response.data.search);
        } else {
          reject(response);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
