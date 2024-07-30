import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { auth } from "./firebaseConfig";
import "./assets/tailwind.css";

// Create a reactive state for the user
const userState = {
  user: null,
};

// Monitor auth state changes
auth.onAuthStateChanged((user) => {
  userState.user = user;
  if (!app) {
    // Initialize the app once the auth state is determined
    app = createApp(App);
    app.config.globalProperties.$userState = userState; // Make userState accessible globally
    app.use(router);
    app.mount("#app");
  }
});

let app;
