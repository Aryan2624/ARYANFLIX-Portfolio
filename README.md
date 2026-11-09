# ARYANFLIX V12 — Projects In Motion

A cinematic portfolio for Aryan M Dubey, now with **genuinely moving, interactive 3D-perspective project cards**.

## What's new compared with V11

- All six featured screens move around an **elliptical 3D carousel** in the main Projects room and cinematic tour.
- The cards change position, distance, scale, and facing angle as they travel.
- Orbit runs automatically with a roughly 22-second loop. Hover or focus a card to hold it still for reading or clicking.
- Pause / Play and Previous / Next controls in the main gallery.
- Each project opens its own case study with features, workflow, and technologies.
- GitHub code links appear only for projects with a known repository URL.
- The **entire public GitHub project library** below remains searchable. It syncs live when the GitHub API is available.
- On phones the gallery becomes a swipeable row (less demanding than animating a busy 3D scene). Reduced-motion preferences are respected.
- Your two supplied images and separated character are still bundled; no external image hosting required.

## Run on Windows

Unzip and open the **inner folder containing package.json** in VS Code or CMD:

```cmd
npm install
npm run dev
```

Open http://localhost:5173/

Optional GitHub list sync:

```cmd
npm run sync:github
npm run list:github
```

If there is no internet connection, the locally featured projects remain available. Public GitHub API access may be rate limited.

## Implementation

- `src/ProjectOrbit.jsx`: requestAnimationFrame motion loop, visibility pause, controls, clickable cards.
- `src/orbitProjects.css`: holographic cards, orbit markers, responsive swipe gallery.
- `src/ProjectCinema.jsx`: full main Projects room.
- `src/CinematicTour.jsx`: scene 4 also displays moving projects.

The motion uses browser CSS 3D transforms for the project panels (not physics-driven Three.js meshes). The volumetric 3D planet remains powered by React Three Fiber. Character art is a layered 2D image, not a rigged 3D animation.

Contact form needs an email handoff configuration; it does not silently send messages. Github repository descriptions may require network access.
