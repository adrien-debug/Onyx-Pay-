"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import type { Workstream, User } from "@prisma/client";

interface TaskFiltersProps {
  workstreams: Workstream[];
  users: User[];
}

export function TaskFilters({ workstreams, users }: TaskFiltersProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [workstream, setWorkstream] = useState("");
  const [assignee, setAssignee] = useState("");

  const hasFilters = search || status || priority || workstream || assignee;

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setPriority("");
    setWorkstream("");
    setAssignee("");
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <Input
          placeholder="Rechercher une tâche..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Status filter */}
      <Select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">Tous les statuts</option>
        <option value="BACKLOG">Backlog</option>
        <option value="TODO">À faire</option>
        <option value="IN_PROGRESS">En cours</option>
        <option value="BLOCKED">Bloqué</option>
        <option value="DONE">Terminé</option>
      </Select>

      {/* Priority filter */}
      <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="">Toutes priorités</option>
        <option value="CRITICAL">Critique</option>
        <option value="HIGH">Haute</option>
        <option value="MEDIUM">Moyenne</option>
        <option value="LOW">Basse</option>
      </Select>

      {/* Workstream filter */}
      <Select
        value={workstream}
        onChange={(e) => setWorkstream(e.target.value)}
      >
        <option value="">Tous les workstreams</option>
        {workstreams.map((ws) => (
          <option key={ws.id} value={ws.id}>
            {ws.name}
          </option>
        ))}
      </Select>

      {/* Assignee filter */}
      <Select value={assignee} onChange={(e) => setAssignee(e.target.value)}>
        <option value="">Tous les assignés</option>
        <option value="unassigned">Non assigné</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </Select>

      {/* Clear filters */}
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4 mr-1" />
          Effacer
        </Button>
      )}
    </div>
  );
}
