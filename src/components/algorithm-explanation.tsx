"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const algorithms = {
  fcfs: {
    title: "First Come First Served (FCFS)",
    description:
      "Processes are executed in the order they arrive. It is simple but can lead to long waiting times if a large process arrives first.",
  },
  sjf: {
    title: "Shortest Job First (SJF)",
    description:
      "Executes the process with the shortest burst time first, reducing waiting time. However, it may cause starvation for longer processes.",
  },
  srtf: {
    title: "Shortest Remaining Time First (SRTF)",
    description:
      "A preemptive version of SJF, where the currently running process is interrupted if a new process has a shorter remaining time.",
  },
  priority: {
    title: "Priority Scheduling",
    description:
      "Processes are executed based on priority. Higher-priority processes run first, but this can lead to starvation if lower-priority processes are ignored.",
  },
  rr: {
    title: "Round Robin (RR)",
    description:
      "Each process is assigned a fixed time slice (quantum). After the quantum expires, the process is moved to the end of the queue. This ensures fair CPU time distribution.",
  },
};

export function AlgorithmExplanation() {
  const [, setSelectedAlgorithm] = useState("fcfs");

  return (
      <div className="container mx-auto py-6 space-y-6">
        <h2 className="text-3xl font-bold text-center">
          CPU Scheduling Algorithms
        </h2>
        <p className="text-muted-foreground text-center">
          Learn about different CPU scheduling algorithms and their behavior.
        </p>

        <Tabs defaultValue="fcfs" className="w-full">
          <TabsList className="grid grid-cols-5">
            {Object.keys(algorithms).map((key) => (
              <TabsTrigger
            key={key}
            value={key}
            onClick={() => setSelectedAlgorithm(key)}
            className="cursor-pointer"
              >
            {algorithms[key as keyof typeof algorithms].title.split(" ")[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.keys(algorithms).map((key) => (
            <TabsContent key={key} value={key}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {algorithms[key as keyof typeof algorithms].title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    {algorithms[key as keyof typeof algorithms].description}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
  );
}
