import './app.css'
import App from './App.svelte'
import { updateParam, resize, initEngine } from './lib/engine'

const app = new App({
  target: document.getElementById('app'),
  props: {
    update: (name, value) => {
      updateParam(name, value)
    },
    resize: () => {
      resize();
    }
  }
})

export default app

initEngine();