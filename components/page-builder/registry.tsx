import * as React from "react"
import { Block, BlockKind } from "./types"

// Import all block components
import { HeroBasicEditor, HeroBasicView } from "./blocks/hero-basic"
import { HeroSliderEditor, HeroSliderView } from "./blocks/hero-slider"
import { HeroSplitEditor, HeroSplitView } from "./blocks/hero-split"
import { SectionHeaderEditor, SectionHeaderView } from "./blocks/section-header"
import { RichTextEditor, RichTextView } from "./blocks/rich-text"
import { ImageWithTextEditor, ImageWithTextView } from "./blocks/image-with-text"
import { HighlightBannerEditor, HighlightBannerView } from "./blocks/highlight-banner"
import { ProgramsGridEditor, ProgramsGridView } from "./blocks/programs-grid"
import { ServicesListEditor, ServicesListView } from "./blocks/services-list"
import { CurriculumOverviewEditor, CurriculumOverviewView } from "./blocks/curriculum-overview"
import { StatsEditor, StatsView } from "./blocks/stats"
import { IconPointsEditor, IconPointsView } from "./blocks/icon-points"
import { TestimonialsEditor, TestimonialsView } from "./blocks/testimonials"
import { LogosStripEditor, LogosStripView } from "./blocks/logos-strip"
import { GalleryGridEditor, GalleryGridView } from "./blocks/gallery-grid"
import { VideoHighlightEditor, VideoHighlightView } from "./blocks/video-highlight"
import { StaffGridEditor, StaffGridView } from "./blocks/staff-grid"
import { BoardOrTeamListEditor, BoardOrTeamListView } from "./blocks/board-or-team-list"
import { StepsHorizontalEditor, StepsHorizontalView } from "./blocks/steps-horizontal"
import { TimelineVerticalEditor, TimelineVerticalView } from "./blocks/timeline-vertical"
import { FaqAccordionEditor, FaqAccordionView } from "./blocks/faq-accordion"
import { DownloadsListEditor, DownloadsListView } from "./blocks/downloads-list"
import { ContactSectionEditor, ContactSectionView } from "./blocks/contact-section"
import { MapEditor, MapView } from "./blocks/map"
import { CtaStripEditor, CtaStripView } from "./blocks/cta-strip"
// import { TestimonialsSliderEditor, TestimonialsSliderView } from "./blocks/testimonials-slider"
import { GalleryMasonryEditor, GalleryMasonryView } from "./blocks/gallery-masonry"
// import { MapEmbedEditor, MapEmbedView } from "./blocks/map-embed"
import { PricingTableEditor, PricingTableView } from "./blocks/pricing-table"
import { VideoEmbedEditor, VideoEmbedView } from "./blocks/video-embed"
import { NewsletterSignupEditor, NewsletterSignupView } from "./blocks/newsletter-signup"
import { DividerEditor, DividerView } from "./blocks/divider"
import { SpacerEditor, SpacerView } from "./blocks/spacer"
import { CustomHtmlEditor, CustomHtmlView } from "./blocks/custom-html"
import { ColumnsEditor, ColumnsView } from "./blocks/columns"
import { GridEditor, GridView } from "./blocks/grid"
import { SocialIconsEditor, SocialIconsView } from "./blocks/social-icons"
import { DepartmentsGridEditor, DepartmentsGridView } from "./blocks/departments-grid"
import { AboutSectionEditor, AboutSectionView } from "./blocks/about-section"
import { DepartmentWelcomeEditor, DepartmentWelcomeView } from "./blocks/department-welcome"
import { DepartmentSubsectionsEditor, DepartmentSubsectionsView } from "./blocks/department-subsections"
import { DepartmentCTAEditor, DepartmentCTAView } from "./blocks/department-cta"
import { JobsListingEditor, JobsListingView } from "./blocks/jobs-listing"
import { ImageAlbumsEditor, ImageAlbumsView } from "./blocks/image-albums"
import {
    FormContainerEditor, FormContainerView,
    FormInputEditor, FormInputView,
    FormTextareaEditor, FormTextareaView,
    FormSelectEditor, FormSelectView,
    FormCheckboxEditor, FormCheckboxView,
    FormRadioEditor, FormRadioView,
    FormButtonEditor, FormButtonView,
} from "./blocks/form-blocks"

