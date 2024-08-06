import { gql } from '@apollo/client';
import client from '@/graphql/client';

export const GET_EVENTS = gql`
  query calendar($rangeStartDateTime: DateTime!, $rangeEndDateTime: DateTime!) {
    calendar(
      rangeStartDateTime: $rangeStartDateTime
      rangeEndDateTime: $rangeEndDateTime
    ) {
      id
      calendarEntryType
      title
      startDateTime
      endDateTime
      allDay
      description
      school {
        id
        name
      }
      sharedWith {
        id
        receiver {
          __typename
          ... on School {
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
          ... on Group {
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
          ... on Student {
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
      }
    }
  }
`;
