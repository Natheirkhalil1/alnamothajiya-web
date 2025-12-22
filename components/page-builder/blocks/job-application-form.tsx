import * as React from "react"
import { Block } from "../types"
import { InputField, TextareaField, StylingGroup, applyBlockStyles, SectionContainer } from "../utils"
import { Briefcase, Upload, CheckCircle, FileText, Camera, User, Mail, Phone, MapPin, Calendar, DollarSign, Building2 } from "lucide-react"
import { useEditingLanguage } from "../editing-language-context"
import { useLanguage } from "@/lib/language-context"
import { getJobPositions, saveEnhancedEmploymentApplication, type JobPosition, type EnhancedEmploymentApplication } from "@/lib/storage"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Block type definition
export interface JobApplicationFormBlock extends Block {
    kind: "job-application-form"
    jobId?: string
    header?: {
        title?: string
        titleEn?: string
        description?: string
        descriptionEn?: string
    }
    submitButtonText?: string
    submitButtonTextEn?: string
    successMessage?: string
    successMessageEn?: string
    showAllJobs?: boolean // If true, show job selector. If false, use specific jobId
    blockStyles?: any
}

export function JobApplicationFormEditor({ block, onChange }: { block: JobApplicationFormBlock; onChange: (b: Block) => void }) {
    const { editingLanguage } = useEditingLanguage()
    const isAr = editingLanguage === "ar"
    const [dashboardJobs, setDashboardJobs] = React.useState<JobPosition[]>([])
    const header = block.header ?? {}
    const updateHeader = (patch: Partial<typeof header>) => onChange({ ...block, header: { ...header, ...patch } })
    const update = (patch: Partial<JobApplicationFormBlock>) => onChange({ ...block, ...patch })

    React.useEffect(() => {
        const loadJobs = async () => {
            const jobs = await getJobPositions()
            setDashboardJobs(jobs)
        }
        loadJobs()
    }, [])

    const selectedJob = dashboardJobs.find(j => j.id === block.jobId)

    return (
        <div className="space-y-3 text-[11px]" dir={isAr ? "rtl" : "ltr"}>
            <InputField
                label={isAr ? "العنوان" : "Title"}
                value={isAr ? (header.title ?? "") : (header.titleEn ?? "")}
                onChange={(v) => updateHeader(isAr ? { title: v || undefined } : { titleEn: v || undefined })}
                placeholder={isAr ? "نموذج طلب التوظيف" : "Job Application Form"}
            />
            <TextareaField
                label={isAr ? "الوصف" : "Description"}
                value={isAr ? (header.description ?? "") : (header.descriptionEn ?? "")}
                onChange={(v) => updateHeader(isAr ? { description: v || undefined } : { descriptionEn: v || undefined })}
                rows={2}
            />

            {/* Job Selection Mode */}
            <div className="p-2 bg-blue-50 rounded-md border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                    <input
                        type="checkbox"
                        id="showAllJobs"
                        checked={block.showAllJobs ?? false}
                        onChange={(e) => update({ showAllJobs: e.target.checked })}
                        className="rounded"
                    />
                    <label htmlFor="showAllJobs" className="font-medium text-blue-700">
                        {isAr ? "السماح للمتقدم باختيار الوظيفة" : "Allow applicant to select job"}
                    </label>
                </div>
                <p className="text-[10px] text-blue-600">
                    {isAr
                        ? "إذا كان مفعلاً، سيظهر قائمة بجميع الوظائف للاختيار منها"
                        : "If enabled, a dropdown with all jobs will be shown"}
                </p>
            </div>

            {/* Specific Job Selection (if not showing all jobs) */}
            {!block.showAllJobs && (
                <div className="p-2 bg-cyan-50 rounded-md border border-cyan-200">
                    <span className="font-medium text-cyan-700 block mb-2">
                        {isAr ? "اختر وظيفة محددة" : "Select Specific Job"}
                    </span>
                    <select
                        value={block.jobId || ""}
                        onChange={(e) => update({ jobId: e.target.value || undefined })}
                        className="w-full h-8 px-2 rounded border border-cyan-300 bg-white text-sm"
                    >
                        <option value="">{isAr ? "-- اختر وظيفة --" : "-- Select a Job --"}</option>
                        {dashboardJobs.map((job) => (
                            <option key={job.id} value={job.id}>
                                {isAr ? job.title : job.titleEn}
                            </option>
                        ))}
                    </select>
                    {dashboardJobs.length === 0 && (
                        <p className="text-[10px] text-orange-600 mt-1">
                            {isAr
                                ? "لا توجد وظائف. أنشئ وظائف في لوحة التحكم أولاً."
                                : "No jobs available. Create jobs in the dashboard first."}
                        </p>
                    )}
                </div>
            )}

            {/* Selected Job Info */}
            {selectedJob && !block.showAllJobs && (
                <div className="p-2 bg-green-50 rounded-md border border-green-200">
                    <span className="font-medium text-green-700 block mb-1">
                        {isAr ? "الوظيفة المحددة:" : "Selected Job:"}
                    </span>
                    <p className="text-green-600 text-[11px] font-semibold">
                        {isAr ? selectedJob.title : selectedJob.titleEn}
                    </p>
                    <div className="text-[10px] text-green-500 mt-1 space-y-0.5">
                        {selectedJob.requiresCv && <p>• {isAr ? "يتطلب سيرة ذاتية" : "Requires CV"}</p>}
                        {selectedJob.requiresCoverLetter && <p>• {isAr ? "يتطلب خطاب تقديم" : "Requires Cover Letter"}</p>}
                        {selectedJob.requiresPhoto && <p>• {isAr ? "يتطلب صورة شخصية" : "Requires Photo"}</p>}
                        {selectedJob.customFields && selectedJob.customFields.length > 0 && (
                            <p>• {selectedJob.customFields.length} {isAr ? "حقول إضافية" : "custom fields"}</p>
                        )}
                    </div>
                </div>
            )}

            <InputField
                label={isAr ? "نص زر الإرسال" : "Submit Button Text"}
                value={isAr ? (block.submitButtonText || "") : (block.submitButtonTextEn || "")}
                onChange={(v) => update(isAr ? { submitButtonText: v } : { submitButtonTextEn: v })}
                placeholder={isAr ? "إرسال الطلب" : "Submit Application"}
            />

            <TextareaField
                label={isAr ? "رسالة النجاح" : "Success Message"}
                value={isAr ? (block.successMessage || "") : (block.successMessageEn || "")}
                onChange={(v) => update(isAr ? { successMessage: v } : { successMessageEn: v })}
                rows={2}
                placeholder={isAr ? "تم إرسال طلبك بنجاح" : "Your application has been submitted successfully"}
            />

            <StylingGroup block={block} onChange={update as (patch: Partial<Block>) => void} />
        </div>
    )
}

