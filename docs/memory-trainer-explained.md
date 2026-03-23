# Memory Trainer — How It Works (React Explained for Beginners)

This document walks through `app/memory-trainer/page.tsx` and explains every
`useState`, every `useEffect`, and the complete flow of a single round. It
assumes you've never used React hooks before.

---

## What are hooks?

React components are just functions that return JSX (HTML-like code). Every
time something on screen needs to change, React calls your function again to
get the new JSX. This is called a **re-render**.

The problem: local variables inside a function reset every time the function
runs. You can't store "the user typed R U R'" in a plain `let` variable because
it'll be gone on the next re-render.

**Hooks** are React's solution. They let you store values that survive
re-renders (`useState`), and run side effects when certain values change
(`useEffect`).

---

## Every `useState` and why it exists

### 1. `phase`

```ts
const [phase, setPhase] = useState<Phase>("idle");
// Phase = "idle" | "showing" | "recall" | "result"
```

**What it is:** The current screen the user sees. Think of it like a game
state machine — the component renders completely different UI depending on
which phase you're in.

**Why it needs to be state:** The screen has to change when the timer runs out,
when the user submits an answer, etc. A plain variable wouldn't trigger a
re-render, so React would never update the screen.

**What changes it:**
- `"idle"` → `"showing"`: user clicks START TRAINING
- `"showing"` → `"recall"`: countdown timer hits 0 (inside the timer effect)
- `"recall"` → `"result"`: user submits their answer
- `"result"` → `"showing"`: user clicks NEXT CASE (starts the next round)
- `"result"` → `"idle"`: user completes all 16 cases and clicks START NEW CYCLE

---

### 2. `currentCase`

```ts
const [currentCase, setCurrentCase] = useState<TrainerCase | null>(null);
```

**What it is:** The case being drilled right now — its name, diagram data, and
the correct algorithm string.

**Why it needs to be state:** The component renders the diagram and algorithm
from this value. When a new case is picked, the screen needs to update, so it
has to be state.

**What changes it:** `beginRound()` picks a random case from the pool and calls
`setCurrentCase(next)`.

---

### 3. `seen`

```ts
const [seen, setSeen] = useState<string[]>([]);
```

**What it is:** An array of case names the user has already answered this
session (e.g. `["Sune", "T-Perm"]`). This ensures each case appears exactly
once per cycle before anything repeats.

**Why it needs to be state:** We need this list to persist across rounds. A
plain variable would reset to `[]` on every re-render.

**What changes it:**
- `handleSubmit()` appends the current case name after the answer is submitted:
  `setSeen(prev => [...prev, currentCase.name])`
- Reset to `[]` when the user starts a new cycle

---

### 4. `input`

```ts
const [input, setInput] = useState("");
```

**What it is:** The text the user has typed into the algorithm input field.

**Why it needs to be state:** In React, form inputs are "controlled" — the
`<input>` element's `value` is tied to this state variable, and `onChange`
updates it on every keystroke. Without state, the input wouldn't respond to
typing.

**What changes it:**
- Every keystroke: `onChange={(e) => setInput(e.target.value)}`
- Reset to `""` at the start of each new round in `beginRound()`

---

### 5. `isCorrect`

```ts
const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
```

**What it is:** Whether the user's last answer was right (`true`), wrong
(`false`), or hasn't been checked yet (`null`).

**Why it needs to be state:** The result screen shows different UI (green check
vs red X) based on this value. It has to survive until the user clicks NEXT.

**What changes it:**
- `handleSubmit()` compares the normalized input to the normalized correct
  algorithm and calls `setIsCorrect(true)` or `setIsCorrect(false)`
- Reset to `null` at the start of each new round in `beginRound()`

---

### 6. `timeLeft`

```ts
const [timeLeft, setTimeLeft] = useState(SHOW_SECONDS); // starts at 5
```

**What it is:** How many seconds remain on the memorization countdown.

