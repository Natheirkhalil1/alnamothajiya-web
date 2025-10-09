import Link from "next/link"
import { ArrowRight, FlaskConical, Lightbulb, Beaker, TestTube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function ExperimentalDepartmentPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white py-20">
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
            <span>العودة للرئيسية</span>
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <FlaskConical className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-balance">القسم التجريبي</h1>
          </div>
          <p className="text-xl text-white/90 max-w-2xl leading-relaxed text-pretty">
            مختبرات متقدمة للتجارب العملية والأبحاث العلمية
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Labs Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Beaker,
              title: "مختبر الكيمياء",
              description: "مختبر مجهز بأحدث الأدوات لإجراء تجارب كيميائية متقدمة بأمان",
            },
            {
              icon: TestTube,
              title: "مختبر الأحياء",
              description: "مختبر متخصص لدراسة الكائنات الحية والتجارب البيولوجية",
            },
            {
              icon: Lightbulb,
              title: "مختبر الفيزياء",
              description: "مختبر حديث لإجراء تجارب فيزيائية وفهم القوانين الطبيعية",
            },
          ].map((lab, index) => (
            <Card key={index} className="p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4">
                <lab.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{lab.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{lab.description}</p>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl blur-2xl" />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img src="/students-doing-science-experiments.jpg" alt="القسم التجريبي" className="w-full h-auto" />
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">عن القسم التجريبي</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              يوفر القسم التجريبي بيئة مثالية للطلاب لإجراء التجارب العلمية واكتشاف المفاهيم العلمية بشكل عملي.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              نشجع الطلاب على التفكير النقدي والاستكشاف العلمي من خلال تجارب عملية موجهة وآمنة.
            </p>
            <div className="space-y-3 pt-4">
              <h3 className="font-bold text-foreground">ما نقدمه:</h3>
              <ul className="space-y-2">
                {[
                  "تجارب علمية متنوعة ومتقدمة",
                  "إشراف متخصص على جميع التجارب",
                  "معايير سلامة عالية",
                  "مشاريع بحثية للطلاب",
                  "مسابقات علمية وعروض تقديمية",
                  "ربط النظرية بالتطبيق العملي",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <Card className="p-12 bg-gradient-to-br from-green-500/5 to-emerald-500/5 mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">مشاريع الطلاب</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "تنقية المياه",
                description: "مشروع لتطوير نظام تنقية مياه بسيط وفعال",
                image: "/water-filtration-project.jpg",
              },
              {
                title: "الطاقة المتجددة",
                description: "دراسة وتطبيق مصادر الطاقة البديلة",
                image: "/renewable-energy-project.jpg",
              },
              {
                title: "الزراعة المائية",
                description: "تجربة الزراعة بدون تربة باستخدام المحاليل",
                image: "/placeholder.svg?height=300&width=400",
              },
            ].map((project, index) => (
              <div key={index} className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-foreground">{project.title}</h3>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Link href="/#contact">
            <Button size="lg">تواصل معنا للاستفسار</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
