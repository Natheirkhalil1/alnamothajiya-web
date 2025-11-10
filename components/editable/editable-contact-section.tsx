"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

interface ContactInfo {
  email?: string
  phone?: string
  addressAr?: string
  addressEn?: string
  hoursAr?: string
  hoursEn?: string
}

interface EditableContactSectionProps {
  sectionTitle?: { ar?: string; en?: string }
  sectionSubtitle?: { ar?: string; en?: string }
  contactInfo?: ContactInfo
  showForm?: boolean
  lang?: "ar" | "en"
  className?: string
}

export function EditableContactSection({
  sectionTitle,
  sectionSubtitle,
  contactInfo = {},
  showForm = true,
  lang = "en",
  className = "",
}: EditableContactSectionProps) {
  return (
    <section className={`py-20 ${className}`} dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        {(sectionTitle?.ar || sectionTitle?.en) && (
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {lang === "ar" ? sectionTitle?.ar : sectionTitle?.en}
            </h2>
            {(sectionSubtitle?.ar || sectionSubtitle?.en) && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {lang === "ar" ? sectionSubtitle?.ar : sectionSubtitle?.en}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: lang === "ar" ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold mb-6">{lang === "ar" ? "معلومات الاتصال" : "Contact Information"}</h3>

            {contactInfo.email && (
              <Card className="p-6 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{lang === "ar" ? "البريد الإلكتروني" : "Email"}</h4>
                    <a href={`mailto:${contactInfo.email}`} className="text-muted-foreground hover:text-primary">
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
              </Card>
            )}

            {contactInfo.phone && (
              <Card className="p-6 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{lang === "ar" ? "الهاتف" : "Phone"}</h4>
                    <a href={`tel:${contactInfo.phone}`} className="text-muted-foreground hover:text-primary">
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>
              </Card>
            )}

            {(contactInfo.addressAr || contactInfo.addressEn) && (
              <Card className="p-6 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white group-hover:scale-110 transition-transform">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{lang === "ar" ? "العنوان" : "Address"}</h4>
                    <p className="text-muted-foreground">
                      {lang === "ar" ? contactInfo.addressAr : contactInfo.addressEn}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {(contactInfo.hoursAr || contactInfo.hoursEn) && (
              <Card className="p-6 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white group-hover:scale-110 transition-transform">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{lang === "ar" ? "ساعات العمل" : "Working Hours"}</h4>
                    <p className="text-muted-foreground">{lang === "ar" ? contactInfo.hoursAr : contactInfo.hoursEn}</p>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>

          {/* Contact Form */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, x: lang === "ar" ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="p-8">
                <h3 className="text-2xl font-bold mb-6">{lang === "ar" ? "أرسل رسالة" : "Send a Message"}</h3>
                <form className="space-y-6">
                  <div>
                    <Input placeholder={lang === "ar" ? "اسمك" : "Your Name"} />
                  </div>
                  <div>
                    <Input type="email" placeholder={lang === "ar" ? "بريدك الإلكتروني" : "Your Email"} />
                  </div>
                  <div>
                    <Input placeholder={lang === "ar" ? "الموضوع" : "Subject"} />
                  </div>
                  <div>
                    <Textarea placeholder={lang === "ar" ? "رسالتك" : "Your Message"} rows={5} />
                  </div>
                  <Button type="submit" className="w-full">
                    {lang === "ar" ? "إرسال" : "Send Message"}
                  </Button>
                </form>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
