import { createApp } from 'vue'
import App from './App.vue'
import HDE from './plugin'
import './assets/style.css'

HDE.on('ready', () => {
  let { plugin } = HDE.getState()
  plugin.showButton = true
  HDE.emit('setPlugin', plugin)
  const app = createApp(App)

  app.mount('#app')
})