export function JobApplicationFormView({ block }: { block: JobApplicationFormBlock }) {
    const { language } = useLanguage()
    const isAr = language === "ar"
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

    const [jobs, setJobs] = React.useState<JobPosition[]>([])
    const [selectedJobId, setSelectedJobId] = React.useState<string>(block.jobId || "")
    const [submitted, setSubmitted] = React.useState(false)
    const [loading, setLoading] = React.useState(false)

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

    React.useEffect(() => {
        const loadJobs = async () => {
            const loadedJobs = await getJobPositions()
            setJobs(loadedJobs)
            if (block.jobId) {
                setSelectedJobId(block.jobId)
            }
        }
        loadJobs()
    }, [block.jobId])

    const selectedJob = jobs.find(j => j.id === selectedJobId)

    // Helper function to convert file to base64
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = (error) => reject(error)
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedJob) return

        setLoading(true)
        try {
            // Convert files to base64 for persistent storage
            let cvBase64: string | undefined
            let photoBase64: string | undefined

            if (cvFile) {
                cvBase64 = await fileToBase64(cvFile)
            }
            if (photoFile) {
                photoBase64 = await fileToBase64(photoFile)
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
                position: isAr ? selectedJob.title : selectedJob.titleEn,
                expectedSalary: formData.expectedSalary,
                canStayOvernight: formData.canStayOvernight,
                education: education.filter(e => e.degree || e.university),
                experience: experience.filter(e => e.institution || e.jobTitle),
                coverLetter: selectedJob.requiresCoverLetter ? coverLetter : undefined,
                cvFileName: cvFile?.name,
                cvFileUrl: cvBase64,
                photoFileName: photoFile?.name,
                photoFileUrl: photoBase64,
                customFieldResponses: selectedJob.customFields?.map(field => ({
                    fieldId: field.id,
                    value: customFieldValues[field.id] || "",
                })),
            }

            await saveEnhancedEmploymentApplication(applicationData)
            setSubmitted(true)
        } catch (error) {
            console.error("Failed to submit application:", error)
        } finally {
            setLoading(false)
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
        title: isAr ? (block.header?.title || "نموذج طلب التوظيف") : (block.header?.titleEn || block.header?.title || "Job Application Form"),
        description: isAr ? block.header?.description : (block.header?.descriptionEn || block.header?.description),
        selectJob: isAr ? "اختر الوظيفة" : "Select Position",
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
        addEducation: isAr ? "+ إضافة مؤهل" : "+ Add Education",
        remove: isAr ? "حذف" : "Remove",
        experienceLabel: isAr ? "الخبرات العملية" : "Work Experience",
        institution: isAr ? "جهة العمل" : "Institution",
        jobTitle: isAr ? "المسمى الوظيفي" : "Job Title",
        duration: isAr ? "المدة" : "Duration",
        responsibilities: isAr ? "المهام والمسؤوليات" : "Responsibilities",
        addExperience: isAr ? "+ إضافة خبرة" : "+ Add Experience",
        attachments: isAr ? "المرفقات" : "Attachments",
        cv: isAr ? "السيرة الذاتية" : "CV/Resume",
        coverLetterLabel: isAr ? "خطاب التقديم" : "Cover Letter",
        photo: isAr ? "الصورة الشخصية" : "Personal Photo",
        customFields: isAr ? "معلومات إضافية" : "Additional Information",
        submit: isAr ? (block.submitButtonText || "إرسال الطلب") : (block.submitButtonTextEn || block.submitButtonText || "Submit Application"),
        submitting: isAr ? "جاري الإرسال..." : "Submitting...",
        successTitle: isAr ? "تم الإرسال بنجاح!" : "Successfully Submitted!",
        successMessage: isAr ? (block.successMessage || "تم إرسال طلبك بنجاح. سنتواصل معك قريباً.") : (block.successMessageEn || block.successMessage || "Your application has been submitted successfully. We will contact you soon."),
        submitAnother: isAr ? "تقديم طلب آخر" : "Submit Another Application",
        single: isAr ? "أعزب" : "Single",
        married: isAr ? "متزوج" : "Married",
        noJobSelected: isAr ? "الرجاء اختيار وظيفة" : "Please select a position",
    }

    if (submitted) {
        return (
            <SectionContainer {...blockProps}>
                {hoverStyles && <style>{hoverStyles}</style>}
                <div className="max-w-2xl mx-auto p-8 text-center bg-green-50 border border-green-200 rounded-2xl" dir={isAr ? "rtl" : "ltr"}>
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-green-700 mb-2">{t.successTitle}</h3>
                    <p className="text-green-600 mb-6">{t.successMessage}</p>
                    <Button variant="outline" onClick={() => {
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
                    }}>
                        {t.submitAnother}
                    </Button>
                </div>
            </SectionContainer>
        )
    }

    return (
        <SectionContainer {...blockProps}>
            {hoverStyles && <style>{hoverStyles}</style>}
            <div className="max-w-4xl mx-auto" dir={isAr ? "rtl" : "ltr"}>
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                        <Briefcase className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">{t.title}</h2>
                    {t.description && <p className="text-muted-foreground">{t.description}</p>}
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Job Selection (if showAllJobs) */}
                    {block.showAllJobs && (
                        <div className="bg-card border rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Building2 className="w-5 h-5" />
                                {t.selectJob}
                            </h3>
                            <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t.selectJob} />
                                </SelectTrigger>
                                <SelectContent>
                                    {jobs.map((job) => (
                                        <SelectItem key={job.id} value={job.id}>
                                            {isAr ? job.title : job.titleEn} - {isAr ? job.type : job.typeEn}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Personal Information */}
                    <div className="bg-card border rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <User className="w-5 h-5" />
                            {t.personalInfo}
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>{t.fullName} <span className="text-red-500">*</span></Label>
                                <Input value={formData.fullName} onChange={(e) => updateFormData("fullName", e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label>{t.nationalId} <span className="text-red-500">*</span></Label>
                                <Input value={formData.nationalId} onChange={(e) => updateFormData("nationalId", e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label>{t.birthPlace}</Label>
                                <Input value={formData.birthPlace} onChange={(e) => updateFormData("birthPlace", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>{t.birthDate}</Label>
                                <Input type="date" value={formData.birthDate} onChange={(e) => updateFormData("birthDate", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>{t.gender} <span className="text-red-500">*</span></Label>
                                <RadioGroup value={formData.gender} onValueChange={(v) => updateFormData("gender", v)} className="flex gap-4">
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem value="male" id="gender-male" />
                                        <Label htmlFor="gender-male" className="font-normal">{t.male}</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem value="female" id="gender-female" />
                                        <Label htmlFor="gender-female" className="font-normal">{t.female}</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            <div className="space-y-2">
                                <Label>{t.maritalStatus}</Label>
                                <Select value={formData.maritalStatus} onValueChange={(v) => updateFormData("maritalStatus", v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t.maritalStatus} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="single">{t.single}</SelectItem>
                                        <SelectItem value="married">{t.married}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label>{t.address}</Label>
                                <Input value={formData.address} onChange={(e) => updateFormData("address", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>{t.phone} <span className="text-red-500">*</span></Label>
                                <Input type="tel" value={formData.phone} onChange={(e) => updateFormData("phone", e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label>{t.email}</Label>
                                <Input type="email" value={formData.email} onChange={(e) => updateFormData("email", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>{t.expectedSalary}</Label>
                                <Input value={formData.expectedSalary} onChange={(e) => updateFormData("expectedSalary", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>{t.canStayOvernight}</Label>
                                <RadioGroup value={formData.canStayOvernight} onValueChange={(v) => updateFormData("canStayOvernight", v)} className="flex gap-4">
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem value="yes" id="overnight-yes" />
                                        <Label htmlFor="overnight-yes" className="font-normal">{t.yes}</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem value="no" id="overnight-no" />
                                        <Label htmlFor="overnight-no" className="font-normal">{t.no}</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                    </div>

                    {/* Education */}
                    <div className="bg-card border rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            {t.education}
                        </h3>
                        <div className="space-y-4">
                            {education.map((ed, index) => (
                                <div key={index} className="grid md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                                    <div className="space-y-2">
                                        <Label>{t.degree}</Label>
                                        <Input value={ed.degree} onChange={(e) => updateEducation(index, "degree", e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{t.major}</Label>
                                        <Input value={ed.major} onChange={(e) => updateEducation(index, "major", e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{t.university}</Label>
                                        <Input value={ed.university} onChange={(e) => updateEducation(index, "university", e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{t.graduationYear}</Label>
                                        <Input value={ed.graduationYear} onChange={(e) => updateEducation(index, "graduationYear", e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{t.gpa}</Label>
                                        <Input value={ed.gpa} onChange={(e) => updateEducation(index, "gpa", e.target.value)} />
                                    </div>
                                    {education.length > 1 && (
                                        <div className="flex items-end">
                                            <Button type="button" variant="ghost" size="sm" className="text-red-500" onClick={() => removeEducation(index)}>
                                                {t.remove}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={addEducation}>
                                {t.addEducation}
                            </Button>
                        </div>
                    </div>

                    {/* Experience */}
                    <div className="bg-card border rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Briefcase className="w-5 h-5" />
                            {t.experienceLabel}
                        </h3>
                        <div className="space-y-4">
                            {experience.map((ex, index) => (
                                <div key={index} className="grid md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                                    <div className="space-y-2">
                                        <Label>{t.institution}</Label>
                                        <Input value={ex.institution} onChange={(e) => updateExperience(index, "institution", e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{t.jobTitle}</Label>
                                        <Input value={ex.jobTitle} onChange={(e) => updateExperience(index, "jobTitle", e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{t.duration}</Label>
                                        <Input value={ex.duration} onChange={(e) => updateExperience(index, "duration", e.target.value)} />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label>{t.responsibilities}</Label>
                                        <Textarea value={ex.responsibilities} onChange={(e) => updateExperience(index, "responsibilities", e.target.value)} rows={2} />
                                    </div>
                                    {experience.length > 1 && (
                                        <div className="md:col-span-2">
                                            <Button type="button" variant="ghost" size="sm" className="text-red-500" onClick={() => removeExperience(index)}>
                                                {t.remove}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={addExperience}>
                                {t.addExperience}
                            </Button>
                        </div>
                    </div>

                    {/* Attachments - Only show if job requires them */}
                    {selectedJob && (selectedJob.requiresCv || selectedJob.requiresCoverLetter || selectedJob.requiresPhoto) && (
                        <div className="bg-card border rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Upload className="w-5 h-5" />
                                {t.attachments}
                            </h3>
                            <div className="space-y-4">
                                {selectedJob.requiresCv && (
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            {t.cv} <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                                            required={selectedJob.requiresCv}
                                        />
                                    </div>
                                )}
                                {selectedJob.requiresCoverLetter && (
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            {t.coverLetterLabel} <span className="text-red-500">*</span>
                                        </Label>
                                        <Textarea
                                            value={coverLetter}
                                            onChange={(e) => setCoverLetter(e.target.value)}
                                            rows={5}
                                            required={selectedJob.requiresCoverLetter}
                                        />
                                    </div>
                                )}
                                {selectedJob.requiresPhoto && (
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2">
                                            <Camera className="w-4 h-4" />
                                            {t.photo} <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                                            required={selectedJob.requiresPhoto}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Custom Fields - Only show if job has them */}
                    {selectedJob && selectedJob.customFields && selectedJob.customFields.length > 0 && (
                        <div className="bg-card border rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-4">{t.customFields}</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {selectedJob.customFields.sort((a, b) => a.order - b.order).map((field) => {
                                    const label = isAr ? field.labelAr : field.labelEn
                                    const placeholder = isAr ? field.placeholder : (field.placeholderEn || field.placeholder)

                                    return (
                                        <div key={field.id} className={`space-y-2 ${field.type === "textarea" ? "md:col-span-2" : ""}`}>
                                            <Label>
                                                {label}
                                                {field.required && <span className="text-red-500 mr-1">*</span>}
                                            </Label>
                                            {field.type === "textarea" ? (
                                                <Textarea
                                                    value={customFieldValues[field.id] || ""}
                                                    onChange={(e) => setCustomFieldValues(prev => ({ ...prev, [field.id]: e.target.value }))}
                                                    placeholder={placeholder}
                                                    required={field.required}
                                                    rows={3}
                                                />
                                            ) : field.type === "select" && field.options ? (
                                                <Select
                                                    value={customFieldValues[field.id] || ""}
                                                    onValueChange={(v) => setCustomFieldValues(prev => ({ ...prev, [field.id]: v }))}
                                                >
                                                    <SelectTrigger>
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
                                            ) : (
                                                <Input
                                                    type={field.type === "email" ? "email" : field.type === "phone" ? "tel" : field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                                                    value={customFieldValues[field.id] || ""}
                                                    onChange={(e) => setCustomFieldValues(prev => ({ ...prev, [field.id]: e.target.value }))}
                                                    placeholder={placeholder}
                                                    required={field.required}
                                                />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <Button
                            type="submit"
                            size="lg"
                            className="px-12 py-6 text-lg"
                            disabled={loading || (!selectedJobId && block.showAllJobs) || (!selectedJob && !block.showAllJobs)}
                        >
                            {loading ? t.submitting : t.submit}
                        </Button>
                    </div>

                    {!selectedJobId && block.showAllJobs && (
                        <p className="text-center text-red-500 text-sm">{t.noJobSelected}</p>
                    )}
                </form>
            </div>
        </SectionContainer>
    )
}
