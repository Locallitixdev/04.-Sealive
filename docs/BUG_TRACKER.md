# 🐛 Bug Tracker

> **Last Updated**: 2026-04-09

## Open Bugs

| ID | Severity | Description | Found Date | Module | Repro Steps |
|----|----------|-------------|------------|--------|-------------|
| *(none)* | | No open bugs | | | |

---

## Fixed Bugs (sorted by date, newest first)

| ID | Severity | Description | Root Cause | Fix | Date |
|----|----------|-------------|------------|-----|------|
| B-022 | 🔴 HIGH | Component SyntaxError: Unexpected token in `vessel/[id]/page.tsx` | Multi-replace tool duplicated an opening `div` tag during the MapView widget swap, causing unclosed tags. | Removed the duplicated `div` tag. | 2026-04-09 |
| B-021 | 🟢 LOW | Visual Bug: Map wraps around showing duplicated vessels horizontally | MapLibre `renderWorldCopies` default is true, which causes multiple earth bounds rendered continuously in low zoom levels. | Added `renderWorldCopies={false}` to map props in `MapView.tsx`. | 2026-04-09 |
| B-020 | 🔴 HIGH | Runtime ReferenceError: useMemo is not defined in MapView.tsx | Multi-replace added useMemo logic but skipped the import statement in the header. | Added `useMemo` to the React imports in `MapView.tsx`. | 2026-04-09 |
| B-019 | 🔴 HIGH | Runtime ReferenceError: useEffect is not defined in page.tsx | New playback logic added useEffect but forgot to update the import list. | Added `useEffect` to the React imports in `page.tsx`. | 2026-04-09 |
| B-018 | 🔴 HIGH | Component Fragmentation: "Unexpected token / closing tag" in MapView.tsx | Multi-replace tool failed to cleanly replace the Popup block, leaving orphaned `</div>` and `Popup` segments outside the function scope. | Manually re-structured `MapView.tsx` to close `Map` component and `MapView` function correctly. | 2026-04-09 |
| B-017 | ⚠️ MED | React rendering error: "Cannot update MapPage while rendering MapView" | `onLayerChange` (parent setState callback) called explicitly inside pure functional updater queue `setLayers(prev => ...)`. | Evaluated the truthy state via closure variable `layers` bypassing the async updater and moved the side effect out of the setter loop. | 2026-04-09 |
| B-016 | ⚠️ LOW | Console Warning: "Image circle-11 could not be loaded" in MapLibre | MapLibre throws warnings if base styles define icons that are entirely missing. Also custom markers briefly unavailable before component remount mapping. | Delayed initial mount visibility of layers until SVG dynamically injected to map memory. Handled `styleimagemissing` by creating 1x1 blank image payload dynamically. | 2026-04-09 |
| B-015 | 🔴 HIGH | Build error: Export ANOMALY_ZONES doesn't exist | mapData.ts was empty (0 lines) | Added all map data exports (SHIPPING_ROUTES, EEZ_ZONES, PORTS, ANOMALY_ZONES, MAP_LAYERS) | 2026-04-09 |
| B-011 | 🟡 MED | Layer toggle panel overlap with map controls | Both positioned top-right | Moved NavigationControl to bottom-left | 2026-04-08 |
| B-012 | 🟡 MED | Globe not fullscreen | Fixed width/height 600px | Added useEffect + containerRef for responsive sizing | 2026-04-08 |
| B-013 | 🟡 MED | Vessel toggle not functioning | Conditional rendering missing | Added `{layers["vessels"] && ...}` wrapper | 2026-04-08 |
| B-014 | 🔴 HIGH | MapLibre `_loaded` error | layerVisibility synced before map loaded | Added mapLoaded state, sync only after onLoad | 2026-04-08 |

---

## Bug Severity Guide

| Severity | Impact | Response Time |
|----------|--------|---------------|
| 🔴 CRITICAL | System unusable, data loss | Fix immediately |
| 🔴 HIGH | Core feature broken | Fix within same session |
| 🟡 MED | Feature degraded but workaround exists | Fix when possible |
| 🟢 LOW | Cosmetic / minor UX issue | Schedule for next phase |
