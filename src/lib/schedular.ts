import type { Process, SchedulingResult, GanttChartEntry, TimelineEntry, ProcessState } from "./types"

export function runSchedulingAlgorithm(
  processes: Process[],
  algorithm: string,
  timeQuantum?: number,
): SchedulingResult {
  // Create deep copy of processes to avoid modifying the original
  const processesClone: Process[] = JSON.parse(JSON.stringify(processes))

  // Sort processes by arrival time
  processesClone.sort((a, b) => a.arrivalTime - b.arrivalTime)

  let result: SchedulingResult

  switch (algorithm) {
    case "fcfs":
      result = fcfs(processesClone)
      break
    case "sjf":
      result = sjf(processesClone)
      break
    case "srtf":
      result = srtf(processesClone)
      break
    case "priority":
      result = priorityScheduling(processesClone)
      break
    case "rr":
      result = roundRobin(processesClone, timeQuantum || 2)
      break
    default:
      result = fcfs(processesClone)
  }

  return result
}

// First Come First Served (FCFS)
function fcfs(processes: Process[]): SchedulingResult {
  const ganttChart: GanttChartEntry[] = [];
  const timeline: TimelineEntry[] = [];
  const processStats: Process[] = JSON.parse(JSON.stringify(processes));

  let currentTime = 0;
  let completedProcesses = 0;

  // Initialize timeline at time 0
  timeline.push(
    createTimelineEntry(
      0,
      null,
      [],
      processes.map((p) => ({
        id: p.id,
        state: "New",
        remainingTime: p.burstTime,
      })),
    ),
  );

  while (completedProcesses < processes.length) {
    let selectedProcess: Process | null = null;

    // Find the first process that has arrived and hasn't been processed yet
    for (const process of processes) {
      if (process.arrivalTime <= currentTime && process.remainingTime > 0) {
        if (process.startTime === -1) {
          process.startTime = currentTime;
          process.responseTime = currentTime - process.arrivalTime;
        }
        selectedProcess = process;
        break;
      }
    }

    if (selectedProcess) {
      const duration = selectedProcess.remainingTime;

      // Add to Gantt chart
      ganttChart.push({
        processId: selectedProcess.id,
        startTime: currentTime,
        duration,
      });

      // Update process stats
      selectedProcess.remainingTime = 0;
      selectedProcess.finishTime = currentTime + duration;
      selectedProcess.turnaroundTime = selectedProcess.finishTime - selectedProcess.arrivalTime;
      selectedProcess.waitingTime = selectedProcess.turnaroundTime - selectedProcess.burstTime;

      // Create timeline entries for each time unit
      for (let t = 0; t < duration; t++) {
        const time = currentTime + t;
        const readyQueue = getReadyQueue(processes, time, selectedProcess?.id);
        const processStates = getProcessStates(processes, time, selectedProcess?.id);

        timeline.push(createTimelineEntry(time, selectedProcess.id, readyQueue, processStates));
      }

      currentTime += duration;
      completedProcesses++;
    } else {
      // No process available at current time, advance time to next arrival
      const nextArrival = processes.find((p) => p.arrivalTime > currentTime && p.remainingTime > 0);

      if (nextArrival) {
        // Add idle time to Gantt chart
        ganttChart.push({
          processId: null,
          startTime: currentTime,
          duration: nextArrival.arrivalTime - currentTime,
        });

        // Create timeline entry for idle time
        timeline.push(
          createTimelineEntry(
            currentTime,
            null,
            [],
            processes.map((p) => ({
              id: p.id,
              state: p.remainingTime === 0 ? "Terminated" : p.arrivalTime <= currentTime ? "Ready" : "New",
              remainingTime: p.remainingTime,
            })),
          ),
        );

        currentTime = nextArrival.arrivalTime;
      } else {
        currentTime++;
      }
    }
  }

  // Add final timeline entry
  timeline.push(
    createTimelineEntry(
      currentTime,
      null,
      [],
      processes.map((p) => ({
        id: p.id,
        state: "Terminated",
        remainingTime: 0,
      })),
    ),
  );

  // Calculate averages
  const averageWaitingTime = processStats.reduce((sum, p) => sum + p.waitingTime, 0) / processStats.length;
  const averageTurnaroundTime = processStats.reduce((sum, p) => sum + p.turnaroundTime, 0) / processStats.length;
  const averageResponseTime = processStats.reduce((sum, p) => sum + p.responseTime, 0) / processStats.length;

  return {
    ganttChart,
    timeline,
    totalTime: currentTime,
    processStats,
    averageWaitingTime,
    averageTurnaroundTime,
    averageResponseTime,
  };
}

