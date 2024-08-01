import { gql } from '@apollo/client';
import client from '@/lib/apolloClient';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

const GET_WRITE_SIGNED_URL = gql`
  mutation getWriteSignedUrl($fileName: String!, $contentType: String!) {
    getWriteSignedUrl(fileName: $fileName, contentType: $contentType) {
      returnStatus
      writeSignedUrl
      objectKey
      url
    }
  }
`;

const ADD_DOCUMENT = gql`
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

const DELETE_DOCUMENT = gql`
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

export const Upload = async (file, id, role, refetch, setUploading) => {
  try {
    setUploading(true);

    const { data } = await client.mutate({
      mutation: GET_WRITE_SIGNED_URL,
      variables: {
        fileName: file.name,
        contentType: file.type
      }
    });

    const { getWriteSignedUrl } = data;

    if (!getWriteSignedUrl || !getWriteSignedUrl.writeSignedUrl) {
      throw new Error('Failed to get write signed URL');
    }

    const { status } = await axios.put(getWriteSignedUrl.writeSignedUrl, file, {
      headers: { 'Content-Type': file.type }
    });

    if (status === 200) {
      const addedDocument = await addDocument(
        id,
        role,
        file.name,
        file.type,
        getWriteSignedUrl.url,
        getWriteSignedUrl.objectKey
      );

      await refetch();
      await client.reFetchObservableQueries();

      toast({
        title: 'Success',
        description: 'File uploaded and database updated successfully',
        variant: 'default'
      });

      return addedDocument.signedUrl;
    } else {
      throw new Error(`File upload failed with status: ${status}`);
    }
  } catch (error) {
    toast({
      title: 'Error',
      description: `Failed to upload file: ${error.message}`,
      variant: 'destructive'
    });
    return null;
  } finally {
    setUploading(false);
  }
};

const addDocument = async (
  entityTypeId,
  documentType,
  fileName,
  contentType,
  url,
  objectKey
) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_DOCUMENT,
      variables: {
        entityTypeId,
        documentType,
        document: {
          fileName,
          contentType,
          url,
          objectKey
        }
      }
    });
    return data.addDocument;
  } catch (error) {
    throw error;
  }
};

export const Delete = async (
  id,
  documentId,
  docType,
  refetch,
  setDeletePic
) => {
  try {
    setDeletePic(true);

    const { data } = await client.mutate({
      mutation: DELETE_DOCUMENT,
      variables: {
        documentType: docType,
        entityTypeId: id,
        documentId: documentId
      }
    });

    if (data.deleteDocument) {
      await refetch();
      await client.reFetchObservableQueries();

      toast({
        title: 'Success',
        description: 'File deleted successfully',
        variant: 'default'
      });
    } else {
      throw new Error('Delete operation failed');
    }
  } catch (error) {
    toast({
      title: 'Error',
      description: `Failed to delete file: ${error.message}`,
      variant: 'destructive'
    });
  } finally {
    setDeletePic(false);
  }
};
