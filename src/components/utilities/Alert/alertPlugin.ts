// src/plugins/alertPlugin.ts
import { App, ref, defineComponent, h, createApp } from 'vue';
import AlertModal from './AlertModal.vue';

interface AlertOptions {
  message: string;
  title?: string;
  duration?: number; // Optional duration in milliseconds
}

class UseAlert {
  private isVisible = ref(false);
  private title = ref('');
  private message = ref('');
  private type = ref<'success' | 'error' | 'info' | 'warning'>('info');

  public show(
    type: 'success' | 'error' | 'info' | 'warning', 
    options: AlertOptions
  ) {
    this.title.value = options.title || '';
    this.message.value = options.message;
    this.type.value = type;
    this.isVisible.value = true;

    return new Promise<boolean>((resolve) => {
      const handleConfirm = () => {
        this.close();
        resolve(true);
      };

      const handleCancel = () => {
        this.close();
        resolve(false);
      };

      // Create a new Vue instance to render the alert modal
      const alertInstance = createApp(defineComponent({
        setup: () => {
          return () => h(AlertModal, {
            title: this.title.value,
            message: this.message.value,
            isVisible: this.isVisible.value,
            type: this.type.value,
            onConfirm: handleConfirm,
            onCancel: handleCancel,
          });
        },
      }));

      // Mount the alert instance to a new div element
      const div = document.createElement('div');
      document.body.appendChild(div);
      alertInstance.mount(div);

      // Auto-close for success type if duration is provided
      if (type === 'success' && options.duration) {
        setTimeout(() => {
          this.close();
          resolve(true);
        }, options.duration);
      }

      // Close method to unmount and remove the instance
      this.close = () => {
        this.isVisible.value = false;
        alertInstance.unmount();
        document.body.removeChild(div);
      };
    });
  }

  public close() {
    this.isVisible.value = false;
  }

  public install(app: App) {
    app.config.globalProperties.$alert = this;
  }
}

const useAlert = new UseAlert();

export default useAlert;