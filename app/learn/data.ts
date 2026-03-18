export interface Lesson {
  number: string;
  title: string;
}

export interface StageData {
  number: number;
  title: string;
  goal: string;
  color: string;
  xpPerLesson: number;
  lessons: Lesson[];
}

export const STAGES: Record<number, StageData> = {
  1: {
    number: 1,
    title: "The Basics",
    goal: "Understand the cube, read notation, and do your first moves.",
    color: "#a1a1aa",
    xpPerLesson: 50,
    lessons: [
      { number: "1.1", title: "What is a Rubik's Cube?" },
      { number: "1.2", title: "How the Cube Moves" },
      { number: "1.3", title: "Reading Notation" },
      { number: "1.4", title: "Your First Algorithms" },
      { number: "1.5", title: "Holding the Cube" },
    ],
  },
  2: {
    number: 2,
    title: "Your First Solve",
    goal: "Solve the entire cube using the beginner layer-by-layer method.",
    color: "#009B48",
    xpPerLesson: 75,
    lessons: [
      { number: "2.1", title: "The White Cross (Concept)" },
      { number: "2.2", title: "The White Cross (Solving)" },
      { number: "2.3", title: "White Corners" },
      { number: "2.4", title: "Middle Layer Edges" },
      { number: "2.5", title: "Yellow Cross" },
      { number: "2.6", title: "Yellow Edge Alignment" },
      { number: "2.7", title: "Yellow Corner Positioning" },
      { number: "2.8", title: "Yellow Corner Orientation" },
      { number: "2.9", title: "Your First Full Solve" },
    ],
  },
  3: {
    number: 3,
    title: "Getting Comfortable",
    goal: "Finger tricks, efficiency, reduce pauses. Target: sub-2:00.",
    color: "#0051A2",
    xpPerLesson: 100,
    lessons: [
      { number: "3.1", title: "Finger Tricks (Basics)" },
      { number: "3.2", title: "Finger Tricks (Practice)" },
      { number: "3.3", title: "Efficient Cross" },
      { number: "3.4", title: "Reducing Pauses" },
      { number: "3.5", title: "Common Mistakes & Bad Habits" },
      { number: "3.6", title: "Benchmark Challenge" },
    ],
  },
  4: {
    number: 4,
    title: "Intro to CFOP & The Cross",
    goal: "Understand CFOP and master the cross at a higher level.",
    color: "#FF5800",
    xpPerLesson: 125,
    lessons: [
      { number: "4.1", title: "What is CFOP?" },
      { number: "4.2", title: "Cross on Bottom" },
      { number: "4.3", title: "Planning the Full Cross" },
      { number: "4.4", title: "Cross Efficiency" },
      { number: "4.5", title: "Cross Drills" },
    ],
  },
  5: {
    number: 5,
    title: "F2L (First Two Layers)",
    goal: "Learn intuitive F2L — the hardest and most rewarding stage.",
    color: "#C41E3A",
    xpPerLesson: 150,
    lessons: [
      { number: "5.1", title: "What is F2L?" },
      { number: "5.2", title: "Find and Prepare an F2L pair" },
      { number: "5.3", title: "Basic Insertions" },
      { number: "5.4", title: "Pairing on Top" },
      { number: "5.5", title: "Dealing with Pieces in the Wrong Slot" },
      { number: "5.6", title: "Tricky Cases" },
      { number: "5.7", title: "F2L Practice & Building Intuition" },
    ],
  },
  6: {
    number: 6,
    title: "2-Look OLL",
    goal: "Orient the last layer in two steps using ~9 algorithms.",
    color: "#FFD500",
    xpPerLesson: 150,
    lessons: [
      { number: "6.1", title: "What is OLL?" },
      { number: "6.2", title: "Step 1: Edge Orientation (Yellow Cross)" },
      {
        number: "6.3",
        title: "Step 2: Corner Orientation (Complete Yellow Face)",
      },
      { number: "6.4", title: "OLL Recognition Practice" },
      { number: "6.5", title: "Putting OLL Together" },
    ],
  },
  7: {
    number: 7,
    title: "2-Look PLL",
    goal: "Permute the last layer and complete your full CFOP solve.",
    color: "#c47aff",
    xpPerLesson: 175,
    lessons: [
      { number: "7.1", title: "What is PLL?" },
      { number: "7.2", title: "Step 1: Corner Permutation" },
      { number: "7.3", title: "Step 2: Edge Permutation" },
      { number: "7.4", title: "PLL Recognition Practice" },
      { number: "7.5", title: "Full CFOP Solve" },
      { number: "7.6", title: "The Path to Sub-30" },
    ],
  },
};
