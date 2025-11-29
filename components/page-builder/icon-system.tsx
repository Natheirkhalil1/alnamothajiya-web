import * as React from "react"
import {
    // Academic & School
    GraduationCap,
    BookOpen,
    Library,
    School,
    Pencil,
    PenTool,
    Calculator,
    Microscope,
    FlaskConical,
    Globe,
    Languages,
    Music,
    Palette,
    Trophy,
    Medal,
    Star,
    Award,
    // People
    User,
    Users,
    UserCheck,
    Baby,
    Accessibility,
    // Transport & Time
    Bus,
    Clock,
    Calendar,
    MapPin,
    // Communication
    Phone,
    Mail,
    Bell,
    Megaphone,
    Info,
    HelpCircle,
    CheckCircle,
    AlertCircle,
    // Files & Data
    FileText,
    Files,
    Download,
    Upload,
    Search,
    Menu,
    X,
    // Arrows
    ChevronRight,
    ChevronLeft,
    ChevronDown,
    ChevronUp,
    ArrowRight,
    ArrowLeft,
    // Media
    Play,
    Pause,
    Video,
    Image,
    Camera,
    Mic,
    // Tech
    Laptop,
    Monitor,
    Smartphone,
    Wifi,
    Database,
    Server,
    // Security
    Lock,
    Unlock,
    Key,
    Shield,
    ShieldCheck,
    // Misc
    Heart,
    Smile,
    ThumbsUp,
    Zap,
    Activity,
    Target,
    Compass,
    Anchor,
    Sun,
    Moon,
    Cloud,
    Umbrella,
    Coffee,
    Utensils,
    Briefcase,
    Building,
    Home,
    Layout,
    Grid,
    List,
    Settings,
    Sliders,
    Filter,
    MoreHorizontal,
    MoreVertical,
    Plus,
    Minus,
    Trash,
    Edit,
    Save,
    Share,
    Link,
    ExternalLink,
    // Social
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    Github,
    Chrome,
    Code,
    Terminal,
} from "lucide-react"

// Define the icon registry type
export type IconName = string

// Create the registry
export const ICON_REGISTRY: Record<string, React.ComponentType<any>> = {
    // Academic
    "graduation-cap": GraduationCap,
    "book-open": BookOpen,
    "library": Library,
    "school": School,
    "pencil": Pencil,
    "pen-tool": PenTool,
    "calculator": Calculator,
    "microscope": Microscope,
    "flask": FlaskConical,
    "globe": Globe,
    "languages": Languages,
    "music": Music,
    "palette": Palette,
    "trophy": Trophy,
    "medal": Medal,
    "star": Star,
    "award": Award,

    // People
    "user": User,
    "users": Users,
    "user-check": UserCheck,
    "baby": Baby,
    "accessibility": Accessibility,

    // Transport & Time
    "bus": Bus,
    "clock": Clock,
    "calendar": Calendar,
    "map-pin": MapPin,

    // Communication
    "phone": Phone,
    "mail": Mail,
    "bell": Bell,
    "megaphone": Megaphone,
    "info": Info,
    "help": HelpCircle,
    "check": CheckCircle,
    "alert": AlertCircle,

    // Files & Data
    "file-text": FileText,
    "files": Files,
    "download": Download,
    "upload": Upload,
    "search": Search,
    "menu": Menu,
    "x": X,

    // Arrows
    "chevron-right": ChevronRight,
    "chevron-left": ChevronLeft,
    "chevron-down": ChevronDown,
    "chevron-up": ChevronUp,
    "arrow-right": ArrowRight,
    "arrow-left": ArrowLeft,

    // Media
    "play": Play,
    "pause": Pause,
    "video": Video,
    "image": Image,
    "camera": Camera,
    "mic": Mic,

    // Tech
    "laptop": Laptop,
    "monitor": Monitor,
    "smartphone": Smartphone,
    "wifi": Wifi,
    "database": Database,
    "server": Server,

    // Security
    "lock": Lock,
    "unlock": Unlock,
    "key": Key,
    "shield": Shield,
    "shield-check": ShieldCheck,

    // Misc
    "heart": Heart,
    "smile": Smile,
    "thumbs-up": ThumbsUp,
    "zap": Zap,
    "activity": Activity,
    "target": Target,
    "compass": Compass,
    "anchor": Anchor,
    "sun": Sun,
    "moon": Moon,
    "cloud": Cloud,
    "umbrella": Umbrella,
    "coffee": Coffee,
    "utensils": Utensils,
    "briefcase": Briefcase,
    "building": Building,
    "home": Home,
    "layout": Layout,
    "grid": Grid,
    "list": List,
    "settings": Settings,
    "sliders": Sliders,
    "filter": Filter,
    "more-horizontal": MoreHorizontal,
    "more-vertical": MoreVertical,
    "plus": Plus,
    "minus": Minus,
    "trash": Trash,
    "edit": Edit,
    "save": Save,
    "share": Share,
    "link": Link,
    "external-link": ExternalLink,

    // Social
    "facebook": Facebook,
    "twitter": Twitter,
    "instagram": Instagram,
    "linkedin": Linkedin,
    "youtube": Youtube,
    "github": Github,
    "chrome": Chrome,
    "code": Code,
    "terminal": Terminal,
}

export const ICON_NAMES = Object.keys(ICON_REGISTRY).sort()

export function IconByName({ name, className, ...props }: { name: string; className?: string;[key: string]: any }) {
    const IconComponent = ICON_REGISTRY[name]

    if (!IconComponent) {
        // Fallback for unknown icons or empty state
        return null
    }

    return <IconComponent className={className} {...props} />
}
