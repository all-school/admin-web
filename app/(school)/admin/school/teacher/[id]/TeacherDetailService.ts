// File: [id]/TeacherDetailService.ts
import { gql } from '@apollo/client';

export const GET_TEACHER_BY_ID = gql`
  query teacher($id: ID!) {
    teacher(id: $id) {
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
`;

export const UPDATE_TEACHER = gql`
  mutation updateTeacher(
    $teacherId: ID!
    $firstName: String!
    $lastName: String!
  ) {
    updateTeacher(
      teacherId: $teacherId
      firstName: $firstName
      lastName: $lastName
    ) {
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
`;

export const GET_USER_ACCESS = gql`
  query userAccesses($queryByType: queryByType!, $queryById: ID) {
    userAccesses(queryByType: $queryByType, queryById: $queryById) {
      id
      email
      role
      status
      user {
        id
        firstName
        lastName
        profilePicture {
          id
          signedUrl
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
