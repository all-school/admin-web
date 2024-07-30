// StudentPaymentService.ts
import { gql } from '@apollo/client';

export const GET_STUDENT_PAYMENT_BY_ID = gql`
  query studentPayment($id: ID!) {
    studentPayment(id: $id) {
      id
      student {
        id
        firstName
        lastName
        dob
        fatherName
        motherName
        bloodGroup
        profilePicture {
          id
          fileName
          contentType
          objectKey
          url
          signedUrl
        }
      }
      payment {
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
        dueDateTime
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
      }
      status
      createdAt
      respondedBy {
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
      respondedAt
    }
  }
`;

export const VIEW_RECEIPT = gql`
  query studentPaymentReceipt($studentPaymentId: ID!) {
    studentPaymentReceipt(studentPaymentId: $studentPaymentId) {
      returnStatus
      errorMessage
      receiptUrl
    }
  }
`;
