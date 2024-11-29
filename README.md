# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

# tmapp-client

## Toast Notification System

To integrate the toast notification system into your application, follow these steps:

### 1. Include the Plugin in `main.ts`

```typescript
import { toastPlugin } from "@/plugins/toastPlugin";
```

Then, use the plugin in your app:

```typescript
app.use(toastPlugin, {
  defaultDuration: 2000,
  maxToasts: 5,
});
```

### 2. Add the Toast Manager in `App.vue`

Import the ToastManager component and add it to your App.vue:

```vue
<template>
  <ToastManager ref="toastManagerRef" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import ToastManager from "./components/utilities/Toast/ToastManager.vue";

const toastManagerRef = ref(null);
</script>
```

### 3. How to use Toasts

To use the toast notifications in your components, import ToastService and inject it:

```typescript
import { ToastService } from "@/components/utilities/Toast/useToast";
const toast = inject<ToastService>("toast")!;
```

You can then call different types of toast notifications:

```typescript
toast.success("Successfully Executed!", "Test");
toast.warning("Warning: Check your input!", "Test");
toast.error("An error occurred!", "Test");
toast.info("Information: Process completed!", "Test");
```

### Parameters

- Parameter: Message (the content of the toast)
- Parameter: Title (the title of the toast)
- Parameter: Duration (optional, overrides the default duration)

## Alert Notification System

To integrate the alert notification system into your application, follow these steps:

### 1.Include the Plugin in `main.ts`

Then, use the plugin in your app:

```typescript
import useAlert from "@/components/utilities/Alert/alertPlugin";
app.use(useAlert);
```

### 2. How to use Alerts

To use the Alert Notification System, import `useAlert`

```typescript
import useAlert from "@/components/utilities/Alert/alertPlugin";
```

You can then call different types of alert notifications:

```typescript
useAlert.show("success", {
  message: "This is a Success Notification",
  title: "Success",
  duration: 5000,
});
useAlert.show("warning", {
  message: "This is a Warning Notification",
  title: "Warning",
});
useAlert.show("error", {
  message: "This is a Error Notification",
  title: "Error",
});
useAlert.show("info", {
  message: "This is a Info Notification",
  title: "Info",
});
```

### 3. Notes

- This alert function is a promise that returns a boolean

##### it can be used like this:

```typescript
const showSuccessAlert = async () => {
  // Show the alert using the useAlert service
  const result = await useAlert.show("warning", {
    message: "This is a success alert!", // The message to display in the alert
    title: "Success", // The title of the alert
    duration: 2000, // Duration for which the alert will be visible (in milliseconds)
  });

  // Check the result of the alert
  if (result) {
    // If the user confirmed or acknowledged the alert, handle the success case here
    //
  } else {
    // If the user dismissed the alert, handle the cancellation case here
    //
  }
};
```
