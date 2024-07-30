import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

const NO_OF_TEACHERS = gql`
  query {
    noOfEntries(entryType: TEACHER)
  }
`;

export default function Teachers() {
  const { data, error } = useQuery(NO_OF_TEACHERS, {
    errorPolicy: 'none'
  });

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <h3 className="text-sm font-medium text-muted-foreground">Teachers</h3>
      </CardHeader>
      <CardContent className="flex flex-grow items-center justify-center">
        {data && data.noOfEntries ? (
          <span className="text-3xl font-bold">{data.noOfEntries}</span>
        ) : error ? (
          <span className="text-sm text-muted-foreground">Not available</span>
        ) : (
          <span className="text-sm text-muted-foreground">Loading...</span>
        )}
      </CardContent>
    </Card>
  );
}
