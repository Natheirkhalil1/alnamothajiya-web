import json
import os
from datetime import datetime

# Initialize Firebase Admin if not already done
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase
if not firebase_admin._apps:
    # Get Firebase config from environment variables
    firebase_config = {
        "type": "service_account",
        "project_id": os.environ.get("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
        "private_key": "dummy_key_for_client_sdk",  # Not needed for Firestore emulator
        "client_email": "dummy@email.com",
    }
    
    # For production, you would use actual credentials
    # For now, we'll work with the data structure
    print("Setting up Firebase connection...")

# Since we're using Firebase client-side SDK in the app, we'll generate the page data
# that can be imported into Firebase through the dashboard or via the app

page_data = {
    "id": f"home-template-{int(datetime.now().timestamp())}",
    "title": "Home Page Template",
    "titleAr": "قالب الصفحة الرئيسية",
    "titleEn": "Home Page Template",
    "slug": "home-template",
    "status": "draft",  # Set as draft so it doesn't interfere with actual pages
    "createdAt": datetime.now().isoformat(),
    "updatedAt": datetime.now().isoformat(),
    "blocks": []
}

# Block 1: Hero Slider
hero_block = {
    "id": "hero-slider-1",
    "type": "hero",
    "order": 0,
    "content": {
        "title": "Welcome to Our School",
        "titleAr": "مرحباً بكم في مدرستنا",
        "subtitle": "Excellence in Education",
        "subtitleAr": "التميز في التعليم",
        "description": "Building tomorrow's leaders today with quality education",
        "descriptionAr": "بناء قادة الغد اليوم من خلال تعليم عالي الجودة",
        "image": "/placeholder.svg?height=800&width=1600",
        "ctaText": "Explore More",
        "ctaTextAr": "استكشف المزيد",
        "ctaLink": "#about"
    },
    "styles": {
        "backgroundColor": "gradient",
        "backgroundGradient": "from-primary/80 via-background/70 to-background/90",
        "textColor": "foreground",
        "padding": "none",
        "margin": "none",
        "borderRadius": "none",
        "borderWidth": "0",
        "borderColor": "border",
        "shadow": "none",
        "animation": "fade-in",
        "animationDuration": "1000",
        "animationDelay": "0",
        "hoverScale": "none",
        "hoverRotate": "0",
        "hoverTranslateX": "0",
        "hoverTranslateY": "0",
        "hoverShadow": "none",
        "textAlign": "center",
        "maxWidth": "full",
        "backdropBlur": "none",
        "opacity": "100"
    }
}

# Block 2: About Section
about_block = {
    "id": "about-section-1",
    "type": "features",
    "order": 1,
    "content": {
        "title": "About Us",
        "titleAr": "من نحن",
        "subtitle": "Excellence in Education",
        "subtitleAr": "التميز في التعليم",
        "description": "We are committed to providing the highest quality education",
        "descriptionAr": "نحن ملتزمون بتقديم أعلى مستويات الجودة في التعليم",
        "image": "/placeholder.svg?height=600&width=800",
        "items": [
            {
                "title": "Our Mission",
                "titleAr": "مهمتنا",
                "description": "To provide excellent education and nurture future leaders",
                "descriptionAr": "تقديم تعليم متميز ورعاية قادة المستقبل",
                "icon": "target"
            },
            {
                "title": "Our Vision",
                "titleAr": "رؤيتنا",
                "description": "To be the leading educational institution in the region",
                "descriptionAr": "أن نكون المؤسسة التعليمية الرائدة في المنطقة",
                "icon": "heart"
            },
            {
                "title": "Our Values",
                "titleAr": "قيمنا",
                "description": "Excellence, integrity, and innovation in everything we do",
                "descriptionAr": "التميز والنزاهة والابتكار في كل ما نقوم به",
                "icon": "award"
            },
            {
                "title": "Our Community",
                "titleAr": "مجتمعنا",
                "description": "A diverse and inclusive learning environment",
                "descriptionAr": "بيئة تعليمية متنوعة وشاملة",
                "icon": "users"
            }
        ]
    },
    "styles": {
        "backgroundColor": "gradient",
        "backgroundGradient": "from-primary/5 via-accent/5 to-secondary/5",
        "textColor": "foreground",
        "padding": "32",
        "margin": "0",
        "borderRadius": "3xl",
        "borderWidth": "0",
        "borderColor": "border",
        "shadow": "2xl",
        "animation": "fade-in-up",
        "animationDuration": "700",
        "animationDelay": "200",
        "hoverScale": "105",
        "hoverRotate": "0",
        "hoverTranslateX": "0",
        "hoverTranslateY": "-4",
        "hoverShadow": "2xl",
        "textAlign": "left",
        "maxWidth": "7xl",
        "backdropBlur": "sm",
        "opacity": "100"
    }
}

# Block 3: Departments Section
departments_block = {
    "id": "departments-section-1",
    "type": "cards",
    "order": 2,
    "content": {
        "title": "Our Departments",
        "titleAr": "أقسامنا",
        "subtitle": "Specialized Excellence",
        "subtitleAr": "التميز المتخصص",
        "description": "Explore our specialized departments offering comprehensive services",
        "descriptionAr": "استكشف أقسامنا المتخصصة التي تقدم خدمات شاملة",
        "items": [
            {
                "title": "Medical Department",
                "titleAr": "القسم الطبي",
                "description": "Complete healthcare services for students",
                "descriptionAr": "خدمات رعاية صحية كاملة للطلاب",
                "image": "/placeholder.svg?height=400&width=600",
                "link": "/departments/medical"
            },
            {
                "title": "Science Department",
                "titleAr": "القسم العلمي",
                "description": "Advanced scientific education and labs",
                "descriptionAr": "تعليم علمي متقدم ومختبرات حديثة",
                "image": "/placeholder.svg?height=400&width=600",
                "link": "/departments/science"
            },
            {
                "title": "Experimental Department",
                "titleAr": "القسم التجريبي",
                "description": "Innovation and experimentation",
                "descriptionAr": "الابتكار والتجربة",
                "image": "/placeholder.svg?height=400&width=600",
                "link": "/departments/experimental"
            }
        ]
    },
    "styles": {
        "backgroundColor": "gradient",
        "backgroundGradient": "from-background via-muted/30 to-background",
        "textColor": "foreground",
        "padding": "32",
        "margin": "0",
        "borderRadius": "2xl",
        "borderWidth": "2",
        "borderColor": "primary/30",
        "shadow": "2xl",
        "animation": "fade-in-up",
        "animationDuration": "700",
        "animationDelay": "150",
        "hoverScale": "105",
        "hoverRotate": "0",
        "hoverTranslateX": "0",
        "hoverTranslateY": "-16",
        "hoverShadow": "2xl",
        "textAlign": "center",
        "maxWidth": "6xl",
        "backdropBlur": "sm",
        "opacity": "100"
    }
}

# Block 4: Gallery Section
gallery_block = {
    "id": "gallery-section-1",
    "type": "gallery",
    "order": 3,
    "content": {
        "title": "Photo Gallery",
        "titleAr": "معرض الصور",
        "subtitle": "Explore Our Facilities",
        "subtitleAr": "استكشف مرافقنا",
        "description": "A visual tour of our school facilities and activities",
        "descriptionAr": "جولة مصورة في مرافق المدرسة وأنشطتها",
        "images": [
            {
                "url": "/placeholder.svg?height=400&width=600",
                "title": "Modern Classrooms",
                "titleAr": "فصول دراسية حديثة",
                "description": "State-of-the-art learning spaces",
                "descriptionAr": "مساحات تعليمية حديثة",
                "category": "Facilities"
            },
            {
                "url": "/placeholder.svg?height=400&width=600",
                "title": "Library",
                "titleAr": "المكتبة",
                "description": "Extensive collection of books and resources",
                "descriptionAr": "مجموعة واسعة من الكتب والموارد",
                "category": "Facilities"
            },
            {
                "url": "/placeholder.svg?height=400&width=600",
                "title": "Sports Facilities",
                "titleAr": "المرافق الرياضية",
                "description": "Modern sports and recreation areas",
                "descriptionAr": "مناطق رياضية وترفيهية حديثة",
                "category": "Activities"
            },
            {
                "url": "/placeholder.svg?height=400&width=600",
                "title": "Science Labs",
                "titleAr": "المختبرات العلمية",
                "description": "Fully equipped laboratories",
                "descriptionAr": "مختبرات مجهزة بالكامل",
                "category": "Facilities"
            },
            {
                "url": "/placeholder.svg?height=400&width=600",
                "title": "Cafeteria",
                "titleAr": "الكافتيريا",
                "description": "Healthy and delicious meals",
                "descriptionAr": "وجبات صحية ولذيذة",
                "category": "Facilities"
            },
            {
                "url": "/placeholder.svg?height=400&width=600",
                "title": "Playground",
                "titleAr": "الملعب",
                "description": "Safe and fun play areas",
                "descriptionAr": "مناطق لعب آمنة وممتعة",
                "category": "Activities"
            }
        ]
    },
    "styles": {
        "backgroundColor": "gradient",
        "backgroundGradient": "from-background via-muted/20 to-background",
        "textColor": "foreground",
        "padding": "24",
        "margin": "0",
        "borderRadius": "2xl",
        "borderWidth": "1",
        "borderColor": "border/50",
        "shadow": "2xl",
        "animation": "fade-in-up",
        "animationDuration": "500",
        "animationDelay": "100",
        "hoverScale": "102",
        "hoverRotate": "0",
        "hoverTranslateX": "0",
        "hoverTranslateY": "-12",
        "hoverShadow": "2xl",
        "textAlign": "center",
        "maxWidth": "full",
        "backdropBlur": "sm",
        "opacity": "100"
    }
}

# Block 5: Testimonials Section
testimonials_block = {
    "id": "testimonials-section-1",
    "type": "testimonials",
    "order": 4,
    "content": {
        "title": "What Parents Say",
        "titleAr": "آراء أولياء الأمور",
        "subtitle": "Parent Reviews",
        "subtitleAr": "تقييمات أولياء الأمور",
        "description": "We are proud of the trust and satisfaction of parents",
        "descriptionAr": "نفخر بثقة أولياء الأمور ورضاهم",
        "items": [
            {
                "name": "Ahmed Al-Mansouri",
                "nameAr": "أحمد المنصوري",
                "image": "/placeholder.svg?height=100&width=100",
                "rating": 5,
                "comment": "Excellent school with dedicated teachers and modern facilities",
                "commentAr": "مدرسة ممتازة مع معلمين متفانين ومرافق حديثة"
            },
            {
                "name": "Fatima Al-Khatib",
                "nameAr": "فاطمة الخطيب",
                "image": "/placeholder.svg?height=100&width=100",
                "rating": 5,
                "comment": "My children love going to school every day",
                "commentAr": "أطفالي يحبون الذهاب إلى المدرسة كل يوم"
            },
            {
                "name": "Omar Al-Rashid",
                "nameAr": "عمر الراشد",
                "image": "/placeholder.svg?height=100&width=100",
                "rating": 5,
                "comment": "Great communication and excellent academic results",
                "commentAr": "تواصل رائع ونتائج أكاديمية ممتازة"
            }
        ]
    },
    "styles": {
        "backgroundColor": "gradient",
        "backgroundGradient": "from-primary/5 via-accent/5 to-secondary/5",
        "textColor": "foreground",
        "padding": "24",
        "margin": "0",
        "borderRadius": "2xl",
        "borderWidth": "0",
        "borderColor": "border",
        "shadow": "2xl",
        "animation": "fade-in-up",
        "animationDuration": "300",
        "animationDelay": "100",
        "hoverScale": "105",
        "hoverRotate": "0",
        "hoverTranslateX": "0",
        "hoverTranslateY": "-8",
        "hoverShadow": "2xl",
        "textAlign": "center",
        "maxWidth": "6xl",
        "backdropBlur": "sm",
        "opacity": "100"
    }
}

# Block 6: Jobs/Services Section
jobs_block = {
    "id": "jobs-section-1",
    "type": "cta",
    "order": 5,
    "content": {
        "title": "Career Opportunities",
        "titleAr": "فرص العمل",
        "subtitle": "Join Our Team",
        "subtitleAr": "انضم إلى فريقنا",
        "description": "Explore our job openings and service requests",
        "descriptionAr": "استكشف فرص العمل وطلبات الخدمة المتاحة",
        "ctaText": "View Opportunities",
        "ctaTextAr": "عرض الفرص",
        "ctaLink": "/jobs",
        "image": "/placeholder.svg?height=500&width=800"
    },
    "styles": {
        "backgroundColor": "gradient",
        "backgroundGradient": "from-background via-muted/30 to-background",
        "textColor": "foreground",
        "padding": "24",
        "margin": "0",
        "borderRadius": "2xl",
        "borderWidth": "1",
        "borderColor": "border/50",
        "shadow": "xl",
        "animation": "fade-in-up",
        "animationDuration": "500",
        "animationDelay": "150",
        "hoverScale": "105",
        "hoverRotate": "0",
        "hoverTranslateX": "0",
        "hoverTranslateY": "0",
        "hoverShadow": "xl",
        "textAlign": "center",
        "maxWidth": "5xl",
        "backdropBlur": "none",
        "opacity": "100"
    }
}

# Block 7: Contact Section
contact_block = {
    "id": "contact-section-1",
    "type": "contact",
    "order": 6,
    "content": {
        "title": "Contact Us",
        "titleAr": "تواصل معنا",
        "subtitle": "We're Here to Help",
        "subtitleAr": "نحن هنا لمساعدتك",
        "description": "Get in touch with us for any inquiries or questions",
        "descriptionAr": "تواصل معنا لأي استفسارات أو أسئلة",
        "phone": "+962 6 4122002",
        "email": "info@namothajia.com",
        "address": "Amman - Airport Road",
        "addressAr": "عمان - طريق المطار",
        "hours": "Sunday - Thursday: 7:00 AM - 3:00 PM",
        "hoursAr": "الأحد - الخميس: 7:00 صباحاً - 3:00 مساءً"
    },
    "styles": {
        "backgroundColor": "gradient",
        "backgroundGradient": "from-slate-50 via-blue-50/30 to-purple-50/20",
        "textColor": "foreground",
        "padding": "32",
        "margin": "0",
        "borderRadius": "3xl",
        "borderWidth": "2",
        "borderColor": "blue-500/20",
        "shadow": "2xl",
        "animation": "fade-in-up",
        "animationDuration": "500",
        "animationDelay": "0",
        "hoverScale": "103",
        "hoverRotate": "0",
        "hoverTranslateX": "0",
        "hoverTranslateY": "0",
        "hoverShadow": "2xl",
        "textAlign": "left",
        "maxWidth": "7xl",
        "backdropBlur": "xl",
        "opacity": "100"
    }
}

# Add all blocks to the page
page_data["blocks"] = [
    hero_block,
    about_block,
    departments_block,
    gallery_block,
    testimonials_block,
    jobs_block,
    contact_block
]

# Save to JSON file for easy import
output_file = "home-page-template.json"
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(page_data, f, ensure_ascii=False, indent=2)

print(f"✅ Home page template created successfully!")
print(f"📄 Template saved to: {output_file}")
print(f"🔢 Total blocks: {len(page_data['blocks'])}")
print("\n📋 Blocks included:")
for i, block in enumerate(page_data['blocks'], 1):
    print(f"  {i}. {block['type'].upper()} - {block['content'].get('title', 'Untitled')}")

print("\n💡 To use this template:")
print("  1. Go to Dashboard → Pages")
print("  2. Click 'Import Page' (you'll need to add this feature)")
print("  3. Or manually create a page and copy the block configurations")
print(f"\n📊 Template stats:")
print(f"  - Blocks with animations: {sum(1 for b in page_data['blocks'] if b['styles']['animation'] != 'none')}")
print(f"  - Blocks with hover effects: {sum(1 for b in page_data['blocks'] if b['styles']['hoverScale'] != 'none')}")
print(f"  - Blocks with gradients: {sum(1 for b in page_data['blocks'] if b['styles']['backgroundColor'] == 'gradient')}")
