// File: services/TimetableService.ts
import { gql } from '@apollo/client';
import client from '@/graphql/client';

export const ADD_TO_TIMETABLE = gql`
  mutation addToTimetable(
    $group: ID!
    $subject: String!
    $start: DateTime!
    $end: DateTime!
    $recurrence: RecurrenceInput
  ) {
    addToTimetable(
      group: $group
      subject: $subject
      start: $start
      end: $end
      recurrence: $recurrence
    ) {
      error
      timetable {
        id
        subject
        start
        end
        recurrence {
          endsOn
          endType
          recurrenceType
        }
      }
    }
  }
`;

export const GET_TIMETABLE = gql`
  query timetable($group: ID!, $rangeStart: DateTime!, $rangeEnd: DateTime!) {
    timetable(group: $group, rangeStart: $rangeStart, rangeEnd: $rangeEnd) {
      id
      subject
      start
      end
      recurrence {
        recurrenceType
        dayRecurrence {
          frequency
        }
        weekRecurrence {
          frequency
          repeatOn
        }
        monthRecurrence {
          frequency
          repeatOn
        }
        endType
        endsOn
        endsAfterOccurrences
      }
    }
  }
`;

export const GET_TIMETABLE_BY_ID = gql`
  query timetableEntry($id: ID!) {
    timetableEntry(id: $id) {
      id
      subject
      start
      end
      recurrence {
        endsOn
        endType
        recurrenceType
      }
    }
  }
`;

export const DELETE_FROM_TIMETABLE = gql`
  mutation deleteFromTimetable(
    $id: ID!
    $recurringEventType: RecurringEventType
  ) {
    deleteFromTimetable(id: $id, recurringEventType: $recurringEventType) {
      error
      timetable {
        id
      }
    }
  }
`;
export const UPDATE_TIMETABLE = gql`
  mutation updateTimetableEntry(
    $id: ID!
    $subject: String!
    $start: DateTime!
    $end: DateTime!
  ) {
    updateTimetableEntry(id: $id, subject: $subject, start: $start, end: $end) {
      error
      timetable {
        id
        subject
        start
        end
        recurrence {
          endsOn
          endType
          recurrenceType
        }
      }
    }
  }
`;

export const GET_GROUPS = gql`
  {
    groups(queryByType: SCHOOL) {
      id
      name
    }
  }
`;

export const GET_TEAMS_BY_GROUP = gql`
  query teams($queryById: ID!) {
    teams(queryByType: GROUP, queryById: $queryById) {
      id
      name
    }
  }
`;

export const getTeamsByGroupId = (id) =>
  new Promise((resolve, reject) => {
    //setTeamsLoading(true)
    client
      .query({
        variables: {
          queryByType: 'GROUP',
          queryById: id
        },
        query: GET_TEAMS_BY_GROUP
      })
      .then((response) => {
        if (response.data.teams) {
          resolve(response.data.teams);
        } else {
          reject(response);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });

export const GET_ID_BY_NAME = gql`
  query search($searchType: [SearchType!]!, $text: String!) {
    search(searchType: $searchType, text: $text) {
      __typename
      ... on Group {
        id
        name
      }
    }
  }
`;

export const getGroupIdByName = (text) =>
  new Promise((resolve, reject) => {
    client
      .query({
        variables: {
          searchType: 'GROUP',
          text: text
        },
        query: GET_ID_BY_NAME
      })
      .then((response) => {
        if (response.data.search.length > 0) {
          resolve(response.data.search[0].id);
        } else {
          reject(response);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getTeamIdByName = (text) =>
  new Promise((resolve, reject) => {
    client
      .query({
        variables: {
          searchType: 'TEAM',
          text: text
        },
        query: GET_ID_BY_NAME
      })
      .then((response) => {
        if (response.data.search.length > 0) {
          resolve(response.data.search[0].id);
        } else {
          reject(response);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getTimetableData = (groupId, start, end) =>
  new Promise((resolve, reject) => {
    client
      .query({
        variables: {
          group: groupId,
          rangeStart: start,
          rangeEnd: end
        },
        query: GET_TIMETABLE,
        fetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-first'
      })
      .then((response) => {
        if (response.data.timetable) {
          resolve(response.data.timetable);
        } else {
          reject(response);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
