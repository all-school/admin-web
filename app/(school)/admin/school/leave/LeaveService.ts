import { gql } from '@apollo/client';

export const GET_LEAVES = gql`
  query leaves($type: LeaveType!) {
    leaves(type: $type) {
      id
      summary
      from
      to
      noOfDays
      reason
      student {
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
      status
      appliedBy {
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
  }
`;

export const GET_LEAVES_BY_RANGE = gql`
  query leavesByRange($rangeStart: Date!, $rangeEnd: Date!) {
    leavesByRange(rangeStart: $rangeStart, rangeEnd: $rangeEnd) {
      id
      summary
      from
      to
      noOfDays
      reason
      student {
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
      status
      appliedBy {
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
      }
      createdAt
      approvedBy {
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
      }
      approvedAt
      attachments {
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

export const APPROVE_LEAVE = gql`
  mutation approveLeave($id: ID!, $approved: Boolean!) {
    approveLeave(id: $id, approved: $approved) {
      id
      summary
      from
      to
      noOfDays
      reason
      student {
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
      status
      appliedBy {
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
  }
`;

export const CANCEL_LEAVE = gql`
  mutation cancelLeave($id: ID!) {
    cancelLeave(id: $id) {
      id
      summary
      from
      to
      noOfDays
      reason
      student {
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
      status
      appliedBy {
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
  }
`;
