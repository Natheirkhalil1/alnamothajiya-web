"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Menu, Save, RotateCcw, ArrowLeft, Palette, Settings as SettingsIcon, Plus, Columns3, ImageIcon, X } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { getFooterSettingsAsync, saveFooterSettingsAsync, resetFooterSettingsAsync } from "@/lib/settings"
import type { FooterSettings, FooterColumn, MediaItem } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"
import { MediaPicker } from "@/components/media-picker"

export default function FooterEditorPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const { toast } = useToast()
  const isAr = language === "ar"

  const [settings, setSettings] = useState<FooterSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const footerSettings = await getFooterSettingsAsync()
        setSettings(footerSettings)
        setLoading(false)
      } catch (error) {
        console.error("[v0] Failed to load footer settings:", error)
        toast({
          variant: "destructive",
          title: isAr ? "خطأ" : "Error",
          description: isAr ? "فشل تحميل إعدادات الفوتر" : "Failed to load footer settings"
        })
        setLoading(false)
      }
    }
    loadSettings()
  }, [isAr, toast])

  const handleSave = async () => {
    if (!settings) return
    try {
      await saveFooterSettingsAsync(settings)
      toast({
        title: isAr ? "تم الحفظ" : "Saved",
        description: isAr ? "تم حفظ إعدادات الفوتر بنجاح" : "Footer settings saved successfully"
      })
    } catch (error) {
      console.error("[v0] Failed to save footer settings:", error)
      toast({
        variant: "destructive",
        title: isAr ? "خطأ" : "Error",
        description: isAr ? "فشل حفظ إعدادات الفوتر" : "Failed to save footer settings"
      })
    }
  }

  const handleReset = async () => {
    if (confirm(isAr ? "هل أنت متأكد من إعادة التعيين إلى الإعدادات الافتراضية؟" : "Are you sure you want to reset to default settings?")) {
      const defaultSettings = await resetFooterSettingsAsync()
      setSettings(defaultSettings)
      toast({
        title: isAr ? "تمت الإعادة" : "Reset",
        description: isAr ? "تمت إعادة التعيين إلى الإعدادات الافتراضية" : "Reset to default settings"
      })
    }
  }

  const updateSettings = (updates: Partial<FooterSettings>) => {
    setSettings(prev => prev ? { ...prev, ...updates } : null)
  }

  const updateStyle = (styleUpdates: Partial<FooterSettings["style"]>) => {
    setSettings(prev => prev ? {
      ...prev,
      style: { ...prev.style, ...styleUpdates }
    } : null)
  }

  const updateSocialMedia = (socialUpdates: Partial<FooterSettings["socialMedia"]>) => {
    setSettings(prev => prev ? {
      ...prev,
      socialMedia: { ...prev.socialMedia, ...socialUpdates }
    } : null)
  }

  const updateContactInfo = (contactUpdates: Partial<FooterSettings["contactInfo"]>) => {
    setSettings(prev => prev ? {
      ...prev,
      contactInfo: { ...prev.contactInfo, ...contactUpdates }
    } : null)
  }

  const addColumn = () => {
    if (!settings) return
    const newColumn: FooterColumn = {
      id: `column-${Date.now()}`,
      titleAr: "عمود جديد",
      titleEn: "New Column",
      type: "text",
      order: settings.columns.length + 1,
      content: {
        textAr: "",
        textEn: ""
      }
    }
    updateSettings({ columns: [...settings.columns, newColumn] })
  }

  const updateColumn = (id: string, updates: Partial<FooterColumn>) => {
    if (!settings) return
    updateSettings({
      columns: settings.columns.map(col =>
        col.id === id ? { ...col, ...updates } : col
      )
    })
  }

  const deleteColumn = (id: string) => {
    if (!settings) return
    updateSettings({
      columns: settings.columns.filter(col => col.id !== id)
    })
  }

  const moveColumn = (id: string, direction: "up" | "down") => {
    if (!settings) return
    const index = settings.columns.findIndex(col => col.id === id)
    if (index === -1) return
    if (direction === "up" && index === 0) return
    if (direction === "down" && index === settings.columns.length - 1) return

    const newColumns = [...settings.columns]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    ;[newColumns[index], newColumns[targetIndex]] = [newColumns[targetIndex], newColumns[index]]

    // Update order values
    newColumns.forEach((col, idx) => {
      col.order = idx + 1
    })

    updateSettings({ columns: newColumns })
  }

  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Menu className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">
                  {isAr ? "تخصيص الفوتر" : "Footer Customization"}
                </h1>
                <p className="text-muted-foreground text-lg">
                  {isAr ? "تعديل الأعمدة، روابط التواصل، والعناصر الإضافية" : "Edit columns, social links, and additional elements"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleReset} variant="outline" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                {isAr ? "إعادة تعيين" : "Reset"}
              </Button>
              <Button onClick={handleSave} className="gap-2 bg-gradient-to-r from-purple-500 to-purple-600">
                <Save className="w-4 h-4" />
                {isAr ? "حفظ التغييرات" : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Card className="p-6">
          <Tabs defaultValue="layout" dir={isAr ? "rtl" : "ltr"}>
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="layout">
                <Columns3 className="w-4 h-4 mr-2" />
                {isAr ? "التخطيط" : "Layout"}
              </TabsTrigger>
              <TabsTrigger value="content">
                {isAr ? "المحتوى" : "Content"}
              </TabsTrigger>
              <TabsTrigger value="social">
                {isAr ? "التواصل" : "Social"}
              </TabsTrigger>
              <TabsTrigger value="styling">
                <Palette className="w-4 h-4 mr-2" />
                {isAr ? "التنسيق" : "Styling"}
              </TabsTrigger>
              <TabsTrigger value="additional">
                <SettingsIcon className="w-4 h-4 mr-2" />
                {isAr ? "إضافية" : "Additional"}
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Layout */}
            <TabsContent value="layout" className="space-y-6">
              <div className="space-y-4">
                <Label>{isAr ? "تخطيط الأعمدة" : "Column Layout"}</Label>
                <Select
                  value={settings.layout}
                  onValueChange={(value: FooterSettings["layout"]) => updateSettings({ layout: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-column">{isAr ? "عمود واحد" : "1 Column"}</SelectItem>
                    <SelectItem value="2-column">{isAr ? "عمودان" : "2 Columns"}</SelectItem>
                    <SelectItem value="3-column">{isAr ? "3 أعمدة" : "3 Columns"}</SelectItem>
                    <SelectItem value="4-column">{isAr ? "4 أعمدة" : "4 Columns"}</SelectItem>
                  </SelectContent>
                </Select>

                <div className="p-4 border rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    {isAr
                      ? `التخطيط الحالي: ${settings.layout}. عدد الأعمدة: ${settings.columns.length}`
                      : `Current layout: ${settings.layout}. Number of columns: ${settings.columns.length}`
                    }
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Tab 2: Content Sections */}
            <TabsContent value="content" className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {isAr ? "أعمدة الفوتر" : "Footer Columns"}
                </h3>
                <Button onClick={addColumn} size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  {isAr ? "إضافة عمود" : "Add Column"}
                </Button>
              </div>

              <div className="space-y-4">
                {settings.columns.map((column, index) => (
                  <Card key={column.id} className="p-4">
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{isAr ? "العنوان (عربي)" : "Title (Arabic)"}</Label>
                          <Input
                            value={column.titleAr}
                            onChange={(e) => updateColumn(column.id, { titleAr: e.target.value })}
                            dir="rtl"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>{isAr ? "العنوان (إنجليزي)" : "Title (English)"}</Label>
                          <Input
                            value={column.titleEn}
                            onChange={(e) => updateColumn(column.id, { titleEn: e.target.value })}
                            dir="ltr"
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label>{isAr ? "نوع المحتوى" : "Content Type"}</Label>
                          <Select
                            value={column.type}
                            onValueChange={(value: FooterColumn["type"]) =>
                              updateColumn(column.id, { type: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">{isAr ? "نص" : "Text"}</SelectItem>
                              <SelectItem value="links">{isAr ? "روابط" : "Links"}</SelectItem>
                              <SelectItem value="contact">{isAr ? "معلومات الاتصال" : "Contact Info"}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {column.type === "text" && (
                          <>
                            <div className="space-y-2">
                              <Label>{isAr ? "النص (عربي)" : "Text (Arabic)"}</Label>
                              <Textarea
                                value={column.content.textAr || ""}
                                onChange={(e) => updateColumn(column.id, {
                                  content: { ...column.content, textAr: e.target.value }
                                })}
                                dir="rtl"
                                rows={4}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>{isAr ? "النص (إنجليزي)" : "Text (English)"}</Label>
                              <Textarea
                                value={column.content.textEn || ""}
                                onChange={(e) => updateColumn(column.id, {
                                  content: { ...column.content, textEn: e.target.value }
                                })}
                                dir="ltr"
                                rows={4}
                              />
                            </div>
                          </>
                        )}

                        {column.type === "links" && (
                          <div className="space-y-2 md:col-span-2">
                            <Label>{isAr ? "الروابط (JSON)" : "Links (JSON)"}</Label>
                            <Textarea
                              value={JSON.stringify(column.content.links || [], null, 2)}
                              onChange={(e) => {
                                try {
                                  const links = JSON.parse(e.target.value)
                                  updateColumn(column.id, {
                                    content: { ...column.content, links }
                                  })
                                } catch (err) {
                                  // Invalid JSON, ignore
                                }
                              }}
                              rows={8}
                              className="font-mono text-sm"
                              placeholder='[{"labelAr": "الرئيسية", "labelEn": "Home", "linkType": "page", "pageSlug": "home"}]'
                            />
                            <p className="text-xs text-muted-foreground">
                              {isAr
                                ? "قم بتعديل الروابط بتنسيق JSON. استخدم 'linkType' كـ 'page' أو 'url'"
                                : "Edit links in JSON format. Use 'linkType' as 'page' or 'url'"
                              }
                            </p>
                          </div>
                        )}

                        {column.type === "contact" && (
                          <div className="space-y-2 md:col-span-2">
                            <Label>{isAr ? "عناصر الاتصال (JSON)" : "Contact Items (JSON)"}</Label>
                            <Textarea
                              value={JSON.stringify(column.content.contactItems || [], null, 2)}
                              onChange={(e) => {
                                try {
                                  const contactItems = JSON.parse(e.target.value)
                                  updateColumn(column.id, {
                                    content: { ...column.content, contactItems }
                                  })
                                } catch (err) {
                                  // Invalid JSON, ignore
                                }
                              }}
                              rows={8}
                              className="font-mono text-sm"
                              placeholder='[{"icon": "phone", "labelAr": "الهاتف", "labelEn": "Phone", "value": "+966..."}]'
                            />
                            <p className="text-xs text-muted-foreground">
                              {isAr
                                ? "قم بتعديل عناصر الاتصال بتنسيق JSON. الأيقونات المتاحة: phone, mail, map-pin"
                                : "Edit contact items in JSON format. Available icons: phone, mail, map-pin"
                              }
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => moveColumn(column.id, "up")}
                          variant="outline"
                          size="sm"
                          disabled={index === 0}
                        >
                          ↑
                        </Button>
                        <Button
                          onClick={() => moveColumn(column.id, "down")}
                          variant="outline"
                          size="sm"
                          disabled={index === settings.columns.length - 1}
                        >
                          ↓
                        </Button>
                        <Button
                          onClick={() => deleteColumn(column.id)}
                          variant="destructive"
                          size="sm"
                          className="ml-auto"
                        >
                          {isAr ? "حذف" : "Delete"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}

                {settings.columns.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    {isAr ? "لا توجد أعمدة. انقر على 'إضافة عمود' للبدء." : "No columns. Click 'Add Column' to start."}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Tab 3: Social Media & Contact */}
            <TabsContent value="social" className="space-y-6">
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">{isAr ? "روابط التواصل الاجتماعي" : "Social Media Links"}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Facebook</Label>
                    <Input
                      value={settings.socialMedia.facebook || ""}
                      onChange={(e) => updateSocialMedia({ facebook: e.target.value })}
                      placeholder="https://facebook.com/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Twitter / X</Label>
                    <Input
                      value={settings.socialMedia.twitter || ""}
                      onChange={(e) => updateSocialMedia({ twitter: e.target.value })}
                      placeholder="https://twitter.com/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Instagram</Label>
                    <Input
                      value={settings.socialMedia.instagram || ""}
                      onChange={(e) => updateSocialMedia({ instagram: e.target.value })}
                      placeholder="https://instagram.com/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>YouTube</Label>
                    <Input
                      value={settings.socialMedia.youtube || ""}
                      onChange={(e) => updateSocialMedia({ youtube: e.target.value })}
                      placeholder="https://youtube.com/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>LinkedIn</Label>
                    <Input
                      value={settings.socialMedia.linkedin || ""}
                      onChange={(e) => updateSocialMedia({ linkedin: e.target.value })}
                      placeholder="https://linkedin.com/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>TikTok</Label>
                    <Input
                      value={settings.socialMedia.tiktok || ""}
                      onChange={(e) => updateSocialMedia({ tiktok: e.target.value })}
                      placeholder="https://tiktok.com/@..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>WhatsApp</Label>
                    <Input
                      value={settings.socialMedia.whatsapp || ""}
                      onChange={(e) => updateSocialMedia({ whatsapp: e.target.value })}
                      placeholder="+966..."
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">{isAr ? "معلومات الاتصال" : "Contact Information"}</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={settings.contactInfo.showAddress}
                      onCheckedChange={(checked) => updateContactInfo({ showAddress: checked })}
                    />
                    <Label>{isAr ? "إظهار العنوان" : "Show address"}</Label>
                  </div>

                  {settings.contactInfo.showAddress && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{isAr ? "العنوان (عربي)" : "Address (Arabic)"}</Label>
                        <Input
                          value={settings.contactInfo.addressAr}
                          onChange={(e) => updateContactInfo({ addressAr: e.target.value })}
                          dir="rtl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{isAr ? "العنوان (إنجليزي)" : "Address (English)"}</Label>
                        <Input
                          value={settings.contactInfo.addressEn}
                          onChange={(e) => updateContactInfo({ addressEn: e.target.value })}
                          dir="ltr"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={settings.contactInfo.showPhone}
                      onCheckedChange={(checked) => updateContactInfo({ showPhone: checked })}
                    />
                    <Label>{isAr ? "إظهار الهاتف" : "Show phone"}</Label>
                  </div>

                  {settings.contactInfo.showPhone && (
                    <div className="space-y-2">
                      <Label>{isAr ? "رقم الهاتف" : "Phone Number"}</Label>
                      <Input
                        value={settings.contactInfo.phone}
                        onChange={(e) => updateContactInfo({ phone: e.target.value })}
                        placeholder="+966 XX XXX XXXX"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={settings.contactInfo.showEmail}
                      onCheckedChange={(checked) => updateContactInfo({ showEmail: checked })}
                    />
                    <Label>{isAr ? "إظهار البريد الإلكتروني" : "Show email"}</Label>
                  </div>

                  {settings.contactInfo.showEmail && (
                    <div className="space-y-2">
                      <Label>{isAr ? "البريد الإلكتروني" : "Email"}</Label>
                      <Input
                        value={settings.contactInfo.email}
                        onChange={(e) => updateContactInfo({ email: e.target.value })}
                        placeholder="info@example.com"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={settings.contactInfo.showWorkingHours}
                      onCheckedChange={(checked) => updateContactInfo({ showWorkingHours: checked })}
                    />
                    <Label>{isAr ? "إظهار ساعات العمل" : "Show working hours"}</Label>
                  </div>

                  {settings.contactInfo.showWorkingHours && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{isAr ? "ساعات العمل (عربي)" : "Working Hours (Arabic)"}</Label>
                        <Input
                          value={settings.contactInfo.workingHoursAr}
                          onChange={(e) => updateContactInfo({ workingHoursAr: e.target.value })}
                          dir="rtl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{isAr ? "ساعات العمل (إنجليزي)" : "Working Hours (English)"}</Label>
                        <Input
                          value={settings.contactInfo.workingHoursEn}
                          onChange={(e) => updateContactInfo({ workingHoursEn: e.target.value })}
                          dir="ltr"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            {/* Tab 4: Styling */}
            <TabsContent value="styling" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bgColor">{isAr ? "لون الخلفية" : "Background Color"}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="bgColor"
                      type="color"
                      value={settings.style.backgroundColor}
                      onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
                      className="w-20 h-10 p-1"
                    />
                    <Input
                      value={settings.style.backgroundColor}
                      onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="textColor">{isAr ? "لون النص" : "Text Color"}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="textColor"
                      type="color"
                      value={settings.style.textColor}
                      onChange={(e) => updateStyle({ textColor: e.target.value })}
                      className="w-20 h-10 p-1"
                    />
                    <Input
                      value={settings.style.textColor}
                      onChange={(e) => updateStyle({ textColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkColor">{isAr ? "لون الروابط" : "Link Color"}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="linkColor"
                      type="color"
                      value={settings.style.linkColor}
                      onChange={(e) => updateStyle({ linkColor: e.target.value })}
                      className="w-20 h-10 p-1"
                    />
                    <Input
                      value={settings.style.linkColor}
                      onChange={(e) => updateStyle({ linkColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkHoverColor">{isAr ? "لون الروابط عند التمرير" : "Link Hover Color"}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="linkHoverColor"
                      type="color"
                      value={settings.style.linkHoverColor}
                      onChange={(e) => updateStyle({ linkHoverColor: e.target.value })}
                      className="w-20 h-10 p-1"
                    />
                    <Input
                      value={settings.style.linkHoverColor}
                      onChange={(e) => updateStyle({ linkHoverColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="font">{isAr ? "الخط" : "Font"}</Label>
                  <Select
                    value={settings.style.font}
                    onValueChange={(value) => updateStyle({ font: value })}
                  >
                    <SelectTrigger id="font">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cairo">Cairo</SelectItem>
                      <SelectItem value="Tajawal">Tajawal</SelectItem>
                      <SelectItem value="Almarai">Almarai</SelectItem>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="padding">{isAr ? "المسافة الداخلية (px)" : "Padding (px)"}</Label>
                  <Input
                    id="padding"
                    type="number"
                    value={settings.style.padding}
                    onChange={(e) => updateStyle({ padding: parseInt(e.target.value) || 48 })}
                    min={0}
                    max={200}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Tab 5: Additional Elements */}
            <TabsContent value="additional" className="space-y-6">
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">{isAr ? "عناصر إضافية" : "Additional Elements"}</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={settings.showLogo}
                      onCheckedChange={(checked) => updateSettings({ showLogo: checked })}
                    />
                    <Label>{isAr ? "إظهار اللوجو" : "Show logo"}</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={settings.showNewsletter}
                      onCheckedChange={(checked) => updateSettings({ showNewsletter: checked })}
                    />
                    <Label>{isAr ? "إظهار النشرة البريدية" : "Show newsletter"}</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={settings.showBackToTop}
                      onCheckedChange={(checked) => updateSettings({ showBackToTop: checked })}
                    />
                    <Label>{isAr ? "إظهار زر العودة للأعلى" : "Show back to top button"}</Label>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">{isAr ? "حقوق النشر" : "Copyright"}</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{isAr ? "نص حقوق النشر (عربي)" : "Copyright Text (Arabic)"}</Label>
                    <Input
                      value={settings.copyrightAr}
                      onChange={(e) => updateSettings({ copyrightAr: e.target.value })}
                      dir="rtl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{isAr ? "نص حقوق النشر (إنجليزي)" : "Copyright Text (English)"}</Label>
                    <Input
                      value={settings.copyrightEn}
                      onChange={(e) => updateSettings({ copyrightEn: e.target.value })}
                      dir="ltr"
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">{isAr ? "أيقونات الدفع" : "Payment Icons"}</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{isAr ? "أيقونات الدفع" : "Payment Icons"}</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(settings.paymentIcons || []).map((icon, index) => (
                        <div key={index} className="relative group">
                          <img src={icon} alt={`Payment icon ${index + 1}`} className="h-10 w-auto border rounded p-1" />
                          <button
                            type="button"
                            onClick={() => {
                              const newIcons = [...(settings.paymentIcons || [])]
                              newIcons.splice(index, 1)
                              updateSettings({ paymentIcons: newIcons })
                            }}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder={isAr ? "أدخل رابط الأيقونة أو اختر من المكتبة" : "Enter icon URL or select from library"}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const input = e.target as HTMLInputElement
                            if (input.value.trim()) {
                              updateSettings({ paymentIcons: [...(settings.paymentIcons || []), input.value.trim()] })
                              input.value = ""
                            }
                          }
                        }}
                        className="flex-1"
                      />
                      <MediaPicker
                        onSelect={(item: MediaItem) => {
                          updateSettings({ paymentIcons: [...(settings.paymentIcons || []), item.url] })
                        }}
                        language={language}
                        filterType="image"
                        trigger={
                          <Button type="button" variant="outline" className="h-12 px-6 text-base gap-2">
                            <ImageIcon className="w-5 h-5" />
                            {language === "ar" ? "اختر من المكتبة" : "Select from Library"}
                          </Button>
                        }
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {isAr ? "اضغط Enter لإضافة رابط أو استخدم زر المكتبة" : "Press Enter to add URL or use library button"}
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Back Button */}
        <div className="mt-8">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/settings")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {isAr ? "← العودة للإعدادات" : "← Back to Settings"}
          </Button>
        </div>
      </div>
    </div>
  )
}
