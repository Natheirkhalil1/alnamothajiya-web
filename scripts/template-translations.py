"""
Script to add English versions of all Arabic block templates.
This reads the existing templates and creates English duplicates.
"""

# English translations mapping
translations = {
    # Hero Slider
    "مرحباً بكم في المدرسة النموذجية": "Welcome to Al Namothajia School",
    "التميز في التعليم": "Excellence in Education",
    "نقدم تعليماً عالي الجودة ونُنشئ قادة المستقبل منذ عام 1990": "Providing high-quality education and nurturing future leaders since 1990",
    "مرافق حديثة": "Modern Facilities",
    "تعلم متطور": "Advanced Learning",
    "مجهزة بأحدث التقنيات والموارد لتجارب تعليمية محسّنة": "Equipped with cutting-edge technology and resources for enhanced learning experiences",
    "كادر مؤهل": "Qualified Staff",
    "معلمون خبراء": "Expert Teachers",
    "فريقنا المتفاني من المحترفين ملتزم بنجاح الطلاب": "Our dedicated team of professionals committed to student success",
    
    # About Section
    "عن المدرسة النموذجية": "About Al Namothajia School",
    "قصتنا ورؤيتنا": "Our Story and Vision",
    "مدرسة نموذجية كانت منارة للتميز التعليمي لأكثر من 30 عاماً": "Al Namothajia School has been a beacon of educational excellence for over 30 years",
    "مميزاتنا": "Our Features",
    "ما يجعلنا مميزين": "What Makes Us Special",
    "التميز الأكاديمي": "Academic Excellence",
    "منهج صارم مصمم لتحدي وإلهام الطلاب": "Rigorous curriculum designed to challenge and inspire students",
    "تطوير الشخصية": "Character Development",
    "بناء القيم والأخلاق ومهارات القيادة": "Building values, ethics, and leadership skills",
    "مرافق حديثة": "Modern Facilities",
    "فصول دراسية ومختبرات ومرافق رياضية حديثة": "State-of-the-art classrooms, labs, and sports facilities",
    "هيئة تدريس متخصصة": "Dedicated Faculty",
    "معلمون مؤهلون وذوو خبرة عالية": "Highly qualified and experienced educators",
    "تعليم شامل": "Holistic Education",
    "نهج متوازن للأكاديميات والفنون والرياضة": "Balanced approach to academics, arts, and sports",
    "منظور عالمي": "Global Perspective",
    "إعداد الطلاب لعالم مترابط": "Preparing students for an interconnected world",
    
    # Stats
    "إنجازاتنا": "Our Achievements",
    "أرقام تتحدث عن نفسها": "Numbers That Speak for Themselves",
    "30+": "30+",
    "سنة من التميز": "Years of Excellence",
    "سنوات من التميز": "Years of Excellence",
    "8": "8",
    "أقسام متخصصة": "Specialized Departments",
    "50+": "50+",
    "كادر متخصص": "Specialized Staff",
    "100%": "100%",
    "التزام بالجودة": "Commitment to Quality",
    "1000+": "1000+",
    "طالب سعيد": "Happy Students",
    "95%": "95%",
    "معدل النجاح": "Success Rate",
    "معلم خبير": "Expert Teachers",
    
    # Features
    "لماذا تختارنا": "Why Choose Us",
    "اكتشف ما يجعل مدرستنا مميزة": "Discover what makes our school special",
    "منهج معتمد": "Accredited Curriculum",
    "برامج تعليمية معترف بها دولياً": "Internationally recognized educational programs",
    "معلمون خبراء": "Expert Teachers",
    "مربون مؤهلون وذوو خبرة عالية": "Highly qualified and experienced educators",
    "حائزة على جوائز": "Award-Winning",
    "معترف بها للتميز في التعليم": "Recognized for excellence in education",
    
    # Testimonials
    "آراء أولياء الأمور": "Parent Testimonials",
    "ثقة العائلات في مجتمعنا": "Families Trust in Our Community",
    "سارة أحمد": "Sarah Ahmed",
    "ولي أمر": "Parent",
    "لقد ازدهر أطفالي في المدرسة النموذجية. المعلمون داعمون للغاية والمنهج ممتاز.": "My children have thrived at Al Namothajia School. The teachers are incredibly supportive and the curriculum is excellent.",
    "محمد علي": "Mohammed Ali",
    "أفضل استثمار تعليمي قمنا به لأطفالنا. يحبون الذهاب إلى المدرسة كل يوم!": "Best educational investment we've made for our children. They love going to school every day!",
    "فاطمة حسن": "Fatima Hassan",
    "مرافق متميزة وبيئة رعاية. أنصح بها بشدة!": "Outstanding facilities and nurturing environment. Highly recommend!",
    
    # CTA
    "هل أنت مستعد للانضمام إلى مجتمعنا؟": "Ready to Join Our Community?",
    "قدم اليوم واضمن مستقبلاً مشرقاً لطفلك": "Apply today and secure a bright future for your child",
    "قدم الآن": "Apply Now",
    "حدد موعد زيارة": "Schedule a Visit",
    "اعرف المزيد": "Learn More",
    "تواصل معنا": "Contact Us",
    "لم تجد ما تبحث عنه؟": "Didn't Find What You're Looking For?",
    "يمكنك التواصل معنا وسنساعدك في إيجاد ما تحتاجه": "You can contact us and we'll help you find what you need",
    
    # Jobs
    "فرص التوظيف": "Employment Opportunities",
    "انضم إلى فريقنا": "Join Our Team",
    "تصفح الوظائف": "Browse Jobs",
    
    # Contact
    "تواصل معنا": "Contact Us",
    "عمان - طريق المطار - ضاحية الأمير علي": "Amman - Airport Road - Prince Ali District",
    "+962 6 4122002": "+962 6 4122002",
    "info@namothajia.com": "info@namothajia.com",
    "الأحد - الخميس: 7:00 صباحاً - 3:00 مساءً": "Sunday - Thursday: 7:00 AM - 3:00 PM",
    
    # Gallery
    "معرض الصور": "Photo Gallery",
    "مبنى المدرسة": "School Building",
    "مبنى المدرسة الحديث": "Modern School Building",
    "المرافق التقنية": "Technology Facilities",
    "مختبرات الحاسوب والتكنولوجيا": "Computer and Technology Labs",
    "البيئة الصفية": "Classroom Environment",
    "فصول دراسية حديثة ومجهزة": "Modern and Equipped Classrooms",
    "المختبرات العلمية": "Science Labs",
    "تجارب علمية في المختبرات": "Scientific Experiments in Labs",
    
    # Services
    "خدماتنا": "Our Services",
    "التوظيف": "Employment",
    "فرص عمل متميزة في بيئة تعليمية احترافية": "Excellent job opportunities in a professional educational environment",
    "التدريب": "Training",
    "برامج تدريبية متخصصة لتطوير المهارات": "Specialized training programs for skill development",
    
    # Department
    "القسم الطبي": "Medical Department",
    "صحة طلابنا أولويتنا": "Our Students' Health is Our Priority",
    "كوادر طبية ذوي كفاءات عالية ومعدات شاملة": "Highly qualified medical staff and comprehensive equipment",
    "رعاية متكاملة": "Comprehensive Care",
    "خدمات على مدار الساعة": "24/7 Services",
    "فريق من الأطباء والممرضين لضمان سلامة الجميع": "Team of doctors and nurses ensuring everyone's safety",
    "مرحباً بكم في القسم": "Welcome to the Department",
    "رؤيتنا ورسالتنا": "Our Vision and Mission",
    "يتميز هذا القسم بكوادر متخصصة وتجهيزات عالية المستوى": "This department features specialized staff and high-level equipment",
    "وحدات القسم": "Department Units",
    "تعرف على خدماتنا المتخصصة": "Learn About Our Specialized Services",
    "العيادة الطبية": "Medical Clinic",
    "مجهزة بأحدث المعدات وكادر طبي متخصص": "Equipped with latest equipment and specialized medical staff",
    "الصيدلية": "Pharmacy",
}

print("Translation mapping created with", len(translations), "entries")
print("Note: This is a reference. Manual implementation needed in TypeScript file.")
