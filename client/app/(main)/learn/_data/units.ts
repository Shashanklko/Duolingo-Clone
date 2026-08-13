export interface NodeItem {
  icon: "star" | "chest" | "trophy" | "fast-forward";
  status: "current" | "locked" | "completed";
  position: number;
  character?: "duo" | string;
}

export interface UnitItem {
  title: string;
  description: string;
  color: string;
  nodes: NodeItem[];
}

export const UNITS: UnitItem[] = [
  {
    title: "Unit 1",
    description: "Order at a café",
    color: "#58cc02", // Duolingo Green
    nodes: [
      { icon: "star", status: "current", position: 0 },
      { icon: "star", status: "locked", position: -1 },
      { icon: "chest", status: "locked", position: -2 },
      { icon: "star", status: "locked", position: 0, character: "duo" },
      { icon: "trophy", status: "locked", position: 1 },
    ]
  },
  {
    title: "Unit 2",
    description: "Greet people and say goodbye",
    color: "#ce82ff", // Duolingo Purple
    nodes: [
      { icon: "fast-forward", status: "locked", position: 0 },
      { icon: "star", status: "locked", position: 1 },
      { icon: "chest", status: "locked", position: 2, character: "duo" },
      { icon: "star", status: "locked", position: 0 },
      { icon: "trophy", status: "locked", position: -1 },
    ]
  },
  {
    title: "Unit 3",
    description: "Discuss daily routine and hobbies",
    color: "#00cd9c", // Duolingo Teal
    nodes: [
      { icon: "star", status: "locked", position: 0 },
      { icon: "star", status: "locked", position: -1 },
      { icon: "chest", status: "locked", position: -2, character: "duo" },
      { icon: "star", status: "locked", position: 0 },
      { icon: "trophy", status: "locked", position: 1 },
    ]
  },
  {
    title: "Unit 4",
    description: "Travel, directions and culture",
    color: "#ff4b4b", // Duolingo Coral
    nodes: [
      { icon: "fast-forward", status: "locked", position: 0 },
      { icon: "star", status: "locked", position: 1 },
      { icon: "chest", status: "locked", position: 2, character: "duo" },
      { icon: "star", status: "locked", position: 0 },
      { icon: "trophy", status: "locked", position: -1 },
    ]
  }
];

export type UnitType = typeof UNITS[number];
export type NodeType = NodeItem;
