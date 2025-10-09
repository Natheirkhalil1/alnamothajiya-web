import Link from "next/link"
import { ArrowRight, BookOpen, Users, Award, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const programs = [
  {
    icon: BookOpen,
    title: "المرحلة الابتدائية",
    description: "برنامج تعليمي شامل للصفوف من الأول إلى السادس يركز على بناء الأساسيات الأكاديمية والمهارات الحياتية",
    features: ["مناهج معتمدة", "أنشطة تفاعلية", "متابعة فردية", "تقييم مستمر"],
  },
  {
    icon: Users,
    title: "المرحلة الإعدادية",
    description: "برنامج متقدم للصفوف من السابع إلى التاسع يهدف لتطوير المهارات الأكاديمية والتفكير النقدي",
    features: ["مناهج متطورة", "مختبرات علمية", "مشاريع بحثية", "إرشاد أكاديمي"],
  },
  {
    icon: Award,
    title: "المرحلة الثانوية",
    description: "برنامج تحضيري للجامعة يركز على التميز الأكاديمي والإعداد للمستقبل المهني",
    features: ["تخصصات متنوعة", "إعداد للتوجيهي", "توجيه مهني", "برامج تميز"],
  },
  {
    icon: Target,
    title: "برامج إضافية",
    description: "برامج تعليمية إضافية لتعزيز المهارات وتنمية المواهب في مختلف المجالات",
    features: ["دورات تقوية", "أنشطة لا منهجية", "مسابقات علمية", "رحلات تعليمية"],
  },
]

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-accent text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
            <span>العودة للرئيسية</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">برامجنا التعليمية</h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl leading-relaxed text-pretty">
            برامج تعليمية متكاملة تغطي جميع المراحل الدراسية بأحدث المناهج والأساليب التعليمية
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {programs.map((program, index) => (
            <Card key={index} className="p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-6">
                <program.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">{program.title}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{program.description}</p>
              <div className="space-y-2">
                <h3 className="font-bold text-foreground text-sm mb-3">المميزات:</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {program.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">منهجية تعليمية متطورة</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              نتبع منهجية تعليمية حديثة تجمع بين التعليم التقليدي والتقنيات الحديثة، مع التركيز على:
            </p>
            <ul className="space-y-3">
              {[
                "التعلم النشط والتفاعلي",
                "تنمية مهارات التفكير النقدي",
                "التعلم القائم على المشاريع",
                "استخدام التكنولوجيا في التعليم",
                "التقييم المستمر والشامل",
                "الاهتمام بالفروق الفردية",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-sm font-bold">✓</span>
                  </div>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/#contact">
              <Button size="lg" className="mt-4">
                استفسر عن التسجيل
              </Button>
            </Link>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img src="/modern-tech-classroom.png" alt="التعليم الحديث" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
