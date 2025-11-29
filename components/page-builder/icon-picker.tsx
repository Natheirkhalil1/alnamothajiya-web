import * as React from "react"
import { ICON_NAMES, IconByName } from "./icon-system"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, X } from "lucide-react"

interface IconPickerProps {
    value?: string
    onChange: (iconName: string) => void
}

export function IconPicker({ value, onChange }: IconPickerProps) {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")

    const filteredIcons = React.useMemo(() => {
        if (!search) return ICON_NAMES
        return ICON_NAMES.filter((name) => name.toLowerCase().includes(search.toLowerCase()))
    }, [search])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between px-3 font-normal"
                >
                    <div className="flex items-center gap-2">
                        {value ? (
                            <>
                                <IconByName name={value} className="h-4 w-4 text-primary" />
                                <span className="truncate">{value}</span>
                            </>
                        ) : (
                            <span className="text-muted-foreground">اختر أيقونة...</span>
                        )}
                    </div>
                    {value && (
                        <div
                            role="button"
                            onClick={(e) => {
                                e.stopPropagation()
                                onChange("")
                            }}
                            className="ml-auto rounded-full p-1 hover:bg-slate-100"
                        >
                            <X className="h-3 w-3 text-muted-foreground" />
                        </div>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
                <div className="flex items-center border-b px-3">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <Input
                        placeholder="بحث عن أيقونة..."
                        className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-none focus-visible:ring-0"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <ScrollArea className="h-[300px] p-2">
                    <div className="grid grid-cols-5 gap-2">
                        {filteredIcons.map((iconName) => (
                            <button
                                key={iconName}
                                onClick={() => {
                                    onChange(iconName)
                                    setOpen(false)
                                }}
                                className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-md border p-2 transition-all hover:bg-accent hover:text-accent-foreground ${value === iconName ? "bg-accent text-accent-foreground ring-2 ring-primary" : "bg-transparent border-transparent"
                                    }`}
                                title={iconName}
                            >
                                <IconByName name={iconName} className="h-5 w-5" />
                            </button>
                        ))}
                        {filteredIcons.length === 0 && (
                            <div className="col-span-5 py-6 text-center text-sm text-muted-foreground">
                                لا توجد نتائج
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    )
}
