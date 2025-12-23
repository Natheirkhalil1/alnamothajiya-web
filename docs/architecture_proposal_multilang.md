# Architecture Proposal: Split-Content Multi-language Strategy

**Date:** 2025-11-28
**Status:** Approved / Decided

## 🎯 Objective
To implement full bilingual support by separating page content into distinct "Arabic" and "English" block arrays. This allows for completely independent layouts and content for each language, sharing only the underlying block components.

## 🏗️ Current Data Model
Currently, a `DynamicPage` has a single `blocks` array:
<<<<<<< HEAD
\`\`\`typescript
=======
\`\`\`typescript
>>>>>>> 1b633bfcd0d8a4a9200a4ced2b3f5caf261fa02c
interface DynamicPage {
  // ... metadata
  blocks?: PageBlock[] // Single array, mixed content
}
<<<<<<< HEAD
\`\`\`
=======
\`\`\`
>>>>>>> 1b633bfcd0d8a4a9200a4ced2b3f5caf261fa02c

## 💡 Proposed Data Model
We will split the content into two separate arrays:

<<<<<<< HEAD
\`\`\`typescript
=======
\`\`\`typescript
>>>>>>> 1b633bfcd0d8a4a9200a4ced2b3f5caf261fa02c
interface DynamicPage {
  // ... metadata (titleAr, titleEn, slug, etc.)
  
  // 1. English Content
  blocksEn: PageBlock[] 
  
  // 2. Arabic Content
  blocksAr: PageBlock[]
  
  // Deprecated/Removed
  // blocks?: PageBlock[] 
}
<<<<<<< HEAD
\`\`\`
=======
\`\`\`
>>>>>>> 1b633bfcd0d8a4a9200a4ced2b3f5caf261fa02c

## 🛠 Implementation Plan

### 1. Database & Types (`lib/storage.ts`)
-   Update `DynamicPage` interface.
-   Update `saveDynamicPage` and `getDynamicPage` to handle both arrays.
-   **Migration:** For existing pages, move the current `blocks` into `blocksAr` (assuming current content is Arabic-first).

### 2. Page Builder UI (`components/page-builder/`)
-   **Language Switcher:** Add a toggle (Tab/Switch) at the top of the Page Builder: `[ Arabic Content | English Content ]`.
-   **State Management:** The editor will maintain two separate lists of blocks.
-   **"Copy" Feature:** Add a button "Copy from Arabic" when editing English (and vice versa) to quickly duplicate the layout, which the user can then translate.

### 3. Frontend Rendering (`app/pages/[slug]/page.tsx`)
-   Update the page component to fetch the full page data.
-   Use `useLanguage()` hook to determine which array to render:
<<<<<<< HEAD
    \`\`\`tsx
    const { language } = useLanguage()
    const blocksToRender = language === 'ar' ? page.blocksAr : page.blocksEn
    \`\`\`
=======
    \`\`\`tsx
    const { language } = useLanguage()
    const blocksToRender = language === 'ar' ? page.blocksAr : page.blocksEn
    \`\`\`
>>>>>>> 1b633bfcd0d8a4a9200a4ced2b3f5caf261fa02c

## ✅ Pros
1.  **Zero Block Refactoring:** We don't need to touch the 34+ existing blocks. They remain "dumb" and monolingual.
2.  **Flexible Layouts:** The English version of a page can have a completely different structure than the Arabic version if needed (e.g., different cultural emphasis).
3.  **Clean Separation:** Database JSON is cleaner and easier to debug.

## ⚠️ Cons
1.  **Content Sync:** Editors must update both versions separately. (Mitigated by the "Copy" feature).
2.  **Migration:** Existing pages need a one-time migration.

## 📝 Opinion & Endorsement
This approach is **ideal** for the Namothajia project.

1.  **True Localization vs. Translation:** It allows you to tailor the *structure* of the page to the audience, not just translate the words. For example, the English homepage might highlight "International Accreditation" more prominently, while the Arabic one highlights "Community Values".
2.  **Technical Simplicity:** It keeps the individual block components simple and maintainable. We avoid "prop drilling" bilingual data into every single component.
3.  **Future Proofing:** If you ever add a third language (e.g., French), you just add a `blocksFr` array. You don't have to refactor 34 components to add `titleFr`.

**Verdict:** Strongly Endorsed.