// Type definitions for block components
export type BlockEditorComponent = React.ComponentType<{
    block: Block
    onChange: (block: Block) => void
    onNestedBlockSettings?: (blockPath: string[], block: Block) => void
}>

export type BlockViewComponent = React.ComponentType<{
    block: Block
}>

export interface BlockRegistryEntry {
    Editor: BlockEditorComponent
    View: BlockViewComponent
}

// Block registry mapping BlockKind to components
export const blockRegistry: Record<BlockKind, BlockRegistryEntry> = {
    "hero-basic": {
        Editor: HeroBasicEditor as BlockEditorComponent,
        View: HeroBasicView as BlockViewComponent,
    },
    "hero-slider": {
        Editor: HeroSliderEditor as BlockEditorComponent,
        View: HeroSliderView as BlockViewComponent,
    },
    "hero-split": {
        Editor: HeroSplitEditor as BlockEditorComponent,
        View: HeroSplitView as BlockViewComponent,
    },
    "section-header": {
        Editor: SectionHeaderEditor as BlockEditorComponent,
        View: SectionHeaderView as BlockViewComponent,
    },
    "rich-text": {
        Editor: RichTextEditor as BlockEditorComponent,
        View: RichTextView as BlockViewComponent,
    },
    "image-with-text": {
        Editor: ImageWithTextEditor as BlockEditorComponent,
        View: ImageWithTextView as BlockViewComponent,
    },
    "highlight-banner": {
        Editor: HighlightBannerEditor as BlockEditorComponent,
        View: HighlightBannerView as BlockViewComponent,
    },
    "programs-grid": {
        Editor: ProgramsGridEditor as BlockEditorComponent,
        View: ProgramsGridView as BlockViewComponent,
    },
    "services-list": {
        Editor: ServicesListEditor as BlockEditorComponent,
        View: ServicesListView as BlockViewComponent,
    },
    "curriculum-overview": {
        Editor: CurriculumOverviewEditor as BlockEditorComponent,
        View: CurriculumOverviewView as BlockViewComponent,
    },
    "stats": {
        Editor: StatsEditor as BlockEditorComponent,
        View: StatsView as BlockViewComponent,
    },
    "icon-points": {
        Editor: IconPointsEditor as BlockEditorComponent,
        View: IconPointsView as BlockViewComponent,
    },
    "testimonials": {
        Editor: TestimonialsEditor as BlockEditorComponent,
        View: TestimonialsView as BlockViewComponent,
    },
    "logos-strip": {
        Editor: LogosStripEditor as BlockEditorComponent,
        View: LogosStripView as BlockViewComponent,
    },
    "gallery-grid": {
        Editor: GalleryGridEditor as BlockEditorComponent,
        View: GalleryGridView as BlockViewComponent,
    },
    "video-highlight": {
        Editor: VideoHighlightEditor as BlockEditorComponent,
        View: VideoHighlightView as BlockViewComponent,
    },
    "staff-grid": {
        Editor: StaffGridEditor as BlockEditorComponent,
        View: StaffGridView as BlockViewComponent,
    },
    "board-or-team-list": {
        Editor: BoardOrTeamListEditor as BlockEditorComponent,
        View: BoardOrTeamListView as BlockViewComponent,
    },
    "steps-horizontal": {
        Editor: StepsHorizontalEditor as BlockEditorComponent,
        View: StepsHorizontalView as BlockViewComponent,
    },
    "timeline-vertical": {
        Editor: TimelineVerticalEditor as BlockEditorComponent,
        View: TimelineVerticalView as BlockViewComponent,
    },
    "faq-accordion": {
        Editor: FaqAccordionEditor as BlockEditorComponent,
        View: FaqAccordionView as BlockViewComponent,
    },
    "downloads-list": {
        Editor: DownloadsListEditor as BlockEditorComponent,
        View: DownloadsListView as BlockViewComponent,
    },
    "contact-section": {
        Editor: ContactSectionEditor as BlockEditorComponent,
        View: ContactSectionView as BlockViewComponent,
    },
    "map": {
        Editor: MapEditor as BlockEditorComponent,
        View: MapView as BlockViewComponent,
    },
    "cta-strip": {
        Editor: CtaStripEditor as BlockEditorComponent,
        View: CtaStripView as BlockViewComponent,
    },
    // "testimonials-slider": {
    //     Editor: TestimonialsSliderEditor as BlockEditorComponent,
    //     View: TestimonialsSliderView as BlockViewComponent,
    // },
    "gallery-masonry": {
        Editor: GalleryMasonryEditor as BlockEditorComponent,
        View: GalleryMasonryView as BlockViewComponent,
    },
    // "map-embed": {
    //     Editor: MapEmbedEditor as BlockEditorComponent,
    //     View: MapEmbedView as BlockViewComponent,
    // },
    "pricing-table": {
        Editor: PricingTableEditor as BlockEditorComponent,
        View: PricingTableView as BlockViewComponent,
    },
    "video-embed": {
        Editor: VideoEmbedEditor as BlockEditorComponent,
        View: VideoEmbedView as BlockViewComponent,
    },
    "newsletter-signup": {
        Editor: NewsletterSignupEditor as BlockEditorComponent,
        View: NewsletterSignupView as BlockViewComponent,
    },
    "divider": {
        Editor: DividerEditor as BlockEditorComponent,
        View: DividerView as BlockViewComponent,
    },
    "spacer": {
        Editor: SpacerEditor as BlockEditorComponent,
        View: SpacerView as BlockViewComponent,
    },
    "custom-html": {
        Editor: CustomHtmlEditor as BlockEditorComponent,
        View: CustomHtmlView as BlockViewComponent,
    },
    "columns": {
        Editor: ColumnsEditor as BlockEditorComponent,
        View: ColumnsView as BlockViewComponent,
    },
    "grid": {
        Editor: GridEditor as BlockEditorComponent,
        View: GridView as BlockViewComponent,
    },
    "social-icons": {
        Editor: SocialIconsEditor as BlockEditorComponent,
        View: SocialIconsView as BlockViewComponent,
    },
    "departments-grid": {
        Editor: DepartmentsGridEditor as BlockEditorComponent,
        View: DepartmentsGridView as BlockViewComponent,
    },
    "about-section": {
        Editor: AboutSectionEditor as BlockEditorComponent,
        View: AboutSectionView as BlockViewComponent,
    },
    // Note: download-list is an alias for downloads-list
    "download-list": {
        Editor: DownloadsListEditor as BlockEditorComponent,
        View: DownloadsListView as BlockViewComponent,
    },
    "jobs-listing": {
        Editor: JobsListingEditor as BlockEditorComponent,
        View: JobsListingView as BlockViewComponent,
    },
    "department-welcome": {
        Editor: DepartmentWelcomeEditor as BlockEditorComponent,
        View: DepartmentWelcomeView as BlockViewComponent,
    },
    "department-subsections": {
        Editor: DepartmentSubsectionsEditor as BlockEditorComponent,
        View: DepartmentSubsectionsView as BlockViewComponent,
    },
    "department-cta": {
        Editor: DepartmentCTAEditor as BlockEditorComponent,
        View: DepartmentCTAView as BlockViewComponent,
    },
    "image-albums": {
        Editor: ImageAlbumsEditor as BlockEditorComponent,
        View: ImageAlbumsView as BlockViewComponent,
    },
    "form-container": {
        Editor: FormContainerEditor as BlockEditorComponent,
        View: FormContainerView as BlockViewComponent,
    },
    "form-input": {
        Editor: FormInputEditor as BlockEditorComponent,
        View: FormInputView as BlockViewComponent,
    },
    "form-textarea": {
        Editor: FormTextareaEditor as BlockEditorComponent,
        View: FormTextareaView as BlockViewComponent,
    },
    "form-select": {
        Editor: FormSelectEditor as BlockEditorComponent,
        View: FormSelectView as BlockViewComponent,
    },
    "form-checkbox": {
        Editor: FormCheckboxEditor as BlockEditorComponent,
        View: FormCheckboxView as BlockViewComponent,
    },
    "form-radio": {
        Editor: FormRadioEditor as BlockEditorComponent,
        View: FormRadioView as BlockViewComponent,
    },
    "form-button": {
        Editor: FormButtonEditor as BlockEditorComponent,
        View: FormButtonView as BlockViewComponent,
    },
}

// Helper function to get block editor component
export function getBlockEditor(kind: BlockKind): BlockEditorComponent {
    return blockRegistry[kind]?.Editor || ((() => null) as unknown as BlockEditorComponent)
}

// Helper function to get block view component
export function getBlockView(kind: BlockKind): BlockViewComponent {
    return blockRegistry[kind]?.View || ((() => null) as unknown as BlockViewComponent)
}