// Shortest Job First (SJF) - Non-preemptive
function sjf(processes: Process[]): SchedulingResult {
  const ganttChart: GanttChartEntry[] = []
  const timeline: TimelineEntry[] = []
  const processStats: Process[] = JSON.parse(JSON.stringify(processes))

  let currentTime = 0
  let completedProcesses = 0

  // Initialize timeline at time 0
  timeline.push(
    createTimelineEntry(
      0,
      null,
      [],
      processes.map((p) => ({
        id: p.id,
        state: "New",
        remainingTime: p.burstTime,
      })),
    ),
  )

  while (completedProcesses < processes.length) {
    let selectedProcess: Process | null = null
    let shortestBurstTime = Number.MAX_VALUE

    // Find the process with shortest burst time among arrived processes
    for (const process of processes) {
      if (process.arrivalTime <= currentTime && process.remainingTime > 0) {
        if (process.burstTime < shortestBurstTime) {
          shortestBurstTime = process.burstTime
          selectedProcess = process
        }
      }
    }

    if (selectedProcess) {
      const duration = selectedProcess.remainingTime

      // If this is the first time the process runs, set start time
      if (selectedProcess.startTime === -1) {
        selectedProcess.startTime = currentTime
        selectedProcess.responseTime = currentTime - selectedProcess.arrivalTime
      }

      // Add to Gantt chart
      ganttChart.push({
        processId: selectedProcess.id,
        startTime: currentTime,
        duration,
      })

      // Update process stats
      selectedProcess.remainingTime = 0
      selectedProcess.finishTime = currentTime + duration
      selectedProcess.turnaroundTime = selectedProcess.finishTime - selectedProcess.arrivalTime
      selectedProcess.waitingTime = selectedProcess.turnaroundTime - selectedProcess.burstTime

      // Create timeline entries for each time unit
      for (let t = 0; t < duration; t++) {
        const time = currentTime + t
        const readyQueue = getReadyQueue(processes, time, selectedProcess?.id)
        const processStates = getProcessStates(processes, time, selectedProcess?.id)

        timeline.push(createTimelineEntry(time, selectedProcess.id, readyQueue, processStates))
      }

      currentTime += duration
      completedProcesses++
    } else {
      // No process available at current time, advance time to next arrival
      const nextArrival = processes.find((p) => p.arrivalTime > currentTime && p.remainingTime > 0)

      if (nextArrival) {
        // Add idle time to Gantt chart
        ganttChart.push({
          processId: null,
          startTime: currentTime,
          duration: nextArrival.arrivalTime - currentTime,
        })

        // Create timeline entry for idle time
        timeline.push(
          createTimelineEntry(
            currentTime,
            null,
            [],
            processes.map((p) => ({
              id: p.id,
              state: p.remainingTime === 0 ? "Terminated" : p.arrivalTime <= currentTime ? "Ready" : "New",
              remainingTime: p.remainingTime,
            })),
          ),
        )

        currentTime = nextArrival.arrivalTime
      } else {
        currentTime++
      }
    }
  }

  // Add final timeline entry
  timeline.push(
    createTimelineEntry(
      currentTime,
      null,
      [],
      processes.map((p) => ({
        id: p.id,
        state: "Terminated",
        remainingTime: 0,
      })),
    ),
  )

  // Calculate averages
  const averageWaitingTime = processStats.reduce((sum, p) => sum + p.waitingTime, 0) / processStats.length
  const averageTurnaroundTime = processStats.reduce((sum, p) => sum + p.turnaroundTime, 0) / processStats.length
  const averageResponseTime = processStats.reduce((sum, p) => sum + p.responseTime, 0) / processStats.length

  return {
    ganttChart,
    timeline,
    totalTime: currentTime,
    processStats,
    averageWaitingTime,
    averageTurnaroundTime,
    averageResponseTime,
  }
}

