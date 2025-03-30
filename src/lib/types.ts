export interface Process {
  id: number;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  remainingTime: number;
  startTime: number;
  finishTime: number;
  waitingTime: number;
  turnaroundTime: number;
  responseTime: number;
}

export interface GanttChartEntry {
  processId: number | null;
  startTime: number;
  duration: number;
}

export interface ProcessState {
  id: number;
  state: "New" | "Ready" | "Running" | "Waiting" | "Terminated";
  remainingTime: number;
}

export interface TimelineEntry {
  time: number;
  runningProcess: number | null;
  readyQueue: number[];
  processStates: ProcessState[];
}

export interface SchedulingResult {
  ganttChart: GanttChartEntry[];
  timeline: TimelineEntry[];
  totalTime: number;
  processStats: Process[];
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  averageResponseTime: number;
}
