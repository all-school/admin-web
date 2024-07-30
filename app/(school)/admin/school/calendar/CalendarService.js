import { gql } from '@apollo/client';
import client from '@/graphql/client';
const CalendarEvents = {
  calendarFragment: gql`
    fragment CalendarEvents on CalendarEntry {
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
  `
};

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

export const GET_SCHOOL_ID = gql`
  query GetSchoolId {
    school {
      id
    }
  }
`;

export const getAllDetailsByName = (text) =>
  new Promise((resolve, reject) => {
    client
      .query({
        variables: {
          searchType: ['GROUP', 'STUDENT'],
          text: text
        },
        query: GET_ALL_DETAILS_BY_NAME
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