// Shortest Remaining Time First (SRTF) - Preemptive
function srtf(processes: Process[]): SchedulingResult {
  const ganttChart: GanttChartEntry[] = []
  const timeline: TimelineEntry[] = []
  const processStats: Process[] = JSON.parse(JSON.stringify(processes))

  let currentTime = 0
  let completedProcesses = 0
  let prevRunningProcess: number | null = null

  // Initialize timeline at time 0
  timeline.push(
    createTimelineEntry(
      0,
      null,
      [],
      processes.map((p) => ({
        id: p.id,
        state: "New",
        remainingTime: p.burstTime,
      })),
    ),
  )

  while (completedProcesses < processes.length) {
    let selectedProcess: Process | null = null
    let shortestRemainingTime = Number.MAX_VALUE

    // Find the process with shortest remaining time among arrived processes
    for (const process of processes) {
      if (process.arrivalTime <= currentTime && process.remainingTime > 0) {
        if (process.remainingTime < shortestRemainingTime) {
          shortestRemainingTime = process.remainingTime
          selectedProcess = process
        }
      }
    }

    if (selectedProcess) {
      // If this is the first time the process runs, set start time and response time
      if (selectedProcess.startTime === -1) {
        selectedProcess.startTime = currentTime
        selectedProcess.responseTime = currentTime - selectedProcess.arrivalTime
      }

      // Check if we need to add a new entry to Gantt chart (process switch)
      if (prevRunningProcess !== selectedProcess.id) {
        ganttChart.push({
          processId: selectedProcess.id,
          startTime: currentTime,
          duration: 1, // Will be updated if the same process continues
        })
        prevRunningProcess = selectedProcess.id
      } else {
        // Extend the duration of the last Gantt chart entry
        ganttChart[ganttChart.length - 1].duration++
      }

      // Create timeline entry
      const readyQueue = getReadyQueue(processes, currentTime, selectedProcess.id)
      const processStates = getProcessStates(processes, currentTime, selectedProcess.id)
      timeline.push(createTimelineEntry(currentTime, selectedProcess.id, readyQueue, processStates))

      // Update process
      selectedProcess.remainingTime--

      // Check if process is completed
      if (selectedProcess.remainingTime === 0) {
        selectedProcess.finishTime = currentTime + 1
        selectedProcess.turnaroundTime = selectedProcess.finishTime - selectedProcess.arrivalTime
        selectedProcess.waitingTime = selectedProcess.turnaroundTime - selectedProcess.burstTime
        completedProcesses++
        prevRunningProcess = null // Force a new Gantt chart entry
      }

      currentTime++
    } else {
      // No process available at current time, advance time to next arrival
      const nextArrival = processes.find((p) => p.arrivalTime > currentTime && p.remainingTime > 0)

      if (nextArrival) {
        // Add idle time to Gantt chart
        ganttChart.push({
          processId: null,
          startTime: currentTime,
          duration: nextArrival.arrivalTime - currentTime,
        })

        // Create timeline entry for idle time
        timeline.push(
          createTimelineEntry(
            currentTime,
            null,
            [],
            processes.map((p) => ({
              id: p.id,
              state: p.remainingTime === 0 ? "Terminated" : p.arrivalTime <= currentTime ? "Ready" : "New",
              remainingTime: p.remainingTime,
            })),
          ),
        )

        currentTime = nextArrival.arrivalTime
        prevRunningProcess = null
      } else {
        currentTime++
      }
    }
  }

  // Add final timeline entry
  timeline.push(
    createTimelineEntry(
      currentTime,
      null,
      [],
      processes.map((p) => ({
        id: p.id,
        state: "Terminated",
        remainingTime: 0,
      })),
    ),
  )

  // Calculate averages
  const averageWaitingTime = processStats.reduce((sum, p) => sum + p.waitingTime, 0) / processStats.length
  const averageTurnaroundTime = processStats.reduce((sum, p) => sum + p.turnaroundTime, 0) / processStats.length
  const averageResponseTime = processStats.reduce((sum, p) => sum + p.responseTime, 0) / processStats.length

  return {
    ganttChart,
    timeline,
    totalTime: currentTime,
    processStats,
    averageWaitingTime,
    averageTurnaroundTime,
    averageResponseTime,
  }
}

