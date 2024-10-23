import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import "./assets/style.css";
import axios from "axios";
import VCalendar from "v-calendar";
import 'v-calendar/dist/style.css';

axios.defaults.baseURL =
  "http://10.164.58.52/port-projects/tm/server/public/api";

const app = createApp(App);

app.use(VCalendar);
app.use(createPinia());
app.use(router);
app.mount("#app");
