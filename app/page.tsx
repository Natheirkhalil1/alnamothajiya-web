"use client"

import { HeroSlider } from "@/components/hero-slider"
import { AboutSection } from "@/components/about-section"
import { GallerySection } from "@/components/gallery-section"
import { JobsSection } from "@/components/jobs-section"
import { DepartmentsSection } from "@/components/departments-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ContactSection } from "@/components/contact-section"
import { LayoutWrapper } from "@/components/layout-wrapper"

export default function HomePage() {
  return (
    <LayoutWrapper>
      <main className="min-h-screen">
        <HeroSlider />
        <AboutSection />
        <DepartmentsSection />
        <GallerySection />
        <TestimonialsSection />
        <JobsSection />
        <ContactSection />
      </main>
    </LayoutWrapper>
  )
}
