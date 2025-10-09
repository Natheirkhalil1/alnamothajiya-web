import Link from "next/link"
import { ArrowRight, Calculator, Atom, Microscope, FlaskConical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function ScienceDepartmentPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white py-20">
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
              <Calculator className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-balance">القسم العلمي</h1>
          </div>
          <p className="text-xl text-white/90 max-w-2xl leading-relaxed text-pretty">
            تعليم متميز في العلوم والرياضيات مع مختبرات حديثة وبرامج متقدمة
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Subjects Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {[
            { icon: Calculator, title: "الرياضيات", color: "from-blue-500 to-blue-600" },
            { icon: Atom, title: "الفيزياء", color: "from-cyan-500 to-cyan-600" },
            { icon: FlaskConical, title: "الكيمياء", color: "from-teal-500 to-teal-600" },
            { icon: Microscope, title: "الأحياء", color: "from-green-500 to-green-600" },
          ].map((subject, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-xl transition-shadow group">
              <div
                className={`w-16 h-16 bg-gradient-to-br ${subject.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
              >
                <subject.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground">{subject.title}</h3>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">عن القسم العلمي</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              يقدم القسم العلمي برامج تعليمية متقدمة في الرياضيات والعلوم، مع التركيز على تنمية مهارات التفكير العلمي
              والتحليلي.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              نوفر مختبرات علمية حديثة مجهزة بأحدث الأدوات والتقنيات، مما يتيح للطلاب إجراء تجارب عملية متقدمة.
            </p>
            <div className="space-y-3 pt-4">
              <h3 className="font-bold text-foreground">مميزات القسم:</h3>
              <ul className="space-y-2">
                {[
                  "مناهج علمية متطورة ومحدثة",
                  "مختبرات مجهزة بأحدث التقنيات",
                  "معلمون متخصصون وذوو خبرة",
                  "مشاريع بحثية ومسابقات علمية",
                  "برامج إثرائية للطلاب المتميزين",
                  "ربط العلوم بالحياة العملية",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl blur-2xl" />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img src="/modern-science-laboratory.jpg" alt="القسم العلمي" className="w-full h-auto" />
            </div>
          </div>
        </div>

        {/* Achievements */}
        <Card className="p-12 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">إنجازاتنا</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { number: "15+", label: "جائزة علمية" },
              { number: "95%", label: "نسبة النجاح" },
              { number: "50+", label: "مشروع بحثي" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
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
