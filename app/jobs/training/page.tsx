import Link from "next/link"
import { ArrowRight, GraduationCap, Users, Award, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const trainingPrograms = [
  {
    icon: GraduationCap,
    title: "تطوير المعلمين",
    description: "برامج تدريبية متخصصة لتطوير مهارات المعلمين في أحدث أساليب التدريس والتقنيات التعليمية",
    duration: "3 أشهر",
    level: "متقدم",
  },
  {
    icon: Users,
    title: "القيادة التربوية",
    description: "برنامج تدريبي للمشرفين والإداريين لتطوير مهارات القيادة والإدارة التربوية الفعالة",
    duration: "2 أشهر",
    level: "متقدم",
  },
  {
    icon: Award,
    title: "التقييم والقياس",
    description: "دورات متخصصة في أساليب التقييم الحديثة وقياس نواتج التعلم بطرق علمية",
    duration: "6 أسابيع",
    level: "متوسط",
  },
  {
    icon: BookOpen,
    title: "التكنولوجيا في التعليم",
    description: "برامج تدريبية على استخدام التقنيات الحديثة والأدوات الرقمية في العملية التعليمية",
    duration: "4 أسابيع",
    level: "مبتدئ",
  },
]

export default function TrainingPage() {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">التدريب والتطوير</h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl leading-relaxed text-pretty">
            برامج تدريبية متخصصة لتطوير الكفاءات التعليمية والإدارية
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Training Programs */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {trainingPrograms.map((program, index) => (
            <Card key={index} className="p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center flex-shrink-0">
                  <program.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground mb-2">{program.title}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">{program.description}</p>
                  <div className="flex gap-4">
                    <div className="px-3 py-1 bg-primary/10 rounded-full">
                      <span className="text-sm font-medium text-primary">{program.duration}</span>
                    </div>
                    <div className="px-3 py-1 bg-accent/10 rounded-full">
                      <span className="text-sm font-medium text-accent">{program.level}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img src="/professional-training-workshop.png" alt="التدريب المهني" className="w-full h-auto" />
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">فوائد برامجنا التدريبية</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              نقدم برامج تدريبية شاملة تساعد على تطوير المهارات المهنية والشخصية:
            </p>
            <ul className="space-y-3">
              {[
                "شهادات معتمدة من جهات دولية",
                "مدربون متخصصون وذوو خبرة",
                "محتوى تدريبي محدث ومتطور",
                "تطبيقات عملية وورش تفاعلية",
                "متابعة ما بعد التدريب",
                "فرص للتواصل المهني",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-sm font-bold">✓</span>
                  </div>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="p-12 text-center bg-gradient-to-br from-primary/5 to-accent/5">
          <h2 className="text-3xl font-bold text-foreground mb-4">هل أنت مهتم بالانضمام لبرامجنا التدريبية؟</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            تواصل معنا للحصول على مزيد من المعلومات حول البرامج التدريبية المتاحة ومواعيد الدورات القادمة
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/#contact">
              <Button size="lg">تواصل معنا</Button>
            </Link>
            <Link href="/jobs/employment">
              <Button size="lg" variant="outline">
                فرص التوظيف
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
