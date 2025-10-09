import { Header } from "@/components/header"
import { HeroSlider } from "@/components/hero-slider"
import { AboutSection } from "@/components/about-section"
import { GallerySection } from "@/components/gallery-section"
import { JobsSection } from "@/components/jobs-section"
import { DepartmentsSection } from "@/components/departments-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSlider />
      <AboutSection />
      <GallerySection />
      <JobsSection />
      <DepartmentsSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
