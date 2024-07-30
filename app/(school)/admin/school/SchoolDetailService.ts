import { gql } from '@apollo/client';

export const UPDATE_SCHOOL = gql`
  mutation updateSchool(
    $schoolId: ID!
    $name: String!
    $type: schoolType
    $board: board
    $city: String
    $country: String
    $contactNumber: String
    $contactEmail: String
    $headTeacher: ID
    $caption: String
    $subdomain: String
    $timezone: String
  ) {
    updateSchool(
      schoolId: $schoolId
      name: $name
      type: $type
      board: $board
      city: $city
      country: $country
      contactNumber: $contactNumber
      contactEmail: $contactEmail
      headTeacher: $headTeacher
      caption: $caption
      subdomain: $subdomain
      timezone: $timezone
    ) {
      error
      school {
        id
        name
        type
        board
        city
        country
        contactNumber
        contactEmail
        headTeacher {
          id
          firstName
          lastName
        }
        caption
        subdomain
        timezone
      }
    }
  }
`;
export const MY_CURRENT_SCHOOL = gql`
  query myCurrentSchool {
    myCurrentSchool {
      id
      name
      type
      board
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
      subdomain
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
      timezone
    }
  }
`;

export const CHECK_SUBDOMAIN_AVAILABILITY = gql`
  query checkSubdomainAvailability($subdomain: String!) {
    checkSubdomainAvailability(subdomain: $subdomain)
  }
`;
