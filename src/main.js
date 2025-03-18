import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')

// Render LoginForm
new Vue({
  render: (h) => h(LoginForm),
}).$mount("#app");
