"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Process } from "@/lib/types";

interface ProcessFormProps {
  addProcess: (process: Process) => void;
  algorithm: string;
}

export function ProcessForm({ addProcess, algorithm }: ProcessFormProps) {
  const [arrivalTime, setArrivalTime] = useState("0");
  const [burstTime, setBurstTime] = useState("1");
  const [priority, setPriority] = useState("1");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const process: Process = {
      id: 0, // Will be set by parent component
      arrivalTime: Number.parseInt(arrivalTime),
      burstTime: Number.parseInt(burstTime),
      priority: Number.parseInt(priority),
      remainingTime: Number.parseInt(burstTime),
      startTime: -1,
      finishTime: -1,
      waitingTime: 0,
      turnaroundTime: 0,
      responseTime: -1,
    };

    addProcess(process);

    // Reset form
    setArrivalTime("0");
    setBurstTime("1");
    setPriority("1");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="arrivalTime">Arrival Time</Label>
        <Input
          id="arrivalTime"
          type="number"
          min="0"
          value={arrivalTime}
          onChange={(e) => setArrivalTime(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="burstTime">Burst Time</Label>
        <Input
          id="burstTime"
          type="number"
          min="1"
          value={burstTime}
          onChange={(e) => setBurstTime(e.target.value)}
          required
        />
      </div>

      {algorithm === "priority" && (
        <div className="space-y-2">
          <Label htmlFor="priority">
            Priority (lower value = higher priority)
          </Label>
          <Input
            id="priority"
            type="number"
            min="1"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
          />
        </div>
      )}

      <Button type="submit" className="w-full">
        Add Process
      </Button>
    </form>
  );
}
