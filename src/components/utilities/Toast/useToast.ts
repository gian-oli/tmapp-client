// src/composables/useToast.ts
import { ref, type Ref } from "vue";
import type { ToastInterface } from "@/components/utilities/Toast/toasts.types.ts";

export class ToastService {
  // Private ref to store the toast manager
  private toastManager: Ref<{
    addToast: (toast: Omit<ToastInterface, "id">) => void;
  } | null> = ref(null);

  // Configuration for default toast settings
  private config = {
    defaultDuration: 3000,
    maxToasts: 5,
  };

  // Set the toast manager instance
  setToastManager(manager: {
    addToast: (toast: Omit<ToastInterface, "id">) => void;
  }) {
    this.toastManager.value = manager;
  }

  // Configure global toast settings
  configure(
    options: Partial<{
      defaultDuration: number;
      maxToasts: number;
    }>
  ) {
    this.config = { ...this.config, ...options };
  }

  // Private method to create toast with validation and error handling
  private createToast(
    message: string,
    type: ToastInterface["type"],
    title?: string,
    duration?: number
  ) {
    // Validate toast manager
    if (!this.toastManager.value) {
      console.warn(
        "Toast manager not initialized. Call setToastManager first."
      );
      return;
    }

    // Validate message
    if (!message) {
      console.warn("Toast message cannot be empty");
      return;
    }

    // Use default duration if not provided
    const toastDuration = duration ?? this.config.defaultDuration;

    // Create and add toast
    this.toastManager.value.addToast({
      message,
      title,
      type,
      duration: toastDuration,
    });
  }

  // Overloaded method signatures for success toast
  success(message: string): void;
  success(message: string, title: string): void;
  success(message: string, duration: number): void;
  success(message: string, title: string, duration: number): void;
  success(
    message: string,
    titleOrDuration?: string | number,
    duration?: number
  ) {
    let title: string | undefined;

    // Handle different argument combinations
    if (typeof titleOrDuration === "string") {
      title = titleOrDuration;
    } else if (typeof titleOrDuration === "number") {
      duration = titleOrDuration;
    }

    this.createToast(message, "success", title, duration);
  }

  // Overloaded method signatures for error toast
  error(message: string): void;
  error(message: string, title: string): void;
  error(message: string, duration: number): void;
  error(message: string, title: string, duration: number): void;
  error(message: string, titleOrDuration?: string | number, duration?: number) {
    let title: string | undefined;

    if (typeof titleOrDuration === "string") {
      title = titleOrDuration;
    } else if (typeof titleOrDuration === "number") {
      duration = titleOrDuration;
    }

    this.createToast(message, "error", title, duration);
  }

  // Overloaded method signatures for warning toast
  warning(message: string): void;
  warning(message: string, title: string): void;
  warning(message: string, duration: number): void;
  warning(message: string, title: string, duration: number): void;
  warning(
    message: string,
    titleOrDuration?: string | number,
    duration?: number
  ) {
    let title: string | undefined;

    if (typeof titleOrDuration === "string") {
      title = titleOrDuration;
    } else if (typeof titleOrDuration === "number") {
      duration = titleOrDuration;
    }

    this.createToast(message, "warning", title, duration);
  }

  // Overloaded method signatures for info toast
  info(message: string): void;
  info(message: string, title: string): void;
  info(message: string, duration: number): void;
  info(message: string, title: string, duration: number): void;
  info(message: string, titleOrDuration?: string | number, duration?: number) {
    let title: string | undefined;

    if (typeof titleOrDuration === "string") {
      title = titleOrDuration;
    } else if (typeof titleOrDuration === "number") {
      duration = titleOrDuration;
    }

    this.createToast(message, "info", title, duration);
  }

  // Advanced method for custom toast
  custom(
    message: string,
    type: ToastInterface["type"],
    options?: {
      title?: string;
      duration?: number;
      // Add more custom options if needed
    }
  ) {
    this.createToast(message, type, options?.title, options?.duration);
  }
  // Clear all toasts
  clear() {
    if (this.toastManager.value && "clearToasts" in this.toastManager.value) {
      (this.toastManager.value as any).clearToasts();
    } else {
      console.warn("Clear toasts method not available");
    }
  }
}

// Singleton pattern to ensure consistent instance
class ToastServiceSingleton {
  private static instance: ToastService;

  static getInstance(): ToastService {
    if (!this.instance) {
      this.instance = new ToastService();
    }
    return this.instance;
  }
}

// Global type augmentation for TypeScript
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $toast: ToastService;
  }
}

// Composition API and global access hook
export function useToast(): ToastService {
  return ToastServiceSingleton.getInstance();
}
