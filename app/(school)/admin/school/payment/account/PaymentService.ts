// PaymentService.ts
import { gql } from '@apollo/client';

export const GET_PAYMENT_ACCOUNT_ONBOARD = gql`
  mutation paymentAccountOnboard($returnUrl: String!, $refreshUrl: String!) {
    paymentAccountOnboard(returnUrl: $returnUrl, refreshUrl: $refreshUrl) {
      returnStatus
      errorMessage
      accountLinkUrl
    }
  }
`;

export const GET_PAYMENT_ACCOUNT_CONTINUE_ONBOARD = gql`
  mutation paymentAccountContinueOnboard(
    $accountId: String!
    $returnUrl: String!
    $refreshUrl: String!
  ) {
    paymentAccountContinueOnboard(
      accountId: $accountId
      returnUrl: $returnUrl
      refreshUrl: $refreshUrl
    ) {
      returnStatus
      errorMessage
      accountLinkUrl
    }
  }
`;

export const GET_PAYMENT_ACCOUNTS = gql`
  query paymentAccounts($type: PaymentAccountType) {
    paymentAccounts(type: $type) {
      id
      accountId
      accountName
      onboardingComplete
      chargesEnabled
      payoutsEnabled
      defaultCurrency
    }
  }
`;
