# ThreadHive Frontend — Agent Guide

This file provides context for AI coding agents working on this codebase.

---

## Project Overview

ThreadHive is a Reddit-style discussion forum built with **React 19 + Vite + React-Bootstrap**. It renders threads and comments from local dummy data, with plans to connect to a real backend API.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build tool | Vite |
| UI library | React-Bootstrap + Bootstrap Icons |
| Routing | State-based (no React Router yet) |
| Data | Local dummy data (`data/dummyData.js`) |
| Testing | Vitest + React Testing Library |

---

## Project Structure

```
src/
  App.jsx                        # Root component; dark mode, page state
  pages/
    Auth/
      Login.jsx                  # Login form (currently commented out of routing)
      Register.jsx               # Register form (currently commented out of routing)
    User/
      Home.jsx                   # Thread list + state-based navigation to ThreadPage
      ThreadPage.jsx             # Thread detail: ThreadCard + CommentForm + CommentList
  components/
    Header/Header.jsx            # Top nav; dark mode toggle, onNavigate prop
    Footer/Footer.jsx            # Bottom bar
    ThreadList/
      ThreadList.jsx             # Maps threads → ThreadCard
      ThreadCard.jsx             # Single thread; voting stubs, "View Comments" button
    Comment/
      CommentList.jsx            # Maps comments → comment cards with voting
      CommentForm.jsx            # Add-comment form (currently inert)
    Shared/
      VoteButtons.jsx            # Reusable upvote/downvote UI
services/
  threadService.js               # fetchRecentThreads() — stub, reads dummyData
  commentService.js              # fetchCommentsForThread(id) — stub, reads dummyData
  userService.js                 # getUserName(userId) — looks up dummyData users
data/
  dummyData.js                   # Local threads, comments, users arrays
```

---

## Known Bugs

| # | Bug | Location |
|---|---|---|
| 1 | `CommentForm` is inert — no controlled state, submit just `alert()`s | `src/components/Comment/CommentForm.jsx` |
| 2 | Upvote bug — `alreadyUpvoted` check runs against every comment, not just the clicked one | `src/pages/User/ThreadPage.jsx` |
| 3 | Thread up/downvote handlers just `alert()` — no state update | `src/components/ThreadList/ThreadCard.jsx` |
| 4 | Comment downvote handler just `alert()` — no state update | `src/components/Comment/CommentList.jsx` |
| 5 | `currentPage` state in `App.jsx` is set but never drives conditional rendering | `src/App.jsx` |
| 6 | `currentUserId` is hardcoded string — no real auth session | `src/pages/User/ThreadPage.jsx` |
| 7 | `mongoose` listed in frontend `package.json` — should be removed | `package.json` |

---

## Planned Improvements

1. **Fix upvote bug** in `ThreadPage.jsx` — scope the `alreadyUpvoted` check to the clicked comment only
2. **Wire up `CommentForm`** — add `useState` for input, call `commentService` on submit, update parent comment list
3. **Implement thread voting** — real state updates in `ThreadCard.jsx`
4. **Implement comment downvote** — mirror the upvote logic in `CommentList.jsx`
5. **Add React Router** — replace state-based navigation so URLs change and browser back works
6. **Integrate Auth** — wire `Login`/`Register` into `App.jsx` routing via `currentPage` state
7. **Connect backend API** — replace dummy data stubs in all three services with real `fetch`/`axios` calls

---

## Agent Instructions

- **Do not** introduce new dependencies without checking `package.json` first.
- **Do not** remove or rename existing props/callbacks without updating all call sites.
- **Preserve** the `data-theme` dark mode mechanism on `document.documentElement`.
- **Services** (`threadService.js`, `commentService.js`, `userService.js`) are the only files that should make API calls — keep data-fetching out of components.
- **State-based routing** (`selectedThread` in `Home.jsx`, `currentPage` in `App.jsx`) is the current pattern — do not add React Router unless the task explicitly requires it.
- **`currentUserId`** is a placeholder — do not build features that depend on it being a real authenticated user ID until Auth is wired up.
- All vote state is **local only** — no persistence to a backend yet.


## Styling

- **Component library** — Use **React-Bootstrap** components (`Card`, `Button`, `Form`, `Container`, `Row`, `Col`, `Stack`, `Badge`, etc.) for all UI elements. Do not reach for plain HTML elements when a React-Bootstrap equivalent exists.
- **Icons** — Use **Bootstrap Icons** via `<i className="bi bi-*">` (already loaded globally). Do not add a separate icon library.
- **CSS files** — Each component has a co-located `.css` file (e.g., `CommentForm.css`, `ThreadCard.css`). Add component-specific styles there, not in `App.css` or `index.css`.
- **Dark mode** — Controlled by the `data-theme="dark"` attribute on `document.documentElement`. Use CSS variables / `[data-theme="dark"]` selectors in `.css` files to support both themes. Do not hard-code colours inline.
- **Utility classes** — Prefer Bootstrap utility classes (`d-flex`, `gap-3`, `mb-4`, `fw-semibold`, etc.) over writing custom CSS wherever possible.
- **Do not** introduce Tailwind, styled-components, Emotion, or any other styling library, inline style unless avoidable, Add unnecessary wrapper divs, overnest layout structure.
- **Maintain** - responsiveness, proper spacing rhythm (prefer gap-2, mb-3), clear visual hirearchy and semantic structure, accessibility (ally) aria-label, proper button types