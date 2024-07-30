import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const NO_OF_STUDENTS = gql`
  query {
    noOfEntries(entryType: STUDENT)
  }
`;

export default function Students() {
  const { data, loading, error } = useQuery(NO_OF_STUDENTS, {
    errorPolicy: 'none'
  });

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <h3 className="text-sm font-medium text-muted-foreground">Students</h3>
      </CardHeader>
      <CardContent className="flex flex-grow items-center justify-center">
        {loading ? (
          <span className="text-sm text-muted-foreground">Loading...</span>
        ) : error ? (
          <span className="text-sm text-muted-foreground">Not available</span>
        ) : (
          <span className="text-3xl font-bold">
            {data && data.noOfEntries !== null && data.noOfEntries !== undefined
              ? data.noOfEntries
              : 'N/A'}
          </span>
        )}
      </CardContent>
    </Card>
  );
}
