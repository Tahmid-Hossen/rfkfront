import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import router from './router'; // Import the router
import '@mdi/font/css/materialdesignicons.css'; // Import Material Design Icons directly

loadFonts(); // Load fonts asynchronously

// Create the Vue app
const app = createApp(App);

// Use Vuetify and Router
app.use(vuetify);
app.use(router); // Add the router

// Mount the app
app.mount('#app');