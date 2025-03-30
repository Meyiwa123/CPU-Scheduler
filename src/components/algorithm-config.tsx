"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AlgorithmConfigProps {
  algorithm: string;
  timeQuantum: number;
  setTimeQuantum: (value: number) => void;
}

export function AlgorithmConfig({
  algorithm,
  timeQuantum,
  setTimeQuantum,
}: AlgorithmConfigProps) {
  if (algorithm !== "rr") {
    return null;
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="timeQuantum">Time Quantum</Label>
      <Input
        id="timeQuantum"
        type="number"
        min="1"
        value={timeQuantum}
        onChange={(e) => setTimeQuantum(Number.parseInt(e.target.value))}
      />
      <p className="text-xs text-muted-foreground">
        The maximum amount of time each process can run before being preempted
      </p>
    </div>
  );
}
