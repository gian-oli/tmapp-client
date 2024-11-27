import type { App } from 'vue'
import { useAlert } from '@/components/utilities/Alert/useAlert'

export const alertPlugin = {
  install: (app: App) => {
    const alert = useAlert()
    
    app.config.globalProperties.$alert = alert
    app.provide('alert', alert)
  }
}