// Priority Scheduling (Non-preemptive)
function priorityScheduling(processes: Process[]): SchedulingResult {
  const ganttChart: GanttChartEntry[] = []
  const timeline: TimelineEntry[] = []
  const processStats: Process[] = JSON.parse(JSON.stringify(processes))

  let currentTime = 0
  let completedProcesses = 0

  // Initialize timeline at time 0
  timeline.push(
    createTimelineEntry(
      0,
      null,
      [],
      processes.map((p) => ({
        id: p.id,
        state: "New",
        remainingTime: p.burstTime,
      })),
    ),
  )

  while (completedProcesses < processes.length) {
    let selectedProcess: Process | null = null
    let highestPriority = Number.MAX_VALUE // Lower value = higher priority

    // Find the process with highest priority among arrived processes
    for (const process of processes) {
      if (process.arrivalTime <= currentTime && process.remainingTime > 0) {
        if (process.priority < highestPriority) {
          highestPriority = process.priority
          selectedProcess = process
        }
      }
    }

    if (selectedProcess) {
      const duration = selectedProcess.remainingTime

      // If this is the first time the process runs, set start time
      if (selectedProcess.startTime === -1) {
        selectedProcess.startTime = currentTime
        selectedProcess.responseTime = currentTime - selectedProcess.arrivalTime
      }

      // Add to Gantt chart
      ganttChart.push({
        processId: selectedProcess.id,
        startTime: currentTime,
        duration,
      })

      // Update process stats
      selectedProcess.remainingTime = 0
      selectedProcess.finishTime = currentTime + duration
      selectedProcess.turnaroundTime = selectedProcess.finishTime - selectedProcess.arrivalTime
      selectedProcess.waitingTime = selectedProcess.turnaroundTime - selectedProcess.burstTime

      // Create timeline entries for each time unit
      for (let t = 0; t < duration; t++) {
        const time = currentTime + t
        const readyQueue = getReadyQueue(processes, time, selectedProcess?.id)
        const processStates = getProcessStates(processes, time, selectedProcess?.id)

        timeline.push(createTimelineEntry(time, selectedProcess.id, readyQueue, processStates))
      }

      currentTime += duration
      completedProcesses++
    } else {
      // No process available at current time, advance time to next arrival
      const nextArrival = processes.find((p) => p.arrivalTime > currentTime && p.remainingTime > 0)

      if (nextArrival) {
        // Add idle time to Gantt chart
        ganttChart.push({
          processId: null,
          startTime: currentTime,
          duration: nextArrival.arrivalTime - currentTime,
        })

        // Create timeline entry for idle time
        timeline.push(
          createTimelineEntry(
            currentTime,
            null,
            [],
            processes.map((p) => ({
              id: p.id,
              state: p.remainingTime === 0 ? "Terminated" : p.arrivalTime <= currentTime ? "Ready" : "New",
              remainingTime: p.remainingTime,
            })),
          ),
        )

        currentTime = nextArrival.arrivalTime
      } else {
        currentTime++
      }
    }
  }

  // Add final timeline entry
  timeline.push(
    createTimelineEntry(
      currentTime,
      null,
      [],
      processes.map((p) => ({
        id: p.id,
        state: "Terminated",
        remainingTime: 0,
      })),
    ),
  )

  // Calculate averages
  const averageWaitingTime = processStats.reduce((sum, p) => sum + p.waitingTime, 0) / processStats.length
  const averageTurnaroundTime = processStats.reduce((sum, p) => sum + p.turnaroundTime, 0) / processStats.length
  const averageResponseTime = processStats.reduce((sum, p) => sum + p.responseTime, 0) / processStats.length

  return {
    ganttChart,
    timeline,
    totalTime: currentTime,
    processStats,
    averageWaitingTime,
    averageTurnaroundTime,
    averageResponseTime,
  }
}

