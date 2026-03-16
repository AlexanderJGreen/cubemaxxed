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
};
