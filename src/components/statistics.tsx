"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Process, SchedulingResult } from "@/lib/types";

interface StatisticsProps {
  result: SchedulingResult;
  processes: Process[];
}

export function Statistics({ result, processes }: StatisticsProps) {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">
                Average Waiting Time
              </div>
              <div className="text-2xl font-bold">
                {result.averageWaitingTime.toFixed(2)}
              </div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">
                Average Turnaround Time
              </div>
              <div className="text-2xl font-bold">
                {result.averageTurnaroundTime.toFixed(2)}
              </div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">
                Average Response Time
              </div>
              <div className="text-2xl font-bold">
                {result.averageResponseTime.toFixed(2)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Process Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Process</TableHead>
                <TableHead>Arrival</TableHead>
                <TableHead>Burst</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>Finish</TableHead>
                <TableHead>Waiting</TableHead>
                <TableHead>Turnaround</TableHead>
                <TableHead>Response</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.processStats.map((process) => (
                <TableRow key={process.id}>
                  <TableCell>P{process.id}</TableCell>
                  <TableCell>{process.arrivalTime}</TableCell>
                  <TableCell>{process.burstTime}</TableCell>
                  <TableCell>{process.startTime}</TableCell>
                  <TableCell>{process.finishTime}</TableCell>
                  <TableCell>{process.waitingTime}</TableCell>
                  <TableCell>{process.turnaroundTime}</TableCell>
                  <TableCell>{process.responseTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
