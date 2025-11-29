"use client"

import { HeroSlider } from "@/components/hero-slider"
import { AboutSection } from "@/components/about-section"
import { GallerySection } from "@/components/gallery-section"
import { JobsSection } from "@/components/jobs-section"
import { DepartmentsSection } from "@/components/departments-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ContactSection } from "@/components/contact-section"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { getFullDepartmentsData } from "@/lib/storage"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [departmentCards, setDepartmentCards] = useState<any[]>([])

  useEffect(() => {
    const departmentsData = getFullDepartmentsData()
    const cards = departmentsData.map((dept) => ({
      id: dept.id,
      type: dept.slug,
      titleEn: dept.titleEn,
      titleAr: dept.titleAr,
      descriptionEn: dept.descriptionEn,
      descriptionAr: dept.descriptionAr,
      image: dept.heroSlides?.[0]?.image || "/placeholder.svg",
    }))
    setDepartmentCards(cards)
  }, [])

  const heroSlides = [
    {
      id: "slide-1",
      titleEn: "Welcome to Namothajia School",
      titleAr: "مرحباً بكم في مدرسة نموذجية",
      subtitleEn: "Excellence in Education",
      subtitleAr: "التميز في التعليم",
      descriptionEn: "Providing quality education and nurturing future leaders since 1990",
      descriptionAr: "نقدم تعليماً عالي الجودة ونُنشئ قادة المستقبل منذ عام 1990",
      image: "/modern-school-exterior.png",
      order: 1,
    },
    {
      id: "slide-2",
      titleEn: "Modern Facilities",
      titleAr: "مرافق حديثة",
      subtitleEn: "State-of-the-Art Learning",
      subtitleAr: "تعلم متطور",
      descriptionEn: "Equipped with the latest technology and resources for enhanced learning experiences",
      descriptionAr: "مجهزة بأحدث التقنيات والموارد لتجارب تعليمية محسّنة",
      image: "/modern-school-facilities-and-technology.jpg",
      order: 2,
    },
    {
      id: "slide-3",
      titleEn: "Qualified Staff",
      titleAr: "كادر مؤهل",
      subtitleEn: "Expert Educators",
      subtitleAr: "معلمون خبراء",
      descriptionEn: "Our dedicated team of professionals is committed to student success",
      descriptionAr: "فريقنا المتفاني من المحترفين ملتزم بنجاح الطلاب",
      image: "/happy-students-learning-together.jpg",
      order: 3,
    },
  ]

  const aboutData = {
    titleEn: "About Namothajia School",
    titleAr: "عن مدرسة نموذجية",
    descriptionEn:
      "Namothajia School has been a beacon of educational excellence for over 30 years. We are committed to providing a comprehensive learning environment that nurtures academic achievement, personal growth, and social responsibility. Our state-of-the-art facilities and experienced educators work together to prepare students for success in an ever-changing world.",
    descriptionAr:
      "مدرسة نموذجية كانت منارة للتميز التعليمي لأكثر من 30 عاماً. نحن ملتزمون بتوفير بيئة تعليمية شاملة تعزز التحصيل الأكاديمي والنمو الشخصي والمسؤولية الاجتماعية. مرافقنا الحديثة والمعلمون ذوو الخبرة يعملون معاً لإعداد الطلاب للنجاح في عالم متغير.",
    image: "/modern-school-classroom-with-students.jpg",
    features: [
      {
        titleEn: "Academic Excellence",
        titleAr: "التميز الأكاديمي",
        descriptionEn: "Rigorous curriculum designed to challenge and inspire students",
        descriptionAr: "منهج صارم مصمم لتحدي وإلهام الطلاب",
      },
      {
        titleEn: "Character Development",
        titleAr: "تطوير الشخصية",
        descriptionEn: "Building values, ethics, and leadership skills",
        descriptionAr: "بناء القيم والأخلاق ومهارات القيادة",
      },
      {
        titleEn: "Modern Facilities",
        titleAr: "مرافق حديثة",
        descriptionEn: "State-of-the-art classrooms, labs, and sports facilities",
        descriptionAr: "فصول دراسية ومختبرات ومرافق رياضية حديثة",
      },
      {
        titleEn: "Expert Faculty",
        titleAr: "هيئة تدريس متخصصة",
        descriptionEn: "Highly qualified and experienced educators",
        descriptionAr: "معلمون مؤهلون وذوو خبرة عالية",
      },
      {
        titleEn: "Holistic Education",
        titleAr: "تعليم شامل",
        descriptionEn: "Balanced approach to academics, arts, and athletics",
        descriptionAr: "نهج متوازن للأكاديميات والفنون والرياضة",
      },
      {
        titleEn: "Global Perspective",
        titleAr: "منظور عالمي",
        descriptionEn: "Preparing students for an interconnected world",
        descriptionAr: "إعداد الطلاب لعالم مترابط",
      },
    ],
  }

  return (
    <LayoutWrapper>
      <main className="min-h-screen">
        <HeroSlider slides={heroSlides} autoplay={true} interval={5000} showDots={true} showArrows={true} />
        <AboutSection {...aboutData} />
        <DepartmentsSection
          cards={departmentCards}
          sectionTitle={{ en: "Our Specialized Departments", ar: "أقسامنا المتخصصة" }}
        />
        <GallerySection />
        <TestimonialsSection />
        <JobsSection />
        <ContactSection />
      </main>
    </LayoutWrapper>
  )
}
