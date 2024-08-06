import { gql } from '@apollo/client';
import client from '@/graphql/client';

// Queries
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

export const GET_EVENT_BY_ID = gql`
  query calendarEntry($id: ID!) {
    calendarEntry(id: $id) {
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

export const CURRENT_USER = gql`
  query GetCurrentUser {
    myCurrentUserAccount {
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
    }
  }
`;

export const GET_ALL_DETAILS_BY_NAME = gql`
  query search($searchType: [SearchType!]!, $text: String!) {
    search(searchType: $searchType, text: $text) {
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
      ... on Teacher {
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
`;

// Mutations
export const ADD_TO_CALENDAR = gql`
  mutation addToCalendar(
    $calendarEntryType: CalendarEntryType!
    $title: String!
    $startDateTime: DateTime!
    $endDateTime: DateTime
    $allDay: Boolean
    $description: String
    $sendTo: [ReceiverInput!]!
    $notifyByEmail: Boolean!
  ) {
    addToCalendar(
      calendarEntryType: $calendarEntryType
      title: $title
      startDateTime: $startDateTime
      endDateTime: $endDateTime
      allDay: $allDay
      description: $description
      sendTo: $sendTo
      notifyByEmail: $notifyByEmail
    ) {
      id
      calendarEntryType
      title
      startDateTime
      endDateTime
      allDay
      description
      sharedWith {
        id
        receiver {
          __typename
          ... on School {
            id
            name
          }
          ... on Group {
            id
            name
          }
          ... on Student {
            id
            firstName
            lastName
          }
        }
      }
    }
  }
`;

export const UPDATE_CALENDAR = gql`
  mutation updateCalendarEntry(
    $entryId: ID!
    $calendarEntryType: CalendarEntryType!
    $title: String!
    $startDateTime: DateTime!
    $endDateTime: DateTime
    $allDay: Boolean
    $description: String
    $sendTo: [ReceiverInput!]!
    $notifyByEmail: Boolean!
  ) {
    updateCalendarEntry(
      entryId: $entryId
      calendarEntryType: $calendarEntryType
      title: $title
      startDateTime: $startDateTime
      endDateTime: $endDateTime
      allDay: $allDay
      description: $description
      sendTo: $sendTo
      notifyByEmail: $notifyByEmail
    ) {
      id
      calendarEntryType
      title
      startDateTime
      endDateTime
      allDay
      description
      sharedWith {
        id
        receiver {
          __typename
          ... on School {
            id
            name
          }
          ... on Group {
            id
            name
          }
          ... on Student {
            id
            firstName
            lastName
          }
        }
      }
    }
  }
`;

export const DELETE_FROM_CALENDAR = gql`
  mutation deleteFromCalendar($entryId: ID!) {
    deleteFromCalendar(entryId: $entryId) {
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
          }
          ... on Group {
            id
            name
          }
          ... on Student {
            id
            firstName
            lastName
          }
        }
      }
    }
  }
`;

// Helper functions
export const getAllDetailsByName = async (text) => {
  try {
    const response = await client.query({
      query: GET_ALL_DETAILS_BY_NAME,
      variables: {
        searchType: ['GROUP', 'STUDENT'],
        text: text
      }
    });
    return response.data.search;
  } catch (error) {
    console.error('Error fetching details by name:', error);
    throw error;
  }
};
