"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProcessForm } from "@/components/process-form";
import { GanttChart } from "@/components/gantt-chart";
import { ProcessTable } from "@/components/process-table";
import { AlgorithmConfig } from "@/components/algorithm-config";
import { Statistics } from "@/components/statistics";
import type { Process, SchedulingResult } from "@/lib/types";
import { runSchedulingAlgorithm } from "./lib/schedular";
import { Header } from "./components/header";
import { HeroSection } from "./components/hero-sectino";
import { Footer } from "./components/footer";
import { FloatingBubbles } from "./components/floating-bubbles";
import { AlgorithmExplanation } from "./components/algorithm-explanation";

export default function App() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [algorithm, setAlgorithm] = useState("fcfs");
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [result, setResult] = useState<SchedulingResult | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1000); // milliseconds per step

  const addProcess = (process: Process) => {
    setProcesses([...processes, { ...process, id: processes.length + 1 }]);
  };

  const removeProcess = (id: number) => {
    setProcesses(processes.filter((p) => p.id !== id));
    // Reset result when processes change
    setResult(null);
    setCurrentStep(0);
  };

  const updateProcess = (updatedProcess: Process) => {
    setProcesses(
      processes.map((p) => (p.id === updatedProcess.id ? updatedProcess : p))
    );
    // Reset result when processes change
    setResult(null);
    setCurrentStep(0);
  };

  const runSimulation = () => {
    if (processes.length === 0) return;

    const schedulingResult = runSchedulingAlgorithm(
      processes,
      algorithm,
      algorithm === "rr" ? timeQuantum : undefined
    );

    setResult(schedulingResult);
    setCurrentStep(0);
  };

  const startAnimation = () => {
    if (!result || currentStep >= result.timeline.length - 1) {
      runSimulation();
      setCurrentStep(0);
    }

    setIsRunning(true);

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (next >= (result?.timeline.length || 0)) {
          clearInterval(interval);
          setIsRunning(false);
          return prev;
        }
        return next;
      });
    }, speed);

    return () => clearInterval(interval);
  };

  const stopAnimation = () => {
    setIsRunning(false);
  };

  const resetSimulation = () => {
    setResult(null);
    setCurrentStep(0);
    setIsRunning(false);
  };

  const stepForward = () => {
    if (result && currentStep < result.timeline.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <FloatingBubbles />
      <Header />

      <main className="flex-1">
        <HeroSection />

        <section id="simulator" className="py-12 bg-muted/30">
          <div className="container mx-auto py-6 space-y-8">
            <div className="flex flex-col space-y-2">
              <h1 className="text-3xl font-bold">
                CPU Scheduling Visualization
              </h1>
              <p className="text-muted-foreground">
                Create processes, select an algorithm, and visualize CPU
                scheduling in action
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Configuration</CardTitle>
                  <CardDescription>
                    Set up processes and algorithm
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="algorithm">Scheduling Algorithm</Label>
                      <Select value={algorithm} onValueChange={setAlgorithm}>
                        <SelectTrigger id="algorithm">
                          <SelectValue placeholder="Select algorithm" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fcfs">
                            First Come First Served (FCFS)
                          </SelectItem>
                          <SelectItem value="sjf">
                            Shortest Job First (SJF)
                          </SelectItem>
                          <SelectItem value="srtf">
                            Shortest Remaining Time First (SRTF)
                          </SelectItem>
                          <SelectItem value="priority">
                            Priority Scheduling
                          </SelectItem>
                          <SelectItem value="rr">Round Robin (RR)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <AlgorithmConfig
                      algorithm={algorithm}
                      timeQuantum={timeQuantum}
                      setTimeQuantum={setTimeQuantum}
                    />
                  </div>

                  <ProcessForm addProcess={addProcess} algorithm={algorithm} />
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Process List</CardTitle>
                  <CardDescription>Manage your processes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProcessTable
                    processes={processes}
                    removeProcess={removeProcess}
                    updateProcess={updateProcess}
                    algorithm={algorithm}
                  />

                  <div className="flex justify-end mt-4 space-x-2">
                    <Button
                      variant="outline"
                      onClick={resetSimulation}
                      disabled={!result}
                    >
                      Reset
                    </Button>
                    <Button
                      onClick={runSimulation}
                      disabled={processes.length === 0}
                    >
                      Run Simulation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {result && (
              <Tabs defaultValue="gantt" className="w-full">
                <TabsList>
                  <TabsTrigger value="gantt">Gantt Chart</TabsTrigger>
                  <TabsTrigger value="stats">Statistics</TabsTrigger>
                </TabsList>
                <TabsContent value="gantt" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Execution Timeline</CardTitle>
                      <CardDescription>
                        Step {currentStep + 1} of {result.timeline.length}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <GanttChart
                        result={result}
                        currentStep={currentStep}
                        processes={processes}
                      />

                      <div className="flex items-center justify-center space-x-4">
                        <Button
                          variant="outline"
                          onClick={stepBackward}
                          disabled={currentStep === 0 || isRunning}
                        >
                          Previous Step
                        </Button>

                        {isRunning ? (
                          <Button variant="destructive" onClick={stopAnimation}>
                            Stop
                          </Button>
                        ) : (
                          <Button
                            onClick={startAnimation}
                            disabled={processes.length === 0}
                          >
                            {result ? "Resume" : "Start"} Animation
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          onClick={stepForward}
                          disabled={
                            !result ||
                            currentStep >= result.timeline.length - 1 ||
                            isRunning
                          }
                        >
                          Next Step
                        </Button>
                      </div>

                      <div className="flex items-center space-x-4">
                        <Label htmlFor="speed">Animation Speed (ms):</Label>
                        <Input
                          id="speed"
                          type="number"
                          min="100"
                          max="3000"
                          step="100"
                          value={speed}
                          onChange={(e) => setSpeed(Number(e.target.value))}
                          className="w-24"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="stats">
                  <Statistics result={result} processes={processes} />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </section>

        <section id="algorithms" className="py-12 bg-muted/30">
          <AlgorithmExplanation />
        </section>
      </main>

      <Footer />
    </div>
  );
}
