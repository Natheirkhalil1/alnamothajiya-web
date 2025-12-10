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
import { Layout, Save, RotateCcw, ArrowLeft, Menu, Palette, Plus, Settings as SettingsIcon } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { getHeaderSettingsAsync, saveHeaderSettingsAsync, resetHeaderSettingsAsync } from "@/lib/settings"
import type { HeaderSettings, MenuItem } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

export default function HeaderEditorPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const { toast } = useToast()
  const isAr = language === "ar"

  const [settings, setSettings] = useState<HeaderSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const headerSettings = await getHeaderSettingsAsync()
        setSettings(headerSettings)
        setLoading(false)
      } catch (error) {
        console.error("[v0] Failed to load header settings:", error)
        toast({
          variant: "destructive",
          title: isAr ? "خطأ" : "Error",
          description: isAr ? "فشل تحميل إعدادات الهيدر" : "Failed to load header settings"
        })
        setLoading(false)
      }
    }
    loadSettings()
  }, [isAr, toast])

  const handleSave = async () => {
    if (!settings) return
    try {
      await saveHeaderSettingsAsync(settings)
      toast({
        title: isAr ? "تم الحفظ" : "Saved",
        description: isAr ? "تم حفظ إعدادات الهيدر بنجاح" : "Header settings saved successfully"
      })
    } catch (error) {
      console.error("[v0] Failed to save header settings:", error)
      toast({
        variant: "destructive",
        title: isAr ? "خطأ" : "Error",
        description: isAr ? "فشل حفظ إعدادات الهيدر" : "Failed to save header settings"
      })
    }
  }

  const handleReset = async () => {
    if (confirm(isAr ? "هل أنت متأكد من إعادة التعيين إلى الإعدادات الافتراضية؟" : "Are you sure you want to reset to default settings?")) {
      const defaultSettings = await resetHeaderSettingsAsync()
      setSettings(defaultSettings)
      toast({
        title: isAr ? "تمت الإعادة" : "Reset",
        description: isAr ? "تمت إعادة التعيين إلى الإعدادات الافتراضية" : "Reset to default settings"
      })
    }
  }

  const updateSettings = (updates: Partial<HeaderSettings>) => {
    setSettings(prev => prev ? { ...prev, ...updates } : null)
  }

  const updateStyle = (styleUpdates: Partial<HeaderSettings["style"]>) => {
    setSettings(prev => prev ? {
      ...prev,
      style: { ...prev.style, ...styleUpdates }
    } : null)
  }

  const updateCtaButton = (ctaUpdates: Partial<NonNullable<HeaderSettings["ctaButton"]>>) => {
    setSettings(prev => prev ? {
      ...prev,
      ctaButton: { ...prev.ctaButton, ...ctaUpdates } as any
    } : null)
  }

  const updateContactInfo = (contactUpdates: Partial<NonNullable<HeaderSettings["contactInfo"]>>) => {
    setSettings(prev => prev ? {
      ...prev,
      contactInfo: { ...prev.contactInfo, ...contactUpdates } as any
    } : null)
  }

  const addMenuItem = () => {
    if (!settings) return
    const newItem: MenuItem = {
      id: `menu-${Date.now()}`,
      labelAr: "عنصر جديد",
      labelEn: "New Item",
      linkType: "url",
      url: "#",
      openInNewTab: false,
      order: settings.menuItems.length + 1
    }
    updateSettings({ menuItems: [...settings.menuItems, newItem] })
  }

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    if (!settings) return
    updateSettings({
      menuItems: settings.menuItems.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    })
  }

  const deleteMenuItem = (id: string) => {
    if (!settings) return
    updateSettings({
      menuItems: settings.menuItems.filter(item => item.id !== id)
    })
  }

  const moveMenuItem = (id: string, direction: "up" | "down") => {
    if (!settings) return
    const index = settings.menuItems.findIndex(item => item.id === id)
    if (index === -1) return
    if (direction === "up" && index === 0) return
    if (direction === "down" && index === settings.menuItems.length - 1) return

    const newItems = [...settings.menuItems]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    ;[newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]]

    // Update order values
    newItems.forEach((item, idx) => {
      item.order = idx + 1
    })

    updateSettings({ menuItems: newItems })
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
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Layout className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">
                  {isAr ? "تخصيص الهيدر" : "Header Customization"}
                </h1>
                <p className="text-muted-foreground text-lg">
                  {isAr ? "تعديل اللوجو، القائمة، الألوان، والعناصر الإضافية" : "Edit logo, menu, colors, and additional elements"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleReset} variant="outline" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                {isAr ? "إعادة تعيين" : "Reset"}
              </Button>
              <Button onClick={handleSave} className="gap-2 bg-gradient-to-r from-blue-500 to-blue-600">
                <Save className="w-4 h-4" />
                {isAr ? "حفظ التغييرات" : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Card className="p-6">
          <Tabs defaultValue="menu" dir={isAr ? "rtl" : "ltr"}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="menu">
                <Menu className="w-4 h-4 mr-2" />
                {isAr ? "القائمة" : "Menu"}
              </TabsTrigger>
              <TabsTrigger value="styling">
                <Palette className="w-4 h-4 mr-2" />
                {isAr ? "التنسيق" : "Styling"}
              </TabsTrigger>
              <TabsTrigger value="additional">
                <SettingsIcon className="w-4 h-4 mr-2" />
                {isAr ? "عناصر إضافية" : "Additional"}
              </TabsTrigger>
            </TabsList>

            {/* Tab 2: Menu Builder */}
            <TabsContent value="menu" className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {isAr ? "عناصر القائمة" : "Menu Items"}
                </h3>
                <Button onClick={addMenuItem} size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  {isAr ? "إضافة عنصر" : "Add Item"}
                </Button>
              </div>

              <div className="space-y-4">
                {settings.menuItems.map((item, index) => (
                  <Card key={item.id} className="p-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{isAr ? "التسمية (عربي)" : "Label (Arabic)"}</Label>
                        <Input
                          value={item.labelAr}
                          onChange={(e) => updateMenuItem(item.id, { labelAr: e.target.value })}
                          dir="rtl"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>{isAr ? "التسمية (إنجليزي)" : "Label (English)"}</Label>
                        <Input
                          value={item.labelEn}
                          onChange={(e) => updateMenuItem(item.id, { labelEn: e.target.value })}
                          dir="ltr"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>{isAr ? "نوع الرابط" : "Link Type"}</Label>
                        <Select
                          value={item.linkType}
                          onValueChange={(value: "page" | "url" | "section") =>
                            updateMenuItem(item.id, { linkType: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="page">{isAr ? "صفحة" : "Page"}</SelectItem>
                            <SelectItem value="url">{isAr ? "رابط مخصص" : "Custom URL"}</SelectItem>
                            <SelectItem value="section">{isAr ? "قسم" : "Section"}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {item.linkType === "page" && (
                        <div className="space-y-2">
                          <Label>{isAr ? "معرّف الصفحة" : "Page Slug"}</Label>
                          <Input
                            value={item.pageSlug || ""}
                            onChange={(e) => updateMenuItem(item.id, { pageSlug: e.target.value })}
                            placeholder="home"
                          />
                        </div>
                      )}

                      {item.linkType === "url" && (
                        <div className="space-y-2">
                          <Label>{isAr ? "الرابط" : "URL"}</Label>
                          <Input
                            value={item.url || ""}
                            onChange={(e) => updateMenuItem(item.id, { url: e.target.value })}
                            placeholder="https://..."
                          />
                        </div>
                      )}

                      {item.linkType === "section" && (
                        <div className="space-y-2">
                          <Label>{isAr ? "معرّف القسم" : "Section ID"}</Label>
                          <Input
                            value={item.sectionId || ""}
                            onChange={(e) => updateMenuItem(item.id, { sectionId: e.target.value })}
                            placeholder="about"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-2 md:col-span-2">
                        <Switch
                          checked={item.openInNewTab}
                          onCheckedChange={(checked) => updateMenuItem(item.id, { openInNewTab: checked })}
                        />
                        <Label>{isAr ? "فتح في تبويب جديد" : "Open in new tab"}</Label>
                      </div>

                      <div className="flex gap-2 md:col-span-2">
                        <Button
                          onClick={() => moveMenuItem(item.id, "up")}
                          variant="outline"
                          size="sm"
                          disabled={index === 0}
                        >
                          ↑
                        </Button>
                        <Button
                          onClick={() => moveMenuItem(item.id, "down")}
                          variant="outline"
                          size="sm"
                          disabled={index === settings.menuItems.length - 1}
                        >
                          ↓
                        </Button>
                        <Button
                          onClick={() => deleteMenuItem(item.id)}
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

                {settings.menuItems.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    {isAr ? "لا توجد عناصر في القائمة. انقر على 'إضافة عنصر' للبدء." : "No menu items. Click 'Add Item' to start."}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Tab 3: Styling */}
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
                  <Label htmlFor="hoverColor">{isAr ? "لون التمرير" : "Hover Color"}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="hoverColor"
                      type="color"
                      value={settings.style.hoverColor}
                      onChange={(e) => updateStyle({ hoverColor: e.target.value })}
                      className="w-20 h-10 p-1"
                    />
                    <Input
                      value={settings.style.hoverColor}
                      onChange={(e) => updateStyle({ hoverColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activeColor">{isAr ? "لون النشط" : "Active Color"}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="activeColor"
                      type="color"
                      value={settings.style.activeColor}
                      onChange={(e) => updateStyle({ activeColor: e.target.value })}
                      className="w-20 h-10 p-1"
                    />
                    <Input
                      value={settings.style.activeColor}
                      onChange={(e) => updateStyle({ activeColor: e.target.value })}
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
                  <Label htmlFor="height">{isAr ? "الارتفاع (px)" : "Height (px)"}</Label>
                  <Input
                    id="height"
                    type="number"
                    value={settings.style.height}
                    onChange={(e) => updateStyle({ height: parseInt(e.target.value) || 80 })}
                    min={60}
                    max={200}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shadow">{isAr ? "الظل" : "Shadow"}</Label>
                  <Select
                    value={settings.style.shadow}
                    onValueChange={(value: "none" | "sm" | "md" | "lg" | "xl") => updateStyle({ shadow: value })}
                  >
                    <SelectTrigger id="shadow">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">{isAr ? "بدون" : "None"}</SelectItem>
                      <SelectItem value="sm">{isAr ? "صغير" : "Small"}</SelectItem>
                      <SelectItem value="md">{isAr ? "متوسط" : "Medium"}</SelectItem>
                      <SelectItem value="lg">{isAr ? "كبير" : "Large"}</SelectItem>
                      <SelectItem value="xl">{isAr ? "كبير جداً" : "Extra Large"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-4 md:col-span-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={settings.style.isSticky}
                      onCheckedChange={(checked) => updateStyle({ isSticky: checked })}
                    />
                    <Label>{isAr ? "ثابت عند التمرير" : "Sticky on scroll"}</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={settings.style.isTransparent}
                      onCheckedChange={(checked) => updateStyle({ isTransparent: checked })}
                    />
                    <Label>{isAr ? "شفاف" : "Transparent"}</Label>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab 4: Additional Elements */}
            <TabsContent value="additional" className="space-y-6">
              {/* Language Switcher */}
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">{isAr ? "مبدل اللغة" : "Language Switcher"}</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={settings.showLanguageSwitcher}
                      onCheckedChange={(checked) => updateSettings({ showLanguageSwitcher: checked })}
                    />
                    <Label>{isAr ? "إظهار مبدل اللغة" : "Show language switcher"}</Label>
                  </div>

                  {settings.showLanguageSwitcher && (
                    <div className="space-y-2">
                      <Label>{isAr ? "موضع مبدل اللغة" : "Language Switcher Position"}</Label>
                      <Select
                        value={settings.languageSwitcherPosition}
                        onValueChange={(value: "left" | "right") => updateSettings({ languageSwitcherPosition: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">{isAr ? "يسار" : "Left"}</SelectItem>
                          <SelectItem value="right">{isAr ? "يمين" : "Right"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </Card>

              {/* Search */}
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">{isAr ? "البحث" : "Search"}</h3>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={settings.showSearch}
                    onCheckedChange={(checked) => updateSettings({ showSearch: checked })}
                  />
                  <Label>{isAr ? "إظهار البحث" : "Show search"}</Label>
                </div>
              </Card>

              {/* CTA Button */}
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">{isAr ? "زر الدعوة لاتخاذ إجراء" : "CTA Button"}</h3>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{isAr ? "النص (عربي)" : "Text (Arabic)"}</Label>
                      <Input
                        value={settings.ctaButton?.labelAr || ""}
                        onChange={(e) => updateCtaButton({ labelAr: e.target.value })}
                        dir="rtl"
                        placeholder={isAr ? "اترك فارغاً لإخفاء الزر" : "Leave empty to hide button"}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>{isAr ? "النص (إنجليزي)" : "Text (English)"}</Label>
                      <Input
                        value={settings.ctaButton?.labelEn || ""}
                        onChange={(e) => updateCtaButton({ labelEn: e.target.value })}
                        dir="ltr"
                        placeholder={isAr ? "اترك فارغاً لإخفاء الزر" : "Leave empty to hide button"}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label>{isAr ? "الرابط" : "Link"}</Label>
                      <Input
                        value={settings.ctaButton?.link || ""}
                        onChange={(e) => updateCtaButton({ link: e.target.value })}
                        placeholder="#contact"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Contact Info */}
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">{isAr ? "معلومات الاتصال" : "Contact Info"}</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={settings.contactInfo?.showPhone || false}
                      onCheckedChange={(checked) => updateContactInfo({ showPhone: checked })}
                    />
                    <Label>{isAr ? "إظهار الهاتف" : "Show phone"}</Label>
                  </div>

                  {settings.contactInfo?.showPhone && (
                    <div className="space-y-2">
                      <Label>{isAr ? "رقم الهاتف" : "Phone Number"}</Label>
                      <Input
                        value={settings.contactInfo?.phone || ""}
                        onChange={(e) => updateContactInfo({ phone: e.target.value })}
                        placeholder="+966 XX XXX XXXX"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={settings.contactInfo?.showEmail || false}
                      onCheckedChange={(checked) => updateContactInfo({ showEmail: checked })}
                    />
                    <Label>{isAr ? "إظهار البريد الإلكتروني" : "Show email"}</Label>
                  </div>

                  {settings.contactInfo?.showEmail && (
                    <div className="space-y-2">
                      <Label>{isAr ? "البريد الإلكتروني" : "Email"}</Label>
                      <Input
                        value={settings.contactInfo?.email || ""}
                        onChange={(e) => updateContactInfo({ email: e.target.value })}
                        placeholder="info@example.com"
                      />
                    </div>
                  )}
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
