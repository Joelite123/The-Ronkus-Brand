---
name: Mobile visual viewport
description: Mobile viewport measurements and overlay placement in the Replit preview.
---

For mobile dialogs, size and center against `window.visualViewport` (including its offsets), rather than `window.innerWidth` or percentage-based layout-viewport coordinates. Keep the page root clipped horizontally while allowing nested carousels to scroll.

**Why:** In mobile device emulation, `window.innerWidth` and the document root's reported scroll width can be much wider than the visible screen, even while the body and rendered content match the phone width. Layout-viewport centering can put a dialog off-screen.

**How to apply:** Track visual-viewport resize and scroll events, expose its visible bounds to the dialog styles, and verify at phone width and after a viewport-height change.
