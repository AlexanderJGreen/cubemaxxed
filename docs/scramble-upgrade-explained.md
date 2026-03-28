# Scramble Upgrade — What's Going On Under the Hood

## What is a Web Worker?

Your browser runs JavaScript on a single thread — one lane of traffic. That means if a piece of code takes a long time to run, it blocks everything else: the page freezes, buttons stop responding, animations stutter.

A **Web Worker** is a way to run JavaScript in a separate background thread — a second lane that runs in parallel. It can't touch the page directly (no DOM access), but it can do heavy computation and send results back to the main thread via messages.

`cstimer_module` uses a Web Worker because some scramble types — especially a proper random-state 3x3 scramble — require serious computation. A real random-state scramble doesn't just randomly string moves together; it works backwards from a randomly chosen cube state and calculates the shortest sequence of moves to reach it (using an algorithm called Kociemba's algorithm). That can take a noticeable moment. Running it on the main thread would freeze the timer. Running it in a Worker keeps the UI smooth.

**The message-passing pattern:**

```
Main thread                          Worker (background)
    │                                      │
    │──── postMessage([id, 'scramble', ['333', 0]]) ──►│
    │                                      │ (computes)
    │◄─── onmessage([id, 'scramble', result]) ─────────│
    │                                      │
```

Both sides send plain data back and forth. That's why the code in `page.tsx` uses `workerRef.current.postMessage(...)` to ask and listens for `worker.onmessage` to receive the answer.

---

## What is async/await (and why is it needed here)?

JavaScript is **non-blocking** by default. When you ask the Worker for a scramble, the code doesn't pause and wait — it continues running immediately. The scramble arrives later, whenever the Worker is done.

Without async handling, you'd have a problem: you ask for a scramble, but before it arrives your code has already moved on and there's nothing ready to receive the result.

The solution is a **Promise** — an object that represents a value that will exist in the future. When you `await` a Promise, you're saying "pause *this function* here and come back when the result is ready, but don't block the rest of the page."

In the timer code, `requestNewScramble` sets up a callback in `workerCallbacksRef`. When the Worker sends back a scramble, the callback fires and calls `setCurrentScramble(result)` — which triggers React to re-render with the new scramble. That's why you see "generating..." briefly — the UI updates to show loading immediately, then updates again when the scramble arrives.

**Why not just use `import cstimer_module` like a normal package?**

The npm package *can* be imported directly in Node.js (which is synchronous — it can block and wait). But in the browser, the same code would freeze the page during computation. So for browser use, the package is designed to be loaded as a Worker script — and the README shows exactly the message-passing pattern we implemented.

---

## What does each scramble type produce on the physical cube?

Before you apply the scramble, your cube needs to be in a specific starting state. Here's what each type expects and what you'll practice:

### Full Scramble (`333`)
**Start state:** Solved cube.
**What it produces:** A random-state 25-move scramble (WCA competition standard). Every piece is in a random position. You practice the entire solve from scratch: cross → F2L → OLL → PLL.

### Last Layer (`ll`)
**Start state:** Solve your F2L completely (all four corner-edge pairs in the first two layers). Leave the top layer alone.
**What it produces:** A short scramble that mixes only the top layer pieces. You practice **OLL + PLL** — the last two steps of CFOP. Great for drilling the end of your solve when you already know F2L reasonably well.

### LL + 4 Slots (`f2l`)
**Start state:** Solve only the white cross (bottom layer edges). Leave everything else scrambled.
**What it produces:** A scramble where the cross is already done. You practice inserting all **four F2L pairs plus OLL plus PLL**. This is the biggest training ground — F2L is the hardest and most time-consuming part of CFOP, and this lets you drill it repeatedly without re-scrambling from scratch.

### OLL Only (`oll`)
**Start state:** Solve your entire F2L (first two layers). The top face stickers are scrambled but all top-layer pieces are in the right position (just oriented wrong).
**What it produces:** A scramble that puts the top layer into one of the 57 OLL cases. You practice **orienting the last layer** — getting all the yellow stickers to face up — in one algorithm. Perfect for memorising and drilling OLL cases.

### PLL Only (`pll`)
**Start state:** Solve your F2L and complete OLL (full yellow face on top, but side stickers on the top layer are in the wrong positions).
**What it produces:** A scramble in one of the 21 PLL cases. You practice **permuting the last layer** — moving the top-layer pieces to their final correct positions. The last step of a CFOP solve.

---

## The persistence detail

When you select a scramble type, it gets saved to `localStorage` under the key `cubemaxxed_scramble_type`. Next time you open the playground, the same type is automatically loaded and the Worker generates a scramble of that type immediately. You never have to reselect it mid-session.
