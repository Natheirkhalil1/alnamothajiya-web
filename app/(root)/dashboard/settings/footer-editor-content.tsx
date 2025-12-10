import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Columns3, Palette, Plus, Settings as SettingsIcon, Trash2, ChevronUp, ChevronDown, Link as LinkIcon, ExternalLink } from "lucide-react"
import type { FooterSettings, FooterColumn } from "@/lib/storage"

// Type for footer links
interface FooterLink {
  labelAr: string
  labelEn: string
  linkType: 'page' | 'url'
  pageSlug?: string
  url?: string
}

interface FooterEditorContentProps {
  settings: FooterSettings
  isAr: boolean
  updateSettings: (updates: Partial<FooterSettings>) => void
  updateStyle: (styleUpdates: Partial<FooterSettings["style"]>) => void
  updateSocialMedia: (socialUpdates: Partial<FooterSettings["socialMedia"]>) => void
  updateContactInfo: (contactUpdates: Partial<FooterSettings["contactInfo"]>) => void
  addColumn: () => void
  updateColumn: (id: string, updates: Partial<FooterColumn>) => void
  deleteColumn: (id: string) => void
  moveColumn: (id: string, direction: "up" | "down") => void
}

export function FooterEditorContent({
  settings,
  isAr,
  updateSettings,
  updateStyle,
  updateSocialMedia,
  updateContactInfo,
  addColumn,
  updateColumn,
  deleteColumn,
  moveColumn
}: FooterEditorContentProps) {
  return (
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
                ? `التخطيط الحالي: ${settings.layout}. عدد الأعمدة: ${settings.columns?.length || 0}`
                : `Current layout: ${settings.layout}. Number of columns: ${settings.columns?.length || 0}`
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
          {settings.columns && settings.columns.map((column, index) => (
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
                    <div className="space-y-4 md:col-span-2">
                      <div className="flex items-center justify-between">
                        <Label>{isAr ? "الروابط" : "Links"}</Label>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const currentLinks = column.content.links || []
                            const newLink: FooterLink = {
                              labelAr: isAr ? "رابط جديد" : "رابط جديد",
                              labelEn: "New Link",
                              linkType: "url",
                              url: "#"
                            }
                            updateColumn(column.id, {
                              content: { ...column.content, links: [...currentLinks, newLink] }
                            })
                          }}
                          className="gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          {isAr ? "إضافة رابط" : "Add Link"}
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {(column.content.links || []).map((link, linkIndex) => (
                          <Card key={linkIndex} className="p-3 bg-muted/30">
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <Label className="text-xs">{isAr ? "العنوان (عربي)" : "Label (Arabic)"}</Label>
                                  <Input
                                    value={link.labelAr}
                                    onChange={(e) => {
                                      const newLinks = [...(column.content.links || [])]
                                      newLinks[linkIndex] = { ...newLinks[linkIndex], labelAr: e.target.value }
                                      updateColumn(column.id, {
                                        content: { ...column.content, links: newLinks }
                                      })
                                    }}
                                    dir="rtl"
                                    className="h-8 text-sm"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs">{isAr ? "العنوان (إنجليزي)" : "Label (English)"}</Label>
                                  <Input
                                    value={link.labelEn}
                                    onChange={(e) => {
                                      const newLinks = [...(column.content.links || [])]
                                      newLinks[linkIndex] = { ...newLinks[linkIndex], labelEn: e.target.value }
                                      updateColumn(column.id, {
                                        content: { ...column.content, links: newLinks }
                                      })
                                    }}
                                    className="h-8 text-sm"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <Label className="text-xs">{isAr ? "نوع الرابط" : "Link Type"}</Label>
                                  <Select
                                    value={link.linkType}
                                    onValueChange={(value: 'page' | 'url') => {
                                      const newLinks = [...(column.content.links || [])]
                                      newLinks[linkIndex] = {
                                        ...newLinks[linkIndex],
                                        linkType: value,
                                        pageSlug: value === 'page' ? (newLinks[linkIndex].pageSlug || '') : undefined,
                                        url: value === 'url' ? (newLinks[linkIndex].url || '#') : undefined
                                      }
                                      updateColumn(column.id, {
                                        content: { ...column.content, links: newLinks }
                                      })
                                    }}
                                  >
                                    <SelectTrigger className="h-8 text-sm">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="page">
                                        <div className="flex items-center gap-1">
                                          <LinkIcon className="w-3 h-3" />
                                          {isAr ? "صفحة" : "Page"}
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="url">
                                        <div className="flex items-center gap-1">
                                          <ExternalLink className="w-3 h-3" />
                                          {isAr ? "رابط خارجي" : "URL"}
                                        </div>
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-1">
                                  {link.linkType === 'page' ? (
                                    <>
                                      <Label className="text-xs">{isAr ? "معرف الصفحة" : "Page Slug"}</Label>
                                      <Input
                                        value={link.pageSlug || ''}
                                        onChange={(e) => {
                                          const newLinks = [...(column.content.links || [])]
                                          newLinks[linkIndex] = { ...newLinks[linkIndex], pageSlug: e.target.value }
                                          updateColumn(column.id, {
                                            content: { ...column.content, links: newLinks }
                                          })
                                        }}
                                        placeholder="home, about, contact..."
                                        className="h-8 text-sm"
                                      />
                                    </>
                                  ) : (
                                    <>
                                      <Label className="text-xs">{isAr ? "الرابط" : "URL"}</Label>
                                      <Input
                                        value={link.url || ''}
                                        onChange={(e) => {
                                          const newLinks = [...(column.content.links || [])]
                                          newLinks[linkIndex] = { ...newLinks[linkIndex], url: e.target.value }
                                          updateColumn(column.id, {
                                            content: { ...column.content, links: newLinks }
                                          })
                                        }}
                                        placeholder="https://... or /#section"
                                        className="h-8 text-sm"
                                      />
                                    </>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  disabled={linkIndex === 0}
                                  onClick={() => {
                                    const newLinks = [...(column.content.links || [])]
                                    ;[newLinks[linkIndex - 1], newLinks[linkIndex]] = [newLinks[linkIndex], newLinks[linkIndex - 1]]
                                    updateColumn(column.id, {
                                      content: { ...column.content, links: newLinks }
                                    })
                                  }}
                                >
                                  <ChevronUp className="w-4 h-4" />
                                </Button>
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  disabled={linkIndex === (column.content.links || []).length - 1}
                                  onClick={() => {
                                    const newLinks = [...(column.content.links || [])]
                                    ;[newLinks[linkIndex], newLinks[linkIndex + 1]] = [newLinks[linkIndex + 1], newLinks[linkIndex]]
                                    updateColumn(column.id, {
                                      content: { ...column.content, links: newLinks }
                                    })
                                  }}
                                >
                                  <ChevronDown className="w-4 h-4" />
                                </Button>
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 text-destructive hover:text-destructive"
                                  onClick={() => {
                                    const newLinks = (column.content.links || []).filter((_, i) => i !== linkIndex)
                                    updateColumn(column.id, {
                                      content: { ...column.content, links: newLinks }
                                    })
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}

                        {(!column.content.links || column.content.links.length === 0) && (
                          <div className="text-center py-4 text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                            {isAr ? "لا توجد روابط. انقر على 'إضافة رابط' للبدء." : "No links. Click 'Add Link' to start."}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {column.type === "contact" && (
                    <div className="space-y-4 md:col-span-2">
                      <div className="flex items-center justify-between">
                        <Label>{isAr ? "عناصر الاتصال" : "Contact Items"}</Label>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const currentItems = column.content.contactItems || []
                            const newItem = {
                              icon: "phone",
                              labelAr: "الهاتف",
                              labelEn: "Phone",
                              value: ""
                            }
                            updateColumn(column.id, {
                              content: { ...column.content, contactItems: [...currentItems, newItem] }
                            })
                          }}
                          className="gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          {isAr ? "إضافة عنصر" : "Add Item"}
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {(column.content.contactItems || []).map((item, itemIndex) => (
                          <Card key={itemIndex} className="p-3 bg-muted/30">
                            <div className="space-y-3">
                              <div className="grid grid-cols-3 gap-2">
                                <div className="space-y-1">
                                  <Label className="text-xs">{isAr ? "الأيقونة" : "Icon"}</Label>
                                  <Select
                                    value={item.icon}
                                    onValueChange={(value) => {
                                      const newItems = [...(column.content.contactItems || [])]
                                      newItems[itemIndex] = { ...newItems[itemIndex], icon: value }
                                      updateColumn(column.id, {
                                        content: { ...column.content, contactItems: newItems }
                                      })
                                    }}
                                  >
                                    <SelectTrigger className="h-8 text-sm">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="phone">{isAr ? "هاتف" : "Phone"}</SelectItem>
                                      <SelectItem value="mail">{isAr ? "بريد" : "Email"}</SelectItem>
                                      <SelectItem value="map-pin">{isAr ? "موقع" : "Location"}</SelectItem>
                                      <SelectItem value="clock">{isAr ? "ساعات" : "Hours"}</SelectItem>
                                      <SelectItem value="globe">{isAr ? "موقع ويب" : "Website"}</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs">{isAr ? "العنوان (عربي)" : "Label (Arabic)"}</Label>
                                  <Input
                                    value={item.labelAr}
                                    onChange={(e) => {
                                      const newItems = [...(column.content.contactItems || [])]
                                      newItems[itemIndex] = { ...newItems[itemIndex], labelAr: e.target.value }
                                      updateColumn(column.id, {
                                        content: { ...column.content, contactItems: newItems }
                                      })
                                    }}
                                    dir="rtl"
                                    className="h-8 text-sm"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs">{isAr ? "العنوان (إنجليزي)" : "Label (English)"}</Label>
                                  <Input
                                    value={item.labelEn}
                                    onChange={(e) => {
                                      const newItems = [...(column.content.contactItems || [])]
                                      newItems[itemIndex] = { ...newItems[itemIndex], labelEn: e.target.value }
                                      updateColumn(column.id, {
                                        content: { ...column.content, contactItems: newItems }
                                      })
                                    }}
                                    className="h-8 text-sm"
                                  />
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <div className="flex-1 space-y-1">
                                  <Label className="text-xs">{isAr ? "القيمة" : "Value"}</Label>
                                  <Input
                                    value={item.value}
                                    onChange={(e) => {
                                      const newItems = [...(column.content.contactItems || [])]
                                      newItems[itemIndex] = { ...newItems[itemIndex], value: e.target.value }
                                      updateColumn(column.id, {
                                        content: { ...column.content, contactItems: newItems }
                                      })
                                    }}
                                    placeholder={item.icon === 'phone' ? '+966...' : item.icon === 'mail' ? 'info@example.com' : isAr ? 'القيمة...' : 'Value...'}
                                    className="h-8 text-sm"
                                  />
                                </div>
                                <div className="flex items-end gap-1">
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8"
                                    disabled={itemIndex === 0}
                                    onClick={() => {
                                      const newItems = [...(column.content.contactItems || [])]
                                      ;[newItems[itemIndex - 1], newItems[itemIndex]] = [newItems[itemIndex], newItems[itemIndex - 1]]
                                      updateColumn(column.id, {
                                        content: { ...column.content, contactItems: newItems }
                                      })
                                    }}
                                  >
                                    <ChevronUp className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8"
                                    disabled={itemIndex === (column.content.contactItems || []).length - 1}
                                    onClick={() => {
                                      const newItems = [...(column.content.contactItems || [])]
                                      ;[newItems[itemIndex], newItems[itemIndex + 1]] = [newItems[itemIndex + 1], newItems[itemIndex]]
                                      updateColumn(column.id, {
                                        content: { ...column.content, contactItems: newItems }
                                      })
                                    }}
                                  >
                                    <ChevronDown className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                    onClick={() => {
                                      const newItems = (column.content.contactItems || []).filter((_, i) => i !== itemIndex)
                                      updateColumn(column.id, {
                                        content: { ...column.content, contactItems: newItems }
                                      })
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}

                        {(!column.content.contactItems || column.content.contactItems.length === 0) && (
                          <div className="text-center py-4 text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                            {isAr ? "لا توجد عناصر. انقر على 'إضافة عنصر' للبدء." : "No items. Click 'Add Item' to start."}
                          </div>
                        )}
                      </div>
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

          {(!settings.columns || settings.columns.length === 0) && (
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
                value={settings.socialMedia?.facebook || ""}
                onChange={(e) => updateSocialMedia({ facebook: e.target.value })}
                placeholder="https://facebook.com/..."
              />
            </div>

            <div className="space-y-2">
              <Label>Twitter / X</Label>
              <Input
                value={settings.socialMedia?.twitter || ""}
                onChange={(e) => updateSocialMedia({ twitter: e.target.value })}
                placeholder="https://twitter.com/..."
              />
            </div>

            <div className="space-y-2">
              <Label>Instagram</Label>
              <Input
                value={settings.socialMedia?.instagram || ""}
                onChange={(e) => updateSocialMedia({ instagram: e.target.value })}
                placeholder="https://instagram.com/..."
              />
            </div>

            <div className="space-y-2">
              <Label>YouTube</Label>
              <Input
                value={settings.socialMedia?.youtube || ""}
                onChange={(e) => updateSocialMedia({ youtube: e.target.value })}
                placeholder="https://youtube.com/..."
              />
            </div>

            <div className="space-y-2">
              <Label>LinkedIn</Label>
              <Input
                value={settings.socialMedia?.linkedin || ""}
                onChange={(e) => updateSocialMedia({ linkedin: e.target.value })}
                placeholder="https://linkedin.com/..."
              />
            </div>

            <div className="space-y-2">
              <Label>TikTok</Label>
              <Input
                value={settings.socialMedia?.tiktok || ""}
                onChange={(e) => updateSocialMedia({ tiktok: e.target.value })}
                placeholder="https://tiktok.com/@..."
              />
            </div>

            <div className="space-y-2">
              <Label>WhatsApp</Label>
              <Input
                value={settings.socialMedia?.whatsapp || ""}
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
                checked={settings.contactInfo?.showAddress || false}
                onCheckedChange={(checked) => updateContactInfo({ showAddress: checked })}
              />
              <Label>{isAr ? "إظهار العنوان" : "Show address"}</Label>
            </div>

            {settings.contactInfo?.showAddress && (
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
                checked={settings.contactInfo?.showPhone || false}
                onCheckedChange={(checked) => updateContactInfo({ showPhone: checked })}
              />
              <Label>{isAr ? "إظهار الهاتف" : "Show phone"}</Label>
            </div>

            {settings.contactInfo?.showPhone && (
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
                checked={settings.contactInfo?.showEmail || false}
                onCheckedChange={(checked) => updateContactInfo({ showEmail: checked })}
              />
              <Label>{isAr ? "إظهار البريد الإلكتروني" : "Show email"}</Label>
            </div>

            {settings.contactInfo?.showEmail && (
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
                checked={settings.contactInfo?.showWorkingHours || false}
                onCheckedChange={(checked) => updateContactInfo({ showWorkingHours: checked })}
              />
              <Label>{isAr ? "إظهار ساعات العمل" : "Show working hours"}</Label>
            </div>

            {settings.contactInfo?.showWorkingHours && (
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
                value={settings.style?.backgroundColor || "#1a1a1a"}
                onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
                className="w-20 h-10 p-1"
              />
              <Input
                value={settings.style?.backgroundColor || "#1a1a1a"}
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
                value={settings.style?.textColor || "#ffffff"}
                onChange={(e) => updateStyle({ textColor: e.target.value })}
                className="w-20 h-10 p-1"
              />
              <Input
                value={settings.style?.textColor || "#ffffff"}
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
                value={settings.style?.linkColor || "#60a5fa"}
                onChange={(e) => updateStyle({ linkColor: e.target.value })}
                className="w-20 h-10 p-1"
              />
              <Input
                value={settings.style?.linkColor || "#60a5fa"}
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
                value={settings.style?.linkHoverColor || "#93c5fd"}
                onChange={(e) => updateStyle({ linkHoverColor: e.target.value })}
                className="w-20 h-10 p-1"
              />
              <Input
                value={settings.style?.linkHoverColor || "#93c5fd"}
                onChange={(e) => updateStyle({ linkHoverColor: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="font">{isAr ? "الخط" : "Font"}</Label>
            <Select
              value={settings.style?.font || "Cairo"}
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
              value={settings.style?.padding || 48}
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
                checked={settings.showLogo || false}
                onCheckedChange={(checked) => updateSettings({ showLogo: checked })}
              />
              <Label>{isAr ? "إظهار اللوجو" : "Show logo"}</Label>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={settings.showNewsletter || false}
                onCheckedChange={(checked) => updateSettings({ showNewsletter: checked })}
              />
              <Label>{isAr ? "إظهار النشرة البريدية" : "Show newsletter"}</Label>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={settings.showBackToTop || false}
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
              <Label>{isAr ? "أيقونات الدفع (URLs مفصولة بفاصلة)" : "Payment Icons (Comma-separated URLs)"}</Label>
              <Textarea
                value={settings.paymentIcons?.join(", ") || ""}
                onChange={(e) => {
                  const icons = e.target.value.split(",").map(url => url.trim()).filter(Boolean)
                  updateSettings({ paymentIcons: icons })
                }}
                placeholder="/icons/visa.svg, /icons/mastercard.svg"
                rows={3}
              />
            </div>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
