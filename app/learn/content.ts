export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "tip"; text: string }
  | { type: "warn"; text: string }
  | { type: "algo"; name: string; moves: string; note?: string }
  | { type: "list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] };

export const LESSON_CONTENT: Record<string, Block[]> = {

  // ─────────────────────────────────────────────────────────
  // STAGE 1 — The Basics
  // ─────────────────────────────────────────────────────────

  "1.1": [
    { type: "h2", text: "The Three Types of Pieces" },
    { type: "p", text: "A standard 3×3 Rubik's Cube has 26 visible pieces. Every piece is one of three types — and understanding this is the foundation of everything else." },
    { type: "list", items: [
      "Centers (6 total) — The single-colored piece in the middle of each face. Centers never move relative to each other. The red center is always opposite the orange center, white is always opposite yellow, and green is always opposite blue.",
      "Edges (12 total) — The pieces on the edges between two faces. Each edge has exactly 2 colors.",
      "Corners (8 total) — The pieces at the corners where three faces meet. Each corner has exactly 3 colors.",
    ]},
    { type: "tip", text: "The center pieces define the color of each face. If the center is red, that face will be red when solved. You can never change which color a face belongs to." },
    { type: "h2", text: "The Goal" },
    { type: "p", text: "Your goal is simple to state: get all 9 squares on each face to match their center. That means every face shows one solid color. There is only 1 solved state, and there are approximately 43 quintillion (43,252,003,274,489,856,000) possible scrambled states." },
    { type: "h2", text: "A Key Insight" },
    { type: "p", text: "Because centers are fixed, you never need to 'solve' them — you solve everything else around them. Edges need to go to the right place with the right orientation. Same for corners. That's it. The whole puzzle is just moving 20 pieces (12 edges + 8 corners) into their correct positions and orientations." },
    { type: "tip", text: "Every legitimate scramble can be solved in 20 moves or fewer. This is known as God's Number — it was proven in 2010 by a team using Google's computers." },
  ],

  "1.2": [
    { type: "h2", text: "The Six Faces" },
    { type: "p", text: "Each of the 6 faces has a letter name. These are universal — every tutorial, algorithm, and guide in the world uses these same letters." },
    { type: "table", headers: ["Letter", "Face", "Memory tip"], rows: [
      ["U", "Up", "The top face"],
      ["D", "Down", "The bottom face"],
      ["F", "Front", "The face facing you"],
      ["B", "Back", "The face away from you"],
      ["R", "Right", "The right face"],
      ["L", "Left", "The left face"],
    ]},
    { type: "h2", text: "Clockwise vs Counterclockwise" },
    { type: "p", text: "Clockwise and counterclockwise are always from the perspective of looking directly at that face. So an R move means: look at the right face head-on, then turn it clockwise. A U move: look at the top face from above, turn it clockwise." },
    { type: "warn", text: "This trips people up with the B (back) face. A clockwise B move rotates the back face clockwise as seen from the back — which looks counterclockwise from the front. Don't worry about B moves yet." },
    { type: "h2", text: "Types of Turns" },
    { type: "list", items: [
      "Quarter turn — 90 degrees. This is the standard turn.",
      "Half turn — 180 degrees. Turns the face twice.",
      "Clockwise — The default direction for any face letter.",
      "Counterclockwise — The opposite direction.",
    ]},
    { type: "tip", text: "Hold your cube with white on top and green facing you for now. This is a common starting orientation and will make learning notation easier." },
  ],

  "1.3": [
    { type: "h2", text: "Standard Notation" },
    { type: "p", text: "Notation is how we write cube moves in shorthand. Once you know this, you can read any algorithm on the internet and know exactly what to do." },
    { type: "table", headers: ["Symbol", "Meaning", "Direction"], rows: [
      ["R",  "Right face",  "Clockwise (quarter turn)"],
      ["R'", "Right face",  "Counterclockwise (quarter turn)"],
      ["R2", "Right face",  "180 degrees (direction doesn't matter)"],
      ["U",  "Up face",     "Clockwise"],
      ["U'", "Up face",     "Counterclockwise"],
      ["U2", "Up face",     "180 degrees"],
      ["F",  "Front face",  "Clockwise"],
      ["F'", "Front face",  "Counterclockwise"],
      ["L",  "Left face",   "Clockwise"],
      ["D",  "Down face",   "Clockwise"],
    ]},
    { type: "tip", text: "The prime symbol (') is read as 'prime' or 'inverse'. R' is said 'R prime'. It always means counterclockwise when looking directly at that face." },
    { type: "h2", text: "Reading an Algorithm" },
    { type: "p", text: "Algorithms are just strings of these letters, read left to right. Each move happens one at a time, in order. There are no pauses or tricks — just execute each move in sequence." },
    { type: "algo", name: "Example sequence", moves: "R U R' U'", note: "Right clockwise → Up clockwise → Right counterclockwise → Up counterclockwise. This is one of the most important sequences in cubing." },
    { type: "h2", text: "Cube Rotations (lowercase)" },
    { type: "p", text: "Lowercase letters mean you rotate the entire cube, not just one face. These don't change the state of the puzzle — just your view of it." },
    { type: "list", items: [
      "x — Rotate the whole cube as if doing an R move",
      "y — Rotate the whole cube as if doing a U move",
      "z — Rotate the whole cube as if doing an F move",
    ]},
  ],

  "1.4": [
    { type: "h2", text: "What is an Algorithm?" },
    { type: "p", text: "An algorithm is a fixed sequence of moves that produces a predictable result on the cube. Unlike random turning, algorithms are precise tools — the same sequence always does the same thing, regardless of the rest of the cube." },
    { type: "p", text: "As you learn to solve the cube, you'll collect a small library of algorithms. Think of them like special moves in a game — you learn when and why to use each one." },
    { type: "h2", text: "The Sexy Move" },
    { type: "p", text: "The most famous short algorithm in cubing is the 'sexy move'. It's called that because it looks smooth and satisfying to execute quickly." },
    { type: "algo", name: "The Sexy Move", moves: "R U R' U'", note: "Execute this 6 times in a row and the cube returns to its starting state. This is a good way to test if you're doing it correctly." },
    { type: "h2", text: "Try It Now" },
    { type: "list", items: [
      "Start with a solved (or any scrambled) cube",
      "Execute R U R' U' — that's one repetition",
      "Repeat it 5 more times (6 total)",
      "You should be back where you started",
    ]},
    { type: "tip", text: "If you don't end up back at the start, you made an error somewhere. Common mistakes: going the wrong direction on R' (should be counterclockwise, not clockwise), or doing R2 instead of R. Slow down and double-check each move." },
    { type: "h2", text: "Why This Matters" },
    { type: "p", text: "The sexy move is a building block of several real algorithms you'll use to solve the cube. Understanding that algorithms have consistent, reversible effects is the mental model you'll use throughout this entire course." },
  ],

  "1.5": [
    { type: "h2", text: "Grip and Hand Position" },
    { type: "p", text: "How you hold the cube matters more than you'd think. Bad habits formed now — like always gripping with your palms and doing wrist turns — will slow you down later. Good form feels awkward at first but pays off fast." },
    { type: "h2", text: "Basic Grip" },
    { type: "list", items: [
      "Hold the cube with your fingers, not your palms. Your palms should barely touch the cube.",
      "Index fingers rest on the U (top) face, one on each side.",
      "Middle fingers curl around the front and back faces.",
      "Thumbs rest on the D (bottom) face or the sides.",
    ]},
    { type: "h2", text: "Standard Orientation" },
    { type: "p", text: "When learning, hold the cube with white on top (U face) and green facing you (F face). This is arbitrary, but being consistent removes one source of confusion while you're still building your mental map of the cube." },
    { type: "tip", text: "Once you can solve the cube reliably, you'll stop caring which color is on top — you can start a solve from any orientation. But for now, consistency helps." },
    { type: "h2", text: "Two Hands, Always" },
    { type: "p", text: "Always use both hands. Beginners often hold the cube in one hand and turn with the other — this is slow and inefficient. Both hands should be turning at all times during fast sequences." },
    { type: "warn", text: "Avoid rotating the entire cube (using x, y, z) to get to a face. Instead, learn to reach your fingers around the cube to make moves. Every whole-cube rotation costs time and breaks your rhythm." },
    { type: "h2", text: "What's Next" },
    { type: "p", text: "In Stage 2, you'll start actually solving the cube. You now have everything you need: you understand the pieces, know the face names, can read notation, and understand what algorithms are. Time to use all of it." },
  ],

};
