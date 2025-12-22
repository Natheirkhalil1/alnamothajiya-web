import * as React from "react"
import {
    Block,
    FormContainerBlock,
    FormInputBlock,
    FormTextareaBlock,
    FormSelectBlock,
    FormCheckboxBlock,
    FormRadioBlock,
    FormButtonBlock,
    DynamicFormBlock,
    BlockKind,
} from "../types"
import {
    SelectField,
    InputField,
    SectionContainer,
    StylingGroup,
    applyBlockStyles,
} from "../utils"
import { getBlockEditor, getBlockView } from "../registry"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, CheckCircle } from "lucide-react"
import { getForms, saveFormSubmission, type Form } from "@/lib/storage"
import { useEditingLanguage } from "../editing-language-context"
import { useLanguage } from "@/lib/language-context"

// Helper component for boolean fields
function SwitchField({
    label,
    checked,
    onChange,
}: {
    label: string
    checked: boolean
    onChange: (checked: boolean) => void
}) {
    return (
        <div className="flex items-center justify-between rounded border border-slate-200 bg-white p-2">
            <span className="text-[11px] text-slate-700">{label}</span>
            <Switch checked={checked} onCheckedChange={onChange} />
        </div>
    )
}

// --- Form Container ---

export function FormContainerEditor({
    block,
    onChange,
}: {
    block: FormContainerBlock
    onChange: (b: Block) => void
}) {
    const update = (patch: Partial<FormContainerBlock>) => onChange({ ...block, ...patch } as Block)

    const handleAddChild = (kind: BlockKind) => {
        const id = Math.random().toString(36).substr(2, 9)
        let newBlock: Block

        switch (kind) {
            case "form-input":
                newBlock = { kind: "form-input", id, label: "New Input", name: "input_" + id, type: "text" } as FormInputBlock
                break
            case "form-textarea":
                newBlock = { kind: "form-textarea", id, label: "New Textarea", name: "textarea_" + id } as FormTextareaBlock
                break
            case "form-select":
                newBlock = { kind: "form-select", id, label: "New Select", name: "select_" + id, options: [{ label: "Option 1", value: "opt1" }] } as FormSelectBlock
                break
            case "form-checkbox":
                newBlock = { kind: "form-checkbox", id, label: "New Checkbox", name: "checkbox_" + id } as FormCheckboxBlock
                break
            case "form-radio":
                newBlock = { kind: "form-radio", id, label: "New Radio", name: "radio_" + id, options: [{ label: "Option 1", value: "opt1" }] } as FormRadioBlock
                break
            case "form-button":
                newBlock = { kind: "form-button", id, text: "Submit", type: "submit", variant: "primary" } as FormButtonBlock
                break
            default:
                return
        }

        update({ children: [...(block.children || []), newBlock] })
    }

    const updateChild = (index: number, newChild: Block) => {
        const newChildren = [...(block.children || [])]
        newChildren[index] = newChild
        update({ children: newChildren })
    }

    const removeChild = (index: number) => {
        const newChildren = [...(block.children || [])]
        newChildren.splice(index, 1)
        update({ children: newChildren })
    }

    return (
        <div className="space-y-4">
            <InputField label="Form Title" value={block.title || ""} onChange={(v) => update({ title: v })} />
            <InputField label="Description" value={block.description || ""} onChange={(v) => update({ description: v })} />
            <InputField label="Submit URL" value={block.submitUrl || ""} onChange={(v) => update({ submitUrl: v })} />
            <SelectField
                label="Method"
                value={block.method || "POST"}
                onChange={(v) => update({ method: v as "POST" | "GET" })}
                options={[{ value: "POST", label: "POST" }, { value: "GET", label: "GET" }]}
            />

            <div className="space-y-2">
                <Label>Form Fields</Label>
                <div className="space-y-2">
                    {(block.children || []).map((child, index) => {
                        const Editor = getBlockEditor(child.kind)
                        if (!Editor) return <div key={child.id}>Unknown block kind: {child.kind}</div>

                        return (
                            <Card key={child.id} className="p-2">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-semibold uppercase text-muted-foreground">{child.kind.replace("form-", "")}</span>
                                    <Button variant="ghost" size="sm" onClick={() => removeChild(index)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                                </div>
                                <Editor block={child} onChange={(b) => updateChild(index, b)} />
                            </Card>
                        )
                    })}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button size="sm" variant="outline" onClick={() => handleAddChild("form-input")}><Plus className="mr-1 h-3 w-3" /> Input</Button>
                    <Button size="sm" variant="outline" onClick={() => handleAddChild("form-textarea")}><Plus className="mr-1 h-3 w-3" /> Textarea</Button>
                    <Button size="sm" variant="outline" onClick={() => handleAddChild("form-select")}><Plus className="mr-1 h-3 w-3" /> Select</Button>
                    <Button size="sm" variant="outline" onClick={() => handleAddChild("form-checkbox")}><Plus className="mr-1 h-3 w-3" /> Checkbox</Button>
                    <Button size="sm" variant="outline" onClick={() => handleAddChild("form-radio")}><Plus className="mr-1 h-3 w-3" /> Radio</Button>
                    <Button size="sm" variant="outline" onClick={() => handleAddChild("form-button")}><Plus className="mr-1 h-3 w-3" /> Button</Button>
                </div>
            </div>

            <StylingGroup block={block} onChange={update as any} />
        </div>
    )
}

export function FormContainerView({ block }: { block: FormContainerBlock }) {
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

    return (
        <SectionContainer
            {...blockProps}
            backgroundColor={block.backgroundColor}
            padding={block.padding}
            containerWidth={block.containerWidth}
        >
            {hoverStyles && <style>{hoverStyles}</style>}
            <div className="w-full max-w-2xl mx-auto">
                {block.title && <h2 className="text-2xl font-bold mb-2">{block.title}</h2>}
                {block.description && <p className="text-muted-foreground mb-6">{block.description}</p>}

                <form
                    action={block.submitUrl}
                    method={block.method}
                    className="space-y-6"
                    onSubmit={(e) => {
                        e.preventDefault()
                        alert("Form submission prevented in preview.")
                    }}
                >
                    {(block.children || []).map((child) => {
                        const View = getBlockView(child.kind)
                        if (!View) return null
                        return <View key={child.id} block={child} />
                    })}
                </form>
            </div>
        </SectionContainer>
    )
}

// --- Form Input ---

export function FormInputEditor({ block, onChange }: { block: FormInputBlock; onChange: (b: Block) => void }) {
    const update = (patch: Partial<FormInputBlock>) => onChange({ ...block, ...patch } as Block)
    return (
        <div className="space-y-3">
            <InputField label="Label" value={block.label} onChange={(v) => update({ label: v })} />
            <InputField label="Name (API Key)" value={block.name} onChange={(v) => update({ name: v })} />
            <InputField label="Placeholder" value={block.placeholder || ""} onChange={(v) => update({ placeholder: v })} />
            <SelectField
                label="Type"
                value={block.type}
                onChange={(v) => update({ type: v as any })}
                options={[
                    { value: "text", label: "Text" },
                    { value: "email", label: "Email" },
                    { value: "password", label: "Password" },
                    { value: "number", label: "Number" },
                    { value: "tel", label: "Phone" },
                    { value: "url", label: "URL" },
                    { value: "date", label: "Date" },
                ]}
            />
            <SwitchField label="Required" checked={block.required || false} onChange={(v) => update({ required: v })} />
            <InputField label="Helper Text" value={block.helperText || ""} onChange={(v) => update({ helperText: v })} />
        </div>
    )
}

export function FormInputView({ block }: { block: FormInputBlock }) {
    return (
        <div className="space-y-2">
            <Label htmlFor={block.name}>
                {block.label}
                {block.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
                id={block.name}
                name={block.name}
                type={block.type}
                placeholder={block.placeholder}
                required={block.required}
                defaultValue={block.defaultValue}
            />
            {block.helperText && <p className="text-xs text-muted-foreground">{block.helperText}</p>}
        </div>
    )
}

// --- Form Textarea ---

export function FormTextareaEditor({ block, onChange }: { block: FormTextareaBlock; onChange: (b: Block) => void }) {
    const update = (patch: Partial<FormTextareaBlock>) => onChange({ ...block, ...patch } as Block)
    return (
        <div className="space-y-3">
            <InputField label="Label" value={block.label} onChange={(v) => update({ label: v })} />
            <InputField label="Name (API Key)" value={block.name} onChange={(v) => update({ name: v })} />
            <InputField label="Placeholder" value={block.placeholder || ""} onChange={(v) => update({ placeholder: v })} />
            <InputField label="Rows" value={String(block.rows || 4)} onChange={(v) => update({ rows: Number(v) })} />
            <SwitchField label="Required" checked={block.required || false} onChange={(v) => update({ required: v })} />
            <InputField label="Helper Text" value={block.helperText || ""} onChange={(v) => update({ helperText: v })} />
        </div>
    )
}

export function FormTextareaView({ block }: { block: FormTextareaBlock }) {
    return (
        <div className="space-y-2">
            <Label htmlFor={block.name}>
                {block.label}
                {block.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
                id={block.name}
                name={block.name}
                placeholder={block.placeholder}
                required={block.required}
                rows={block.rows || 4}
                defaultValue={block.defaultValue}
            />
            {block.helperText && <p className="text-xs text-muted-foreground">{block.helperText}</p>}
        </div>
    )
}

// --- Form Select ---

export function FormSelectEditor({ block, onChange }: { block: FormSelectBlock; onChange: (b: Block) => void }) {
    const update = (patch: Partial<FormSelectBlock>) => onChange({ ...block, ...patch } as Block)

    const updateOption = (index: number, key: "label" | "value", val: string) => {
        const newOptions = [...block.options]
        newOptions[index] = { ...newOptions[index], [key]: val }
        update({ options: newOptions })
    }

    const addOption = () => update({ options: [...block.options, { label: "New Option", value: "new" }] })
    const removeOption = (index: number) => {
        const newOptions = [...block.options]
        newOptions.splice(index, 1)
        update({ options: newOptions })
    }

    return (
        <div className="space-y-3">
            <InputField label="Label" value={block.label} onChange={(v) => update({ label: v })} />
            <InputField label="Name (API Key)" value={block.name} onChange={(v) => update({ name: v })} />
            <SwitchField label="Required" checked={block.required || false} onChange={(v) => update({ required: v })} />

            <div className="space-y-2">
                <Label>Options</Label>
                {block.options.map((opt, i) => (
                    <div key={i} className="flex gap-2 items-center">
                        <Input value={opt.label} onChange={(e) => updateOption(i, "label", e.target.value)} placeholder="Label" className="h-8 text-xs" />
                        <Input value={opt.value} onChange={(e) => updateOption(i, "value", e.target.value)} placeholder="Value" className="h-8 text-xs" />
                        <Button variant="ghost" size="sm" onClick={() => removeOption(i)}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                ))}
                <Button size="sm" variant="outline" onClick={addOption} className="w-full"><Plus className="h-3 w-3 mr-1" /> Add Option</Button>
            </div>
        </div>
    )
}

export function FormSelectView({ block }: { block: FormSelectBlock }) {
    return (
        <div className="space-y-2">
            <Label htmlFor={block.name}>
                {block.label}
                {block.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select name={block.name} required={block.required} defaultValue={block.defaultValue}>
                <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                    {block.options.map((opt, i) => (
                        <SelectItem key={i} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {block.helperText && <p className="text-xs text-muted-foreground">{block.helperText}</p>}
        </div>
    )
}

// --- Form Checkbox ---

export function FormCheckboxEditor({ block, onChange }: { block: FormCheckboxBlock; onChange: (b: Block) => void }) {
    const update = (patch: Partial<FormCheckboxBlock>) => onChange({ ...block, ...patch } as Block)
    return (
        <div className="space-y-3">
            <InputField label="Label" value={block.label} onChange={(v) => update({ label: v })} />
            <InputField label="Name (API Key)" value={block.name} onChange={(v) => update({ name: v })} />
            <SwitchField label="Required" checked={block.required || false} onChange={(v) => update({ required: v })} />
            <SwitchField label="Default Checked" checked={block.checked || false} onChange={(v) => update({ checked: v })} />
        </div>
    )
}

export function FormCheckboxView({ block }: { block: FormCheckboxBlock }) {
    return (
        <div className="flex items-center space-x-2">
            <Checkbox id={block.name} name={block.name} required={block.required} defaultChecked={block.checked} />
            <Label htmlFor={block.name} className="font-normal">
                {block.label}
                {block.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
        </div>
    )
}

// --- Form Radio ---

export function FormRadioEditor({ block, onChange }: { block: FormRadioBlock; onChange: (b: Block) => void }) {
    const update = (patch: Partial<FormRadioBlock>) => onChange({ ...block, ...patch } as Block)

    const updateOption = (index: number, key: "label" | "value", val: string) => {
        const newOptions = [...block.options]
        newOptions[index] = { ...newOptions[index], [key]: val }
        update({ options: newOptions })
    }

    const addOption = () => update({ options: [...block.options, { label: "New Option", value: "new" }] })
    const removeOption = (index: number) => {
        const newOptions = [...block.options]
        newOptions.splice(index, 1)
        update({ options: newOptions })
    }

    return (
        <div className="space-y-3">
            <InputField label="Label" value={block.label} onChange={(v) => update({ label: v })} />
            <InputField label="Name (API Key)" value={block.name} onChange={(v) => update({ name: v })} />
            <SwitchField label="Required" checked={block.required || false} onChange={(v) => update({ required: v })} />

            <div className="space-y-2">
                <Label>Options</Label>
                {block.options.map((opt, i) => (
                    <div key={i} className="flex gap-2 items-center">
                        <Input value={opt.label} onChange={(e) => updateOption(i, "label", e.target.value)} placeholder="Label" className="h-8 text-xs" />
                        <Input value={opt.value} onChange={(e) => updateOption(i, "value", e.target.value)} placeholder="Value" className="h-8 text-xs" />
                        <Button variant="ghost" size="sm" onClick={() => removeOption(i)}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                ))}
                <Button size="sm" variant="outline" onClick={addOption} className="w-full"><Plus className="h-3 w-3 mr-1" /> Add Option</Button>
            </div>
        </div>
    )
}

export function FormRadioView({ block }: { block: FormRadioBlock }) {
    return (
        <div className="space-y-2">
            <Label>
                {block.label}
                {block.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <RadioGroup name={block.name} defaultValue={block.defaultValue}>
                {block.options.map((opt, i) => (
                    <div key={i} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt.value} id={`${block.name}-${opt.value}`} />
                        <Label htmlFor={`${block.name}-${opt.value}`} className="font-normal">{opt.label}</Label>
                    </div>
                ))}
            </RadioGroup>
        </div>
    )
}

// --- Form Button ---

export function FormButtonEditor({ block, onChange }: { block: FormButtonBlock; onChange: (b: Block) => void }) {
    const update = (patch: Partial<FormButtonBlock>) => onChange({ ...block, ...patch } as Block)
    return (
        <div className="space-y-3">
            <InputField label="Button Text" value={block.text} onChange={(v) => update({ text: v })} />
            <SelectField
                label="Type"
                value={block.type}
                onChange={(v) => update({ type: v as any })}
                options={[
                    { value: "submit", label: "Submit" },
                    { value: "reset", label: "Reset" },
                    { value: "button", label: "Button" },
                ]}
            />
            <SelectField
                label="Variant"
                value={block.variant || "primary"}
                onChange={(v) => update({ variant: v as any })}
                options={[
                    { value: "primary", label: "Primary" },
                    { value: "secondary", label: "Secondary" },
                    { value: "outline", label: "Outline" },
                    { value: "ghost", label: "Ghost" },
                ]}
            />
            <SwitchField label="Full Width" checked={block.fullWidth || false} onChange={(v) => update({ fullWidth: v })} />
        </div>
    )
}

export function FormButtonView({ block }: { block: FormButtonBlock }) {
    return (
        <Button
            type={block.type}
            variant={block.variant as any || "default"}
            className={block.fullWidth ? "w-full" : ""}
        >
            {block.text}
        </Button>
    )
}

// --- Dynamic Form Block (from Dashboard Forms) ---

export function DynamicFormEditor({ block, onChange }: { block: DynamicFormBlock; onChange: (b: Block) => void }) {
    const { editingLanguage } = useEditingLanguage()
    const isAr = editingLanguage === "ar"
    const [dashboardForms, setDashboardForms] = React.useState<Form[]>([])
    const update = (patch: Partial<DynamicFormBlock>) => onChange({ ...block, ...patch } as Block)

    React.useEffect(() => {
        getForms().then(forms => {
            setDashboardForms(forms.filter(f => f.isActive))
        })
    }, [])

    const selectedForm = dashboardForms.find(f => f.id === block.formId)

    return (
        <div className="space-y-3 text-[11px]" dir={isAr ? "rtl" : "ltr"}>
            {/* Form Selection */}
            <div className="p-2 bg-blue-50 rounded-md border border-blue-200">
                <span className="font-medium text-blue-700 block mb-2">
                    {isAr ? "اختر نموذج من لوحة التحكم" : "Select Form from Dashboard"}
                </span>
                <select
                    value={block.formId || ""}
                    onChange={(e) => update({ formId: e.target.value })}
                    className="w-full h-8 px-2 rounded border border-blue-300 bg-white text-sm"
                >
                    <option value="">{isAr ? "-- اختر نموذج --" : "-- Select a Form --"}</option>
                    {dashboardForms.map((form) => (
                        <option key={form.id} value={form.id}>
                            {isAr ? form.titleAr : form.titleEn} ({form.fields.length} {isAr ? "حقول" : "fields"})
                        </option>
                    ))}
                </select>
                {dashboardForms.length === 0 && (
                    <p className="text-[10px] text-orange-600 mt-1">
                        {isAr
                            ? "لا توجد نماذج نشطة. أنشئ نموذجاً في لوحة التحكم أولاً."
                            : "No active forms available. Create a form in the dashboard first."}
                    </p>
                )}
            </div>

            {selectedForm && (
                <div className="p-2 bg-green-50 rounded-md border border-green-200">
                    <span className="font-medium text-green-700 block mb-1">
                        {isAr ? "النموذج المحدد:" : "Selected Form:"}
                    </span>
                    <p className="text-green-600 text-[11px]">
                        {isAr ? selectedForm.titleAr : selectedForm.titleEn}
                    </p>
                    <p className="text-green-500 text-[10px] mt-1">
                        {selectedForm.fields.length} {isAr ? "حقول" : "fields"}
                    </p>
                </div>
            )}

            <InputField
                label={isAr ? "نص زر الإرسال" : "Submit Button Text"}
                value={isAr ? (block.submitButtonText || "") : (block.submitButtonTextEn || "")}
                onChange={(v) => update(isAr ? { submitButtonText: v } : { submitButtonTextEn: v })}
                placeholder={isAr ? "إرسال" : "Submit"}
            />

            <InputField
                label={isAr ? "رسالة النجاح" : "Success Message"}
                value={isAr ? (block.successMessage || "") : (block.successMessageEn || "")}
                onChange={(v) => update(isAr ? { successMessage: v } : { successMessageEn: v })}
                placeholder={isAr ? "تم إرسال النموذج بنجاح" : "Form submitted successfully"}
            />

            {/* Hover Effect Customization */}
            <div className="p-2 bg-purple-50 rounded-md border border-purple-200 space-y-2">
                <span className="font-medium text-purple-700 block">
                    {isAr ? "تأثيرات التمرير" : "Hover Effects"}
                </span>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-[10px] text-slate-600 block mb-1">
                            {isAr ? "لون الحدود" : "Border Color"}
                        </label>
                        <select
                            value={block.hoverBorderColor || "pink"}
                            onChange={(e) => update({ hoverBorderColor: e.target.value as any })}
                            className="w-full h-7 px-2 rounded border border-purple-300 bg-white text-[11px]"
                        >
                            <option value="pink">{isAr ? "وردي" : "Pink"}</option>
                            <option value="purple">{isAr ? "بنفسجي" : "Purple"}</option>
                            <option value="blue">{isAr ? "أزرق" : "Blue"}</option>
                            <option value="teal">{isAr ? "أزرق مخضر" : "Teal"}</option>
                            <option value="emerald">{isAr ? "زمردي" : "Emerald"}</option>
                            <option value="orange">{isAr ? "برتقالي" : "Orange"}</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] text-slate-600 block mb-1">
                            {isAr ? "لون الظل" : "Shadow Color"}
                        </label>
                        <select
                            value={block.hoverShadowColor || "pink"}
                            onChange={(e) => update({ hoverShadowColor: e.target.value as any })}
                            className="w-full h-7 px-2 rounded border border-purple-300 bg-white text-[11px]"
                        >
                            <option value="pink">{isAr ? "وردي" : "Pink"}</option>
                            <option value="purple">{isAr ? "بنفسجي" : "Purple"}</option>
                            <option value="blue">{isAr ? "أزرق" : "Blue"}</option>
                            <option value="teal">{isAr ? "أزرق مخضر" : "Teal"}</option>
                            <option value="emerald">{isAr ? "زمردي" : "Emerald"}</option>
                            <option value="orange">{isAr ? "برتقالي" : "Orange"}</option>
                        </select>
                    </div>
                </div>
            </div>

            <StylingGroup block={block} onChange={update as any} />
        </div>
    )
}

export function DynamicFormView({ block }: { block: DynamicFormBlock }) {
    const { language } = useLanguage()
    const isAr = language === "ar"
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)
    const [form, setForm] = React.useState<Form | null>(null)
    const [formData, setFormData] = React.useState<Record<string, any>>({})
    const [submitted, setSubmitted] = React.useState(false)
    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {
        if (block.formId) {
            getForms().then(forms => {
                const found = forms.find(f => f.id === block.formId)
                setForm(found || null)
            })
        }
    }, [block.formId])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!form) return

        setLoading(true)

        try {
            saveFormSubmission({
                formId: form.id,
                formTitle: isAr ? form.titleAr : form.titleEn,
                data: formData,
            })
            setSubmitted(true)
            setFormData({})
        } catch (error) {
            console.error("Failed to submit form:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleFieldChange = (fieldId: string, value: any) => {
        setFormData(prev => ({ ...prev, [fieldId]: value }))
    }

    // Color maps for customizable hover effects
    const borderColorMap: Record<string, string> = {
        pink: "hover:border-pink-400 dark:hover:border-pink-400 focus:border-pink-500 focus:ring-pink-500/20",
        purple: "hover:border-purple-400 dark:hover:border-purple-400 focus:border-purple-500 focus:ring-purple-500/20",
        blue: "hover:border-blue-400 dark:hover:border-blue-400 focus:border-blue-500 focus:ring-blue-500/20",
        teal: "hover:border-teal-400 dark:hover:border-teal-400 focus:border-teal-500 focus:ring-teal-500/20",
        emerald: "hover:border-emerald-400 dark:hover:border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/20",
        orange: "hover:border-orange-400 dark:hover:border-orange-400 focus:border-orange-500 focus:ring-orange-500/20",
    }

    const shadowColorMap: Record<string, string> = {
        pink: "hover:shadow-pink-500/10",
        purple: "hover:shadow-purple-500/10",
        blue: "hover:shadow-blue-500/10",
        teal: "hover:shadow-teal-500/10",
        emerald: "hover:shadow-emerald-500/10",
        orange: "hover:shadow-orange-500/10",
    }

    const cornerGradientMap: Record<string, { top: string; bottom: string }> = {
        pink: { top: "from-pink-500/20 via-purple-500/10", bottom: "from-purple-500/20 via-pink-500/10" },
        purple: { top: "from-purple-500/20 via-pink-500/10", bottom: "from-pink-500/20 via-purple-500/10" },
        blue: { top: "from-blue-500/20 via-cyan-500/10", bottom: "from-cyan-500/20 via-blue-500/10" },
        teal: { top: "from-teal-500/20 via-emerald-500/10", bottom: "from-emerald-500/20 via-teal-500/10" },
        emerald: { top: "from-emerald-500/20 via-teal-500/10", bottom: "from-teal-500/20 via-emerald-500/10" },
        orange: { top: "from-orange-500/20 via-amber-500/10", bottom: "from-amber-500/20 via-orange-500/10" },
    }

    const requiredAsteriskColorMap: Record<string, string> = {
        pink: "text-pink-500",
        purple: "text-purple-500",
        blue: "text-blue-500",
        teal: "text-teal-500",
        emerald: "text-emerald-500",
        orange: "text-orange-500",
    }

    const checkboxCheckedMap: Record<string, string> = {
        pink: "data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500",
        purple: "data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500",
        blue: "data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500",
        teal: "data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500",
        emerald: "data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500",
        orange: "data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500",
    }

    const radioColorMap: Record<string, string> = {
        pink: "text-pink-500",
        purple: "text-purple-500",
        blue: "text-blue-500",
        teal: "text-teal-500",
        emerald: "text-emerald-500",
        orange: "text-orange-500",
    }

    const hoverBorderColor = block.hoverBorderColor || "pink"
    const hoverShadowColor = block.hoverShadowColor || "pink"
    const inputHoverClass = borderColorMap[hoverBorderColor]
    const cardShadowClass = shadowColorMap[hoverShadowColor]
    const cornerGradients = cornerGradientMap[hoverBorderColor]
    const requiredAsteriskClass = requiredAsteriskColorMap[hoverBorderColor]
    const checkboxCheckedClass = checkboxCheckedMap[hoverBorderColor]
    const radioColorClass = radioColorMap[hoverBorderColor]

    // Shared input styling to match contact form
    const inputClassName = `h-14 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 ${inputHoverClass} focus:ring-2 transition-all duration-300 outline-none`
    const textareaClassName = `px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 ${inputHoverClass} focus:ring-2 transition-all duration-300 min-h-[140px] resize-none outline-none`
    const selectTriggerClassName = `h-14 px-4 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 ${inputHoverClass} focus:ring-2 transition-all duration-300`

    if (!form) {
        return (
            <SectionContainer {...blockProps}>
                <div className="p-8 text-center bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground">
                        {isAr ? "لم يتم تحديد نموذج" : "No form selected"}
                    </p>
                </div>
            </SectionContainer>
        )
    }

    // Check if form is deactivated
    if (!form.isActive) {
        return (
            <SectionContainer {...blockProps}>
                {hoverStyles && <style>{hoverStyles}</style>}
                <div className="w-full max-w-2xl mx-auto" dir={isAr ? "rtl" : "ltr"}>
                    <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">
                            {isAr ? "النموذج غير متاح حالياً" : "Form Currently Unavailable"}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400">
                            {isAr
                                ? "هذا النموذج غير نشط في الوقت الحالي. يرجى المحاولة لاحقاً."
                                : "This form is currently inactive. Please try again later."}
                        </p>
                    </div>
                </div>
            </SectionContainer>
        )
    }

    if (submitted) {
        return (
            <SectionContainer {...blockProps}>
                {hoverStyles && <style>{hoverStyles}</style>}
                <div className="w-full max-w-2xl mx-auto" dir={isAr ? "rtl" : "ltr"}>
                    {/* Success Card - matching contact form style */}
                    <div className={`group bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl ${cardShadowClass} transition-all duration-500 hover:-translate-y-1 p-8 md:p-10 border border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-400 relative overflow-hidden`}>
                        {/* Decorative corner accents */}
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-500/20 via-emerald-500/10 to-transparent rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
                        <div className={`absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-transparent rounded-tr-full opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 pointer-events-none" />

                        <div className="relative text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                <CheckCircle className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
                                {isAr ? "شكراً لك!" : "Thank you!"}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 mb-6">
                                {isAr
                                    ? (block.successMessage || "تم إرسال النموذج بنجاح")
                                    : (block.successMessageEn || block.successMessage || "Form submitted successfully")}
                            </p>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="relative inline-flex items-center justify-center px-8 h-14 rounded-full bg-gradient-to-r from-teal-500 via-emerald-500 to-blue-500 hover:from-teal-600 hover:via-emerald-600 hover:to-blue-600 text-white font-bold shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 hover:scale-[1.02] transition-all duration-300 overflow-hidden group/btn"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700" />
                                <span className="relative">{isAr ? "إرسال نموذج آخر" : "Submit Another"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </SectionContainer>
        )
    }

    // Border color classes for the card
    const cardBorderColorMap: Record<string, string> = {
        pink: "hover:border-pink-400 dark:hover:border-pink-400",
        purple: "hover:border-purple-400 dark:hover:border-purple-400",
        blue: "hover:border-blue-400 dark:hover:border-blue-400",
        teal: "hover:border-teal-400 dark:hover:border-teal-400",
        emerald: "hover:border-emerald-400 dark:hover:border-emerald-400",
        orange: "hover:border-orange-400 dark:hover:border-orange-400",
    }
    const cardBorderClass = cardBorderColorMap[hoverBorderColor]

    return (
        <SectionContainer {...blockProps}>
            {hoverStyles && <style>{hoverStyles}</style>}
            <div className="w-full max-w-2xl mx-auto" dir={isAr ? "rtl" : "ltr"}>
                {/* Form Card - matching contact form style */}
                <div className={`group bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl ${cardShadowClass} transition-all duration-500 hover:-translate-y-1 p-6 md:p-8 border border-slate-200/50 dark:border-slate-700/50 ${cardBorderClass} relative overflow-hidden`}>
                    {/* Decorative corner accents */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${cornerGradients.top} to-transparent rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
                    <div className={`absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr ${cornerGradients.bottom} to-transparent rounded-tr-full opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 pointer-events-none" />

                        <div className="relative">
                            {/* Form Title */}
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-2">
                                {isAr ? form.titleAr : form.titleEn}
                            </h2>
                            {(isAr ? form.descriptionAr : form.descriptionEn) && (
                                <p className="text-slate-600 dark:text-slate-400 mb-8">
                                    {isAr ? form.descriptionAr : form.descriptionEn}
                                </p>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {form.fields.sort((a, b) => a.order - b.order).map((field) => {
                                    const label = isAr ? field.labelAr : field.labelEn
                                    const placeholder = isAr ? field.placeholder : (field.placeholderEn || field.placeholder)

                                    switch (field.type) {
                                        case "text":
                                        case "email":
                                        case "phone":
                                        case "number":
                                        case "date":
                                            return (
                                                <div key={field.id} className="space-y-2">
                                                    <Label className="text-slate-700 dark:text-slate-300 font-medium">
                                                        {label}
                                                        {field.required && <span className={`${requiredAsteriskClass} mx-1`}>*</span>}
                                                    </Label>
                                                    <Input
                                                        type={field.type === "phone" ? "tel" : field.type}
                                                        placeholder={placeholder}
                                                        required={field.required}
                                                        value={formData[field.id] || ""}
                                                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                                        className={inputClassName}
                                                    />
                                                </div>
                                            )
                                        case "textarea":
                                            return (
                                                <div key={field.id} className="space-y-2">
                                                    <Label className="text-slate-700 dark:text-slate-300 font-medium">
                                                        {label}
                                                        {field.required && <span className={`${requiredAsteriskClass} mx-1`}>*</span>}
                                                    </Label>
                                                    <Textarea
                                                        placeholder={placeholder}
                                                        required={field.required}
                                                        rows={4}
                                                        value={formData[field.id] || ""}
                                                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                                        className={textareaClassName}
                                                    />
                                                </div>
                                            )
                                        case "select":
                                            return (
                                                <div key={field.id} className="space-y-2">
                                                    <Label className="text-slate-700 dark:text-slate-300 font-medium">
                                                        {label}
                                                        {field.required && <span className={`${requiredAsteriskClass} mx-1`}>*</span>}
                                                    </Label>
                                                    <Select
                                                        value={formData[field.id] || ""}
                                                        onValueChange={(v) => handleFieldChange(field.id, v)}
                                                    >
                                                        <SelectTrigger className={selectTriggerClassName}>
                                                            <SelectValue placeholder={placeholder || (isAr ? "اختر..." : "Select...")} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {(field.options || []).map((opt, i) => (
                                                                <SelectItem key={i} value={opt}>{opt}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )
                                        case "checkbox":
                                            return (
                                                <div key={field.id} className={`flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 ${cardBorderClass} transition-colors duration-300`}>
                                                    <Checkbox
                                                        id={field.id}
                                                        checked={formData[field.id] || false}
                                                        onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
                                                        className={`border-slate-300 ${checkboxCheckedClass}`}
                                                    />
                                                    <Label htmlFor={field.id} className="font-normal text-slate-700 dark:text-slate-300 cursor-pointer">
                                                        {label}
                                                        {field.required && <span className={`${requiredAsteriskClass} mx-1`}>*</span>}
                                                    </Label>
                                                </div>
                                            )
                                        case "radio":
                                            return (
                                                <div key={field.id} className="space-y-3">
                                                    <Label className="text-slate-700 dark:text-slate-300 font-medium">
                                                        {label}
                                                        {field.required && <span className={`${requiredAsteriskClass} mx-1`}>*</span>}
                                                    </Label>
                                                    <RadioGroup
                                                        value={formData[field.id] || ""}
                                                        onValueChange={(v) => handleFieldChange(field.id, v)}
                                                        className="space-y-2"
                                                    >
                                                        {(field.options || []).map((opt, i) => (
                                                            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 ${cardBorderClass} transition-colors duration-300`}>
                                                                <RadioGroupItem value={opt} id={`${field.id}-${i}`} className={`border-slate-300 ${radioColorClass}`} />
                                                                <Label htmlFor={`${field.id}-${i}`} className="font-normal text-slate-700 dark:text-slate-300 cursor-pointer">{opt}</Label>
                                                            </div>
                                                        ))}
                                                    </RadioGroup>
                                                </div>
                                            )
                                        default:
                                            return null
                                    }
                                })}

                                {/* Gradient Submit Button - matching contact form exactly */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="relative w-full h-16 py-4 px-8 bg-gradient-to-r from-teal-500 via-emerald-500 to-blue-500 hover:from-teal-600 hover:via-emerald-600 hover:to-blue-600 text-white text-lg font-bold rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 hover:scale-[1.02] overflow-hidden group/btn"
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-700" />
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            <span className="relative">{isAr ? "جاري الإرسال..." : "Submitting..."}</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-6 h-6 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                            <span className="relative">
                                                {isAr
                                                    ? (block.submitButtonText || "إرسال")
                                                    : (block.submitButtonTextEn || block.submitButtonText || "Submit")
                                                }
                                            </span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
        </SectionContainer>
    )
}
