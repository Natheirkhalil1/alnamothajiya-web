"use client"

import { useState } from "react"
import { ZoomIn, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const galleryItems = [
  {
    id: 1,
    image: "/students-in-science-lab.jpg",
    title: "مختبر العلوم",
    description: "مختبرات علمية مجهزة بأحدث الأدوات والتقنيات لتجارب عملية متقدمة",
    category: "المرافق",
  },
  {
    id: 2,
    image: "/school-library-with-books.jpg",
    title: "المكتبة",
    description: "مكتبة غنية بآلاف الكتب والمراجع في مختلف المجالات العلمية والأدبية",
    category: "المرافق",
  },
  {
    id: 3,
    image: "/gallery-hero-4.jpg",
    title: "الأنشطة الرياضية",
    description: "برامج رياضية متنوعة تهدف لتنمية المهارات البدنية والروح الرياضية",
    category: "الأنشطة",
  },
  {
    id: 4,
    image: "/art-class-students-painting.jpg",
    title: "الفنون والإبداع",
    description: "ورش فنية وإبداعية لتنمية المواهب والقدرات الفنية لدى الطلاب",
    category: "الأنشطة",
  },
  {
    id: 5,
    image: "/computer-lab-students.jpg",
    title: "مختبر الحاسوب",
    description: "مختبرات حاسوب حديثة مزودة بأحدث الأجهزة والبرامج التعليمية",
    category: "المرافق",
  },
  {
    id: 6,
    image: "/school-graduation.png",
    title: "حفل التخرج",
    description: "احتفالات التخرج السنوية لتكريم الطلاب المتفوقين والخريجين",
    category: "الفعاليات",
  },
]

export function GallerySection() {
  const [selectedItem, setSelectedItem] = useState<(typeof galleryItems)[0] | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>("الكل")

  const categories = ["الكل", "المرافق", "الأنشطة", "الفعاليات"]

  const filteredItems =
    activeCategory === "الكل" ? galleryItems : galleryItems.filter((item) => item.category === activeCategory)

  return (
    <section
      id="gallery"
      className="relative py-24 bg-gradient-to-b from-background via-muted/20 to-background overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/3 to-accent/3 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-full mb-6 border border-primary/20 backdrop-blur-sm animate-shimmer">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              معرض الصور
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground bg-clip-text text-transparent">
              استكشف مرافقنا وأنشطتنا
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
            جولة مصورة في مرافق المدرسة وأنشطتها المتنوعة
          </p>
        </div>

        <div
          className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                  : "bg-card/50 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:bg-card border border-border/50 hover:border-primary/30 hover:scale-105"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <Card
              key={item.id}
              className="group cursor-pointer overflow-hidden hover:shadow-2xl transition-all duration-500 border-border/50 bg-card/50 backdrop-blur-sm hover:-translate-y-3 hover:scale-[1.02] animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedItem(item)}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-125 group-hover:rotate-2 transition-all duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-[2px] z-20" />

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-30 scale-50 group-hover:scale-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-2xl animate-pulse-slow">
                    <ZoomIn className="w-8 h-8 text-primary-foreground" />
                  </div>
                </div>

                <div className="absolute top-4 right-4 z-30">
                  <span className="px-4 py-1.5 bg-gradient-to-r from-primary/95 to-accent/95 backdrop-blur-md text-primary-foreground text-xs font-semibold rounded-full shadow-lg border border-white/20">
                    {item.category}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
              </div>

              <div className="p-6 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                  {item.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-5xl bg-card/95 backdrop-blur-xl border-border/50">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              {selectedItem?.title}
            </DialogTitle>
            <DialogDescription className="text-base leading-relaxed text-muted-foreground pt-2">
              {selectedItem?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
            <img
              src={selectedItem?.image || "/placeholder.svg"}
              alt={selectedItem?.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center justify-between pt-6">
            <span className="px-5 py-2.5 bg-gradient-to-r from-primary/10 to-accent/10 text-primary text-sm font-semibold rounded-full border border-primary/20">
              {selectedItem?.category}
            </span>
            <Button
              variant="outline"
              onClick={() => setSelectedItem(null)}
              className="hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              إغلاق
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
