# Implementation Plan: Add English Content to Block Templates

## Goal
Add English default content to all block templates in `lib/types/block-templates.ts` so that when users create blocks, they have proper English text instead of just Arabic.

## Scope Analysis
- **File:** `lib/types/block-templates.ts` (1553 lines)
- **Templates:** ~20+ block templates
- **Fields to translate:**
  - `title` → needs English version
  - `subtitle` → needs English version  
  - `description` → needs English version
  - `text` → needs English version
  - `quote` → needs English version
  - `label` → needs English version
  - `primaryCtaLabel` / `secondaryCtaLabel` → needs English version
  - All nested items (slides, features, testimonials, stats, etc.)

## Challenge
The current block structure stores single-language strings (e.g., `title: "مرحباً بكم"`). To support bilingual content, we need to either:

### Option A: Keep Current Structure (Recommended)
- Templates remain Arabic-only for now
- Users manually add English content when creating pages
- **Pro:** No breaking changes, simple
- **Con:** Users must translate manually

### Option B: Change Block Structure
- Change all text fields to objects: `title: { ar: "...", en: "..." }`
- **Pro:** Full bilingual support in templates
- **Con:** **BREAKING CHANGE** - requires updating all 34+ block components to handle new structure

## Recommendation
**Option A** - Keep templates as-is because:
1. The new multi-language system uses separate `blocksAr` and `blocksEn` arrays
2. Users can create Arabic blocks in the Arabic tab, English blocks in the English tab
3. No breaking changes to existing block components
4. Templates are just starting points - users customize anyway

## Alternative: Add English-Only Templates
Instead of modifying existing templates, **add duplicate templates** with English content:
- `hero-slider-premium` (Arabic) → stays as-is
- `hero-slider-premium-en` (English) → new template with English text

This way users can choose language-specific templates.

## Verification Plan
- Manual: Create a new page, check if English templates appear in template picker
- Manual: Insert an English template, verify text is in English

## User Decision Required
Which approach do you prefer?
1. **Keep current Arabic templates** (users add English manually)
2. **Add duplicate English templates** (double the templates, one set per language)
3. **Change block structure** (breaking change, requires refactoring all blocks)
