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
import { Plus, Trash2 } from "lucide-react"

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
