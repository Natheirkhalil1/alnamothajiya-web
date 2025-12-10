export const nmTheme = {
    layout: {
        // Section vertical spacing + container width.
        sectionY: "relative overflow-hidden",
        container: "container mx-auto px-4 relative z-10",
    },

    transitions: {
        sectionMotion: {
            duration: 0.5,
            ease: "easeOut",
        },
    },

    hero: {
        section: "relative h-screen w-full overflow-hidden flex items-center justify-center",
        eyebrow: "inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 backdrop-blur-xl rounded-full border-2 border-primary/40 shadow-2xl shadow-primary/20 animate-float",
        title: "text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-balance drop-shadow-lg",
        subtitle: "block text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary mt-3 animate-shimmer drop-shadow-2xl",
        primaryBtn:
            "group relative text-lg px-10 py-6 bg-gradient-to-r from-primary via-primary/90 to-primary hover:from-primary/90 hover:via-primary hover:to-primary/90 shadow-2xl shadow-primary/30 hover:shadow-3xl hover:shadow-primary/40 transition-all duration-500 hover:scale-105 overflow-hidden text-primary-foreground rounded-lg",
        secondaryBtn:
            "group text-lg px-10 py-6 border-2 border-primary/50 hover:border-primary bg-background/50 backdrop-blur-sm hover:bg-primary/10 shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:scale-105 rounded-lg",
        imageWrapper: "relative w-full h-full",
        imageCard: "w-full h-full object-cover",
    },

    textSection: {
        title: "text-5xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent",
        description: "text-xl text-muted-foreground leading-relaxed",
        body: "text-lg text-muted-foreground leading-relaxed text-pretty",
    },

    card: {
        base: "group relative overflow-hidden border-2 border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-700 hover:shadow-2xl rounded-3xl",
        padded: "p-8 space-y-6",
    },

    programs: {
        sectionBg: "bg-gradient-to-br from-background via-muted/30 to-background",
        card: "group relative overflow-hidden border-2 border-primary/30 hover:border-primary transition-all duration-700 hover:shadow-2xl shadow-primary/50 backdrop-blur-sm bg-card/50 rounded-3xl p-8",
        icon: "w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-2xl transform transition-all duration-700 group-hover:scale-110 group-hover:rotate-12 text-white mb-6",
        title: "text-3xl font-black text-foreground transition-all duration-500 group-hover:text-primary",
        ageRange: "inline-block px-4 py-2 bg-primary/10 rounded-full text-primary font-bold text-sm mb-4",
        description: "text-base text-muted-foreground leading-relaxed line-clamp-3",
    },

    services: {
        card: "relative p-6 hover:shadow-2xl hover:scale-105 transition-all duration-500 border-border/50 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm group overflow-hidden rounded-2xl",
        icon: "w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 text-white mb-4",
        title: "font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors",
        description: "text-sm text-muted-foreground leading-relaxed",
    },

    stats: {
        card: "bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-border/50 hover:scale-105 transition-all duration-300",
        label: "text-sm font-medium text-muted-foreground mt-1",
        value: "text-3xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent",
        suffix: "text-primary text-sm ml-1",
    },

    faq: {
        sectionBg: "bg-slate-50/50",
        item: "rounded-2xl bg-white/80 backdrop-blur-sm p-6 shadow-sm ring-1 ring-slate-200/50 [&>summary]:cursor-pointer hover:shadow-md transition-all",
        question: "text-lg font-bold text-foreground",
        answer: "mt-4 text-base text-muted-foreground leading-relaxed",
    },

    ctaStrip: {
        section: "bg-emerald-600",
        title: "text-xl md:text-2xl font-semibold text-white",
        text: "mt-1 text-sm md:text-base text-emerald-100",
        primaryBtn:
            "inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm hover:bg-emerald-50",
        secondaryBtn:
            "inline-flex items-center justify-center rounded-full border border-emerald-200 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700/40",
    },

    misc: {
        jsonDump: "text-xs text-slate-500 bg-slate-50 p-4 rounded-md overflow-auto font-mono",
    },
}