**Why it needs to be state:** The countdown bar on screen shrinks as time
passes. React can only update the screen when state changes, so the timer
tick has to update this state.

**What changes it:**
- The timer `useEffect` decrements it once per second
- Reset to `SHOW_SECONDS` (5) at the start of each round in `beginRound()`,
  and also inside the timer effect when it hits 0

---

### 7. `xpStatus`

```ts
const [xpStatus, setXpStatus] = useState<XpStatus>("idle");
// XpStatus = "idle" | "pending" | "awarded" | "no_auth"
```

**What it is:** The state of the XP award for the current round.

**Why it needs to be state:** Awarding XP is an async server call. While it's
in flight you want to show "AWARDING...", then either "+10 XP" or "SIGN IN TO
EARN XP" once it resolves. The UI has to update when the result comes back.

**What changes it:**
- `"idle"`: initial state and start of each round
- `"pending"`: immediately when a correct answer is submitted
- `"awarded"`: when the server action returns `{ ok: true }`
- `"no_auth"`: when the server action returns `{ error: "not_logged_in" }`

---

## The two `useEffect` hooks

### What is `useEffect`?

`useEffect(callback, [dependencies])` lets you run code *after* React renders
the screen. Think of it as "whenever [these values] change, run [this code]."

React calls your component function, paints the screen, *then* runs your
effects. This order matters.

The function you pass to `useEffect` can optionally return a **cleanup
function**. React calls that cleanup:
- Before running the effect again (if a dependency changed)
- When the component unmounts (leaves the screen)

---

### Effect 1: The countdown timer

```ts
useEffect(() => {
  if (phase !== "showing") return; // only run during the showing phase

  const interval = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        setPhase("recall");      // transition to recall when time is up
        return SHOW_SECONDS;     // reset for next round
      }
      return prev - 1;           // otherwise tick down
    });
  }, 1000);

  return () => clearInterval(interval); // cleanup: stop the timer
}, [phase]); // re-run this effect whenever `phase` changes
```

**Step by step:**

1. The user clicks START → `phase` becomes `"showing"` → React re-renders →
   effect runs.
2. `setInterval` schedules a function to run every 1000ms (1 second).
3. Each second, `setTimeLeft` is called with an updater function. That function
   receives `prev` (the current value of `timeLeft`) and returns the new value.
4. When `prev` reaches 1, instead of going to 0 we immediately set
   `phase = "recall"`. This causes a re-render, which runs the cleanup
   function (`clearInterval`) because `phase` just changed.
5. The effect runs again for the new `phase` value. Because `phase` is now
   `"recall"` (not `"showing"`), the `if` check at the top returns early —
   no new interval is started.

**Why `setTimeLeft(prev => ...)` instead of `setTimeLeft(timeLeft - 1)`?**

Inside `setInterval`, the variable `timeLeft` is *stale* — it's captured at
the moment the effect ran (when `timeLeft` was 5). It would never change from
that snapshot. The updater form `prev => prev - 1` always gets the actual
current value, regardless of when the callback runs.

**Why `[phase]` as the dependency?**

We want the timer to start exactly once when `phase` becomes `"showing"`, and
stop when `phase` changes away from it. Listing `phase` in the dependency
array achieves this: the effect re-runs (and the old interval is cleaned up)
every time `phase` changes.

---

### Effect 2: Auto-focus the input

```ts
useEffect(() => {
  if (phase === "recall") inputRef.current?.focus();
}, [phase]);
```

**What it does:** When the screen transitions to the recall phase, this
automatically places the text cursor in the input box so the user can start
typing immediately without clicking.

`inputRef` is a React ref — a way to directly access a DOM element. We attach
it to the `<input>` with `ref={inputRef}`.

