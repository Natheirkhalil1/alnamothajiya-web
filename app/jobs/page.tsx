"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { getJobPositions, type JobPosition } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Briefcase, Clock, Users, Calendar, ArrowRight, Building2, Timer } from "lucide-react"

export default function JobsPage() {
  const { language } = useLanguage()
  const [jobs, setJobs] = useState<JobPosition[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load jobs from localStorage
    const loadJobs = () => {
      const jobsData = getJobPositions()
      setJobs(jobsData)
      setLoading(false)
    }

    loadJobs()

    // Listen for storage changes to update in real-time
    const handleStorageChange = (e: CustomEvent) => {
      if (e.detail.key === "jobPositions") {
        loadJobs()
      }
    }

    window.addEventListener("localStorageChange" as any, handleStorageChange)

    return () => {
      window.removeEventListener("localStorageChange" as any, handleStorageChange)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
              <Briefcase className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              {language === "ar" ? "فرص التوظيف" : "Employment Opportunities"}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {language === "ar"
                ? "انضم إلى فريقنا التعليمي المتميز وكن جزءاً من رسالتنا في تقديم تعليم نوعي"
                : "Join our distinguished educational team and be part of our mission to provide quality education"}
            </p>
          </div>
        </div>
      </section>

      {/* Jobs Listing */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {jobs.length === 0 ? (
            <Card className="p-12 text-center">
              <Building2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">
                {language === "ar" ? "لا توجد وظائف متاحة حالياً" : "No Jobs Available Currently"}
              </h3>
              <p className="text-muted-foreground">
                {language === "ar"
                  ? "يرجى المراجعة لاحقاً للاطلاع على الفرص الجديدة"
                  : "Please check back later for new opportunities"}
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">{language === "ar" ? "الوظائف المتاحة" : "Available Positions"}</h2>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {jobs.length} {language === "ar" ? "وظيفة" : "Jobs"}
                </Badge>
              </div>

              <div className="grid gap-6">
                {jobs.map((job) => (
                  <Card
                    key={job.id}
                    className="p-6 hover:shadow-xl transition-all duration-300 border-2 hover:border-cyan-500/50"
                  >
                    <div className="space-y-4">
                      {/* Job Header */}
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-[200px]">
                          <h3 className="text-2xl font-bold mb-2">{language === "ar" ? job.title : job.titleEn}</h3>
                          <Badge className="bg-cyan-500/10 text-cyan-600 hover:bg-cyan-500/20 text-base px-3 py-1">
                            {language === "ar" ? job.type : job.typeEn}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(job.createdAt).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Job Description */}
                      {(job.description || job.descriptionEn) && (
                        <div className="bg-muted/30 rounded-lg p-4">
                          <p className="text-muted-foreground leading-relaxed">
                            {language === "ar" ? job.description : job.descriptionEn}
                          </p>
                        </div>
                      )}

                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                        {job.workShift && (
                          <div className="flex items-center gap-3 bg-blue-500/5 rounded-lg p-3">
                            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Clock className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs text-muted-foreground mb-1">
                                {language === "ar" ? "فترة الدوام" : "Work Shift"}
                              </p>
                              <p className="font-semibold text-sm truncate">
                                {language === "ar" ? job.workShift : job.workShiftEn}
                              </p>
                            </div>
                          </div>
                        )}

                        {job.workDuration && (
                          <div className="flex items-center gap-3 bg-green-500/5 rounded-lg p-3">
                            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Timer className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs text-muted-foreground mb-1">
                                {language === "ar" ? "مدة الدوام" : "Duration"}
                              </p>
                              <p className="font-semibold text-sm truncate">
                                {language === "ar" ? job.workDuration : job.workDurationEn}
                              </p>
                            </div>
                          </div>
                        )}

                        {job.gender && (
                          <div className="flex items-center gap-3 bg-purple-500/5 rounded-lg p-3">
                            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Users className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs text-muted-foreground mb-1">
                                {language === "ar" ? "الجنس المطلوب" : "Required Gender"}
                              </p>
                              <p className="font-semibold text-sm truncate">
                                {language === "ar" ? job.gender : job.genderEn}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-3 bg-cyan-500/5 rounded-lg p-3">
                          <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-5 h-5 text-cyan-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-muted-foreground mb-1">
                              {language === "ar" ? "نوع الوظيفة" : "Job Type"}
                            </p>
                            <p className="font-semibold text-sm truncate">
                              {language === "ar" ? job.type : job.typeEn}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Apply Button */}
                      <div className="pt-4">
                        <Link href="/jobs/employment">
                          <Button
                            size="lg"
                            className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                          >
                            {language === "ar" ? "تقديم طلب التوظيف" : "Apply Now"}
                            <ArrowRight className={`w-5 h-5 ${language === "ar" ? "mr-2" : "ml-2"}`} />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            {language === "ar" ? "لم تجد الوظيفة المناسبة؟" : "Didn't Find the Right Job?"}
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            {language === "ar"
              ? "يمكنك إرسال سيرتك الذاتية وسنتواصل معك عند توفر فرصة مناسبة"
              : "You can send your CV and we'll contact you when a suitable opportunity arises"}
          </p>
          <Link href="/jobs/employment">
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
              {language === "ar" ? "إرسال السيرة الذاتية" : "Send Your CV"}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
