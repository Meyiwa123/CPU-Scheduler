"use client";

import type { Process, SchedulingResult } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface GanttChartProps {
  result: SchedulingResult;
  currentStep: number;
  processes: Process[];
}

export function GanttChart({
  result,
  currentStep,
  processes,
}: GanttChartProps) {
  const currentTimelineEntry = result.timeline[currentStep];
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];

  // Get process color by ID
  const getProcessColor = (id: number) => {
    return colors[(id - 1) % colors.length];
  };

  // Get process state at current step
  const getProcessState = (processId: number) => {
    const process = currentTimelineEntry.processStates.find(
      (p) => p.id === processId
    );
    return process?.state || "New";
  };

  return (
    <div className="space-y-6">
      {/* Current time and running process */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-sm font-medium">Current Time: </span>
          <span className="text-lg font-bold">{currentTimelineEntry.time}</span>
        </div>
        <div>
          <span className="text-sm font-medium">Running: </span>
          {currentTimelineEntry.runningProcess ? (
            <Badge
              className={`${getProcessColor(
                currentTimelineEntry.runningProcess
              )}`}
            >
              P{currentTimelineEntry.runningProcess}
            </Badge>
          ) : (
            <Badge variant="outline">Idle</Badge>
          )}
        </div>
      </div>

      {/* Gantt chart */}
      <div className="border rounded-lg p-4 bg-muted/20">
        <div className="flex h-12 mb-2">
          {result.ganttChart.map((entry, index) => {
            const width = `${(entry.duration / result.totalTime) * 100}%`;
            const isActive =
              currentTimelineEntry.time >= entry.startTime &&
              currentTimelineEntry.time < entry.startTime + entry.duration;

            return (
              <div
                key={index}
                className={`flex flex-col justify-center items-center border-r last:border-r-0 ${
                  isActive ? "ring-2 ring-offset-2 ring-primary" : ""
                }`}
                style={{ width }}
              >
                {entry.processId ? (
                  <div
                    className={`h-full w-full flex items-center justify-center ${getProcessColor(
                      entry.processId
                    )}`}
                  >
                    P{entry.processId}
                  </div>
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-300">
                    Idle
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex text-xs">
          {result.ganttChart.map((entry, index) => {
            const width = `${(entry.duration / result.totalTime) * 100}%`;
            return (
              <div
                key={`time-${index}`}
                className="flex justify-start"
                style={{ width }}
              >
                {entry.startTime}
              </div>
            );
          })}
          <div className="flex justify-start">{result.totalTime}</div>
        </div>
      </div>

      {/* Process states */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {processes.map((process) => {
          const state = getProcessState(process.id);
          return (
            <Card
              key={process.id}
              className="p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full ${getProcessColor(
                    process.id
                  )}`}
                ></div>
                <span className="font-medium">P{process.id}</span>
              </div>
              <Badge
                variant={state === "Running" ? "default" : "outline"}
                className={
                  state === "Running" ? getProcessColor(process.id) : ""
                }
              >
                {state}
              </Badge>
            </Card>
          );
        })}
      </div>

      {/* Ready queue */}
      <div>
        <h3 className="text-sm font-medium mb-2">Ready Queue</h3>
        <div className="flex gap-2 flex-wrap">
          {currentTimelineEntry.readyQueue.length > 0 ? (
            currentTimelineEntry.readyQueue.map((processId, index) => (
              <Badge key={index} className={getProcessColor(processId)}>
                P{processId}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">Empty</span>
          )}
        </div>
      </div>
    </div>
  );
}
