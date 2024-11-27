export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastInterface {
    id: string
    message: string
    title?: string
    type?: ToastType
    duration?: number
}

export interface ToastConfig {
    defaultDuration?: number
    maxToasts?: number
}