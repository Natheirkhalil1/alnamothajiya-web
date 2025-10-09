import Link from "next/link"
import { ArrowRight, Stethoscope, Heart, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function MedicalDepartmentPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-500 to-pink-500 text-white py-20">
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
              <Stethoscope className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-balance">القسم الطبي</h1>
          </div>
          <p className="text-xl text-white/90 max-w-2xl leading-relaxed text-pretty">
            رعاية صحية شاملة لطلابنا مع فريق طبي متخصص ومرافق حديثة
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Heart,
              title: "الفحوصات الدورية",
              description: "فحوصات طبية دورية شاملة لجميع الطلاب للتأكد من سلامتهم الصحية",
            },
            {
              icon: Shield,
              title: "الإسعافات الأولية",
              description: "خدمات إسعافات أولية فورية لأي حالة طارئة خلال اليوم الدراسي",
            },
            {
              icon: Users,
              title: "التوعية الصحية",
              description: "برامج توعية صحية للطلاب وأولياء الأمور حول الصحة والوقاية",
            },
          ].map((service, index) => (
            <Card key={index} className="p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <service.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{service.description}</p>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-3xl blur-2xl" />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img src="/school-medical-clinic-interior.jpg" alt="القسم الطبي" className="w-full h-auto" />
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">عن القسم الطبي</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              يوفر القسم الطبي في المدرسة النموذجية رعاية صحية شاملة لجميع الطلاب، مع التركيز على الوقاية والعلاج
              المبكر.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              نمتلك عيادة طبية مجهزة بأحدث المعدات الطبية، ويشرف عليها فريق طبي متخصص متواجد طوال اليوم الدراسي.
            </p>
            <div className="space-y-3 pt-4">
              <h3 className="font-bold text-foreground">خدماتنا تشمل:</h3>
              <ul className="space-y-2">
                {[
                  "فحوصات طبية دورية شاملة",
                  "متابعة الحالات المزمنة",
                  "برامج التطعيم والتحصين",
                  "الإسعافات الأولية الفورية",
                  "استشارات طبية لأولياء الأمور",
                  "ملفات صحية إلكترونية",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <Card className="p-12 bg-gradient-to-br from-red-500/5 to-pink-500/5">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">الفريق الطبي</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "د. أحمد محمود", role: "طبيب عام", image: "/male-doctor.png" },
              { name: "د. سارة علي", role: "ممرضة", image: "/female-nurse.png" },
              { name: "د. خالد حسن", role: "أخصائي تغذية", image: "/male-nutritionist.jpg" },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-bold text-foreground">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link href="/#contact">
            <Button size="lg">تواصل معنا للاستفسار</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