`inputRef.current?.focus()` calls the browser's native `.focus()` method on
the element. The `?.` is just safety (it does nothing if `inputRef.current` is
null, which could happen if the input isn't rendered yet).

---

## The full flow of a single round

Here's exactly what happens from the user clicking START to seeing the result:

### 1. Start → `"showing"`

User clicks **START TRAINING**.

`handleStart()` runs:
- Calls `pickRandom(seen)` → picks a random case not yet in `seen`
- Calls `beginRound(next)`:
  - `setCurrentCase(next)` — stores the case
  - `setInput("")` — clears any leftover text
  - `setIsCorrect(null)` — clears any leftover result
  - `setXpStatus("idle")` — clears any leftover XP state
  - `setTimeLeft(SHOW_SECONDS)` — reset to 5
  - `setPhase("showing")` — triggers re-render to the showing screen

React re-renders. The showing screen appears: diagram + algorithm + countdown bar.

The timer `useEffect` sees that `phase === "showing"` and starts `setInterval`.

---

### 2. Countdown → `"recall"`

Every second, `setTimeLeft(prev => prev - 1)` fires. React re-renders each
time, updating the countdown bar's width and the `5s / 4s / 3s...` label.

When `timeLeft` reaches 1:
- `setPhase("recall")` is called inside the updater
- `setTimeLeft(SHOW_SECONDS)` resets the timer for next round

React re-renders. The recall screen appears: same diagram, algorithm hidden,
text input shown.

The `useEffect` cleanup fires (because `phase` changed), stopping the interval.

The auto-focus `useEffect` fires (because `phase` is now `"recall"`), focusing
the input.

---

### 3. User types and submits → `"result"`

User types an algorithm and presses Enter (or clicks CHECK ANSWER).

`handleSubmit()` runs:
- `normalize(input)` vs `normalize(currentCase.alg)` — both strings are
  trimmed and have whitespace collapsed to single spaces before comparing
- `setIsCorrect(true/false)`
- `setSeen(prev => [...prev, currentCase.name])` — marks this case as done
- `setPhase("result")`
- If correct:
  - `setXpStatus("pending")`
  - Calls `awardMemoryXP(10)` — a Next.js server action that hits Supabase
  - When it resolves: `setXpStatus("awarded")` or `setXpStatus("no_auth")`

React re-renders to the result screen. While the server call is in flight, the
XP badge shows "AWARDING...". When it resolves, it shows "+10 XP" or "SIGN IN
TO EARN XP".

---

### 4. User clicks NEXT CASE → back to `"showing"`

`handleNext()` runs:
- Calls `beginRound(seen)` — `seen` is now up to date because React re-rendered
  after `setSeen` in step 3 before the user clicked this button
- A new case is picked (filtered out: everything in `seen`)
- Phase becomes `"showing"` → cycle repeats from step 1

---

### 5. Cycle complete

When `seen.length === 16` (all cases done), `isCycleDone` becomes `true`.
The result screen shows a "★ CYCLE COMPLETE" message instead of NEXT CASE.
Clicking START NEW CYCLE resets `seen` to `[]` and returns to the idle screen.

---

## Key concept: why state updates are batched

In steps 3 above, `handleSubmit` calls `setIsCorrect`, `setSeen`, and
`setPhase` one after another. React doesn't re-render three times. In React 18,
multiple state updates inside the same event handler are **batched** — React
waits until all of them have been called, then re-renders once with the final
combined state. This avoids flickering.

---

## Summary table

| State | Type | Purpose | Reset when |
|---|---|---|---|
| `phase` | `"idle" \| "showing" \| "recall" \| "result"` | Controls which screen is shown | N/A (drives everything else) |
| `currentCase` | `TrainerCase \| null` | The case being drilled | New round starts |
| `seen` | `string[]` | Tracks answered cases so nothing repeats | New cycle starts |
| `input` | `string` | User's typed answer | New round starts |
| `isCorrect` | `boolean \| null` | Result of the last check | New round starts |
| `timeLeft` | `number` | Seconds left in the countdown | New round starts + timer resets |
| `xpStatus` | `"idle" \| "pending" \| "awarded" \| "no_auth"` | Tracks async XP award state | New round starts |
