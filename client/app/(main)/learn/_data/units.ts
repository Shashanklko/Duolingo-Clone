export interface NodeItem {
  id?: number | string;
  title?: string;
  lessonId?: string;
  icon: "star" | "chest" | "trophy" | "fast-forward";
  status: "current" | "locked" | "completed";
  position: number;
  character?: "duo" | "lily" | "falstaff" | string;
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
    description: "Greetings & Introductions",
    color: "#58cc02", // Duolingo Green
    nodes: [
      { id: 1, title: "Greetings", icon: "star", status: "current", position: 0 },
      { id: 2, title: "Basic Phrases", icon: "star", status: "locked", position: 1 },
      { id: 3, title: "Café Words", icon: "star", status: "locked", position: 2, character: "duo" },
      { id: 4, title: "Chest Reward", icon: "chest", status: "locked", position: 1 },
      { id: 5, title: "Ordering Food", icon: "star", status: "locked", position: 0 },
      { id: 6, title: "Unit Trophy", icon: "trophy", status: "locked", position: -1 },
    ]
  },
  {
    title: "Unit 2",
    description: "Greet people and say goodbye",
    color: "#ce82ff", // Duolingo Purple
    nodes: [
      { id: 7, title: "Jump Test", icon: "fast-forward", status: "locked", position: 0 },
      { id: 8, title: "Saying Bye", icon: "star", status: "locked", position: -1 },
      { id: 9, title: "Chest Reward", icon: "chest", status: "locked", position: -2, character: "lily" },
      { id: 10, title: "Introductions", icon: "star", status: "locked", position: -1 },
      { id: 11, title: "Unit Trophy", icon: "trophy", status: "locked", position: 0 },
    ]
  },
  {
    title: "Unit 3",
    description: "Discuss daily routine and hobbies",
    color: "#00cd9c", // Duolingo Teal
    nodes: [
      { id: 12, title: "Daily Habits", icon: "star", status: "locked", position: 0 },
      { id: 13, title: "Hobbies", icon: "star", status: "locked", position: 1 },
      { id: 14, title: "Chest Reward", icon: "chest", status: "locked", position: 2, character: "falstaff" },
      { id: 15, title: "Time & Schedule", icon: "star", status: "locked", position: 1 },
      { id: 16, title: "Unit Trophy", icon: "trophy", status: "locked", position: 0 },
    ]
  },
  {
    title: "Unit 4",
    description: "Travel, directions and culture",
    color: "#ff4b4b", // Duolingo Red
    nodes: [
      { id: 17, title: "Airport", icon: "star", status: "locked", position: 0 },
      { id: 18, title: "Directions", icon: "star", status: "locked", position: -1 },
      { id: 19, title: "Chest Reward", icon: "chest", status: "locked", position: -2, character: "duo" },
      { id: 20, title: "Hotel Booking", icon: "star", status: "locked", position: -1 },
      { id: 21, title: "Unit Trophy", icon: "trophy", status: "locked", position: 0 },
    ]
  }
];

export type UnitType = typeof UNITS[number];
export type NodeType = NodeItem;
