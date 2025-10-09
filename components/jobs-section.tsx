"use client"

import Link from "next/link"
import { Briefcase, Users, ClipboardList, ArrowLeft, ArrowRight, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { getServiceContents } from "@/lib/storage"
import { useEffect, useState } from "react"

export function JobsSection() {
  const { language, t } = useLanguage()
  const [services, setServices] = useState<any[]>([])

  useEffect(() => {
    const loadedServices = getServiceContents()
    const mappedServices = loadedServices.map((service) => ({
      icon: service.type === "education" ? ClipboardList : service.type === "training" ? Briefcase : Users,
      titleAr: service.titleAr,
      titleEn: service.titleEn,
      descriptionAr: service.descriptionAr,
      descriptionEn: service.descriptionEn,
      link: `/jobs/${service.type === "education" ? "service-request" : service.type}`,
      gradient:
        service.type === "education"
          ? "from-emerald-500 via-teal-500 to-cyan-500"
          : service.type === "training"
            ? "from-green-500 via-emerald-500 to-teal-500"
            : "from-purple-500 via-pink-500 to-rose-500",
    }))
    setServices(mappedServices)
  }, [])

  const ArrowIcon = language === "ar" ? ArrowLeft : ArrowRight

  return (
    <section
      id="jobs"
      className="relative py-24 bg-gradient-to-b from-background via-muted/30 to-background overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-primary/3 to-accent/3 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-full mb-6 border border-primary/20 backdrop-blur-sm shadow-lg animate-shimmer">
            <Briefcase className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t.jobs.title}
            </span>
            <Sparkles className="w-4 h-4 text-accent animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground bg-clip-text text-transparent">
              {t.jobs.subtitle}
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
            {language === "ar"
              ? "خدماتنا التعليمية وفرص العمل المتاحة"
              : "Our educational services and available job opportunities"}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <Card
              key={index}
              className="relative p-8 hover:shadow-2xl transition-all duration-500 group border-border/50 bg-card/50 backdrop-blur-sm hover:-translate-y-4 hover:scale-[1.02] overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-[100px]" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tr-[100px]" />

              <div className="space-y-6 relative z-10">
                <div className="relative">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 animate-pulse-slow`}
                  />
                  <div
                    className={`relative w-20 h-20 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-xl`}
                  >
                    <service.icon className="w-10 h-10 text-white drop-shadow-lg" />
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {language === "ar" ? service.titleAr : service.titleEn}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6 group-hover:text-foreground/80 transition-colors duration-300">
                    {language === "ar" ? service.descriptionAr : service.descriptionEn}
                  </p>
                </div>

                <Link href={service.link}>
                  <Button
                    className={`w-full group/btn relative overflow-hidden bg-gradient-to-r ${service.gradient} hover:shadow-xl hover:shadow-primary/25 transition-all duration-500 h-12 text-base font-semibold`}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000" />
                    <span className="relative">{t.jobs.learnMore}</span>
                    <ArrowIcon
                      className={`relative w-5 h-5 ${language === "ar" ? "mr-2" : "ml-2"} group-hover/btn:${language === "ar" ? "-translate-x-2" : "translate-x-2"} transition-transform duration-300`}
                    />
                  </Button>
                </Link>
              </div>

              <div className="absolute top-0 left-0 w-0 h-1 bg-gradient-to-r from-primary via-accent to-primary group-hover:w-full transition-all duration-700" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
