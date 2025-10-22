"use client"

export function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating shapes */}
      <div className="absolute top-20 left-10 w-20 h-20 border-2 border-primary/10 rounded-lg rotate-12 animate-float" />
      <div className="absolute bottom-32 right-16 w-16 h-16 border-2 border-accent/10 rounded-full animate-float animation-delay-1000" />
      <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg rotate-45 animate-float animation-delay-2000" />
      <div className="absolute bottom-1/4 left-1/3 w-14 h-14 border-2 border-secondary/10 rounded-lg -rotate-12 animate-float animation-delay-3000" />
      <div className="absolute top-1/3 left-1/4 w-10 h-10 bg-gradient-to-br from-accent/5 to-primary/5 rounded-full animate-float animation-delay-4000" />
      <div className="absolute bottom-1/3 right-1/3 w-16 h-16 border-2 border-primary/10 rounded-full animate-float animation-delay-5000" />

      {/* Animated gradient orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-accent/10 to-secondary/10 rounded-full blur-3xl animate-pulse-slow animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl animate-pulse-slow animation-delay-4000" />
    </div>
  )
}
