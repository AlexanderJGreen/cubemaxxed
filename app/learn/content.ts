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
};
