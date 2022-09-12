import { createApp } from 'vue'
import App from './App.vue'
import store from '@/store'
import '@/sass/style.sass'

createApp(App).use(store).mount('#app')
