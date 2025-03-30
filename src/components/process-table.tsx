"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Process } from "@/lib/types";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface ProcessTableProps {
  processes: Process[];
  removeProcess: (id: number) => void;
  updateProcess: (process: Process) => void;
  algorithm: string;
}

export function ProcessTable({
  processes,
  removeProcess,
  updateProcess,
  algorithm,
}: ProcessTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Partial<Process>>({});

  const startEditing = (process: Process) => {
    setEditingId(process.id);
    setEditValues({
      arrivalTime: process.arrivalTime,
      burstTime: process.burstTime,
      priority: process.priority,
    });
  };

  const handleEditChange = (field: string, value: string) => {
    setEditValues({
      ...editValues,
      [field]: Number.parseInt(value),
    });
  };

  const saveChanges = (process: Process) => {
    updateProcess({
      ...process,
      arrivalTime: editValues.arrivalTime ?? process.arrivalTime,
      burstTime: editValues.burstTime ?? process.burstTime,
      priority: editValues.priority ?? process.priority,
      remainingTime: editValues.burstTime ?? process.burstTime,
    });
    setEditingId(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  if (processes.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No processes added yet
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Process ID</TableHead>
            <TableHead>Arrival Time</TableHead>
            <TableHead>Burst Time</TableHead>
            {algorithm === "priority" && <TableHead>Priority</TableHead>}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processes.map((process) => (
            <TableRow key={process.id}>
              <TableCell>P{process.id}</TableCell>
              <TableCell>
                {editingId === process.id ? (
                  <Input
                    type="number"
                    min="0"
                    value={editValues.arrivalTime}
                    onChange={(e) =>
                      handleEditChange("arrivalTime", e.target.value)
                    }
                    className="w-20"
                  />
                ) : (
                  process.arrivalTime
                )}
              </TableCell>
              <TableCell>
                {editingId === process.id ? (
                  <Input
                    type="number"
                    min="1"
                    value={editValues.burstTime}
                    onChange={(e) =>
                      handleEditChange("burstTime", e.target.value)
                    }
                    className="w-20"
                  />
                ) : (
                  process.burstTime
                )}
              </TableCell>
              {algorithm === "priority" && (
                <TableCell>
                  {editingId === process.id ? (
                    <Input
                      type="number"
                      min="1"
                      value={editValues.priority}
                      onChange={(e) =>
                        handleEditChange("priority", e.target.value)
                      }
                      className="w-20"
                    />
                  ) : (
                    process.priority
                  )}
                </TableCell>
              )}
              <TableCell className="text-right">
                {editingId === process.id ? (
                  <div className="flex justify-end gap-2">
                    <Button size="sm" onClick={() => saveChanges(process)}>
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEditing}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEditing(process)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeProcess(process.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
