# Multi-language Readiness Report

**Date:** 2025-11-28
**Status:** Partial / Mixed

## 📊 Executive Summary
The application has a solid architectural foundation for bilingual support (Arabic/English), but the implementation is inconsistent across different components. While the core infrastructure (Context, Routing, Fonts) is ready, many Page Builder blocks are currently "Arabic-first" or "Arabic-only" with hardcoded strings.

## ✅ Strengths (Ready)

### 1. Core Architecture
-   **Language Context:** `LanguageProvider` and `useLanguage` hook are correctly implemented to manage state and direction (`rtl`/`ltr`).
-   **Translations Library:** `lib/translations.ts` contains a comprehensive dictionary for static app text (Nav, Footer, Auth).
-   **Font Support:** `Cairo` font (Google Fonts) is configured for both Arabic and Latin subsets.
-   **Routing:** The app supports dynamic switching without page reloads.

### 2. Specific Components
-   **Navigation:** The `Header` component is fully bilingual, dynamically switching text and direction based on the selected language.
-   **Newer Blocks:** Blocks like `AboutSectionBlock` and `DepartmentsGridBlock` have explicit fields for both languages (e.g., `titleEn`, `titleAr`), allowing for perfect bilingual content.

## ⚠️ Gaps & Issues (Not Ready)

### 1. Generic Page Builder Blocks (Critical)
Many "generic" blocks are currently **Monolingual** and heavily biased towards Arabic.
-   **Examples:** `HeroBasic`, `HeroSlider`, `RichText`.
-   **Issue:** These blocks only store a single value for text fields (e.g., `title` instead of `titleEn`/`titleAr`).
-   **Hardcoded UI:** Buttons and labels inside these blocks are often hardcoded in Arabic.
    -   *Example (`hero-slider.tsx`):* Buttons are hardcoded as "اعرف المزيد" (Learn More) and "تواصل معنا" (Contact Us). Even if a user enters English content for the title, the buttons will remain in Arabic.

### 2. Metadata
-   **`app/layout.tsx`:** The HTML `lang` and `dir` attributes are hardcoded to `ar` and `rtl` on the server side.
-   **SEO:** Page title and description in `metadata` are hardcoded in Arabic. This affects SEO for English users.

### 3. Editor Experience
-   **Labels:** The Page Builder editor interface (input labels, placeholders) is almost entirely in Arabic. This makes it difficult for a non-Arabic speaker to manage the content.

## 📋 Detailed Block Analysis

| Block Category | Status | Notes |
| :--- | :--- | :--- |
| **Layout** (Columns, Grid) | 🟢 Ready | Structure only, no text. |
| **Hero** (Basic, Slider) | 🔴 Not Ready | Single text fields, hardcoded button labels. |
| **Content** (Rich Text) | 🔴 Not Ready | Single text body. |
| **Features** (About, Depts) | 🟢 Ready | Explicit `En`/`Ar` fields. |
| **Forms** (Contact, Jobs) | 🟡 Partial | Some labels are dynamic, others hardcoded. |

## 🚀 Recommendations

1.  **Refactor Generic Blocks:** Update `HeroBasic`, `HeroSlider`, etc., to include `...En` and `...Ar` fields for all text inputs, similar to `AboutSection`.
2.  **Dynamic Buttons:** Replace hardcoded button text in blocks with either:
    -   Editable fields (e.g., `buttonLabelEn`, `buttonLabelAr`).
    -   Or use the `t` translation helper if the text is standard.
3.  **Dynamic Metadata:** Update `layout.tsx` to generate metadata dynamically based on the active language (requires moving language state to URL or cookie for server-side rendering).
