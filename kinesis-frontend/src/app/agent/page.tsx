import type { Metadata } from "next";
import AgentConsole from "./AgentConsole";

export const metadata: Metadata = {
  title: "AGENT INTERFACE — AWI | KINESIS",
  description:
    "The Agent layer of KINESIS / ATELIER: WebMCP-style tools for AI agents, with human-in-the-loop security checkpoints.",
};

export default function AgentPage() {
  return <AgentConsole />;
}