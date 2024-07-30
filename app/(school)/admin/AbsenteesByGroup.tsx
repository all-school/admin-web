'use client';

import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';

const GET_TODAY_TOTAL_ABSENTEES = gql`
  query GetTodayTotalAbsenteesByGroup {
    getTodayTotalAbsenteesByGroup {
      groupId
      groupName
      absentCount
    }
  }
`;

// Predefined colors
const COLORS = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF',
  '#FF9F40',
  '#FF6384',
  '#C9CBCF',
  '#7BC043',
  '#F37735'
];

// Function to generate additional colors if needed
const generateColor = (index: number) => {
  return `hsl(${index * 137.508}, 50%, 60%)`;
};

export default function AbsenteesByGroup() {
  const { loading, error, data } = useQuery(GET_TODAY_TOTAL_ABSENTEES);

  const { totalAbsentees, chartData, colorMap } = useMemo(() => {
    if (data && data.getTodayTotalAbsenteesByGroup) {
      const total = data.getTodayTotalAbsenteesByGroup.reduce(
        (sum, group) => sum + group.absentCount,
        0
      );

      const colorMap = new Map();
      data.getTodayTotalAbsenteesByGroup.forEach((group, index) => {
        colorMap.set(group.groupId, COLORS[index] || generateColor(index));
      });

      const chartData = data.getTodayTotalAbsenteesByGroup.map((group) => ({
        name: group.groupName,
        value: group.absentCount,
        color: colorMap.get(group.groupId)
      }));

      return { totalAbsentees: total, chartData, colorMap };
    }
    return { totalAbsentees: 0, chartData: [], colorMap: new Map() };
  }, [data]);

  if (loading)
    return (
      <Card className="h-full">
        <CardContent className="flex h-full items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
        </CardContent>
      </Card>
    );

  if (error)
    return (
      <Card className="h-full">
        <CardContent className="h-full">Error: {error.message}</CardContent>
      </Card>
    );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Today's Absentees</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-center text-2xl font-bold">
          {totalAbsentees}
        </div>
        <div className="mb-4 h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value} absentees`, name]}
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ScrollArea className="h-[200px]">
          {data.getTodayTotalAbsenteesByGroup.map((group, index) => (
            <React.Fragment key={group.groupId}>
              <div className="flex justify-between py-2">
                <span className="flex items-center font-medium">
                  <span
                    className="mr-2 h-3 w-3 rounded-full"
                    style={{ backgroundColor: colorMap.get(group.groupId) }}
                  ></span>
                  {group.groupName}
                </span>
                <span>{group.absentCount}</span>
              </div>
              {index < data.getTodayTotalAbsenteesByGroup.length - 1 && (
                <Separator className="my-2" />
              )}
            </React.Fragment>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
