import { gql } from '@apollo/client';

export const GET_DOCUMENTS = gql`
  query getDocuments($recordId: ID!, $recordType: String!) {
    getDocuments(recordId: $recordId, recordType: $recordType) {
      id
      note
      name
      type
      url
      resourcetype
    }
  }
`;

export const GET_SIGNED_UPLOAD_REQUEST = gql`
  mutation getSignedUploadRequest($fileName: String!, $fileType: String!) {
    getSignedUploadRequest(fileName: $fileName, fileType: $fileType) {
      url
      signedRequest
    }
  }
`;
export const GET_WRITE_SIGNED_URL = gql`
  mutation getWriteSignedUrl($fileName: String!, $contentType: String!) {
    getWriteSignedUrl(fileName: $fileName, contentType: $contentType) {
      returnStatus
      writeSignedUrl
      objectKey
      url
    }
  }
`;
export const GET_READ_SIGNED_URL = gql`
  mutation getReadSignedUrl($objectKey: String!) {
    getReadSignedUrl(objectKey: $objectKey) {
      returnStatus
      readSignedUrl
    }
  }
`;

export const ADD_DOCUMENT = gql`
  mutation addDocument(
    $entityTypeId: ID
    $documentType: DocumentType!
    $document: DocumentInput!
  ) {
    addDocument(
      entityTypeId: $entityTypeId
      documentType: $documentType
      document: $document
    ) {
      id
      fileName
      contentType
      objectKey
      url
      signedUrl
    }
  }
`;
export const DELETE_DOCUMENT = gql`
  mutation deleteDocument(
    $documentType: DocumentType!
    $entityTypeId: ID
    $documentId: ID!
  ) {
    deleteDocument(
      documentType: $documentType
      entityTypeId: $entityTypeId
      documentId: $documentId
    )
  }
`;
