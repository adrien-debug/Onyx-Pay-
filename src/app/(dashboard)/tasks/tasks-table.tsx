"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDate, getStatusColor, getPriorityColor } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Paperclip,
  CheckSquare,
  MoreHorizontal,
} from "lucide-react";
import type { Task, User, Workstream, Project, TaskChecklistItem } from "@prisma/client";

type TaskWithRelations = Task & {
  assignee: User | null;
  workstream: Workstream | null;
  project: Project;
  checklist: TaskChecklistItem[];
  _count: {
    comments: number;
    attachments: number;
  };
};

function parseTags(tags: string | null): string[] {
  if (!tags) return [];
  try {
    return JSON.parse(tags);
  } catch {
    return [];
  }
}

interface TasksTableProps {
  tasks: TaskWithRelations[];
  onEdit?: (task: TaskWithRelations) => void;
}

type SortField = "title" | "status" | "priority" | "dueDate" | "workstream";
type SortDirection = "asc" | "desc";

export function TasksTable({ tasks, onEdit }: TasksTableProps) {
  const [sortField, setSortField] = useState<SortField>("priority");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case "title":
        comparison = a.title.localeCompare(b.title);
        break;
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
      case "priority": {
        const priorityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        comparison =
          (priorityOrder[a.priority as keyof typeof priorityOrder] || 0) -
          (priorityOrder[b.priority as keyof typeof priorityOrder] || 0);
        break;
      }
      case "dueDate":
        comparison =
          (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0);
        break;
      case "workstream":
        comparison = (a.workstream?.name || "").localeCompare(
          b.workstream?.name || ""
        );
        break;
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  return (
    <div className="rounded-xl border border-zinc-800 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-zinc-900/50 hover:bg-zinc-900/50">
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("title")}
            >
              <div className="flex items-center gap-1">
                Tâche <SortIcon field="title" />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("status")}
            >
              <div className="flex items-center gap-1">
                Statut <SortIcon field="status" />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("priority")}
            >
              <div className="flex items-center gap-1">
                Priorité <SortIcon field="priority" />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("workstream")}
            >
              <div className="flex items-center gap-1">
                Workstream <SortIcon field="workstream" />
              </div>
            </TableHead>
            <TableHead>Assigné</TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("dueDate")}
            >
              <div className="flex items-center gap-1">
                Échéance <SortIcon field="dueDate" />
              </div>
            </TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-zinc-500">
                Aucune tâche trouvée
              </TableCell>
            </TableRow>
          ) : (
            sortedTasks.map((task) => {
              const checklistComplete =
                task.checklist.filter((c) => c.completed).length;
              const checklistTotal = task.checklist.length;

              return (
                <TableRow key={task.id} className="group">
                  <TableCell>
                    <div>
                      <p className="font-medium text-zinc-200">{task.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        {checklistTotal > 0 && (
                          <span className="flex items-center gap-1 text-xs text-zinc-500">
                            <CheckSquare className="h-3 w-3" />
                            {checklistComplete}/{checklistTotal}
                          </span>
                        )}
                        {task._count.comments > 0 && (
                          <span className="flex items-center gap-1 text-xs text-zinc-500">
                            <MessageSquare className="h-3 w-3" />
                            {task._count.comments}
                          </span>
                        )}
                        {task._count.attachments > 0 && (
                          <span className="flex items-center gap-1 text-xs text-zinc-500">
                            <Paperclip className="h-3 w-3" />
                            {task._count.attachments}
                          </span>
                        )}
                        {parseTags(task.tags).length > 0 && (
                          <div className="flex gap-1">
                            {parseTags(task.tags).slice(0, 2).map((tag) => (
                              <Badge
                                key={tag}
                                variant="default"
                                className="text-[10px] px-1.5 py-0"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(task.status)}>
                      {task.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {task.workstream ? (
                      <span className="text-sm text-zinc-400">
                        {task.workstream.name}
                      </span>
                    ) : (
                      <span className="text-sm text-zinc-600">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {task.assignee ? (
                      <div className="flex items-center gap-2">
                        <Avatar
                          fallback={task.assignee.name || "?"}
                          size="sm"
                        />
                        <span className="text-sm text-zinc-400">
                          {task.assignee.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-zinc-600">Non assigné</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {task.dueDate ? (
                      <span
                        className={`text-sm ${
                          new Date(task.dueDate) < new Date() &&
                          task.status !== "DONE"
                            ? "text-red-400"
                            : "text-zinc-400"
                        }`}
                      >
                        {formatDate(task.dueDate)}
                      </span>
                    ) : (
                      <span className="text-sm text-zinc-600">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => onEdit?.(task)}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
