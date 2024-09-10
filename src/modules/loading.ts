import { defineStore } from "pinia";

export const useLoadingStore = defineStore({
  id: "loading",
  state: () => ({
    loadingState: false, // Renamed state property
    cancelableRequestState: false, // Renamed state property
  }),
  actions: {
    setLoading(value: boolean) {
      this.loadingState = value;
    },
    setCancelableRequest(value: boolean) {
      this.cancelableRequestState = value;
    },
  },
  getters: {
    isLoading: (state) => state.loadingState,
    isCancelableRequest: (state) => state.cancelableRequestState,
  },
});
