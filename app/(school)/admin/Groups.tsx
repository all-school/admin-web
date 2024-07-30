import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import * as Sentry from '@sentry/react';

const NO_OF_GROUPS = gql`
  query {
    noOfEntries(entryType: GROUP)
  }
`;

export default function Groups() {
  const { data, error } = useQuery(NO_OF_GROUPS, {
    errorPolicy: 'none'
  });

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <h4 className="text-sm font-semibold text-muted-foreground">Groups</h4>
      </CardHeader>
      <CardContent className="flex flex-grow items-center justify-center">
        {data && data.noOfEntries ? (
          <span className="text-3xl font-bold">{data.noOfEntries}</span>
        ) : error ? (
          <span className="text-sm text-muted-foreground">Not available</span>
        ) : (
          <span className="text-sm text-muted-foreground">Loading...</span>
        )}
        {/* Uncomment and adapt if you want to add labels
        {data && data.difference && (
          <Badge variant={data.difference > 0 ? "success" : "destructive"} className="ml-2">
            {data.difference > 0 ? '+' : ''}{data.difference}%
          </Badge>
        )}
        */}
      </CardContent>
      {/* Uncomment and adapt if you want to add an avatar
      <CardFooter>
        <Avatar>
          <AttachMoneyIcon />
        </Avatar>
      </CardFooter>
      */}
    </Card>
  );
}
