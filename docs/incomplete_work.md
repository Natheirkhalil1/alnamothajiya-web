# Incomplete Work & Technical Debt

This document outlines features that are partially implemented, require refactoring, or are currently using placeholders.

## 🚧 Partial Implementations

### 1. Integrations
- **Email Service:** Currently lacks a robust email sending service (e.g., SendGrid, AWS SES). Notifications for employment and service requests may be simulated or basic.
- **Google Maps:** The `Map Embed` block uses a simple iframe. Full Google Maps API integration for custom markers and styling is a "nice-to-have" pending item.
- **Social Feed:** The original `Social Feed` block was removed due to complexity. A proper implementation would require OAuth apps for each platform (Instagram, Twitter, etc.).

### 2. Styling & Theme
- **`nmTheme` Object:** The theme configuration object in the code contains placeholder values.
    - **Action Required:** Replace placeholder colors and settings with the actual brand identity of Namothajia School.
    - **Impact:** Global consistency of the design system.

### 3. Media Management
- **Media Library:** There is no centralized media library to manage uploaded images.
    - **Current State:** Images are uploaded directly within blocks.
    - **Missing:** A dashboard to view, delete, or reuse previously uploaded assets.

## 🛠 Refactoring Needs (Technical Debt)

### 1. Page Builder Core
- **File Size:** `components/page-blocks-editor-core.tsx` is extremely large (>6,200 lines).
- **Action:** Split into smaller, manageable sub-components (e.g., `components/blocks/pricing-table.tsx`).
- **Benefit:** Improved maintainability and faster compile times.

### 2. Component Synchronization
- **Issue:** Some standalone components (used in static pages) may differ slightly from their Page Builder counterparts.
- **Action:** Unify them to share the exact same code and styling to prevent "design drift."

### 3. Type Safety
- **Audit:** `lib/types/blocks.ts` needs a strict audit to ensure all newly added fields (especially in Style/Animation tabs) are fully typed and validated.

## ⚠️ Known Limitations
- **Undo/Redo:** The Page Builder lacks an Undo/Redo history stack.
- **Version Control:** No UI to view or revert to previous versions of a page.
