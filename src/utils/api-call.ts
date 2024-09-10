import { useLoadingStore } from "@/modules";

// Helper function for adding a delay
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function apiCall<T>(
  fn: (controller: AbortController) => Promise<T>,
  triggerStop?: () => boolean,
  delayMs: number = 0 // Optional delay parameter in milliseconds
): Promise<T> {
  const loadingStore = useLoadingStore();
  const controller = new AbortController();

  try {
    // Determine if the request is cancelable
    const isCancelable = !!triggerStop;

    if (isCancelable) {
      loadingStore.setCancelableRequest(true);
    }

    // Start loading
    loadingStore.setLoading(true);

    if (triggerStop && triggerStop()) {
      controller.abort(); // Abort the request
      throw new Error("Operation cancelled by user.");
    }

    // Wait for the specified delay
    if (delayMs > 0) {
      await delay(delayMs);
    }

    if (triggerStop && triggerStop()) {
      controller.abort(); // Abort the request
      throw new Error("Operation cancelled by user.");
    }

    const result = await fn(controller);

    return result;
  } catch (error) {
    if (controller.signal.aborted) {
      console.log("Request was aborted");
    }
    throw error;
  } finally {
    loadingStore.setLoading(false);
    loadingStore.setCancelableRequest(false); // Reset the cancelable request flag
  }
}
