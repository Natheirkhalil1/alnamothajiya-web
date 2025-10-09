"use client"

import { useState } from "react"
import { ZoomIn } from "lucide-react"
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

  return (
    <section id="gallery" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
            <span className="text-sm font-medium text-primary">معرض الصور</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">استكشف مرافقنا وأنشطتنا</h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
            جولة مصورة في مرافق المدرسة وأنشطتها المتنوعة
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <Card
              key={item.id}
              className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300"
              onClick={() => setSelectedItem(item)}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <ZoomIn className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-medium rounded-full">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Image Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedItem?.title}</DialogTitle>
            <DialogDescription className="text-base leading-relaxed">{selectedItem?.description}</DialogDescription>
          </DialogHeader>
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <img
              src={selectedItem?.image || "/placeholder.svg"}
              alt={selectedItem?.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center justify-between pt-4">
            <span className="px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full">
              {selectedItem?.category}
            </span>
            <Button variant="outline" onClick={() => setSelectedItem(null)}>
              إغلاق
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
