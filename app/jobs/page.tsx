"use client"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { useLanguage } from "@/lib/language-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Briefcase,
  ClipboardList,
  ArrowRight,
  ArrowLeft,
  Users,
  Award,
  TrendingUp,
  Heart,
  Star,
  Sparkles,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
} from "lucide-react"

export default function JobsPage() {
  const { language } = useLanguage()
  const ArrowIcon = language === "ar" ? ArrowLeft : ArrowRight

  const benefits = [
    {
      icon: Heart,
      titleAr: "بيئة عمل محفزة",
      titleEn: "Motivating Work Environment",
      descAr: "نوفر بيئة عمل إيجابية تشجع على الإبداع والتطور",
      descEn: "We provide a positive work environment that encourages creativity and development",
      gradient: "from-rose-500 to-pink-500",
    },
    {
      icon: TrendingUp,
      titleAr: "فرص التطور المهني",
      titleEn: "Professional Development",
      descAr: "برامج تدريب مستمرة لتطوير مهاراتك وقدراتك",
      descEn: "Continuous training programs to develop your skills and abilities",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Award,
      titleAr: "مكافآت تنافسية",
      titleEn: "Competitive Rewards",
      descAr: "رواتب ومزايا تنافسية تقدر جهودك وإنجازاتك",
      descEn: "Competitive salaries and benefits that value your efforts and achievements",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: Users,
      titleAr: "فريق متميز",
      titleEn: "Distinguished Team",
      descAr: "انضم إلى فريق من المحترفين المتميزين في مجالهم",
      descEn: "Join a team of distinguished professionals in their field",
      gradient: "from-purple-500 to-indigo-500",
    },
  ]

  return (
    <LayoutWrapper>
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
        </div>

        <div className="relative h-full flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md rounded-full mb-8 border border-white/30 animate-in fade-in slide-in-from-top duration-700">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="text-sm font-bold text-white">
                {language === "ar" ? "انضم إلى عائلتنا" : "Join Our Family"}
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 text-balance drop-shadow-2xl animate-in fade-in slide-in-from-bottom duration-700 delay-100">
              {language === "ar" ? "الوظائف والخدمات" : "Jobs & Services"}
            </h1>

            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto text-pretty mb-12 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
              {language === "ar"
                ? "نبحث عن المواهب المتميزة للانضمام إلى فريقنا، ونقدم خدمات تعليمية وتأهيلية متميزة"
                : "We are looking for distinguished talents to join our team, and we provide excellent educational and rehabilitation services"}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
              <div className="flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                <Phone className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">4122002 / 4122003</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                <Mail className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">info@namothajia.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse delay-700" />
      </section>

      {/* Main Content */}
      <section className="py-20 bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="container mx-auto px-4">
          {/* Benefits Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 rounded-full mb-4">
                <Star className="w-5 h-5 text-primary" />
                <span className="text-sm font-bold text-primary">
                  {language === "ar" ? "لماذا تنضم إلينا" : "Why Join Us"}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {language === "ar" ? "مزايا العمل معنا" : "Benefits of Working With Us"}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {language === "ar"
                  ? "نوفر بيئة عمل مثالية تساعدك على النمو والتطور المهني"
                  : "We provide an ideal work environment that helps you grow and develop professionally"}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {benefits.map((benefit, index) => (
                <Card
                  key={index}
                  className="p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-card/50 backdrop-blur-sm border-2 border-border/50 hover:border-primary/50 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${benefit.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                  >
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {language === "ar" ? benefit.titleAr : benefit.titleEn}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {language === "ar" ? benefit.descAr : benefit.descEn}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* Main Cards */}
          <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {/* Employment Card */}
            <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-border/50 hover:border-primary/50">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-10">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Briefcase className="w-10 h-10 text-white" />
                </div>

                <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                  {language === "ar" ? "طلب التوظيف" : "Employment Application"}
                </h2>

                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  {language === "ar"
                    ? "هل تبحث عن فرصة عمل مميزة؟ انضم إلى فريقنا المتميز وكن جزءاً من رؤيتنا التعليمية"
                    : "Looking for a distinguished job opportunity? Join our distinguished team and be part of our educational vision"}
                </p>

                <div className="space-y-3 mb-8">
                  {[
                    language === "ar" ? "وظائف متنوعة في مجالات مختلفة" : "Various jobs in different fields",
                    language === "ar" ? "رواتب تنافسية ومزايا إضافية" : "Competitive salaries and additional benefits",
                    language === "ar" ? "فرص تطوير وتدريب مستمرة" : "Continuous development and training opportunities",
                    language === "ar" ? "بيئة عمل محفزة وداعمة" : "Motivating and supportive work environment",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3 group/item">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-muted-foreground group-hover/item:text-foreground transition-colors">{item}</p>
                    </div>
                  ))}
                </div>

                <Link href="/jobs/employment">
                  <Button
                    size="lg"
                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] hover:bg-right transition-all duration-500 shadow-lg hover:shadow-xl group-hover:scale-105"
                  >
                    {language === "ar" ? "تقديم طلب توظيف" : "Submit Employment Application"}
                    <ArrowIcon className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Service Request Card */}
            <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-border/50 hover:border-accent/50">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-10">
                <div className="w-20 h-20 bg-gradient-to-br from-accent to-primary rounded-3xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <ClipboardList className="w-10 h-10 text-white" />
                </div>

                <h2 className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-4">
                  {language === "ar" ? "طلب الخدمة" : "Service Request"}
                </h2>

                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  {language === "ar"
                    ? "نقدم خدمات تعليمية وتأهيلية متميزة لذوي الاحتياجات الخاصة. قدم طلبك الآن"
                    : "We provide distinguished educational and rehabilitation services for people with special needs. Submit your request now"}
                </p>

                <div className="space-y-3 mb-8">
                  {[
                    language === "ar"
                      ? "خدمات تعليمية وتأهيلية شاملة"
                      : "Comprehensive educational and rehabilitation services",
                    language === "ar" ? "فريق متخصص ومؤهل" : "Specialized and qualified team",
                    language === "ar" ? "برامج فردية مخصصة" : "Customized individual programs",
                    language === "ar" ? "متابعة مستمرة وتقييم دوري" : "Continuous follow-up and periodic evaluation",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3 group/item">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-muted-foreground group-hover/item:text-foreground transition-colors">{item}</p>
                    </div>
                  ))}
                </div>

                <Link href="/jobs/service-request">
                  <Button
                    size="lg"
                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-accent via-primary to-accent bg-[length:200%_100%] hover:bg-right transition-all duration-500 shadow-lg hover:shadow-xl group-hover:scale-105"
                  >
                    {language === "ar" ? "تقديم طلب خدمة" : "Submit Service Request"}
                    <ArrowIcon className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Contact Info */}
          <Card className="mt-16 p-10 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 border-2 border-primary/20 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-foreground mb-2">
                {language === "ar" ? "هل لديك استفسار؟" : "Have a Question?"}
              </h3>
              <p className="text-lg text-muted-foreground">
                {language === "ar" ? "نحن هنا لمساعدتك. تواصل معنا الآن" : "We are here to help you. Contact us now"}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Phone,
                  title: language === "ar" ? "الهاتف" : "Phone",
                  value: "4122002 / 4122003",
                  gradient: "from-blue-500 to-cyan-500",
                },
                {
                  icon: Mail,
                  title: language === "ar" ? "البريد الإلكتروني" : "Email",
                  value: "info@namothajia.com",
                  gradient: "from-purple-500 to-pink-500",
                },
                {
                  icon: MapPin,
                  title: language === "ar" ? "العنوان" : "Address",
                  value:
                    language === "ar"
                      ? "عمان - طريق المطار - ضاحية الأمير علي"
                      : "Amman - Airport Road - Prince Ali District",
                  gradient: "from-orange-500 to-red-500",
                },
              ].map((contact, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${contact.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <contact.icon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="font-bold text-foreground mb-2">{contact.title}</h4>
                  <p className="text-sm text-muted-foreground">{contact.value}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </LayoutWrapper>
  )
}
