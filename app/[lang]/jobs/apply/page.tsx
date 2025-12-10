"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { getJobPositions, saveEnhancedEmploymentApplication, type JobPosition, type EnhancedEmploymentApplication } from "@/lib/storage"
import { uploadFileToStorage } from "@/lib/firebase"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Briefcase, Upload, CheckCircle, FileText, Camera, User, GraduationCap, Clock, Building2, Plus, Trash2 } from "lucide-react"

export default function JobApplyPage() {
    const searchParams = useSearchParams()
    const jobId = searchParams.get("id")
    const { language } = useLanguage()
    const isAr = language === "ar"

    const [job, setJob] = React.useState<JobPosition | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [submitted, setSubmitted] = React.useState(false)
    const [submitting, setSubmitting] = React.useState(false)

    // Form state
    const [formData, setFormData] = React.useState({
        fullName: "",
        birthPlace: "",
        birthDate: "",
        nationalId: "",
        maritalStatus: "",
        gender: "",
        address: "",
        phone: "",
        email: "",
        expectedSalary: "",
        canStayOvernight: "",
    })

    const [education, setEducation] = React.useState([{
        degree: "",
        major: "",
        university: "",
        graduationYear: "",
        gpa: "",
    }])

    const [experience, setExperience] = React.useState([{
        institution: "",
        jobTitle: "",
        duration: "",
        responsibilities: "",
    }])

    const [coverLetter, setCoverLetter] = React.useState("")
    const [cvFile, setCvFile] = React.useState<File | null>(null)
    const [photoFile, setPhotoFile] = React.useState<File | null>(null)
    const [customFieldValues, setCustomFieldValues] = React.useState<Record<string, string>>({})
    const [customFieldFiles, setCustomFieldFiles] = React.useState<Record<string, File | null>>({})

    // Load job data
    React.useEffect(() => {
        const loadJob = async () => {
            if (!jobId) {
                setLoading(false)
                return
            }
            try {
                const jobs = await getJobPositions()
                const foundJob = jobs.find(j => j.id === jobId)
                setJob(foundJob || null)
            } catch (error) {
                console.error("Error loading job:", error)
            } finally {
                setLoading(false)
            }
        }
        loadJob()
    }, [jobId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!job) return

        setSubmitting(true)
        try {
            // Upload files to Firebase Storage
            let cvFileUrl: string | undefined
            let photoFileUrl: string | undefined

            if (cvFile) {
                const uploadResult = await uploadFileToStorage(cvFile, "jobs_apps_files")
                cvFileUrl = uploadResult.url
            }
            if (photoFile) {
                const uploadResult = await uploadFileToStorage(photoFile, "jobs_apps_files")
                photoFileUrl = uploadResult.url
            }

            // Upload custom field files and build responses
            const customFieldResponses: { fieldId: string; value: string; fileName?: string }[] = []
            if (job.customFields) {
                for (const field of job.customFields) {
                    if (field.type === "file") {
                        const file = customFieldFiles[field.id]
                        if (file) {
                            const uploadResult = await uploadFileToStorage(file, "jobs_apps_files")
                            customFieldResponses.push({
                                fieldId: field.id,
                                value: uploadResult.url,
                                fileName: file.name,
                            })
                        } else {
                            customFieldResponses.push({ fieldId: field.id, value: "" })
                        }
                    } else {
                        customFieldResponses.push({
                            fieldId: field.id,
                            value: customFieldValues[field.id] || "",
                        })
                    }
                }
            }

            const applicationData: Omit<EnhancedEmploymentApplication, "id" | "submittedAt" | "status"> = {
                fullName: formData.fullName,
                birthPlace: formData.birthPlace,
                birthDate: formData.birthDate,
                nationalId: formData.nationalId,
                maritalStatus: formData.maritalStatus,
                gender: formData.gender,
                address: formData.address,
                phone: formData.phone,
                email: formData.email,
                position: isAr ? job.title : job.titleEn,
                expectedSalary: formData.expectedSalary,
                canStayOvernight: formData.canStayOvernight,
                education: education.filter(e => e.degree || e.university),
                experience: experience.filter(e => e.institution || e.jobTitle),
                coverLetter: job.requiresCoverLetter ? coverLetter : undefined,
                cvFileName: cvFile?.name,
                cvFileUrl,
                photoFileName: photoFile?.name,
                photoFileUrl,
                customFieldResponses,
            }

            await saveEnhancedEmploymentApplication(applicationData)
            setSubmitted(true)
        } catch (error) {
            console.error("Failed to submit application:", error)
        } finally {
            setSubmitting(false)
        }
    }

    const updateFormData = (key: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }))
    }

    const addEducation = () => {
        setEducation(prev => [...prev, { degree: "", major: "", university: "", graduationYear: "", gpa: "" }])
    }

    const updateEducation = (index: number, key: string, value: string) => {
        setEducation(prev => prev.map((ed, i) => i === index ? { ...ed, [key]: value } : ed))
    }

    const removeEducation = (index: number) => {
        if (education.length > 1) {
            setEducation(prev => prev.filter((_, i) => i !== index))
        }
    }

    const addExperience = () => {
        setExperience(prev => [...prev, { institution: "", jobTitle: "", duration: "", responsibilities: "" }])
    }

    const updateExperience = (index: number, key: string, value: string) => {
        setExperience(prev => prev.map((ex, i) => i === index ? { ...ex, [key]: value } : ex))
    }

    const removeExperience = (index: number) => {
        if (experience.length > 1) {
            setExperience(prev => prev.filter((_, i) => i !== index))
        }
    }

    // Text labels
    const t = {
        pageTitle: isAr ? "طلب التوظيف" : "Job Application",
        applyingFor: isAr ? "التقديم على وظيفة" : "Applying for position",
        personalInfo: isAr ? "المعلومات الشخصية" : "Personal Information",
        fullName: isAr ? "الاسم الكامل" : "Full Name",
        birthPlace: isAr ? "مكان الميلاد" : "Birth Place",
        birthDate: isAr ? "تاريخ الميلاد" : "Birth Date",
        nationalId: isAr ? "رقم الهوية" : "National ID",
        maritalStatus: isAr ? "الحالة الاجتماعية" : "Marital Status",
        gender: isAr ? "الجنس" : "Gender",
        male: isAr ? "ذكر" : "Male",
        female: isAr ? "أنثى" : "Female",
        address: isAr ? "العنوان" : "Address",
        phone: isAr ? "رقم الجوال" : "Phone",
        email: isAr ? "البريد الإلكتروني" : "Email",
        expectedSalary: isAr ? "الراتب المتوقع" : "Expected Salary",
        canStayOvernight: isAr ? "هل يمكنك المبيت؟" : "Can you stay overnight?",
        yes: isAr ? "نعم" : "Yes",
        no: isAr ? "لا" : "No",
        education: isAr ? "المؤهلات العلمية" : "Education",
        degree: isAr ? "المؤهل" : "Degree",
        major: isAr ? "التخصص" : "Major",
        university: isAr ? "الجامعة/المعهد" : "University/Institute",
        graduationYear: isAr ? "سنة التخرج" : "Graduation Year",
        gpa: isAr ? "المعدل" : "GPA",
        addEducation: isAr ? "إضافة مؤهل" : "Add Education",
        remove: isAr ? "حذف" : "Remove",
        experienceLabel: isAr ? "الخبرات العملية" : "Work Experience",
        institution: isAr ? "جهة العمل" : "Institution",
        jobTitle: isAr ? "المسمى الوظيفي" : "Job Title",
        duration: isAr ? "المدة" : "Duration",
        responsibilities: isAr ? "المهام والمسؤوليات" : "Responsibilities",
        addExperience: isAr ? "إضافة خبرة" : "Add Experience",
        attachments: isAr ? "المرفقات" : "Attachments",
        cv: isAr ? "السيرة الذاتية" : "CV/Resume",
        coverLetterLabel: isAr ? "خطاب التقديم" : "Cover Letter",
        photo: isAr ? "الصورة الشخصية" : "Personal Photo",
        customFields: isAr ? "معلومات إضافية" : "Additional Information",
        submit: isAr ? "إرسال الطلب" : "Submit Application",
        submitting: isAr ? "جاري الإرسال..." : "Submitting...",
        successTitle: isAr ? "تم الإرسال بنجاح!" : "Application Submitted!",
        successMessage: isAr ? "شكراً لتقديمك. سنتواصل معك قريباً." : "Thank you for applying. We will contact you soon.",
        submitAnother: isAr ? "تقديم طلب آخر" : "Submit Another",
        single: isAr ? "أعزب" : "Single",
        married: isAr ? "متزوج" : "Married",
        jobNotFound: isAr ? "الوظيفة غير موجودة" : "Job Not Found",
        jobNotFoundDesc: isAr ? "عذراً، لم نتمكن من العثور على هذه الوظيفة." : "Sorry, we couldn't find this job posting.",
        noJobSelected: isAr ? "لم يتم تحديد وظيفة" : "No Job Selected",
        noJobSelectedDesc: isAr ? "يرجى اختيار وظيفة من قائمة الوظائف المتاحة." : "Please select a job from the available positions.",
    }

    // Loading state
    if (loading) {
        return (
            <LayoutWrapper>
                <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </LayoutWrapper>
        )
    }

    // No job ID or job not found
    if (!jobId || !job) {
        return (
            <LayoutWrapper>
                <div className="min-h-[60vh] flex items-center justify-center">
                    <Card className="p-12 text-center max-w-md" dir={isAr ? "rtl" : "ltr"}>
                        <Building2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold mb-2">
                            {!jobId ? t.noJobSelected : t.jobNotFound}
                        </h1>
                        <p className="text-muted-foreground">
                            {!jobId ? t.noJobSelectedDesc : t.jobNotFoundDesc}
                        </p>
                    </Card>
                </div>
            </LayoutWrapper>
        )
    }

    // Success state
    if (submitted) {
        return (
            <LayoutWrapper>
                <div className="min-h-[60vh] flex items-center justify-center">
                    <Card className="p-12 text-center max-w-md" dir={isAr ? "rtl" : "ltr"}>
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-green-700 mb-2">{t.successTitle}</h1>
                        <p className="text-muted-foreground mb-6">{t.successMessage}</p>
                        <Button onClick={() => {
                            setSubmitted(false)
                            setFormData({
                                fullName: "", birthPlace: "", birthDate: "", nationalId: "",
                                maritalStatus: "", gender: "", address: "", phone: "",
                                email: "", expectedSalary: "", canStayOvernight: "",
                            })
                            setEducation([{ degree: "", major: "", university: "", graduationYear: "", gpa: "" }])
                            setExperience([{ institution: "", jobTitle: "", duration: "", responsibilities: "" }])
                            setCoverLetter("")
                            setCvFile(null)
                            setPhotoFile(null)
                            setCustomFieldValues({})
                            setCustomFieldFiles({})
                        }}>
                            {t.submitAnother}
                        </Button>
                    </Card>
                </div>
            </LayoutWrapper>
        )
    }

    const jobTitle = isAr ? job.title : job.titleEn
    const jobType = isAr ? job.type : job.typeEn

    return (
        <LayoutWrapper>
            <main className="min-h-screen bg-background" dir={isAr ? "rtl" : "ltr"}>
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
                                <Briefcase className="w-10 h-10 text-primary" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.pageTitle}</h1>
                            <p className="text-xl text-muted-foreground mb-2">{t.applyingFor}</p>
                            <div className="inline-flex items-center gap-3 bg-card px-6 py-3 rounded-full border shadow-sm">
                                <span className="text-2xl font-bold text-primary">{jobTitle}</span>
                                <span className="px-3 py-1 bg-cyan-500/10 text-cyan-600 rounded-full text-sm font-medium">
                                    {jobType}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Form Section */}
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
                            {/* Personal Information */}
                            <Card className="p-6 md:p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                                        <User className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                                    </div>
                                    <h2 className="text-xl font-semibold">{t.personalInfo}</h2>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="font-semibold">{t.fullName} <span className="text-rose-500">*</span></Label>
                                        <Input value={formData.fullName} onChange={(e) => updateFormData("fullName", e.target.value)} required className="h-12 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 bg-white dark:bg-slate-800/80 transition-all duration-300" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-semibold">{t.nationalId} <span className="text-rose-500">*</span></Label>
                                        <Input value={formData.nationalId} onChange={(e) => updateFormData("nationalId", e.target.value)} required className="h-12 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 bg-white dark:bg-slate-800/80 transition-all duration-300" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-semibold">{t.birthPlace}</Label>
                                        <Input value={formData.birthPlace} onChange={(e) => updateFormData("birthPlace", e.target.value)} className="h-12 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 bg-white dark:bg-slate-800/80 transition-all duration-300" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-semibold">{t.birthDate}</Label>
                                        <Input type="date" value={formData.birthDate} onChange={(e) => updateFormData("birthDate", e.target.value)} className="h-12 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 bg-white dark:bg-slate-800/80 transition-all duration-300" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-semibold">{t.gender} <span className="text-rose-500">*</span></Label>
                                        <RadioGroup value={formData.gender} onValueChange={(v) => updateFormData("gender", v)} className="flex gap-4 pt-2">
                                            <div className="flex items-center gap-2">
                                                <RadioGroupItem value="male" id="gender-male" className="border-slate-300 text-pink-500 focus:ring-pink-500/20" />
                                                <Label htmlFor="gender-male" className="font-normal cursor-pointer">{t.male}</Label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <RadioGroupItem value="female" id="gender-female" className="border-slate-300 text-pink-500 focus:ring-pink-500/20" />
                                                <Label htmlFor="gender-female" className="font-normal cursor-pointer">{t.female}</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-semibold">{t.maritalStatus}</Label>
                                        <Select value={formData.maritalStatus} onValueChange={(v) => updateFormData("maritalStatus", v)}>
                                            <SelectTrigger className="h-12 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 bg-white dark:bg-slate-800/80 transition-all duration-300">
                                                <SelectValue placeholder={t.maritalStatus} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="single">{t.single}</SelectItem>
                                                <SelectItem value="married">{t.married}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label className="font-semibold">{t.address}</Label>
                                        <Input value={formData.address} onChange={(e) => updateFormData("address", e.target.value)} className="h-12 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 bg-white dark:bg-slate-800/80 transition-all duration-300" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-semibold">{t.phone} <span className="text-rose-500">*</span></Label>
                                        <Input type="tel" value={formData.phone} onChange={(e) => updateFormData("phone", e.target.value)} required className="h-12 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 bg-white dark:bg-slate-800/80 transition-all duration-300" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-semibold">{t.email}</Label>
                                        <Input type="email" value={formData.email} onChange={(e) => updateFormData("email", e.target.value)} className="h-12 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 bg-white dark:bg-slate-800/80 transition-all duration-300" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-semibold">{t.expectedSalary}</Label>
                                        <Input value={formData.expectedSalary} onChange={(e) => updateFormData("expectedSalary", e.target.value)} className="h-12 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 bg-white dark:bg-slate-800/80 transition-all duration-300" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-semibold">{t.canStayOvernight}</Label>
                                        <RadioGroup value={formData.canStayOvernight} onValueChange={(v) => updateFormData("canStayOvernight", v)} className="flex gap-4 pt-2">
                                            <div className="flex items-center gap-2">
                                                <RadioGroupItem value="yes" id="overnight-yes" className="border-slate-300 text-pink-500 focus:ring-pink-500/20" />
                                                <Label htmlFor="overnight-yes" className="font-normal cursor-pointer">{t.yes}</Label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <RadioGroupItem value="no" id="overnight-no" className="border-slate-300 text-pink-500 focus:ring-pink-500/20" />
                                                <Label htmlFor="overnight-no" className="font-normal cursor-pointer">{t.no}</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </div>
                            </Card>

                            {/* Education */}
                            <Card className="p-6 md:p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center">
                                            <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <h2 className="text-xl font-semibold">{t.education}</h2>
                                    </div>
                                    <Button type="button" variant="outline" size="sm" onClick={addEducation} className="gap-2 rounded-xl hover:border-pink-400 hover:text-pink-600">
                                        <Plus className="w-4 h-4" />
                                        {t.addEducation}
                                    </Button>
                                </div>
                                <div className="space-y-6">
                                    {education.map((ed, index) => (
                                        <div key={index} className="grid md:grid-cols-2 gap-4 p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl relative border border-slate-100 dark:border-slate-700/50">
                                            {education.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute top-2 left-2 h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    onClick={() => removeEducation(index)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                            <div className="space-y-2">
                                                <Label className="font-semibold">{t.degree}</Label>
                                                <Input value={ed.degree} onChange={(e) => updateEducation(index, "degree", e.target.value)} className="h-12 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 bg-white dark:bg-slate-800/80 transition-all duration-300" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-semibold">{t.major}</Label>
                                                <Input value={ed.major} onChange={(e) => updateEducation(index, "major", e.target.value)} className="h-12 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 bg-white dark:bg-slate-800/80 transition-all duration-300" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-semibold">{t.university}</Label>
                                                <Input value={ed.university} onChange={(e) => updateEducation(index, "university", e.target.value)} className="h-12 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 bg-white dark:bg-slate-800/80 transition-all duration-300" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-semibold">{t.graduationYear}</Label>
                                                <Input value={ed.graduationYear} onChange={(e) => updateEducation(index, "graduationYear", e.target.value)} className="h-12 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 bg-white dark:bg-slate-800/80 transition-all duration-300" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-semibold">{t.gpa}</Label>
                                                <Input value={ed.gpa} onChange={(e) => updateEducation(index, "gpa", e.target.value)} className="h-12 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 bg-white dark:bg-slate-800/80 transition-all duration-300" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Experience */}
                            <Card className="p-6 md:p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <h2 className="text-xl font-semibold">{t.experienceLabel}</h2>
                                    </div>
                                    <Button type="button" variant="outline" size="sm" onClick={addExperience} className="gap-2 rounded-xl hover:border-pink-400 hover:text-pink-600">
                                        <Plus className="w-4 h-4" />
                                        {t.addExperience}
                                    </Button>
                                </div>
                                <div className="space-y-6">
                                    {experience.map((ex, index) => (
                                        <div key={index} className="grid md:grid-cols-2 gap-4 p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl relative border border-slate-100 dark:border-slate-700/50">
                                            {experience.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute top-2 left-2 h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    onClick={() => removeExperience(index)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                            <div className="space-y-2">
                                                <Label className="font-semibold">{t.institution}</Label>
                                                <Input value={ex.institution} onChange={(e) => updateExperience(index, "institution", e.target.value)} className="h-12 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 bg-white dark:bg-slate-800/80 transition-all duration-300" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-semibold">{t.jobTitle}</Label>
                                                <Input value={ex.jobTitle} onChange={(e) => updateExperience(index, "jobTitle", e.target.value)} className="h-12 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 bg-white dark:bg-slate-800/80 transition-all duration-300" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-semibold">{t.duration}</Label>
                                                <Input value={ex.duration} onChange={(e) => updateExperience(index, "duration", e.target.value)} className="h-12 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 bg-white dark:bg-slate-800/80 transition-all duration-300" />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <Label className="font-semibold">{t.responsibilities}</Label>
                                                <Textarea value={ex.responsibilities} onChange={(e) => updateExperience(index, "responsibilities", e.target.value)} rows={2} className="rounded-xl border border-slate-200 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 bg-white dark:bg-slate-800/80 transition-all duration-300 resize-none" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Attachments - Only show if job requires them */}
                            {(job.requiresCv || job.requiresCoverLetter || job.requiresPhoto) && (
                                <Card className="p-6 md:p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                                            <Upload className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <h2 className="text-xl font-semibold">{t.attachments}</h2>
                                    </div>
                                    <div className="space-y-4">
                                        {job.requiresCv && (
                                            <div className="space-y-2">
                                                <Label className="flex items-center gap-2 font-semibold">
                                                    <FileText className="w-4 h-4" />
                                                    {t.cv} <span className="text-rose-500">*</span>
                                                </Label>
                                                <Input
                                                    type="file"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                                                    required
                                                    className="cursor-pointer h-12 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 bg-white dark:bg-slate-800/80 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                                                />
                                            </div>
                                        )}
                                        {job.requiresCoverLetter && (
                                            <div className="space-y-2">
                                                <Label className="font-semibold">{t.coverLetterLabel} <span className="text-rose-500">*</span></Label>
                                                <Textarea
                                                    value={coverLetter}
                                                    onChange={(e) => setCoverLetter(e.target.value)}
                                                    rows={5}
                                                    required
                                                    className="rounded-xl border border-slate-200 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 bg-white dark:bg-slate-800/80 transition-all duration-300 resize-none"
                                                />
                                            </div>
                                        )}
                                        {job.requiresPhoto && (
                                            <div className="space-y-2">
                                                <Label className="flex items-center gap-2 font-semibold">
                                                    <Camera className="w-4 h-4" />
                                                    {t.photo} <span className="text-rose-500">*</span>
                                                </Label>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                                                    required
                                                    className="cursor-pointer h-12 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 bg-white dark:bg-slate-800/80 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            )}

                            {/* Custom Fields */}
                            {job.customFields && job.customFields.length > 0 && (
                                <Card className="p-6 md:p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-xl flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <h2 className="text-xl font-semibold">{t.customFields}</h2>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {job.customFields.sort((a, b) => a.order - b.order).map((field) => {
                                            const label = isAr ? field.labelAr : field.labelEn
                                            const placeholder = isAr ? field.placeholder : (field.placeholderEn || field.placeholder)

                                            return (
                                                <div key={field.id} className={`space-y-2 ${field.type === "textarea" ? "md:col-span-2" : ""}`}>
                                                    <Label className="font-semibold">
                                                        {label}
                                                        {field.required && <span className="text-rose-500 mx-1">*</span>}
                                                    </Label>
                                                    {field.type === "textarea" ? (
                                                        <Textarea
                                                            value={customFieldValues[field.id] || ""}
                                                            onChange={(e) => setCustomFieldValues(prev => ({ ...prev, [field.id]: e.target.value }))}
                                                            placeholder={placeholder}
                                                            required={field.required}
                                                            rows={3}
                                                            className="rounded-xl border border-slate-200 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 bg-white dark:bg-slate-800/80 transition-all duration-300 resize-none"
                                                        />
                                                    ) : field.type === "select" && field.options ? (
                                                        <Select
                                                            value={customFieldValues[field.id] || ""}
                                                            onValueChange={(v) => setCustomFieldValues(prev => ({ ...prev, [field.id]: v }))}
                                                        >
                                                            <SelectTrigger className="h-12 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 bg-white dark:bg-slate-800/80 transition-all duration-300">
                                                                <SelectValue placeholder={placeholder} />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {field.options.map((opt, i) => (
                                                                    <SelectItem key={i} value={isAr ? opt.valueAr : opt.valueEn}>
                                                                        {isAr ? opt.valueAr : opt.valueEn}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    ) : field.type === "file" ? (
                                                        <div className="space-y-2">
                                                            <Input
                                                                type="file"
                                                                onChange={(e) => setCustomFieldFiles(prev => ({ ...prev, [field.id]: e.target.files?.[0] || null }))}
                                                                required={field.required}
                                                                className="cursor-pointer h-12 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 bg-white dark:bg-slate-800/80 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                                                            />
                                                            {customFieldFiles[field.id] && (
                                                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                                                    <Upload className="w-4 h-4" />
                                                                    {customFieldFiles[field.id]?.name}
                                                                </p>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <Input
                                                            type={field.type === "email" ? "email" : field.type === "phone" ? "tel" : field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                                                            value={customFieldValues[field.id] || ""}
                                                            onChange={(e) => setCustomFieldValues(prev => ({ ...prev, [field.id]: e.target.value }))}
                                                            placeholder={placeholder}
                                                            required={field.required}
                                                            className="h-12 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 bg-white dark:bg-slate-800/80 transition-all duration-300"
                                                        />
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </Card>
                            )}

                            {/* Submit Button */}
                            <div className="flex justify-center pt-4">
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="px-16 py-7 text-lg font-bold rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 hover:shadow-xl hover:shadow-pink-500/25 transition-all duration-500 relative overflow-hidden group"
                                    disabled={submitting}
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                                    <span className="relative">
                                        {submitting ? t.submitting : t.submit}
                                    </span>
                                </Button>
                            </div>
                        </form>
                    </div>
                </section>
            </main>
        </LayoutWrapper>
    )
}
