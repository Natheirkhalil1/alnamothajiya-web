'use client'

import { useToast } from '@/hooks/use-toast'
import { CheckCircle2, XCircle } from 'lucide-react'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        // Determine icon based on variant
        const Icon = variant === 'destructive' ? XCircle : CheckCircle2
        const iconColor = variant === 'destructive' ? 'text-red-600' : 'text-green-600'

        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex items-start gap-3">
              <div className={`shrink-0 ${variant === 'destructive' ? 'bg-red-100' : 'bg-green-100'} rounded-full p-1`}>
                <Icon className={`h-4 w-4 ${iconColor}`} />
              </div>
              <div className="grid gap-0.5">
                {title && <ToastTitle className="font-semibold">{title}</ToastTitle>}
                {description && (
                  <ToastDescription className="text-sm opacity-80">{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
