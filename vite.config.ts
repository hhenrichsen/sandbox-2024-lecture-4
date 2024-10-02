import {defineConfig} from 'vite';
import UnoCSS from 'unocss/vite';

export default defineConfig({
  base: process.env.REPO_NAME ? `/${process.env.REPO_NAME}/` : '/',
  plugins: [UnoCSS()],
});
