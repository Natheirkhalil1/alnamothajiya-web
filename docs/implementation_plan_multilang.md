# Implementation Plan: Multi-language Content & Edit Page Refactor

## Goal
1.  Refactor `app/dashboard/pages/edit/[id]/page.tsx` to match the clean, modern implementation of `app/dashboard/pages/new/page.tsx`.
2.  Implement the split-content strategy (`blocksAr` / `blocksEn`) across the storage, editor, and frontend.

## User Review Required
> [!IMPORTANT]
> **Data Migration:** Existing pages currently store content in `blocks`. We will migrate this to `blocksAr` (assuming current content is Arabic-first) when saving. Old pages will still load correctly by falling back to `blocks` if `blocksAr` is empty.

## Proposed Changes

### 1. Refactor Edit Page (`app/dashboard/pages/edit/[id]/page.tsx`)
-   **Cleanup:** Remove all legacy "Editable..." components, local `blockTypes` definitions, and manual `renderBlockForPreview` logic.
-   **Standardize:** Use `PageBlocksEditor` and `PageBlocks` components exactly like `new/page.tsx`.
-   **Logic:** Simplify state management to focus on `pageData` and `blocks` (eventually `blocksAr`/`blocksEn`).

### 2. Update Data Model (`lib/storage.ts`)
-   **Interface:** Update `DynamicPage` to include `blocksAr: Block[]` and `blocksEn: Block[]`.
-   **Functions:** Update `saveDynamicPage` to handle these new fields.
-   **Migration:** In `getDynamicPages` or the component, if `blocksAr` is missing but `blocks` exists, treat `blocks` as `blocksAr`.

### 3. Update Page Builder (`components/page-blocks-editor.tsx`)
-   **Props:** Add `blocksAr`, `blocksEn`, `onChangeAr`, `onChangeEn`.
-   **UI:** Add a "Language Switcher" (Tabs) at the top of the editor.
-   **Logic:**
    -   State: `activeLanguage` ('ar' | 'en').
    -   Render the block list for the active language.
    -   Add "Copy from [Other Language]" button to duplicate blocks.

### 4. Update Page Consumers & Routing
-   **New Page (`new/page.tsx`):** Initialize both arrays. Pass to editor.
-   **Edit Page (`edit/[id]/page.tsx`):** Load both arrays. Pass to editor.
-   **Public Page Routing (SEO-Optimized):**
    -   Create `app/[lang]/[slug]/page.tsx` for single-level pages.
    -   Create `app/[lang]/[parent]/[slug]/page.tsx` for nested pages.
    -   **Middleware:** Update `middleware.ts` to handle language detection and redirection (e.g., `/about` → `/ar/about` or `/en/about`).
    -   **Logic:** Use the `[lang]` parameter from the URL to determine which blocks array to render (`blocksAr` or `blocksEn`).
    -   **Note:** Existing routes like `/dashboard`, `/login` are unaffected as they don't have the `[lang]` prefix.

### 5. Update Middleware (`middleware.ts`)
-   **Language Detection:** Check if URL starts with `/ar` or `/en`. If not, redirect to `/ar/...` (default) or `/en/...` based on browser preferences.
-   **Exclude Paths:** Skip middleware for `/dashboard`, `/api`, `/login`, `/_next`, `/favicon.ico`, etc.

## Verification Plan

### Automated Tests
-   None available.

### Manual Verification
1.  **Refactor Check:** Open an existing page in "Edit" mode. Verify it loads correctly and the UI looks like the "New Page" UI.
2.  **Multi-language Save:**
    -   Create a new page.
    -   Add a "Hero" block in Arabic tab.
    -   Switch to English tab. Verify it's empty.
    -   Add a "Hero" block in English tab.
    -   Save.
3.  **Frontend Check:**
    -   View the page.
    -   Switch language to Arabic -> See Arabic blocks.
    -   Switch language to English -> See English blocks.
