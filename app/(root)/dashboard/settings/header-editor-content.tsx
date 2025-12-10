import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Menu, Palette, Plus, Settings as SettingsIcon } from "lucide-react"
import type { HeaderSettings, MenuItem } from "@/lib/storage"

interface HeaderEditorContentProps {
  settings: HeaderSettings
  isAr: boolean
  updateSettings: (updates: Partial<HeaderSettings>) => void
  updateStyle: (styleUpdates: Partial<HeaderSettings["style"]>) => void
  updateCtaButton: (ctaUpdates: Partial<NonNullable<HeaderSettings["ctaButton"]>>) => void
  updateContactInfo: (contactUpdates: Partial<NonNullable<HeaderSettings["contactInfo"]>>) => void
  addMenuItem: () => void
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void
  deleteMenuItem: (id: string) => void
  moveMenuItem: (id: string, direction: "up" | "down") => void
}

export function HeaderEditorContent({
  settings,
  isAr,
  updateSettings,
  updateStyle,
  updateCtaButton,
  updateContactInfo,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  moveMenuItem
}: HeaderEditorContentProps) {
  return (
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

      {/* Tab 1: Menu Builder */}
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

      {/* Tab 2: Styling */}
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

      {/* Tab 3: Additional Elements */}
      <TabsContent value="additional" className="space-y-6">
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
  )
}
