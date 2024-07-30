// PaymentService.ts
import { gql } from '@apollo/client';

export const GET_PAYMENT_BY_ID = gql`
  query payment($id: ID!) {
    payment(id: $id) {
      id
      school {
        id
        name
      }
      title
      description
      amount
      currency
      formattedCurrency
      payTo {
        id
        accountId
        accountName
      }
      dueDateTime
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
      createdBy {
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
      noOfRecipients
      noOfResponses
      acceptPayment
      canDelete
    }
  }
`;

export const UPDATE_PAYMENT = gql`
  mutation updatePayment(
    $paymentId: ID!
    $title: String!
    $description: String!
    $amount: Int!
    $currency: String!
    $payTo: ID!
    $dueDateTime: DateTime
  ) {
    updatePayment(
      paymentId: $paymentId
      title: $title
      description: $description
      amount: $amount
      currency: $currency
      payTo: $payTo
      dueDateTime: $dueDateTime
    ) {
      id
      title
      description
      amount
      currency
      formattedCurrency
      payTo {
        id
        accountId
        accountName
      }
      dueDateTime
    }
  }
`;

export const GET_STUDENT_PAYMENTS_BY_PAYMENT = gql`
  query studentPaymentsByPayment(
    $paymentId: ID!
    $first: Int
    $afterCursor: ID
  ) {
    studentPaymentsByPayment(
      paymentId: $paymentId
      first: $first
      afterCursor: $afterCursor
    ) {
      totalCount
      edges {
        node {
          __typename
          ... on StudentPayment {
            id
            student {
              id
              firstName
              lastName
              profilePicture {
                signedUrl
              }
            }
            payment {
              id
              title
              amount
              currency
              formattedCurrency
              dueDateTime
            }
            status
            createdAt
            respondedAt
          }
        }
        cursor
      }
      pageInfo {
        startCursor
        hasNext
      }
    }
  }
`;
// PaymentService.ts (continued)

export const VIEW_RECEIPT = gql`
  query studentPaymentReceipt($studentPaymentId: ID!) {
    studentPaymentReceipt(studentPaymentId: $studentPaymentId) {
      returnStatus
      errorMessage
      receiptUrl
    }
  }
`;

export const DELETE_PAYMENT = gql`
  mutation deletePayment($paymentId: ID!) {
    deletePayment(paymentId: $paymentId) {
      id
    }
  }
`;

export const ACCEPT_PAYMENT = gql`
  mutation acceptPayment($paymentId: ID!, $accept: Boolean!) {
    acceptPayment(paymentId: $paymentId, accept: $accept) {
      id
      acceptPayment
    }
  }
`;