// Round Robin
function roundRobin(processes: Process[], timeQuantum: number): SchedulingResult {
  const ganttChart: GanttChartEntry[] = []
  const timeline: TimelineEntry[] = []
  const processStats: Process[] = JSON.parse(JSON.stringify(processes))

  let currentTime = 0
  let completedProcesses = 0
  const queue: Process[] = []

  // Initialize timeline at time 0
  timeline.push(
    createTimelineEntry(
      0,
      null,
      [],
      processes.map((p) => ({
        id: p.id,
        state: "New",
        remainingTime: p.burstTime,
      })),
    ),
  )

  while (completedProcesses < processes.length) {
    // Add newly arrived processes to the queue
    for (const process of processes) {
      if (process.arrivalTime <= currentTime && process.remainingTime > 0 && !queue.some((p) => p.id === process.id)) {
        queue.push(process)
      }
    }

    if (queue.length > 0) {
      // Get the next process from the queue
      const currentProcess = queue.shift()!

      // If this is the first time the process runs, set start time
      if (currentProcess.startTime === -1) {
        currentProcess.startTime = currentTime
        currentProcess.responseTime = currentTime - currentProcess.arrivalTime
      }

      // Calculate how long this process will run
      const executionTime = Math.min(timeQuantum, currentProcess.remainingTime)

      // Add to Gantt chart
      ganttChart.push({
        processId: currentProcess.id,
        startTime: currentTime,
        duration: executionTime,
      })

      // Create timeline entries for each time unit
      for (let t = 0; t < executionTime; t++) {
        const time = currentTime + t

        // Get ready queue for this time (excluding the running process)
        const readyQueueIds = queue.map((p) => p.id)

        // Get process states
        const processStates = getProcessStates(processes, time, currentProcess.id)

        timeline.push(createTimelineEntry(time, currentProcess.id, readyQueueIds, processStates))
      }

      // Update current time
      currentTime += executionTime

      // Update remaining time
      currentProcess.remainingTime -= executionTime

      // Check if process is completed
      if (currentProcess.remainingTime === 0) {
        currentProcess.finishTime = currentTime
        currentProcess.turnaroundTime = currentProcess.finishTime - currentProcess.arrivalTime
        currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime
        completedProcesses++
      } else {
        // Add newly arrived processes before re-adding the current process
        for (const process of processes) {
          if (
            process.arrivalTime <= currentTime &&
            process.remainingTime > 0 &&
            !queue.some((p) => p.id === process.id) &&
            process.id !== currentProcess.id
          ) {
            queue.push(process)
          }
        }

        // Re-add the process to the end of the queue
        queue.push(currentProcess)
      }
    } else {
      // No process in queue, find next arrival
      const nextArrival = processes.find((p) => p.arrivalTime > currentTime && p.remainingTime > 0)

      if (nextArrival) {
        // Add idle time to Gantt chart
        ganttChart.push({
          processId: null,
          startTime: currentTime,
          duration: nextArrival.arrivalTime - currentTime,
        })

        // Create timeline entry for idle time
        timeline.push(
          createTimelineEntry(
            currentTime,
            null,
            [],
            processes.map((p) => ({
              id: p.id,
              state: p.remainingTime === 0 ? "Terminated" : p.arrivalTime <= currentTime ? "Ready" : "New",
              remainingTime: p.remainingTime,
            })),
          ),
        )

        currentTime = nextArrival.arrivalTime
      } else {
        // This shouldn't happen, but just in case
        currentTime++
      }
    }
  }

  // Add final timeline entry
  timeline.push(
    createTimelineEntry(
      currentTime,
      null,
      [],
      processes.map((p) => ({
        id: p.id,
        state: "Terminated",
        remainingTime: 0,
      })),
    ),
  )

  // Calculate averages
  const averageWaitingTime = processStats.reduce((sum, p) => sum + p.waitingTime, 0) / processStats.length
  const averageTurnaroundTime = processStats.reduce((sum, p) => sum + p.turnaroundTime, 0) / processStats.length
  const averageResponseTime = processStats.reduce((sum, p) => sum + p.responseTime, 0) / processStats.length

  return {
    ganttChart,
    timeline,
    totalTime: currentTime,
    processStats,
    averageWaitingTime,
    averageTurnaroundTime,
    averageResponseTime,
  }
}

// Helper functions
function createTimelineEntry(
  time: number,
  runningProcess: number | null,
  readyQueue: number[],
  processStates: ProcessState[],
): TimelineEntry {
  return {
    time,
    runningProcess,
    readyQueue,
    processStates,
  }
}

function getReadyQueue(processes: Process[], time: number, runningProcessId?: number | null): number[] {
  return processes
    .filter((p) => p.arrivalTime <= time && p.remainingTime > 0 && p.id !== runningProcessId)
    .map((p) => p.id)
}

function getProcessStates(processes: Process[], time: number, runningProcessId?: number | null): ProcessState[] {
  return processes.map((p) => {
    let state: "New" | "Ready" | "Running" | "Waiting" | "Terminated"

    if (p.remainingTime === 0) {
      state = "Terminated"
    } else if (p.id === runningProcessId) {
      state = "Running"
    } else if (p.arrivalTime > time) {
      state = "New"
    } else {
      state = "Ready"
    }

    return {
      id: p.id,
      state,
      remainingTime: p.remainingTime,
    }
  })
}

