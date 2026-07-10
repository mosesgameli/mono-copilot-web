# Mono Copilot — Product Design

## Overview

Mono Copilot is a collaborative product engineering agent that turns a rough product idea into structured engineering artifacts. It works with a user through iterative conversation, asking clarifying questions until it has enough context, then drafts a Business Requirements Document (BRD) using its BRD skill. Once the user is satisfied with the BRD, it generates a Product Requirements Document (PRD) using its PRD skill, and from there brainstorms Architecture Decision Records (ADRs) with input from a set of specialist sub-agents. All of this happens collaboratively with the user inside a canvas, a markdown editor/viewer that sits alongside the chat and is the shared surface both parties edit and comment on.

## Glossary

* BRD — Business Requirements Document  
* PRD — Product Requirements Document  
* ADR — Architecture Decision Record  
* RFC — Request for Comments  
* RPA — Robotic Process Automation  
* MCP — Model Context Protocol, used by agents to retrieve grounded information  
* A2A — Agent2Agent protocol, used for inter-agent coordination

## End-to-end workflow

The core flow has three stages, each owned by a different agent persona: a business analyst agent converts the user’s idea into a BRD, a product engineer agent generates a PRD from the approved BRD, and a solution architect agent brainstorms ADRs from the PRD. Each stage depends on a corresponding template (BRD, PRD, and ADR templates) so that output is consistent across projects.  
Before an ADR is finalized, a set of specialist sub-agents covering UI/UX design, software architecture, security, QA, and DevOps each produce their own RFC capturing domain-specific concerns and recommendations. The solution architect synthesizes these RFCs into the final ADR, so architecture decisions reflect UX, security, quality, and operability considerations rather than a single point of view.

## Workspace & artifacts

Every project is represented as a folder of markdown artifacts that mirrors the workflow above. A project such as “hr payroll automation” would contain a [brd.md](http://brd.md) and [prd.md](http://prd.md) at the root, and an adr/ subfolder holding decision records such as [ui-ux.md](http://ui-ux.md) and [system-design.md](http://system-design.md), alongside the RFCs contributed by each sub-agent. This structure is what powers the file explorer inside the canvas, described below.

## Canvas & interaction model

Mono Copilot’s web app is split into two panes. The left pane is a persistent chat thread where the user describes their idea in natural language and Mono Copilot asks follow-up questions to fill gaps before drafting anything. The right pane is the canvas: a markdown viewer/editor with a file-explorer menu that lists the current project’s artifacts, and a breadcrumb showing the file that’s currently open (e.g. /adr/[ui-ux.md](http://ui-ux.md)).  
The defining interaction of the canvas is inline commenting: the user can highlight any line or span of text in a document and type a comment directly on it. Mono Copilot is immediately aware of both the highlighted selection and the comment text, and responds in that context, for example revising the highlighted section, expanding on a requirement, or asking a clarifying question, without the user needing to re-explain what they’re referring to in chat. This highlight-and-comment loop is the primary way the user steers each artifact toward completion, alongside the open-ended chat.

## Agent architecture

Mono Copilot is built as an orchestrator coordinating a set of specialist agents, each backed by an Agent Skill that encapsulates the relevant template and domain expertise:

* Business analyst agent — BRD skill, converts the user’s idea into a BRD  
* Product engineer agent — PRD skill, converts an approved BRD into a PRD  
* Solution architect agent — brainstorms ADRs from the PRD and synthesizes sub-agent RFCs  
* UI/UX sub-agent — UI/UX skill, produces the UI/UX RFC  
* Security analyst sub-agent — security skill, produces the security RFC  
* QA engineer sub-agent — produces the QA RFC  
* DevOps engineer sub-agent — devops skill, produces the DevOps RFC  
* Software architect sub-agent — solution-architect-for-web-apps skill, produces the system-design RFC

## Agent coordination

Two protocols connect the agents to information and to each other. MCP (Model Context Protocol) gives agents grounded information: the Python backend hosts an MCP client, built with the OpenAI Agents SDK, that queries an MCP server exposing the telco’s product and service catalog, so BRDs and PRDs can reference real offerings rather than generic placeholders. A2A (Agent2Agent protocol) coordinates interactions between the orchestrator and sub-agents, allowing RFCs and intermediate outputs to be shared and referenced consistently as they flow into the final ADR.

## Tech stack

* Frontend — NextJS web app (Mono Copilot’s only supported surface)  
* Backend — Python service hosting agent orchestration  
* OpenAI Agents SDK — agent runtime, and used to build the MCP client  
* MCP (Model Context Protocol) — server exposing telco product/service information  
* A2A Protocol — coordination between the orchestrator and sub-agents  
* Agent Skills — packaged domain skills (BRD, PRD, UI/UX, security, devops, solution-architect-for-web-apps)

## Open questions

A few areas need further definition: how multiple users collaborating on the same canvas are handled, including access control and concurrent edits; how artifact versioning and comment history are preserved as documents are revised; how conflicting sub-agent RFCs get reconciled when the solution architect synthesizes the ADR; and where the MCP server for telco product/service data is hosted and kept up to date.