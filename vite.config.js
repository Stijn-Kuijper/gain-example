import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import mkcert from 'vite-plugin-mkcert';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    https: true
  },
  plugins: [
    svelte(),
    mkcert()
  ],
})
