export interface NodeItem {
  id?: number | string;
  title?: string;
  lessonId?: string;
  icon: "star" | "chest" | "trophy" | "fast-forward";
  status: "current" | "locked" | "completed";
  position: number;
  character?: "duo" | "lily" | "falstaff" | "junior" | string;
}

export interface UnitItem {
  title: string;
  description: string;
  color: string;
  character: "duo" | "lily" | "falstaff" | "junior";
  characterSide: "left" | "right";
  characterNodeIndex: number;
  nodes: NodeItem[];
}

export const UNITS: UnitItem[] = [
  {
    title: "Unit 1",
    description: "Greetings & Introductions",
    color: "#58cc02", // Duolingo Green
    character: "duo",
    characterSide: "right",
    characterNodeIndex: 2,
    nodes: [
      { id: 1, title: "Greetings", icon: "star", status: "current", position: 0 },
      { id: 2, title: "Basic Phrases", icon: "star", status: "locked", position: -1 },
      { id: 3, title: "Café Words", icon: "star", status: "locked", position: -2 },
      { id: 4, title: "Chest Reward", icon: "chest", status: "locked", position: -2 },
      { id: 5, title: "Ordering Food", icon: "star", status: "locked", position: -1 },
      { id: 6, title: "Unit Trophy", icon: "trophy", status: "locked", position: 0 },
    ]
  },
  {
    title: "Unit 2",
    description: "Greet people and say goodbye",
    color: "#ce82ff", // Duolingo Purple
    character: "lily",
    characterSide: "left",
    characterNodeIndex: 2,
    nodes: [
      { id: 7, title: "Jump Test", icon: "fast-forward", status: "locked", position: 0 },
      { id: 8, title: "Saying Bye", icon: "star", status: "locked", position: 1 },
      { id: 9, title: "Introductions", icon: "star", status: "locked", position: 2 },
      { id: 10, title: "Chest Reward", icon: "chest", status: "locked", position: 2 },
      { id: 11, title: "Family & People", icon: "star", status: "locked", position: 1 },
      { id: 12, title: "Unit Trophy", icon: "trophy", status: "locked", position: 0 },
    ]
  },
  {
    title: "Unit 3",
    description: "Discuss daily routine and hobbies",
    color: "#00cd9c", // Duolingo Teal
    character: "falstaff",
    characterSide: "right",
    characterNodeIndex: 2,
    nodes: [
      { id: 13, title: "Daily Habits", icon: "star", status: "locked", position: 0 },
      { id: 14, title: "Hobbies", icon: "star", status: "locked", position: -1 },
      { id: 15, title: "Time & Schedule", icon: "star", status: "locked", position: -2 },
      { id: 16, title: "Chest Reward", icon: "chest", status: "locked", position: -2 },
      { id: 17, title: "Work & Study", icon: "star", status: "locked", position: -1 },
      { id: 18, title: "Unit Trophy", icon: "trophy", status: "locked", position: 0 },
    ]
  },
  {
    title: "Unit 4",
    description: "Travel, directions and culture",
    color: "#ff4b4b", // Duolingo Red
    character: "junior",
    characterSide: "left",
    characterNodeIndex: 2,
    nodes: [
      { id: 19, title: "Airport", icon: "star", status: "locked", position: 0 },
      { id: 20, title: "Directions", icon: "star", status: "locked", position: 1 },
      { id: 21, title: "Hotel Booking", icon: "star", status: "locked", position: 2 },
      { id: 22, title: "Chest Reward", icon: "chest", status: "locked", position: 2 },
      { id: 23, title: "Sightseeing", icon: "star", status: "locked", position: 1 },
      { id: 24, title: "Unit Trophy", icon: "trophy", status: "locked", position: 0 },
    ]
  }
];

export type UnitType = typeof UNITS[number];
export type NodeType = NodeItem;
