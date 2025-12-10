"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import Image from "next/image"
import {
  LayoutDashboard,
  FileText,
  ImageIcon,
  Clock,
  Briefcase,
  MessageSquare,
  Settings,
  Contact,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Eye,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import {
  getDynamicPages,
  getPendingReviews,
  getEnhancedEmploymentApplications,
  getContactMessages,
  getTestimonials,
  getRejectedReviews,
} from "@/lib/storage"

interface NavItem {
  id: string
  label: string
  href: string
  icon: React.ElementType
  color: string
  badge?: number
}

interface NavGroup {
  type: "single" | "group"
  id: string
  label: string
  icon: React.ElementType
  color?: string
  href?: string
  items?: NavItem[]
}

export function DashboardSidebar() {
  const { language } = useLanguage()
  const { logout, username } = useAuth()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentSection = searchParams.get("section") || "overview"
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["content", "reviews", "jobs", "forms", "settings"])

  // Badge counts
  const [pagesCount, setPagesCount] = useState(0)
  const [pendingReviewsCount, setPendingReviewsCount] = useState(0)
  const [pendingApplicationsCount, setPendingApplicationsCount] = useState(0)
  const [messagesCount, setMessagesCount] = useState(0)
  const [reviewsCount, setReviewsCount] = useState(0)

  useEffect(() => {
    // Load counts for badges
    const pages = getDynamicPages()
    const reviews = getPendingReviews()
    const applications = getEnhancedEmploymentApplications()
    const messages = getContactMessages()

    setPagesCount(pages.length)
    setPendingReviewsCount(reviews.length)
    setPendingApplicationsCount(applications.filter((app) => app.status === "pending").length)
    setMessagesCount(messages.length)

    // Load approved and rejected reviews count
    const loadReviewsCount = async () => {
      const approved = await getTestimonials()
      const rejected = getRejectedReviews()
      setReviewsCount(approved.length + rejected.length)
    }
    loadReviewsCount()
  }, [pathname])

  const navigationGroups: NavGroup[] = [
    {
      type: "single",
      id: "overview",
      label: language === "ar" ? "نظرة عامة" : "Overview",
      icon: LayoutDashboard,
      color: "from-blue-500 to-blue-600",
      href: "/dashboard",
    },
    {
      type: "group",
      id: "content",
      label: language === "ar" ? "إدارة المحتوى" : "Content Management",
      icon: FileText,
      items: [
        {
          id: "pages",
          label: language === "ar" ? "الصفحات" : "Pages",
          href: "/dashboard/pages",
          icon: FileText,
          color: "from-violet-500 to-violet-600",
          badge: pagesCount,
        },
        {
          id: "galleries",
          label: language === "ar" ? "المعارض" : "Galleries",
          href: "/dashboard/galleries",
          icon: ImageIcon,
          color: "from-pink-500 to-pink-600",
        },
      ],
    },
    {
      type: "group",
      id: "reviews",
      label: language === "ar" ? "الأشخاص والتقييمات" : "People & Reviews",
      icon: Clock,
      items: [
        {
          id: "pending",
          label: language === "ar" ? "تقييمات معلقة" : "Pending Reviews",
          href: "/dashboard/pending-reviews",
          icon: Clock,
          color: "from-amber-500 to-amber-600",
          badge: pendingReviewsCount,
        },
        {
          id: "reviews",
          label: language === "ar" ? "التقييمات" : "Reviews",
          href: "/dashboard/reviews",
          icon: Star,
          color: "from-yellow-500 to-yellow-600",
          badge: reviewsCount,
        },
      ],
    },
    {
      type: "group",
      id: "jobs",
      label: language === "ar" ? "الوظائف" : "Jobs",
      icon: Briefcase,
      items: [
        {
          id: "jobs",
          label: language === "ar" ? "الوظائف" : "Job Positions",
          href: "/dashboard/jobs",
          icon: Briefcase,
          color: "from-cyan-500 to-cyan-600",
        },
        {
          id: "applications",
          label: language === "ar" ? "طلبات التوظيف" : "Applications",
          href: "/dashboard/applications",
          icon: FileText,
          color: "from-indigo-500 to-indigo-600",
          badge: pendingApplicationsCount,
        },
      ],
    },
    {
      type: "group",
      id: "forms",
      label: language === "ar" ? "الرسائل والنماذج" : "Messages & Forms",
      icon: MessageSquare,
      items: [
        {
          id: "messages",
          label: language === "ar" ? "رسائل الاتصال" : "Contact Messages",
          href: "/dashboard/messages",
          icon: MessageSquare,
          color: "from-teal-500 to-teal-600",
          badge: messagesCount,
        },
        {
          id: "forms",
          label: language === "ar" ? "النماذج" : "Forms",
          href: "/dashboard/forms",
          icon: FileText,
          color: "from-blue-500 to-blue-600",
        },
      ],
    },
    {
      type: "group",
      id: "settings",
      label: language === "ar" ? "الإعدادات" : "Settings",
      icon: Settings,
      items: [
        {
          id: "settings",
          label: language === "ar" ? "إعدادات الموقع" : "Site Settings",
          href: "/dashboard/settings",
          icon: Settings,
          color: "from-slate-500 to-slate-600",
        },
        {
          id: "contact",
          label: language === "ar" ? "معلومات الاتصال" : "Contact Info",
          href: "/dashboard/contact",
          icon: Contact,
          color: "from-red-500 to-red-600",
        },
      ],
    },
  ]

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    )
  }

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" && !searchParams.get("section")
    }
    return pathname === href || pathname.startsWith(href + "/")
  }

  const handleLogout = () => {
    logout()
    window.location.href = "/login"
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-white shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold">
                  {language === "ar" ? "لوحة التحكم" : "Dashboard"}
                </h1>
                <p className="text-sm text-white/60">{username || "Admin"}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navigationGroups.map((group) => {
              if (group.type === "single") {
                const Icon = group.icon
                const active = isActive(group.href || "/dashboard")
                return (
                  <Link key={group.id} href={group.href || "/dashboard"}>
                    <div
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                        active
                          ? `bg-gradient-to-r ${group.color} shadow-lg scale-[1.02]`
                          : "hover:bg-white/10"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{group.label}</span>
                    </div>
                  </Link>
                )
              }

              // Group with items
              const isExpanded = expandedGroups.includes(group.id)
              const GroupIcon = group.icon

              return (
                <div key={group.id} className="space-y-1">
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <GroupIcon className="w-5 h-5 text-white/70" />
                      <span className="font-medium text-white/90">{group.label}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-white/50" />
                    ) : language === "ar" ? (
                      <ChevronRight className="w-4 h-4 text-white/50 rotate-180" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-white/50" />
                    )}
                  </button>

                  {isExpanded && group.items && (
                    <div className="space-y-1 ml-4 rtl:mr-4 rtl:ml-0">
                      {group.items.map((item) => {
                        const ItemIcon = item.icon
                        const active = isActive(item.href)
                        return (
                          <Link key={item.id} href={item.href}>
                            <div
                              className={cn(
                                "flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200",
                                active
                                  ? `bg-gradient-to-r ${item.color} shadow-lg scale-[1.02]`
                                  : "hover:bg-white/10"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <ItemIcon className="w-4 h-4" />
                                <span className="text-sm">{item.label}</span>
                              </div>
                              {item.badge !== undefined && item.badge > 0 && (
                                <span className="px-2 py-0.5 text-xs rounded-full bg-white/20">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <Link href="/" target="_blank">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-white/70 hover:text-white hover:bg-white/10"
              >
                <Eye className="w-5 h-5" />
                {language === "ar" ? "معاينة الموقع" : "Preview Site"}
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <LogOut className="w-5 h-5" />
              {language === "ar" ? "تسجيل الخروج" : "Logout"}
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  )
}
