// useAlert.ts
import { ref, reactive } from 'vue'

export type AlertType = 'success' | 'error' | 'warning' | 'info'

interface AlertOptions {
  message: string
  title?: string
  duration?: number
  type: AlertType
}

class AlertService {
  private alerts = reactive<Array<{
    id: number
    type: AlertType
    message: string
    title?: string
  }>>([])

  private idCounter = ref(0)

  private alertStyles: Record<AlertType, string> = {
    success: 'bg-green-100 text-green-800 border-green-300',
    error: 'bg-red-100 text-red-800 border-red-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300'
  }

  private alertIcons: Record<AlertType, string> = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }

  private createAlert(options: AlertOptions) {
    const id = this.idCounter.value++
    const alert = {
      id,
      type: options.type,
      message: options.message,
      title: options.title
    }
    
    this.alerts.push(alert)

    if (options.duration) {
      setTimeout(() => {
        this.remove(id)
      }, options.duration)
    }
  }

  private processArgs(
    message: string, 
    titleOrDuration?: string | number, 
    duration?: number
  ): Omit<AlertOptions, 'type'> {
    let title: string | undefined;

    if (typeof titleOrDuration === "string") {
      title = titleOrDuration;
    } else if (typeof titleOrDuration === "number") {
      duration = titleOrDuration;
    }

    return { message, title, duration }
  }

  success(message: string): void;
  success(message: string, title: string): void;
  success(message: string, duration: number): void;
  success(message: string, title: string, duration: number): void;
  success(
    message: string,
    titleOrDuration?: string | number,
    duration?: number
  ) {
    const options = this.processArgs(message, titleOrDuration, duration)
    this.createAlert({ ...options, type: 'success' })
  }

  error(message: string): void;
  error(message: string, title: string): void;
  error(message: string, duration: number): void;
  error(message: string, title: string, duration: number): void;
  error(
    message: string,
    titleOrDuration?: string | number,
    duration?: number
  ) {
    const options = this.processArgs(message, titleOrDuration, duration)
    this.createAlert({ ...options, type: 'error' })
  }

  warning(message: string): void;
  warning(message: string, title: string): void;
  warning(message: string, duration: number): void;
  warning(message: string, title: string, duration: number): void;
  warning(
    message: string,
    titleOrDuration?: string | number,
    duration?: number
  ) {
    const options = this.processArgs(message, titleOrDuration, duration)
    this.createAlert({ ...options, type: 'warning' })
  }

  info(message: string): void;
  info(message: string, title: string): void;
  info(message: string, duration: number): void;
  info(message: string, title: string, duration: number): void;
  info(
    message: string,
    titleOrDuration?: string | number,
    duration?: number
  ) {
    const options = this.processArgs(message, titleOrDuration, duration)
    this.createAlert({ ...options, type: 'info' })
  }

  remove(id: number) {
    const index = this.alerts.findIndex(alert => alert.id === id)
    if (index !== -1) {
      this.alerts.splice(index, 1)
    }
  }

  getAlerts() {
    return this.alerts
  }

  getAlertStyle(type: AlertType): string {
    return `p-4 rounded-lg shadow-md mb-4 flex items-center space-x-3 ${this.alertStyles[type]}`
  }

  getAlertIcon(type: AlertType): string {
    return this.alertIcons[type]
  }
}

export const useAlert = () => new AlertService()