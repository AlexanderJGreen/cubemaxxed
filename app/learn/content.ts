export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "tip"; text: string }
  | { type: "warn"; text: string }
  | { type: "algo"; name: string; moves: string; note?: string }
  | { type: "list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | {
      type: "f2l-diagram";
      label?: string;
      /**
       * Per-face sticker colors. Each face takes 9 entries indexed as:
       *   0 1 2 / 3 4 5 / 6 7 8  (row-major, viewed from outside the cube)
       * Use a hex string to color a sticker, null to grey it out.
       * Faces not listed default to all-grey. Keys: U, D, F, B, L, R
       */
      stickerColors: { [face: string]: (string | null)[] };
      size?: number;
    }
  | {
      type: "f2l-diagram-row";
      diagrams: {
        label?: string;
        stickerColors: { [face: string]: (string | null)[] };
        size?: number;
      }[];
    };

export const LESSON_CONTENT: Record<string, Block[]> = {
  // ─────────────────────────────────────────────────────────
  // STAGE 1 — The Basics
  // ─────────────────────────────────────────────────────────

  "1.1": [
    { type: "h2", text: "The Three Types of Pieces" },
    {
      type: "p",
      text: "A standard 3×3 Rubik's Cube has 26 visible pieces. Every piece is one of three types — and understanding this is the foundation of everything else.",
    },
    {
      type: "list",
      items: [
        "Centers (6 total) — The single-colored piece in the middle of each face. Centers never move relative to each other. The red center is always opposite the orange center, white is always opposite yellow, and green is always opposite blue.",
        "Edges (12 total) — The pieces on the edges between two faces. Each edge has exactly 2 colors.",
        "Corners (8 total) — The pieces at the corners where three faces meet. Each corner has exactly 3 colors.",
      ],
    },
    {
      type: "tip",
      text: "The center pieces define the color of each face. If the center is red, that face will be red when solved. You can never change which color a face belongs to.",
    },
    { type: "h2", text: "The Goal" },
    {
      type: "p",
      text: "Your goal is simple to state: get all 9 squares on each face to match their center. That means every face shows one solid color. There is only 1 solved state, and there are approximately 43 quintillion (43,252,003,274,489,856,000) possible scrambled states.",
    },
    { type: "h2", text: "A Key Insight" },
    {
      type: "p",
      text: "Because centers are fixed, you never need to 'solve' them — you solve everything else around them. Edges need to go to the right place with the right orientation. Same for corners. That's it. The whole puzzle is just moving 20 pieces (12 edges + 8 corners) into their correct positions and orientations.",
    },
    {
      type: "tip",
      text: "Every legitimate scramble can be solved in 20 moves or fewer. This is known as God's Number — it was proven in 2010 by a team using Google's computers.",
    },
  ],

  "1.2": [
    { type: "h2", text: "The Six Faces" },
    {
      type: "p",
      text: "Each of the 6 faces has a letter name. These are universal — every tutorial, algorithm, and guide in the world uses these same letters.",
    },
    {
      type: "table",
      headers: ["Letter", "Face", "Memory tip"],
      rows: [
        ["U", "Up", "The top face"],
        ["D", "Down", "The bottom face"],
        ["F", "Front", "The face facing you"],
        ["B", "Back", "The face away from you"],
        ["R", "Right", "The right face"],
        ["L", "Left", "The left face"],
      ],
    },
    { type: "h2", text: "Clockwise vs Counterclockwise" },
    {
      type: "p",
      text: "Clockwise and counterclockwise are always from the perspective of looking directly at that face. So an R move means: look at the right face head-on, then turn it clockwise. A U move: look at the top face from above, turn it clockwise.",
    },
    {
      type: "warn",
      text: "This trips people up with the B (back) face. A clockwise B move rotates the back face clockwise as seen from the back — which looks counterclockwise from the front. Don't worry about B moves yet.",
    },
    { type: "h2", text: "Types of Turns" },
    {
      type: "list",
      items: [
        "Quarter turn — 90 degrees. This is the standard turn.",
        "Half turn — 180 degrees. Turns the face twice.",
        "Clockwise — The default direction for any face letter.",
        "Counterclockwise — The opposite direction.",
      ],
    },
    {
      type: "tip",
      text: "Hold your cube with white on top and green facing you for now. This is a common starting orientation and will make learning notation easier.",
    },
  ],

  "1.3": [
    { type: "h2", text: "Standard Notation" },
    {
      type: "p",
      text: "Notation is how we write cube moves in shorthand. Once you know this, you can read any algorithm on the internet and know exactly what to do.",
    },
    {
      type: "table",
      headers: ["Symbol", "Meaning", "Direction"],
      rows: [
        ["R", "Right face", "Clockwise (quarter turn)"],
        ["R'", "Right face", "Counterclockwise (quarter turn)"],
        ["R2", "Right face", "180 degrees (direction doesn't matter)"],
        ["U", "Up face", "Clockwise"],
        ["U'", "Up face", "Counterclockwise"],
        ["U2", "Up face", "180 degrees"],
        ["F", "Front face", "Clockwise"],
        ["F'", "Front face", "Counterclockwise"],
        ["L", "Left face", "Clockwise"],
        ["D", "Down face", "Clockwise"],
      ],
    },
    {
      type: "tip",
      text: "The prime symbol (') is read as 'prime' or 'inverse'. R' is said 'R prime'. It always means counterclockwise when looking directly at that face.",
    },
    { type: "h2", text: "Reading an Algorithm" },
    {
      type: "p",
      text: "Algorithms are just strings of these letters, read left to right. Each move happens one at a time, in order. There are no pauses or tricks — just execute each move in sequence.",
    },
    {
      type: "algo",
      name: "Example sequence",
      moves: "R U R' U'",
      note: "Right clockwise → Up clockwise → Right counterclockwise → Up counterclockwise. This is one of the most important sequences in cubing.",
    },
    { type: "h2", text: "Cube Rotations (lowercase)" },
    {
      type: "p",
      text: "Lowercase letters mean you rotate the entire cube, not just one face. These don't change the state of the puzzle — just your view of it.",
    },
    {
      type: "list",
      items: [
        "x — Rotate the whole cube as if doing an R move",
        "y — Rotate the whole cube as if doing a U move",
        "z — Rotate the whole cube as if doing an F move",
      ],
    },
  ],

  "1.4": [
    { type: "h2", text: "What is an Algorithm?" },
    {
      type: "p",
      text: "An algorithm is a fixed sequence of moves that produces a predictable result on the cube. Unlike random turning, algorithms are precise tools — the same sequence always does the same thing, regardless of the rest of the cube.",
    },
    {
      type: "p",
      text: "As you learn to solve the cube, you'll collect a small library of algorithms. Think of them like special moves in a game — you learn when and why to use each one.",
    },
    { type: "h2", text: "The Sexy Move" },
    {
      type: "p",
      text: "The most famous short algorithm in cubing is the 'sexy move'. It's called that because it looks smooth and satisfying to execute quickly.",
    },
    {
      type: "algo",
      name: "The Sexy Move",
      moves: "R U R' U'",
      note: "Execute this 6 times in a row and the cube returns to its starting state. This is a good way to test if you're doing it correctly.",
    },
    { type: "h2", text: "Try It Now" },
    {
      type: "list",
      items: [
        "Start with a solved (or any scrambled) cube",
        "Execute R U R' U' — that's one repetition",
        "Repeat it 5 more times (6 total)",
        "You should be back where you started",
      ],
    },
    {
      type: "tip",
      text: "If you don't end up back at the start, you made an error somewhere. Common mistakes: going the wrong direction on R' (should be counterclockwise, not clockwise), or doing R2 instead of R. Slow down and double-check each move.",
    },
    { type: "h2", text: "Why This Matters" },
    {
      type: "p",
      text: "The sexy move is a building block of several real algorithms you'll use to solve the cube. Understanding that algorithms have consistent, reversible effects is the mental model you'll use throughout this entire course.",
    },
  ],

  "1.5": [
    { type: "h2", text: "Grip and Hand Position" },
    {
      type: "p",
      text: "How you hold the cube matters more than you'd think. Bad habits formed now — like always gripping with your palms and doing wrist turns — will slow you down later. Good form feels awkward at first but pays off fast.",
    },
    { type: "h2", text: "Basic Grip" },
    {
      type: "list",
      items: [
        "Hold the cube with your fingers, not your palms. Your palms should barely touch the cube.",
        "Index fingers rest on the U (top) face, one on each side.",
        "Middle fingers curl around the front and back faces.",
        "Thumbs rest on the D (bottom) face or the sides.",
      ],
    },
    { type: "h2", text: "Standard Orientation" },
    {
      type: "p",
      text: "When learning, hold the cube with white on top (U face) and green facing you (F face). This is arbitrary, but being consistent removes one source of confusion while you're still building your mental map of the cube.",
    },
    {
      type: "tip",
      text: "Once you can solve the cube reliably, you'll stop caring which color is on top — you can start a solve from any orientation. But for now, consistency helps.",
    },
    { type: "h2", text: "Two Hands, Always" },
    {
      type: "p",
      text: "Always use both hands. Beginners often hold the cube in one hand and turn with the other — this is slow and inefficient. Both hands should be turning at all times during fast sequences.",
    },
    {
      type: "warn",
      text: "Avoid rotating the entire cube (using x, y, z) to get to a face. Instead, learn to reach your fingers around the cube to make moves. Every whole-cube rotation costs time and breaks your rhythm.",
    },
    { type: "h2", text: "What's Next" },
    {
      type: "p",
      text: "In Stage 2, you'll start actually solving the cube. You now have everything you need: you understand the pieces, know the face names, can read notation, and understand what algorithms are. Time to use all of it.",
    },
  ],

  // ─────────────────────────────────────────────────────────
  // STAGE 2 — Your First Solve
  // ─────────────────────────────────────────────────────────

  "2.1": [
    { type: "h2", text: "Why Start with White?" },
    {
      type: "p",
      text: "You can technically start a solve with any color, but white is the universal convention for beginners — and most speedsolvers keep this habit. The reason is simple: white is easy to see against the dark colored faces, making it easier to spot and track white pieces while you work.",
    },
    {
      type: "p",
      text: "The first step of your solve is building the white cross: getting all 4 white edge pieces onto the top face in the correct positions.",
    },
    { type: "h2", text: "What a Correct Cross Looks Like" },
    {
      type: "p",
      text: "This is where most beginners make their first mistake. A correct white cross is NOT just 4 white pieces on top. Each white edge piece has two colors — white and one other color. For the cross to be correct, the second color on each edge must match the center it's adjacent to.",
    },
    {
      type: "tip",
      text: "Example: the white-green edge piece must be placed so that white faces up AND green faces the green center. If it's flipped or in the wrong slot, the cross is wrong even if it looks like a cross.",
    },
    { type: "h2", text: "The Four White Edge Pieces" },
    {
      type: "p",
      text: "There are 4 white edge pieces, one for each non-white face: white-green, white-red, white-blue, white-orange. Each one belongs in a specific slot on the top (white) face, adjacent to its matching color center.",
    },
    {
      type: "list",
      items: [
        "White-green edge → top face, green side",
        "White-red edge → top face, red side",
        "White-blue edge → top face, blue side",
        "White-orange edge → top face, orange side",
      ],
    },
    { type: "h2", text: "Centers Are Your Guide" },
    {
      type: "p",
      text: "Remember: centers never move. The green center is always the green center. Use the centers as fixed reference points to know where each edge piece belongs. If the green center is facing you, the white-green edge needs to end up directly above it.",
    },
    {
      type: "warn",
      text: "Don't just get 4 white stickers on top and move on. Take the extra second to check that each edge's side color matches its center. A wrong cross means everything built on top of it will also be wrong.",
    },
  ],

  "2.2": [
    { type: "h2", text: "Finding the White Edges" },
    {
      type: "p",
      text: "Start by locating all 4 white edge pieces. They could be anywhere on the cube — top layer, middle layer, or bottom layer, facing any direction. Before turning anything, take a moment to find them all.",
    },
    { type: "h2", text: "Three Cases" },
    {
      type: "p",
      text: "Depending on where a white edge is and which way it's facing, you'll handle it differently. There are three main situations:",
    },
    {
      type: "list",
      items: [
        "Edge is in the bottom layer, white facing down — flip it up with a simple move",
        "Edge is in the bottom layer, white facing sideways — rotate it to the top",
        "Edge is stuck in the top or middle layer — temporarily move it to the bottom first, then bring it up correctly",
      ],
    },
    { type: "h2", text: "The General Approach" },
    {
      type: "p",
      text: "The white cross is intentionally more intuitive than algorithmic. There's no single algorithm you memorize — you learn to see the piece, understand where it needs to go, and figure out a path to get it there without disturbing pieces already placed.",
    },
    {
      type: "tip",
      text: "Work one edge at a time. Get the first white edge correct, then find the next one. As you place more edges, you'll need to be more careful not to knock the placed ones out. Start with whichever edge is easiest to spot.",
    },
    { type: "h2", text: "Key Moves for the Cross" },
    {
      type: "p",
      text: "Most cross solutions use a small set of moves. If a white edge is in the bottom layer with white facing sideways, you can do a face turn to bring it to the top. If it's in the wrong top slot, use a U or U' to reposition it, then bring it down.",
    },
    {
      type: "list",
      items: [
        "U / U' — rotate the top layer to align a cross piece with its center",
        "F / F' — flip a bottom-layer edge up to the top",
        "R / R' or L / L' — move top-layer edges down and out of the way",
      ],
    },
    {
      type: "warn",
      text: "If a white edge is already in the top layer but in the wrong slot or flipped wrong, don't try to twist the top — that knocks out already-placed pieces. Instead, push the piece down into the bottom layer first, then bring it back up correctly.",
    },
    { type: "h2", text: "Practice Until It Feels Natural" },
    {
      type: "p",
      text: "The cross is a skill that improves dramatically with practice. Your first few attempts will be slow and clunky. That's fine. Focus on understanding why each move works, not on doing it fast. Speed comes later.",
    },
  ],

  "2.3": [
    { type: "h2", text: "After the Cross: White Corners" },
    {
      type: "p",
      text: "You have a white cross. Now you need to fill in the 4 white corners to complete the entire white face. Each white corner piece has 3 colors: white plus two side colors. Just like the edges, the corner must go in the right slot — white facing up, and each side color matching its adjacent center.",
    },
    { type: "h2", text: "Finding the Right Slot" },
    {
      type: "p",
      text: "Look at a white corner piece and read its three colors. One is white, the other two tell you exactly where it belongs: in the corner between those two side color centers. For example, a white-red-green corner goes in the top-right corner between the red and green faces.",
    },
    { type: "h2", text: "The Main Insertion Algorithm" },
    {
      type: "p",
      text: "The way you insert all the corners is actually quite simple. Just put the corner piece below where it needs to go (the corners of the white face) and use the algorithm below.",
    },
    {
      type: "algo",
      name: "Basic Corner Insertion",
      moves: "R' D' R D",
      note: "Depending on the orientation of the corner piece you are trying to insert, you may have to repeat this move multiple times. Don't be intimidated, as long as the corner is beneath the spot it needs to go, this algorithm will insert the corner piece properly.",
    },
    {
      type: "tip",
      text: "If there are no white corner pieces in the bottom layer, look for them in the top layer and use the same algorithm (R' D' R D) to put it in the bottom layer. Then simply repeat the same process from before.",
    },
    {
      type: "warn",
      text: "Be careful not to disturb your white cross while inserting corners. Always check that the edges you've placed are still correct after each insertion.",
    },
    { type: "h2", text: "Completing the White Face" },
    {
      type: "p",
      text: "After all 4 corners are in, your white face should be fully solved — all 9 white stickers showing, and the first layer of each side color should match its center. Flip the cube over so white is on the bottom. From now on, you'll work with white on the bottom for the rest of the solve.",
    },
  ],

  "2.4": [
    { type: "h2", text: "The Middle Layer" },
    {
      type: "p",
      text: "You've completed the white face. Flip the cube over — white on the bottom, yellow on top. The middle layer has 4 edge slots. Each middle-layer edge has two colors (neither of which is white or yellow) and needs to go between its two matching centers.",
    },
    {
      type: "p",
      text: "The middle-layer edges you're looking for will be somewhere in the top layer (the yellow layer). Yellow edges — edges with a yellow sticker — belong in the last layer and should be ignored for now.",
    },
    { type: "h2", text: "Two Algorithms: Insert Right and Insert Left" },
    {
      type: "p",
      text: "There are only two algorithms for this step, and they mirror each other. Before using either, position the edge piece in the top layer so that the non-yellow color faces front and matches the front center. Then use U or U' to check which center the top color matches — that tells you which algorithm to use.",
    },
    {
      type: "algo",
      name: "Insert Right",
      moves: "U R U' R' U' F' U F",
      note: "Use when the edge needs to go into the right slot. The front color matches the front center, and the top color matches the right center.",
    },
    {
      type: "algo",
      name: "Insert Left",
      moves: "U' L' U L U F U' F'",
      note: "Use when the edge needs to go into the left slot. The front color matches the front center, and the top color matches the left center.",
    },
    {
      type: "tip",
      text: "If a middle-layer edge is already in the middle layer but in the wrong slot or flipped, you can use either algorithm to pop it out into the top layer, then solve it correctly. Just do the insert as if a random piece is in that slot — it'll kick out the wrong piece and you can then place it properly.",
    },
    { type: "h2", text: "Setting Up the Algorithm" },
    {
      type: "list",
      items: [
        "Find a non-yellow edge in the top layer",
        "Use U moves to align its front-facing color with the matching center",
        "Check what color is on top — if it matches the right center, use Insert Right; if left center, use Insert Left",
        "Execute the algorithm",
        "Repeat for all 4 middle-layer edges",
      ],
    },
    {
      type: "warn",
      text: "Take your time reading which algorithm to use. Running the wrong one inserts the piece backwards and you'll have to redo it. One second of checking saves five seconds of correction.",
    },
  ],

  "2.5": [
    { type: "h2", text: "The Last Layer Begins" },
    {
      type: "p",
      text: "White face done. Middle layer done. Now you work on the last layer — the yellow layer on top. This has two parts: orientation (getting all the yellow stickers to face up) and permutation (getting all the pieces in the right spots). You'll do orientation first.",
    },
    {
      type: "p",
      text: "The first orientation step is building a yellow cross on top. You don't need the cross to be fully solved yet — just a yellow cross shape, with yellow stickers on the 4 top edge positions.",
    },
    { type: "h2", text: "Three Starting Cases" },
    {
      type: "p",
      text: "Look at the top face. The yellow edge stickers will form one of three patterns:",
    },
    {
      type: "list",
      items: [
        "Dot — no yellow edges facing up (just the yellow center)",
        "L-shape (also called a hook) — two adjacent yellow edges facing up",
        "Line — two opposite yellow edges facing up",
      ],
    },
    {
      type: "tip",
      text: "If you already have a yellow cross, skip this step entirely and move to Lesson 2.6.",
    },
    { type: "h2", text: "The Yellow Cross Algorithm" },
    {
      type: "algo",
      name: "Yellow Cross",
      moves: "F R U R' U' F'",
      note: "This algorithm cycles through the cases. Dot → Line → Cross (2 applications). L-shape → Cross (1 application). Line → Cross (1 application with correct orientation).",
    },
    { type: "h2", text: "How to Apply It" },
    {
      type: "list",
      items: [
        "Dot: Run the algorithm once → you'll get a line or L-shape. Run again from correct orientation → cross.",
        "L-shape: Hold the cube so the L opens toward the top-left (the two yellow edges are on the left and top). Run once → cross.",
        "Line: Hold the cube so the line goes left-to-right (horizontal). Run once → cross.",
      ],
    },
    {
      type: "warn",
      text: "The orientation of how you hold the cube before running the algorithm matters. If you get the L-shape, make sure it opens toward the top-left corner before running the algorithm.",
    },
    {
      type: "p",
      text: "After this step, you'll have a yellow cross on top. The side colors of those edge pieces probably don't match their centers yet — that's fine. You'll fix that in the next lesson.",
    },
  ],

  "2.6": [
    { type: "h2", text: "Yellow Cross — But Side Colors Are Wrong" },
    {
      type: "p",
      text: "You have a yellow cross on top. But look at the side colors of those 4 edge pieces — they probably don't match the centers they're sitting next to. This step fixes that.",
    },
    {
      type: "p",
      text: "Look around the top layer edges and count how many already match their center. You'll find one of three situations: 0 matching, 2 adjacent matching, or 2 opposite matching. (You can't have exactly 1 or 3 matching by the laws of the cube.)",
    },
    { type: "h2", text: "The Algorithm" },
    {
      type: "algo",
      name: "Edge Cycle",
      moves: "R U R' U R U2 R'",
      note: "This cycles the front, right, and back top edges counterclockwise. The left edge stays in place.",
    },
    { type: "h2", text: "How to Apply It" },
    {
      type: "list",
      items: [
        "0 edges matching: Run the algorithm once → you'll get 2 adjacent or 2 opposite. Then proceed below.",
        "2 opposite edges matching: Run the algorithm once (Hold the cube so the yellow face is ontop and a lined up edge is facing you). You should then have 2 adjacent edge pieces.",
        "2 adjacent edges matching: Hold the cube so the matching edges are on the back and right. Run the algorithm once → all 4 will match.",
      ],
    },
    {
      type: "tip",
      text: "After running the algorithm, check all 4 side colors. If they all match their centers, you're done. If not, check your cube orientation before the algorithm — the position you hold the cube determines which edges get cycled.",
    },
    {
      type: "warn",
      text: "This algorithm only moves top-layer edges. It won't disturb your white face or middle layer. If something below changes, you misidentified a move — double-check the algorithm.",
    },
    { type: "h2", text: "After This Step" },
    {
      type: "p",
      text: "Your yellow cross is now fully correct — yellow facing up AND side colors matching their centers. The top face still has 4 yellow corners out of place, but you'll handle those next.",
    },
  ],

  "2.7": [
    { type: "h2", text: "Yellow Corners: Position First, Orientation Later" },
    {
      type: "p",
      text: "The last layer has 4 corners to deal with. You'll do this in two steps: first get each corner into the right slot (this lesson), then twist them so yellow faces up (next lesson). Don't worry about which way a corner is twisted yet — just get it to the correct position.",
    },
    { type: "h2", text: "What 'Correct Position' Means" },
    {
      type: "p",
      text: "A corner is in the correct position if its three colors match the three faces it touches — even if the yellow sticker isn't facing up. For example, a yellow-red-green corner is correctly positioned if it's in the front-right slot between the red and green centers.",
    },
    { type: "h2", text: "Checking the Corners" },
    {
      type: "p",
      text: "Look at each top-layer corner and check if its colors match the two adjacent centers. You might get lucky and find all 4 are already positioned correctly. More likely, you'll find 0 or 1 in the right spot.",
    },
    { type: "h2", text: "The Corner Cycle Algorithm" },
    {
      type: "algo",
      name: "Corner Cycle",
      moves: "U R U' L' U R' U' L",
      note: "This cycles 3 of the 4 top corners. The front-left corner stays in place (used as the anchor).",
    },
    { type: "h2", text: "How to Apply It" },
    {
      type: "list",
      items: [
        "Find a corner that is already in the correct position.",
        "Hold the cube so that corner is in the front-right slot.",
        "Run the algorithm — the other 3 corners cycle.",
        "Check again. If all 4 are now positioned correctly, move to lesson 2.8.",
        "If not, repeat with the new correctly-positioned corner in front-left.",
      ],
    },
    {
      type: "tip",
      text: "If no corner is in the correct position, run the algorithm once from any orientation. You'll get at least one correctly positioned corner after that, and you can proceed from there.",
    },
    {
      type: "warn",
      text: "This step only positions the corners — it doesn't orient them. The yellow stickers might face sideways or toward you after this step. That's expected. You'll fix the orientation next.",
    },
  ],

  "2.8": [
    { type: "h2", text: "Twisting the Last Corners" },
    {
      type: "p",
      text: "This is the final step. All the corners are in the right position, but they are just twisted incorrectly. This process will solve that problem.",
    },
    {
      type: "warn",
      text: "This step looks like you're destroying the cube. This is 100% normal and expected. Do NOT stop halfway through. Trust the process! — everything comes back together at the end.",
    },
    { type: "h2", text: "The Algorithm" },
    {
      type: "algo",
      name: "Corner Twist",
      moves: "R U R' U'",
      note: "If you remember Lesson 4 from Stage 1, you were introduced to the 'Sexy Move' we are applying that same technique/algorithm to solve your cube right now.",
    },
    { type: "h2", text: "The Process" },
    {
      type: "list",
      items: [
        "Turn your cube ubside down so the white side is facing upwards.",
        "Hold the cube so an unsolved corner is in the bottom right slot.",
        "Run R U R' U' until the corner is solved. Once that corner is solved, it will look like your progress is destroyed. Don't panic, this is normal.",
        "Now rotate the bottom layer clockwise until another unsolved corner appears in the bottom right corner. DO NOT rotate the whole cube.",
        "Once that corner appears, simply repeat the same algorithm (R U R' U') until that one is solved too.",
        "Continue this process until all corners all solved.",
      ],
    },
    {
      type: "tip",
      text: "Make sure you do the FULL algorithm before rotating in another unsolved corner to the bottom right of the cube. (R U R' *notice solved corner* U') notice the final move of the algorithm AFTER properly orienting the corner piece.",
    },
    { type: "h2", text: "After All Corners Are Twisted" },
    {
      type: "p",
      text: "Once all 4 corners show yellow on top, do a U move if needed to align the top layer fully. The cube should be completely solved. If something looks off, you may have rotated the whole cube during the process — that's the most common mistake here.",
    },
  ],

  "2.9": [
    { type: "h2", text: "You Know How to Solve the Cube" },
    {
      type: "p",
      text: "Congratulations! If you made it up until this point you will have completed your first solve. Put the cube down and take a second to appreciate what you just did. You now have all the tools necessary to do your own unguided solve. This particular lesson isn't about learning anything new — it's about putting it all together in one complete solve, start to finish.",
    },
    { type: "h2", text: "The Full Solve Checklist" },
    {
      type: "list",
      items: [
        "1. White Cross — 4 white edges on top, side colors matching centers",
        "2. White Corners — complete the white face, first layer fully solved",
        "3. Middle Layer Edges — 4 middle-layer edges in the correct slots",
        "4. Yellow Cross — yellow cross on top (F R U R' U' F')",
        "5. Yellow Edge Alignment — cross side colors match their centers (R U R' U R U2 R')",
        "6. Yellow Corner Positioning — all 4 top corners in correct slots (U R U' L' U R' U' L)",
        "7. Yellow Corner Orientation — White face up, Sexy Move till all corners solved (R U R' U')",
      ],
    },
    { type: "h2", text: "Solve It Now" },
    {
      type: "p",
      text: "Scramble your cube and do a complete solve using only this checklist if you need it. Don't rush. It's fine if it takes 5 minutes or even more. The goal right now is completing it cleanly, without needing to look up what comes next.",
    },
    {
      type: "tip",
      text: "If you get stuck on a step, go back to that lesson and review. There's no shame in refreshing — everyone does it the first few times. The algorithms only stick after you've used them a dozen times each.",
    },
    { type: "h2", text: "What Comes Next" },
    {
      type: "p",
      text: "Stage 3 is about making your solve smoother and faster — finger tricks, reducing pauses, planning ahead. The goal there is consistent sub-2:00 solves. Once you can solve the cube reliably, improving your time is surprisingly fun.",
    },
    {
      type: "tip",
      text: "Try solving it a few more times before moving to Stage 3. Do at least 3 complete solves without looking anything up. Repetition is how the algorithms move from short-term memory to muscle memory.",
    },
  ],

  // ─────────────────────────────────────────────────────────
  // STAGE 3 — Getting Comfortable
  // ─────────────────────────────────────────────────────────

  "3.1": [
    { type: "h2", text: "Why Finger Tricks Matter" },
    {
      type: "p",
      text: "Right now you're probably turning the cube by gripping a face with your whole hand and rotating your wrist. That works — but it's slow. Every wrist turn requires you to re-grip the cube, breaking your rhythm and adding time. Finger tricks replace those full-hand movements with small, precise pushes and pulls using individual fingers. The result is faster turns with less effort.",
    },
    {
      type: "p",
      text: "This is what separates a 3-minute solver from a 1-minute solver. Not knowing more algorithms — just being able to execute the ones you already know more fluidly.",
    },
    { type: "h2", text: "The Core Finger Assignments" },
    {
      type: "list",
      items: [
        "U (clockwise) — Right index finger pushes the top-back edge of the U face from right to left.",
        "U' (counterclockwise) — Left index finger pulls the top-back edge of the U face from left to right.",
        "R (clockwise/counterclockwise) — Use your wrist for these movements, try to avoid any fancy tricks.",
        "L (clockwise/counterclockwise) — Use your wrist for these movements, try to avoid any fancy tricks.",
        "F (clockwise) — Right thumb on the top right corner piece to pull clockwise (use your pinky fingers to stop two layers moving at the same time)",
        "D (clockwise) — Left ring finger or pinky finger pulls on the left side bottom layer corner",
        "D' (counterclockwise) — Right ring finger or pinky finger pushes on the right side bottom layer corner",
      ],
    },
    {
      type: "tip",
      text: "You don't need to master all of these instantly. Focus on U and R first — those two moves appear in almost every algorithm you know.",
    },
    { type: "h2", text: "Grip Position" },
    {
      type: "p",
      text: "Hold the cube with your fingertips, not your palms. Your palms should barely touch the cube at all.",
    },
    {
      type: "warn",
      text: "Don't try to fix your grip and learn finger tricks at the same time as solving. Practice the movements with a solved cube first — just do U, U', R, R' over and over until the finger motion feels natural, then apply it to algorithms.",
    },
    { type: "h2", text: "The Goal" },
    {
      type: "p",
      text: "By the end of Stage 3, your finger tricks don't need to be fast — they just need to exist. You're building the habit now. Speed comes from repetition over weeks, not from a single practice session.",
    },
  ],

  "3.2": [
    { type: "h2", text: "Putting Finger Tricks Into Algorithms" },
    {
      type: "p",
      text: "Knowing how to do a finger trick in isolation is one thing. Chaining them smoothly through a full algorithm is another. This lesson is about drilling the algorithms you already know using proper finger technique.",
    },
    { type: "h2", text: "Start With the Sexy Move" },
    {
      type: "p",
      text: "The sexy move (R U R' U') is the best algorithm to learn finger tricks on. It's short, it repeats cleanly, and it uses the two most important moves: R and U.",
    },
    {
      type: "algo",
      name: "The Sexy Move",
      moves: "R U R' U'",
      note: "Execute this slowly with the finger tricks you learned from the previous lesson. Wrist movements for (R / R') and index finger (U / U') Repeat until it flows.",
    },
    {
      type: "tip",
      text: "A good drill: do the sexy move 6 times in a row (which returns the cube to its start state) using only finger tricks. Time yourself. Do it again. Your goal is smooth, not fast.",
    },
    { type: "h2", text: "Apply to Corner Insertion" },
    {
      type: "p",
      text: "The corner insertion from Stage 2 (R' D' R D) also benefits from finger tricks. The D move is trickier — your right ring or pinky finger pushes the bottom face. Practice this separately before combining.",
    },
    {
      type: "algo",
      name: "Corner Insertion",
      moves: "R' D' R D",
      note: "Slight wrist movement for right side movements, ring or pinky for bottom face flicks",
    },
    { type: "h2", text: "The Middle Layer Algorithms" },
    {
      type: "p",
      text: "The insert-right and insert-left algorithms (U R U' R' U' F' U F and U' L' U L U F U' F') are longer and involve more varied moves. Don't try to finger-trick all of them immediately. Start with the first 4 moves of each and get those smooth before tackling the full sequence.",
    },
    {
      type: "warn",
      text: "Speed is not the goal here. If you rush and sloppy turns become a habit, they're hard to unlearn. Slow and clean now means fast and clean later.",
    },
    { type: "h2", text: "Practice Routine" },
    {
      type: "list",
      items: [
        "Do the sexy move 6 times in a row using only finger tricks. Repeat 5 times.",
        "Do R' D' R D 4 times in a row using finger tricks. Repeat 5 times.",
        "Do a full solve — whenever you hit a move, ask yourself: can I do this without a full regrip of the cube? Or without gripping the cube with my palm?",
      ],
    },
  ],

  "3.3": [
    { type: "h2", text: "The Cross Is Your Foundation" },
    {
      type: "p",
      text: "Every solve starts with the white cross. At the beginner level, most people spend 30–60 seconds on it — hunting for pieces, turning randomly, fixing mistakes. An efficient cross solver does it in under 8 moves and under 5 seconds. That gap alone can cut minutes off your solve time.",
    },
    { type: "h2", text: "Solve the Cross on the Bottom" },
    {
      type: "p",
      text: "In Stage 2 you built the cross on top (white facing up). From now on, build it on the bottom — white facing down. This is the standard for all speedsolving methods because it means you never have to flip the cube after the cross. You can go straight from the cross into solving corners and middle layer edges without any interruption.",
    },
    {
      type: "tip",
      text: "Flipping a cube over mid-solve takes about 0.5 seconds. That sounds small, but at the beginner level you flip multiple times per solve. Eliminating those flips adds up fast.",
    },
    { type: "h2", text: "Use Your Inspection Time" },
    {
      type: "p",
      text: "In official competitions you get 15 seconds of inspection before starting the timer. Even in casual practice, take 3–5 seconds before you start turning to find the white cross pieces. Locate all 4 of them. Figure out roughly where they need to go. Having a plan before you start means fewer wasted moves.",
    },
    { type: "h2", text: "The 8-Move Target" },
    {
      type: "p",
      text: "An optimal white cross can almost always be solved in 8 moves or fewer. You don't need to find the perfect solution every time — but aiming for under 8 moves forces you to think rather than turn. Ask yourself: is there a shorter way to get this piece where it needs to go?",
    },
    {
      type: "list",
      items: [
        "Look for white edge pieces that are already close to their correct slot — solve those first.",
        "Try to solve two cross pieces with one sequence of moves.",
        "Avoid undoing moves — if you just did an R move, doing R' next cancels it out.",
        "Plan at least the first two cross pieces before you start turning.",
      ],
    },
    {
      type: "warn",
      text: "Don't get paralyzed trying to find the perfect cross. An 8-move cross done quickly beats a 6-move cross you spent 20 seconds calculating. As you practice, efficient solutions will come faster and more naturally.",
    },
    { type: "h2", text: "Practice: Cross Only" },
    {
      type: "p",
      text: "Scramble your cube, then solve only the cross. Stop there and count how many moves it took. Reset and do it again. Aim to get it under 10 moves consistently before trying to get under 8. This isolated practice is one of the fastest ways to improve your overall solve time.",
    },
  ],

  "3.4": [
    { type: "h2", text: "What Pauses Are Costing You" },
    {
      type: "p",
      text: "If you video yourself solving, you'll notice something: a significant portion of your solve time is spent not turning. You finish a step, then stop and stare at the cube trying to figure out what's next. These pauses are normal at this stage — but eliminating them is where the biggest time gains come from.",
    },
    { type: "h2", text: "Lookahead: The Core Skill" },
    {
      type: "p",
      text: "Lookahead means tracking where the next piece is while you're still executing the current move. Instead of: finish algorithm → stop → find piece → start turning, you're: executing algorithm + already tracking the next piece → no pause between steps.",
    },
    {
      type: "tip",
      text: "You don't need to plan multiple steps ahead right now. Just try to locate the next piece you need before you finish the current one. That one habit alone will noticeably reduce your times.",
    },
    { type: "h2", text: "Where Pauses Happen Most" },
    {
      type: "list",
      items: [
        "After the cross — pausing to find the first white corner piece.",
        "After each corner — pausing to find the next one.",
        "After the first layer — pausing before starting middle layer edges.",
        "After each middle layer edge — pausing to find the next.",
        "Before OLL — pausing to identify which case you have.",
      ],
    },
    { type: "h2", text: "How to Build Lookahead" },
    {
      type: "p",
      text: "The most effective way to practice lookahead is to slow down. This sounds counterintuitive, but deliberate slow solving forces you to have time to look ahead. When you're rushing, you only have time to react to each piece as you find it. When you slow down, you have time to look at two things at once.",
    },
    {
      type: "list",
      items: [
        "Solve at 70% of your normal speed. Use the extra time to look for the next piece while finishing the current step.",
        "After each major step (cross, corners, middle layer), don't stop — immediately start scanning for the next piece.",
        "During long algorithms (like middle layer insertions), let your eyes wander to the rest of the cube rather than just watching your hands.",
      ],
    },
    {
      type: "warn",
      text: "Don't try to force lookahead during fast solves. Practice it during slow, deliberate solves and it will naturally carry over as your muscle memory improves.",
    },
    { type: "h2", text: "A Realistic Expectation" },
    {
      type: "p",
      text: "Lookahead takes weeks to develop. Don't expect to eliminate all pauses immediately. The goal for this stage is just awareness — notice when you pause, notice why, and consciously try to bridge that gap. The improvement happens gradually through repetition.",
    },
  ],

  "3.5": [
    { type: "h2", text: "Bad Habits Are Invisible" },
    {
      type: "p",
      text: "The frustrating thing about bad habits is that they feel normal. You don't notice you're doing them because you've always done them that way. This lesson names the most common ones so you can start catching yourself.",
    },
    { type: "h2", text: "Excessive Cube Rotations" },
    {
      type: "p",
      text: "A cube rotation (x, y, z) reorients the whole cube so you can reach a face more easily. Beginners use them constantly. The problem: every rotation takes time, breaks your rhythm, and forces your brain to re-map which face is which.",
    },
    {
      type: "warn",
      text: "If you find yourself rotating the cube to do an L or B move — stop. Instead, reach your fingers around the cube to execute the move from your current grip. It feels awkward at first but it's faster.",
    },
    { type: "h2", text: "Always Solving the Cross in the Same Order" },
    {
      type: "p",
      text: "Some beginners always place the white-green edge first, then white-red, then white-blue, then white-orange — in the same fixed order every time. This is slower because it ignores which pieces are actually easiest to place first on that specific scramble. Always start with whichever cross piece requires the fewest moves.",
    },
    { type: "h2", text: "One-Handed Turning" },
    {
      type: "p",
      text: "Holding the cube in one hand and turning with the other is a very common beginner habit. It strictly limits your turning speed. Both hands should always be active — while one hand turns a face, the other hand is gripping and stabilizing, ready to turn immediately after.",
    },
    { type: "h2", text: "Constant Re-gripping" },
    {
      type: "p",
      text: "Re-gripping means shifting your hand position between moves. Every re-grip is a tiny pause. Finger tricks reduce re-gripping because you can execute more moves from the same grip position. If you find yourself shuffling your hands around between every move, your grip position is wrong.",
    },
    {
      type: "tip",
      text: "Film a solve on your phone and watch it back. Bad habits are obvious from the outside — you'll immediately see the pauses, the re-grips, and the cube rotations that you didn't notice while solving.",
    },
    { type: "h2", text: "Staring at Your Hands" },
    {
      type: "p",
      text: "Your hands know what to do during familiar algorithms. If you're watching your hands execute R U R' U', your eyes aren't available to look for the next piece. During algorithms you know well, let your hands work on their own and use your eyes to look ahead.",
    },
    { type: "h2", text: "Moving On" },
    {
      type: "p",
      text: "You don't need to eliminate every bad habit before moving forward. Just being aware of them is the first step. As you practice, consciously check in: am I rotating unnecessarily? Am I using both hands? Am I watching my hands when I don't need to?",
    },
  ],

  "3.6": [
    { type: "h2", text: "Time to Find Your Baseline" },
    {
      type: "p",
      text: "You've learned finger tricks, cross efficiency, lookahead, and you know what habits to watch for. Now it's time to establish a real baseline — a number you can actually measure progress against.",
    },
    {
      type: "p",
      text: "A baseline average means nothing without the context of where you started. The time you record today is the number you'll look back on later and feel good about beating.",
    },
    { type: "h2", text: "The Challenge" },
    {
      type: "list",
      items: [
        "Go into Playground mode and open the Timer.",
        "Do 5 complete solves. Don't skip any — even if one goes badly.",
        "Your average of 5 is your Stage 3 baseline.",
        "Write it down or remember it. You'll want to know this number.",
      ],
    },
    {
      type: "tip",
      text: "Don't cherry-pick your solves or redo ones you didn't like. An honest average is more useful than a flattering one. A bad solve in the set is data — it tells you where things break down.",
    },
    { type: "h2", text: "What the Numbers Mean" },
    {
      type: "table",
      headers: ["Average", "What it means"],
      rows: [
        [
          "Under 1:00",
          "You're already moving fast — focus on consistency and lookahead",
        ],
        [
          "1:00 – 2:00",
          "Right on track for this stage. Keep drilling algorithms and reducing pauses",
        ],
        [
          "2:00 – 4:00",
          "Your algorithms aren't fully memorized yet. More reps before Stage 4",
        ],
        [
          "Over 4:00",
          "Spend more time on Stage 2 — the steps aren't automatic enough yet",
        ],
      ],
    },
    { type: "h2", text: "The Sub-2:00 Goal" },
    {
      type: "p",
      text: "The target for Stage 3 is consistent sub-2:00 solves. You don't need to be there before moving to Stage 4 — but if you're averaging over 3 minutes, it's worth spending more time with the fundamentals before adding more complexity.",
    },
    {
      type: "p",
      text: "Stage 4 introduces CFOP — a completely different approach to the first layer. If your current solve is shaky, the new method will feel overwhelming. A solid beginner solve is the best foundation for everything that comes next.",
    },
    {
      type: "tip",
      text: "Come back to the timer regularly. Your average after 50 more solves will be noticeably lower than today's just from repetition alone — even without learning anything new.",
    },
  ],

  // ─────────────────────────────────────────────────────────
  // STAGE 4 — Intro to CFOP & The Cross
  // ─────────────────────────────────────────────────────────

  "4.1": [
    { type: "h2", text: "What is CFOP?" },
    {
      type: "p",
      text: "CFOP is the most popular speedcubing method in the world. Nearly every top solver uses it. The name stands for the four steps of the solve: Cross, F2L, OLL, PLL.",
    },
    {
      type: "table",
      headers: ["Step", "Full Name", "What it does"],
      rows: [
        [
          "Cross",
          "Cross",
          "Solve 4 edge pieces to form a cross on the bottom face",
        ],
        [
          "F2L",
          "First Two Layers",
          "Pair corners and edges, insert them to complete the first two layers",
        ],
        [
          "OLL",
          "Orientation of the Last Layer",
          "Make the entire top face one color (yellow)",
        ],
        [
          "PLL",
          "Permutation of the Last Layer",
          "Move the top layer pieces into their correct positions",
        ],
      ],
    },
    { type: "h2", text: "How It Differs from the Beginner Method" },
    {
      type: "p",
      text: "In the beginner layer-by-layer method, you solve pieces one at a time — white cross, white corners, middle layer, yellow cross, and so on. That's 6–7 separate steps. CFOP collapses all of that into 4 more efficient steps.",
    },
    {
      type: "p",
      text: "The biggest change is F2L. Instead of solving white corners and middle edges separately (2 steps), you pair them up and insert them together in one step. This alone cuts seconds off every solve.",
    },
    {
      type: "list",
      items: [
        "Beginner method: ~6–7 steps, 80–120 moves on average",
        "CFOP: 4 steps, 50–60 moves on average for beginners, under 45 for advanced solvers",
        "World records are set with CFOP — the method scales all the way to sub-5 seconds",
      ],
    },
    { type: "h2", text: "Other Methods (And Why We're Doing CFOP)" },
    {
      type: "p",
      text: "Other popular methods exist — Roux uses block-building and is favored for its low move count, and ZZ pre-orients edges at the start to simplify the rest of the solve. Both are legitimate paths to becoming fast.",
    },
    {
      type: "p",
      text: "We're focusing on CFOP because it's the most documented, most taught, and most used method at every skill level. The learning resources, algorithm sheets, and community knowledge are unmatched. If you ever get stuck, help is everywhere.",
    },
    {
      type: "tip",
      text: "You already know how to do a CFOP cross — it's the same white cross you learned in Stage 2. Stage 4 is about doing it better, faster, and on the bottom instead of the top.",
    },
  ],

  "4.2": [
    { type: "h2", text: "Why Solve the Cross on the Bottom?" },
    {
      type: "p",
      text: "Earlier, you solved the white cross on top because it's a lot easier to see whats happening. With the CFOP method, you always solve it with the white side facing down.",
    },
    {
      type: "warn",
      text: "Flipping the cube after every cross costs time. Every cube rotation (x, y, z) is a pause where your hands aren't solving. CFOP solvers aim for zero unnecessary rotations.",
    },
    { type: "h2", text: "How to Solve the Cross on the Bottom" },
    {
      type: "p",
      text: "The process is the same as before — find white edge pieces and get them to their correct spots. The difference is orientation. You're now looking at the cube from above, working with the bottom face in mind.",
    },
    {
      type: "list",
      items: [
        "Find a white edge, each one has: White + one other color (Red, Green, Orange, or Blue)",
        "If needed, bring the edge piece/pair to the top. Think of the top as your main workspace for now",
        "Now match the side color. For example, if you have a White + Green edge piece, line it up with the green center piece",
        "Once it is lined up, it is time to insert it into the bottom. There's two common cases here:",
        "1. White facing up (on top) — Do a double turn to bring it down. R2, L2, F2, or B2",
        "2. White edge facing sideways. Move it to the front-top position and do a F or F' move to drop it into place",
      ],
    },
    {
      type: "tip",
      text: "Right now, don't worry about speed. Keep the white on bottom, don't break pieces you already solved, and match colors before you insert (this matters a lot)",
    },
    {
      type: "p",
      text: "At this point, you're gonna wanna focus on solving without rotating the cube, understanding where pieces need to go, and getting comfortable working 'from the top' while solving the cross",
    },
    {
      type: "tip",
      text: "It's okay to temporarily displace a placed cross edge to work around it — just make sure to restore it before moving on. Planning ahead (Lesson 4.3) eliminates most of this.",
    },
    { type: "h2", text: "Getting Comfortable" },
    {
      type: "p",
      text: "Solving on the bottom feels awkward at first. Stick with it. After 20–30 practice crosses it becomes second nature. The discomfort is just your brain adjusting to a new perspective — not a sign that you're doing it wrong.",
    },
  ],

  "4.3": [
    { type: "h2", text: "What Does 'Planning the Cross' Mean?" },
    {
      type: "p",
      text: "Before every competitive solve, there's a 15-second inspection period. Top solvers use this time to plan the entire cross before touching the cube. No moves, just eyes — trace the pieces mentally and figure out the solution in advance.",
    },
    {
      type: "p",
      text: "This is called cross planning, and it's one of the highest-leverage skills in speedcubing. A planned cross takes 1–3 seconds to execute. An unplanned cross takes 5–10. That difference compounds across hundreds of solves.",
    },
    { type: "h2", text: "Start with Two Pieces" },
    {
      type: "p",
      text: "Planning all 4 cross pieces simultaneously is an advanced skill. Start by planning just 2. Pick the two easiest-looking cross pieces and figure out how to solve them before you start. Execute those 2 from memory, then solve the remaining 2 normally.",
    },
    {
      type: "list",
      items: [
        "During inspection: scan the cube and find 2 white edges",
        "Figure out the moves to place both — mentally simulate the solution",
        "Start the solve and execute your plan",
        "Solve the remaining 2 cross edges normally",
        "Over time, expand your planning to 3 pieces, then all 4",
      ],
    },
    { type: "h2", text: "What to Look For" },
    {
      type: "p",
      text: "When scanning for cross pieces, identify two things for each edge: where is it now, and which slot does it belong in? The slot is determined by the non-white color — a white-green edge belongs in the slot next to the green center.",
    },
    {
      type: "table",
      headers: ["Edge location", "What to think"],
      rows: [
        [
          "Top face, white up",
          "Which move aligns it? Then a double move drops it in.",
        ],
        ["Top face, white sideways", "Which face move puts white facing down?"],
        [
          "Middle layer",
          "Which moves bring it to the top without disturbing others?",
        ],
        [
          "Bottom (wrong slot)",
          "Which move repositions it, or pull it out and re-insert?",
        ],
      ],
    },
    { type: "h2", text: "Use Inspection Time Actively" },
    {
      type: "p",
      text: "Most beginners use inspection to find one piece and then figure out the rest on the fly. That's fine when starting out, but you want to shift toward complete pre-planning as soon as possible. Every second of thinking during the solve is a second of not turning.",
    },
    {
      type: "tip",
      text: "Practice cross planning without solving. Pick up a scrambled cube, inspect it for 15 seconds, then put it down. Write down your planned moves. Pick it up again and check if your plan was correct. This trains planning without the pressure of timing.",
    },
    {
      type: "warn",
      text: "Don't rush planning to the point where your plan is wrong. A confident, correct 4-move plan beats a panicked 8-move scramble any day.",
    },
  ],

  "4.4": [
    { type: "h2", text: "The 6-Move Goal" },
    {
      type: "p",
      text: "A well-planned cross should be solvable in 6 moves or fewer — and often in 4 or 5. Beginners typically use 8–12 moves per cross. That gap is where seconds are hiding.",
    },
    {
      type: "p",
      text: "The key insight: there are usually multiple ways to solve the cross. The beginner instinct is to grab the first approach that works. The CFOP instinct is to quickly compare a few options and pick the shortest.",
    },
    { type: "h2", text: "Recognizing Multiple Solutions" },
    {
      type: "p",
      text: "When you look at a cross piece, ask: is there a 1-move solution? A 2-move solution? Before accepting a 4-move approach, see if a setup move creates a faster sequence. This takes practice but becomes fast and automatic.",
    },
    {
      type: "list",
      items: [
        "1-move solutions: edge is already in position but needs one flip (F, R, etc.)",
        "2-move solutions: one alignment move + one insertion move",
        "3-move solutions: one setup + one flip + one restore",
        "4+ move solutions: usually avoidable with better sequencing",
      ],
    },
    { type: "h2", text: "Cross Efficiency in Practice" },
    {
      type: "p",
      text: "When practicing efficiency, solve the cross and then count your moves. If you used more than 8, look back and find where you could have done better. Don't just move on — this reflection is where improvement actually happens.",
    },
    {
      type: "tip",
      text: "The 'U' layer is your best friend for cross efficiency. Turning U costs nothing in terms of disrupting the cross itself — all 4 cross slots rotate together. Use 'U' moves to setup easy inserts",
    },
  ],

  "4.5": [
    { type: "h2", text: "Why Drills?" },
    {
      type: "p",
      text: "The cross is the foundation of every CFOP solve. A slow cross creates a slow solve, no matter how fast your F2L and last layer are. Dedicated cross drills train speed and planning simultaneously — and they're the fastest way to make the cross automatic.",
    },
    {
      type: "p",
      text: "The goal for this stage: a consistent cross in 2–3 seconds. That sounds fast, but it's achievable within a few weeks of regular drilling. Top solvers average under 1.5 seconds. Most intermediate solvers land at 2–3.",
    },
    { type: "h2", text: "Cross-Only Practice" },
    {
      type: "p",
      text: "Set a timer. Scramble the cube. Solve only the cross as fast as possible, then stop and reset. Don't finish the full solve — just the cross, over and over. This isolates the skill and builds dedicated speed.",
    },
    {
      type: "list",
      items: [
        "Scramble, inspect for up to 5 seconds, execute",
        "Record your time for each cross-only attempt",
        "Aim for 10 attempts per session",
        "Track your best and average across sessions",
        "Once your average drops under 4 seconds, reduce inspection to 3 seconds",
      ],
    },
    { type: "h2", text: "The Drill Progression" },
    {
      type: "table",
      headers: ["Phase", "Inspection time", "Target cross time", "Goal"],
      rows: [
        [
          "1 — Foundations",
          "15 sec",
          "Under 8 sec",
          "Plan all 4 pieces, execute cleanly",
        ],
        [
          "2 — Speed",
          "15 sec",
          "Under 5 sec",
          "Tighten move count to 6 or fewer",
        ],
        [
          "3 — Competition",
          "15 sec",
          "Under 3 sec",
          "Fast recognition, fluid execution",
        ],
        [
          "4 — Advanced",
          "15 sec",
          "Under 2 sec",
          "Solve cross mid-inspection from memory",
        ],
      ],
    },
    {
      type: "tip",
      text: "If you wanna challenge yourself even more, give your self only 5-10 seconds of inspection time. Once you go back to the standard 15 second inspection time, you will feel far more confident.",
    },
    { type: "h2", text: "What Good Feels Like" },
    {
      type: "p",
      text: "A good cross doesn't feel fast — it feels smooth. There are no pauses to think. The pieces seem to fall into place with minimal effort. That smoothness comes from planning. When you know exactly what to do before you start, execution becomes effortless.",
    },
    {
      type: "warn",
      text: "Don't sacrifice accuracy for speed. A broken cross that you have to fix mid-solve is always slower than a slightly slower but correct cross. Speed up only when your current pace is consistent and clean.",
    },
    {
      type: "tip",
      text: "Use the Playground timer to log cross-only times. After 50+ attempts, your average will tell you which drill phase you're in — and where to focus next.",
    },
    { type: "h2", text: "Stage 4 Complete" },
    {
      type: "p",
      text: "At this point, you should have a basic understanding of CFOP. You can solve the cross on the bottom, plan pieces during inspection, and optimize for fewer moves. Stage 5 is where the method gets deep — F2L is the heart of CFOP and the most rewarding thing to learn. The better your cross is, the more mental space you'll have to focus on F2L.",
    },
    {
      type: "tip",
      text: "Before moving to Stage 5, make sure you can consistently solve the cross in under 6 seconds with no more than 8 moves. If you're not there yet, keep drilling — a solid cross makes all of F2L easier.",
    },
  ],

  // ─────────────────────────────────────────────────────────
  // STAGE 5 — F2L (First Two Layers)
  // ─────────────────────────────────────────────────────────

  "5.1": [
    { type: "h2", text: "The Inefficiency of the Beginner Method" },
    {
      type: "p",
      text: "In the beginner method, after the white cross you solve white corners, then flip the cube and insert middle-layer edges as a completely separate step. That's two steps, two separate hunts for pieces, and around 25–40 extra moves. F2L eliminates this inefficiency entirely.",
    },
    {
      type: "p",
      text: "The key insight: every white corner and its matching middle-layer edge belong together. They're destined for the same location in the finished cube. So instead of solving them separately, you pair them up first — then insert both at once.",
    },
    { type: "h2", text: "What is a pair?" },
    {
      type: "p",
      text: "A pair is one white corner piece + one matching edge piece. They match because they share two colors. For example: the white-red-green corner pairs with the red-green edge. Together, these two pieces fill one F2L slot.",
    },
    {
      type: "list",
      items: [
        "White-red-green corner + red-green edge → front-right slot (if front = red, right = green)",
        "White-orange-green corner + orange-green edge → front-left slot (if front = green, left = orange)",
        "White-red-blue corner + red-blue edge → back-right slot",
        "White-orange-blue corner + orange-blue edge → back-left slot",
      ],
    },

    {
      // Corner UFR: white on U[8], green on F[2], red on R[0]
      // Edge UF:    red on U[7],   green on F[1]
      // Green center F[4], red center R[4] shown for orientation context.
      // All other stickers grey.

      // colors: #B90000 (red), #ffffff (white), #FFD500 (yellow), #009B48 (green)
      type: "f2l-diagram",
      label: "Solved Pair Before Insertion",
      stickerColors: {
        U: [
          null,
          null,
          null,
          null,
          "#FFD500",
          "#B90000",
          null,
          null,
          "#B90000",
        ],
        F: [
          null,
          null,
          "#FFFFFF",
          "#B90000",
          "#B90000",
          null,
          "#B90000",
          "#B90000",
          null,
        ],
        R: [
          "#009B48",
          "#009B48",
          null,
          null,
          "#009B48",
          "#009B48",
          null,
          "#009B48",
          "#009B48",
        ],
      },
    },

    {
      type: "h2",
      text: "Here we have a solved pair. Now it is just a matter of inserting it.",
    },

    {
      type: "algo",
      name: "Right Slot Insert",
      moves: "U (R U' R')",
      note: "This algorithm is very simple. Here is the sequence: Move pair out of the way (U) > Bring up slot the pair needs to go in (R) > Bring the pair into the slot (U') > Insert the slot into its proper position (R')",
    },

    { type: "h2", text: "What a Slot Is" },
    {
      type: "p",
      text: "A slot is the space where a pair lives in the finished cube — the corner of the first (white) layer and the edge directly above it in the second (middle) layer. There are 4 slots, one at each corner of the cube: front-right, front-left, back-right, and back-left.",
    },
    {
      type: "p",
      text: "When a pair is correctly inserted into its slot, the corner sits at the bottom of the slot with white facing down, and the edge sits in the middle layer with its two colors matching the two adjacent centers. Two pieces solved together in one operation.",
    },

    {
      // Corner UFR: white on U[8], green on F[2], red on R[0]
      // Edge UF:    red on U[7],   green on F[1]
      // Green center F[4], red center R[4] shown for orientation context.
      // All other stickers grey.

      // colors: #B90000 (red), #ffffff (white), #FFD500 (yellow), #009B48 (green)
      type: "f2l-diagram",
      label: "Solved Pair After Insertion (In Correct Slot)",
      stickerColors: {
        U: [null, null, null, null, "#FFD500", null, null, null, null],
        F: [
          null,
          null,
          null,
          "#B90000",
          "#B90000",
          "#B90000",
          "#B90000",
          "#B90000",
          "#B90000",
        ],
        R: [
          null,
          null,
          null,
          "#009B48",
          "#009B48",
          "#009B48",
          "#009B48",
          "#009B48",
          "#009B48",
        ],
      },
    },

    { type: "h2", text: "How F2L Compares to the Beginner Method" },
    {
      type: "table",
      headers: ["Metric", "Beginner Method", "F2L"],
      rows: [
        ["Steps", "2 (corners, then edges)", "1 (pairs)"],
        ["Average moves", "25–45", "10–20"],
        [
          "Thinking required",
          "Procedural — run algorithms",
          "Intuitive — understand positions",
        ],
        ["Ceiling", "~45 seconds", "Sub-10 seconds (advanced)"],
      ],
    },
    { type: "h2", text: "The Catch" },
    {
      type: "p",
      text: "F2L is more efficient but harder to learn. It requires you to track two pieces simultaneously, think spatially, and develop intuition rather than just memorize algorithms. Most people find it awkward for the first few weeks before it clicks. That discomfort is completely normal — and temporary.",
    },
    {
      type: "tip",
      text: "F2L is the heart of CFOP. Top solvers spend years refining it. You don't need to be perfect — you just need to be functional. A slow, correct F2L beats a fast, broken one every time.",
    },
  ],

  "5.2": [
    { type: "h2", text: "Finding a F2L pair" },
    {
      type: "p",
      text: "Before you can insert a pair, you need to find it. The very first thing to look for is if both pieces are in the top layer.",
    },
    {
      type: "list",
      items: [
        "Find any white corner piece — it has exactly 3 colors: white plus two others (through out this lesson, we will use red and green as an example)",
        "Note the two non-white colors (red and green)",
        "Find the edge piece with those exact same two colors (the red-green edge)",
        "That corner and that edge are a pair",
      ],
    },

    {
      type: "tip",
      text: "The pair itself most likely will not be grouped together perfectly. Most the time, the corner and edge piece will be seperated. Just make sure they are both in the top layer for now.",
    },

    {
      type: "h2",
      text: "What if the edge piece is on top but a corner is in the bottom layer?",
    },
    {
      type: "p",
      text: "This is a scenario you will come across a lot. When it happens, simply bring the corner piece up with (R U' R')",
    },

    {
      type: "f2l-diagram-row",
      diagrams: [
        {
          // Corner UFR: white on U[8], green on F[2], red on R[0]
          // Edge UF:    red on U[7],   green on F[1]
          // Green center F[4], red center R[4] shown for orientation context.
          // All other stickers grey.

          // colors: #B90000 (red), #ffffff (white), #FFD500 (yellow), #009B48 (green)
          label: "Corner on bottom",
          stickerColors: {
            U: [null, "#B90000", null, null, "#FFD500", null, null, null, null],
            F: [null, null, null, null, "#B90000", null, null, null, "#B90000"],
            R: [null, null, null, null, "#009B48", null, "#009B48", null, null],
          },
        },
        {
          label: "After (R U' R')",
          stickerColors: {
            U: [
              null,
              "#B90000",
              null,
              null,
              "#FFD500",
              null,
              null,
              null,
              "#009B48",
            ],
            F: [null, null, "#B90000", null, "#B90000", null, null, null, null],
            R: ["#FFFFFF", null, null, null, "#009B48", null, null, null, null],
          },
        },
      ],
    },

    {
      type: "p",
      text: "To identify which slot a pair belongs in: look at the two non-white colors of the pair. The slot is the one between those two color centers. A white-red-green pair goes in the slot between the red center and the green center.",
    },

    {
      // Corner UFR: white on U[8], green on F[2], red on R[0]
      // Edge UF:    red on U[7],   green on F[1]
      // Green center F[4], red center R[4] shown for orientation context.
      // All other stickers grey.

      // colors: #B90000 (red), #ffffff (white), #FFD500 (yellow), #009B48 (green)
      type: "f2l-diagram",
      label: "Correct Slot (After Insertion)",
      stickerColors: {
        U: [null, null, null, null, "#FFD500", null, null, null, null],
        F: [
          null,
          null,
          null,
          "#B90000",
          "#B90000",
          "#B90000",
          "#B90000",
          "#B90000",
          "#B90000",
        ],
        R: [
          null,
          null,
          null,
          "#009B48",
          "#009B48",
          "#009B48",
          "#009B48",
          "#009B48",
          "#009B48",
        ],
      },
    },

    {
      type: "warn",
      text: "These are very simplified examples. While these cases are of course possible, you will bump in to MANY different cases which will be covered later on.",
    },

    { type: "h2", text: "Using the U Layer as Your Workspace" },
    {
      type: "p",
      text: "The top layer (U layer) is your workspace in F2L. You bring both pieces of a pair up to the top layer, manipulate them there to connect them.",
    },
    {
      type: "tip",
      text: "Always work on one pair at a time. Pick a pair, get both pieces to the top layer, solve the slot, then move to the next pair. Do not try to solve two pairs at once when learning.",
    },
    { type: "h2", text: "Which Pair to Solve First?" },
    {
      type: "p",
      text: "It usually doesn't matter. However, you'll naturally develop preferences. Many solvers start with the easiest-looking pair (fewest moves to set up) and save harder pairs for last. When starting out, just pick any pair and work through all four.",
    },
    {
      type: "warn",
      text: "Be careful with back slots. It's easy to accidentally disturb a solved front slot while inserting a back pair. You will often need to rotate the whole cube (y rotation) to bring a back slot to the front so you can work on it. This is normal.",
    },
    { type: "h2", text: "A Practice Exercise" },
    {
      type: "p",
      text: "Scramble a cube. Solve the white cross. Now find all 4 pairs — don't move anything yet, just identify each corner, its matching edge, and which slot they belong in. This piece recognition is the foundation of F2L speed.",
    },
  ],

  "5.3": [
    { type: "h2", text: "Corner and edge piece stuck together incorrectly" },
    {
      type: "p",
      text: "When you're learning F2L, you will come across 'Awkward Cases' all the time. In the example below, the corner and edge piece are connected incorrectly. Your goal here is to seperate them while keeping both pieces in the top layer. ",
    },

    {
      // Corner UFR: white on U[8], green on F[2], red on R[0]
      // Edge UF:    red on U[7],   green on F[1]
      // Green center F[4], red center R[4] shown for orientation context.
      // All other stickers grey.

      // colors: #B90000 (red), #ffffff (white), #FFD500 (yellow), #009B48 (green)
      type: "f2l-diagram",
      label: "Corner / Edge pieces connected incorrectly",
      stickerColors: {
        U: [
          null,
          null,
          null,
          null,
          "#FFD500",
          null,
          null,
          "#B90000",
          "#B90000",
        ],
        F: [
          null,
          "#009B48",
          "#FFFFFF",
          "#B90000",
          "#B90000",
          null,
          "#B90000",
          "#B90000",
          null,
        ],
        R: [
          "#009B48",
          null,
          null,
          null,
          "#009B48",
          "#009B48",
          null,
          "#009B48",
          "#009B48",
        ],
      },
    },

    {
      type: "p",
      text: "In the case/diagram above, you'll notice the corner piece is on the right side. If that happens, you can seperate them with a simple algorithm.",
    },

    {
      type: "algo",
      name: "Seperate corner & edge piece",
      moves: "U' R U' R'",
      note: "Run this algorithm to seperate the two pieces and keep them in the top layer.",
    },
    { type: "h2", text: "If the corner piece is on the left" },
    {
      type: "algo",
      name: "Seperate Corner & Edge Piece",
      moves: "y U L' U L",
      note: "This is just a mirror of the right slot insert. This time, the corner piece would be at front left top corner position with the white sticker facing to the left.",
    },
    { type: "h2", text: "White sticker facing up" },
    {
      type: "p",
      text: "When solving the First 2 Layers (F2L) you sometimes notice the white sticker of the corner piece facing upwards. You will actually see this happen when you run those algorithms above. ",
    },

    {
      type: "p",
      text: "This is a scenario that is actually pretty easy to deal with. Just start with lining up the edge with the correct center and then move the edge away. ",
    },

    {
      type: "f2l-diagram-row",
      diagrams: [
        {
          label: "White Corner Up",
          size: 140,
          stickerColors: {
            U: [
              null,
              null,
              null,
              "#B90000",
              "#FFD500",
              null,
              null,
              null,
              "#FFFFFF",
            ],
            F: [
              null,
              null,
              "#009B48",
              "#B90000",
              "#B90000",
              null,
              "#B90000",
              "#B90000",
              null,
            ],
            R: [
              "#B90000",
              null,
              null,
              null,
              "#009B48",
              "#009B48",
              null,
              "#009B48",
              "#009B48",
            ],
          },
        },
        {
          label: "Line up edge",
          size: 140,
          stickerColors: {
            U: [
              "#FFFFFF",
              null,
              null,
              null,
              "#FFD500",
              "#B90000",
              null,
              null,
              null,
            ],
            R: [
              null,
              "#009B48",
              null,
              null,
              "#009B48",
              "#009B48",
              null,
              "#009B48",
              "#009B48",
            ],
            F: [
              null,
              null,
              null,
              "#B90000",
              "#B90000",
              null,
              "#B90000",
              "#B90000",
              null,
            ],
          },
        },
        {
          label: "Move edge away",
          size: 140,
          stickerColors: {
            U: ["#FFFFFF", null, null, null, "#FFD500", null, null, null, null],
            R: [
              null,
              null,
              null,
              "#009B48",
              "#009B48",
              "#009B48",
              "#009B48",
              "#009B48",
              null,
            ],
            F: [
              null,
              null,
              null,
              "#B90000",
              "#B90000",
              "#FFFFFF",
              "#B90000",
              "#B90000",
              "#FFFFFF",
            ],
          },
        },
      ],
    },

    // White corner up pt2

    {
      type: "f2l-diagram-row",
      diagrams: [
        {
          label: "Move corner",
          size: 140,
          stickerColors: {
            U: [null, null, "#FFFFFF", null, "#FFD500", null, null, null, null],
            R: [
              null,
              null,
              "#009B48",
              "#009B48",
              "#009B48",
              "#009B48",
              "#009B48",
              "#009B48",
              null,
            ],
            F: [
              null,
              null,
              null,
              "#B90000",
              "#B90000",
              "#FFFFFF",
              "#B90000",
              "#B90000",
              "#FFFFFF",
            ],
          },
        },

        {
          label: "Move edge to top",
          size: 140,
          stickerColors: {
            U: [
              null,
              null,
              null,
              null,
              "#FFD500",
              "#B90000",
              null,
              null,
              "#B90000",
            ],
            R: [
              "#009B48",
              "#009B48",
              null,
              null,
              "#009B48",
              "#009B48",
              null,
              "#009B48",
              "#009B48",
            ],
            F: [
              null,
              null,
              "#FFFFFF",
              "#B90000",
              "#B90000",
              null,
              "#B90000",
              "#B90000",
              null,
            ],
          },
        },
      ],
    },

    {
      type: "tip",
      text: "Just remember, you're new to F2L. Do NOT worry about going super fast or memorizing a bunch of algorithms. Just go slow, pay attention to how the pieces move and where they go. Eventually, you will begin to notice cases 'automatically' and just know what to do with your fingers.",
    },
  ],

  "5.4": [
    { type: "h2", text: "When the Pair Isn't Formed Yet" },
    {
      type: "p",
      text: "Most of the time, you won't have a pair thats already connected. You will most likely have both pieces in the top layer but not adjacent/not facing the right direction.",
    },
    { type: "h2", text: "Case 1: Corner White Up, Edge Needs Alignment" },
    {
      type: "p",
      text: "The corner is in the top layer with white facing up. The edge is also in the top layer. They aren't adjacent yet. Use U moves to bring the edge directly in front of the corner (at the UF position when the corner is at UFR), matching the edge's non-white color with the corresponding center.",
    },
    {
      type: "algo",
      name: "White-Up Insert (Right Slot)",
      moves: "U R U' R'",
      note: "Corner at UFR with white on top. Edge at UF with the right-center color facing up. U brings the edge above the slot, R starts the insert, U' clears the top layer, R' completes it.",
    },
    {
      type: "algo",
      name: "White-Up Insert (Left Slot)",
      moves: "U' L' U L",
      note: "Mirror case for the front-left slot. Corner at UFL with white on top, edge at UF with the left-center color facing up.",
    },
    { type: "h2", text: "Case 2: Corner White Facing a Side, Edge on Top" },
    {
      type: "p",
      text: "The corner is in the top layer with white facing one of the side faces (front or right). The edge is also in the top layer. In this case, you can often use the setup → insert approach: bring the edge adjacent to the corner with one U move so they 'face' each other (their shared colors align), then run the insert.",
    },
    {
      type: "p",
      text: "The key recognition: two pieces are 'ready to connect' when their shared colors are pointing toward each other or both facing the same side. Once you see this, a single setup move connects them, and you can insert immediately.",
    },
    {
      type: "algo",
      name: "White-Side Right Insert",
      moves: "R U' R'",
      note: "Corner at UFR with white facing right (R face). Edge is at UR with matching colors aligned. R U' R' drives them both into the front-right slot together.",
    },
    {
      type: "algo",
      name: "White-Side Left Insert",
      moves: "L' U L",
      note: "Mirror of the above for the front-left slot. Corner at UFL with white facing left (L face). Edge at UL.",
    },
    { type: "h2", text: "The General Approach" },
    {
      type: "p",
      text: "Rather than memorizing a separate algorithm for every possible case, the better approach is to develop a mental model for when pieces are 'ready.' Ask yourself two questions:",
    },
    {
      type: "list",
      items: [
        "Are both pieces in the U layer? If not, get them there first (covered in Lesson 5.5).",
        "Are the pieces positioned so a simple setup move connects them? If yes, do the setup and insert.",
        "If no — use U moves to reposition until a pairing opportunity appears.",
      ],
    },
    {
      type: "tip",
      text: "Practice connecting pairs WITHOUT inserting them. Pick a scrambled cube, get a pair to the top layer, practice moving them around the U layer until they pair up — then stop. This trains your eye to see pairing opportunities before committing to an insert.",
    },
    { type: "h2", text: "Avoiding Breaking Solved Slots" },
    {
      type: "p",
      text: "When you do setup moves (like R or F), you temporarily disturb the F2L slot on that side. The paired insert algorithms (R U R', L' U' L, etc.) are designed to restore the slot after inserting the new pair. As long as you complete the algorithm, the already-solved pairs stay intact.",
    },
    {
      type: "warn",
      text: "Do not stop an F2L algorithm halfway through. If you start R U R', you must finish it. Stopping mid-sequence leaves previously solved pairs displaced, which is harder to fix than starting over.",
    },
  ],

  "5.5": [
    { type: "h2", text: "When a Piece Is Already in a Slot" },
    {
      type: "p",
      text: "This is one of the most common situations in F2L: one or both pieces of a pair are already sitting in an F2L slot, but either they're in the wrong slot, or they're in the right slot but oriented incorrectly. You can't just leave them there — you need to extract them, bring them to the top layer, and re-insert them correctly.",
    },
    {
      type: "warn",
      text: "Never force a piece out of a slot by doing random moves. You will almost certainly displace an already-solved pair and create more work. Always use controlled extraction moves.",
    },
    { type: "h2", text: "Extracting a Corner from a Slot" },
    {
      type: "p",
      text: "To get a corner out of a slot (say the front-right slot), you need to bring it back up to the U layer. The cleanest way is to use the slot's 'trigger' move in reverse. For the front-right slot:",
    },
    {
      type: "algo",
      name: "Extract Corner from Right Slot",
      moves: "R U R'",
      note: "This lifts the DFR corner up to the UFR position in the U layer. It also brings the FR edge up to the UR position. Now both pieces are in the top layer and you can work on them.",
    },
    {
      type: "p",
      text: "Notice that R U R' both extracts the wrong piece AND sets up the slot for a new pair. This is intentional — you're replacing the incorrectly placed piece while simultaneously positioning it back in the top layer for re-solving.",
    },
    { type: "h2", text: "Extracting an Edge from a Slot" },
    {
      type: "p",
      text: "Sometimes the edge is stuck in a middle-layer slot (correctly or incorrectly placed) while the corner is in the top layer or elsewhere. To get the edge back to the top layer:",
    },
    {
      type: "algo",
      name: "Extract Edge from Right Middle Slot",
      moves: "U R U' R'",
      note: "Brings the FR edge back up to the U layer. The corner currently at UFR will be temporarily displaced and return to a U layer position after R' — so both pieces end up in the U layer after this sequence.",
    },
    { type: "h2", text: "The General Rule: Extract, Then Solve" },
    {
      type: "p",
      text: "Whenever you encounter a piece stuck in a slot, the process is always the same:",
    },
    {
      type: "list",
      items: [
        "1. Identify which slot the piece is stuck in",
        "2. Rotate the cube (y move) so that slot is at the front-right",
        "3. Use an extraction move (like R U R') to bring the piece(s) back to the top layer",
        "4. Now treat it as a normal pairing situation from Lesson 5.3 or 5.4",
      ],
    },
    { type: "h2", text: "The Dreaded 'Already There But Wrong' Case" },
    {
      type: "p",
      text: "Sometimes a piece is in the correct slot but oriented backwards — white is on the front face instead of the bottom, for example. This looks like the slot is solved but it isn't. Resist the urge to 'fix it with a couple moves.' The controlled approach is always better: extract with R U R', bring to top layer, re-pair, re-insert correctly.",
    },
    {
      type: "tip",
      text: "If you're finding that you constantly have to extract pieces from slots, you may be inserting pairs without fully checking their orientation. Before inserting any pair, verify: white faces down (toward D), and each side color of the corner matches the adjacent center.",
    },
  ],

  "5.6": [
    { type: "h2", text: "The Harder Situations" },
    {
      type: "p",
      text: "Once you've practiced the basics, you'll start encountering cases that don't fit cleanly into 'pair them up and insert.' These are the tricky cases — mostly involving edges that are flipped (inserted backwards into the middle layer) or corners with white facing down into the slot from the top layer. This lesson covers how to think through them.",
    },
    {
      type: "p",
      text: "The good news: the solution to every tricky F2L case follows the same mental process. There are no 'mystery' cases. Once you understand the logic, you can work out any situation you encounter.",
    },
    { type: "h2", text: "Flipped Edge in the Middle Layer" },
    {
      type: "p",
      text: "This is one of the most common tricky cases. The edge piece is sitting in the correct middle-layer slot, but it's flipped — its colors are reversed relative to the adjacent centers. For example, in the front-right middle slot, the green color faces front and the red color faces right, when it should be the opposite.",
    },
    {
      type: "p",
      text: "You cannot fix this with D or U moves alone. You must extract the edge, bring it to the top layer, and re-insert it with the correct orientation. Use the standard extraction move for that slot (R U R' for the front-right), then re-pair and re-insert.",
    },
    {
      type: "algo",
      name: "Flip and Re-insert (Front-Right Slot)",
      moves: "R U' R' U R U R'",
      note: "Extracts the flipped edge and corner from the front-right slot, flips the edge to the correct orientation in the top layer, and re-inserts the pair. This is one efficient sequence for this specific case, but you can also just extract manually and re-pair.",
    },
    { type: "h2", text: "Corner with White Facing Down (Into the Slot)" },
    {
      type: "p",
      text: "The corner is at a top-layer position (say UFR) with white facing down — pointing into the slot it would fill. This looks like it should be easy to insert, but if you just do R, the white face ends up on the front or right face of the corner slot instead of the bottom. The piece is misoriented.",
    },
    {
      type: "p",
      text: "The fix: use a U move to move the corner AWAY from the slot, then use a setup move to bring both pieces (corner + its paired edge) to a position where the standard insert works. Usually this means doing U R U' R' U2 R U R' or a similar sequence to flip the corner into the correct orientation before inserting.",
    },
    {
      type: "algo",
      name: "White-Down Corner Fix (Right Slot)",
      moves: "R U2 R' U' R U R'",
      note: "For when the corner is at UFR with white facing down (D direction). This sequence repositions the corner into a standard insertable orientation. The pair's edge should be in the U layer before running this.",
    },
    { type: "h2", text: "The Universal Problem-Solving Method" },
    {
      type: "p",
      text: "For ANY tricky F2L case, apply this thinking process:",
    },
    {
      type: "list",
      items: [
        "Step 1 — Get BOTH pieces into the U layer. If either one is in a middle-layer slot, extract it first.",
        "Step 2 — Look at the corner's white sticker. Which face is it on? Up, front, or right?",
        "Step 3 — Use U moves to move the pieces around the top layer until you reach a position where a standard insert (R U R', L' U' L, or a variant) cleanly inserts the pair.",
        "Step 4 — If you can't reach a clean insert position after 4 U moves, try a setup move (R, F', etc.) to change the corner's orientation, then try again.",
      ],
    },
    {
      type: "p",
      text: "This process means you never need to panic about an unusual case. Every position reachable in F2L can be solved by getting both pieces to the top, repositioning, and inserting. The number of moves varies, but the logic is always the same.",
    },
    { type: "h2", text: "Efficiency Over Perfection" },
    {
      type: "p",
      text: "At this stage, don't obsess over solving every pair in the minimum possible moves. Solving correctly matters far more than solving quickly. A clean, logical F2L that takes 12 moves per pair beats a frantic, mistake-prone attempt that takes 20. Build understanding first. Speed follows understanding.",
    },
    {
      type: "tip",
      text: "Keep a cube with you and just practice recognizing cases. When you encounter a tricky position, pause before moving. Ask: where is the white sticker? Where is the edge? What's the fastest path to get both to the top layer? Training this recognition is what actually makes F2L fast.",
    },
  ],

  "5.7": [
    { type: "h2", text: "From Technique to Intuition" },
    {
      type: "p",
      text: "You've now learned the full F2L framework: pairs and slots, basic inserts, pairing on top, extractions, and tricky cases. The next phase isn't learning more algorithms — it's converting what you know into genuine intuition through repetition.",
    },
    {
      type: "p",
      text: "Intuitive F2L means you stop consciously thinking 'which algorithm do I run' and instead see the position and know instinctively what to do. This transition takes time and deliberate practice. It doesn't happen by accident.",
    },
    { type: "h2", text: "The Practice Routine" },
    {
      type: "p",
      text: "Do full solves with your focus entirely on F2L quality, not total time. Use the Playground timer but don't chase a fast total solve — chase a clean F2L. After each solve, ask:",
    },
    {
      type: "list",
      items: [
        "Did I solve every pair correctly on the first attempt, or did I have to backtrack?",
        "Did I extract pieces efficiently, or did I do unnecessary moves?",
        "Did I use the U layer as my workspace, or did I rotate the whole cube too often?",
        "For each pair: did I 'see' the solution before I started moving, or did I figure it out on the fly?",
      ],
    },
    { type: "h2", text: "Tracking Your Progress" },
    {
      type: "table",
      headers: ["Stage of learning", "What it looks like", "What to do"],
      rows: [
        [
          "Beginner",
          "Lots of pauses, backtracking, cube rotations",
          "Focus on correct extraction and insertion — moves don't matter yet",
        ],
        [
          "Developing",
          "Fewer pauses, occasional backtrack, some lookahead",
          "Start counting moves per pair — aim for under 10 per pair",
        ],
        [
          "Functional",
          "Smooth solves, rare mistakes, consistent process",
          "Begin reducing cube rotations — keep the cube in one orientation per pair",
        ],
        [
          "Intuitive",
          "No pauses, pair recognition before you start, flowing solve",
          "Start planning the next pair while inserting the current one (lookahead)",
        ],
      ],
    },
    { type: "h2", text: "Lookahead: The Key to Real F2L Speed" },
    {
      type: "p",
      text: "Lookahead is the ability to track where your next pair is while your hands are busy inserting the current one. This is what separates a 30-second solver from a 15-second solver. It's a skill developed purely through repetition — you cannot force it. Do lots of solves, focus on smooth execution, and the lookahead will gradually emerge.",
    },
    {
      type: "tip",
      text: "One of the best F2L drills: solve pairs one at a time with no time pressure. After solving the cross, work on pair 1 until it's in the slot. Stop. Find pair 2. Solve it. Stop. This builds clean, deliberate recognition habits that transfer directly to full-speed solving.",
    },
    { type: "h2", text: "Stage 5 Complete" },
    {
      type: "p",
      text: "F2L is the hardest stage in this curriculum, and completing it means you now have the most important skill in CFOP. Stage 6 covers 2-look OLL — orienting the last layer using about 9 algorithms. After Stage 5, OLL will feel manageable. The hardest part is behind you.",
    },
    {
      type: "p",
      text: "Before moving on, aim for a full F2L completion (all 4 pairs inserted correctly) at least 10 times in a row without backtracking or undoing misinsertions. That consistency is the signal that your F2L foundation is solid enough to build OLL and PLL on top of it.",
    },
  ],
};
