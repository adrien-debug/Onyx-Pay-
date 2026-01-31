import { Suspense } from "react";
import { db } from "@/lib/db";
import { RoadmapClient } from "./roadmap-client";

async function getMilestones() {
  const milestones = await db.milestone.findMany({
    include: {
      owner: true,
      workstream: true,
      project: true,
      checklist: true,
    },
    orderBy: { targetDate: "asc" },
  });

  const workstreams = await db.workstream.findMany({
    orderBy: { name: "asc" },
  });

  const users = await db.user.findMany({
    orderBy: { name: "asc" },
  });

  const project = await db.project.findFirst();

  return { milestones, workstreams, users, projectId: project?.id || "" };
}

async function RoadmapContent() {
  const { milestones, workstreams, users, projectId } = await getMilestones();

  return (
    <RoadmapClient
      milestones={milestones}
      workstreams={workstreams}
      users={users}
      projectId={projectId}
    />
  );
}

export default function RoadmapPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-8 w-48 bg-zinc-800 rounded shimmer" />
          <div className="h-96 bg-zinc-800 rounded-xl shimmer" />
        </div>
      }
    >
      <RoadmapContent />
    </Suspense>
  );
}
