import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import VueTelInput from 'vue-tel-input'
import 'vue-tel-input/vue-tel-input.css'

const app = createApp(App)
app.use(router)  // ✅ Add router to app
app.use(VueTelInput, {
  mode: 'international',
  defaultCountry: 'IN',
  inputOptions: {
    showDialCode: true,
  },
})
app.mount('#app')
    