import type { CanvasFile } from "../types/workspace";


export const seedFiles: CanvasFile[] = [
  {
    id: "f1",
    name: "brd.md",
    content: [
      "# Business Requirements",
      "",
      "## Goal",
      "Create a reliable ticketing system for CEX operations.",
      "",
      "## Constraints",
      "- Keep incident triage under 5 minutes",
      "- Preserve an audit trail for every status change",
    ].join("\n"),
    isDirty: false,
  },
  {
    id: "f2",
    name: "prd.md",
    content: [
      "# Product Requirements",
      "",
      "## Users",
      "- Support agents",
      "- Operations lead",
      "",
      "## Core flows",
      "1. Create ticket",
      "2. Assign owner",
      "3. Escalate SLA breaches",
    ].join("\n"),
    isDirty: false,
  },
  {
    id: "f3",
    name: "system-design.md",
    content: [
      "# System Design",
      "",
      "## Services",
      "- Ticket API",
      "- Rules engine",
      "- Notification worker",
      "",
      "## Data model sketch",
      "- Ticket(id, status, priority, owner, created_at)",
    ].join("\n"),
    isDirty: false,
  },
];