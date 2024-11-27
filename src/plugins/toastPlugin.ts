// toastPlugin.ts
import type { App } from 'vue'
import { useToast } from '@/components/utilities/Toast/useToast'
import { ToastConfig } from '@/components/utilities/Toast/toasts.types'

export const toastPlugin = {
    install: (app: App, options?: ToastConfig) => {
        const toast = useToast()
        
        if (options) {
            toast.configure(options)
        }

        app.config.globalProperties.$toast = toast
        app.provide('toast', toast)
    }
}

// Add this to resolve type issues
declare module 'vue' {
  interface ComponentCustomProperties {
    $toast: ReturnType<typeof useToast>
  }
}