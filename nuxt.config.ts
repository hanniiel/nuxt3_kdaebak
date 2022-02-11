import { defineNuxtConfig } from 'nuxt3'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
    buildModules: [],
    css: ['@/assets/css/main.css'],
    components: true,
    plugins: [],
    privateRuntimeConfig: {
        MONGO_PATH: process.env.MONGO_PATH,
        SECRET_KEY: process.env.SECRET_KEY,
        JWT_KEY: process.env.JWT_KEY,
        IMGUR_ID: process.env.IMGUR_ID,
        GOOGLE_APPLICATION_CREDENTIALS:
            process.env.GOOGLE_APPLICATION_CREDENTIALS,
    },
    publicRuntimeConfig: {
        BASE_URL: 'http://localhost:3000',
    },
    build: {
        postcss: {
            postcssOptions: {
                plugins: {
                    tailwindcss: {},
                    autoprefixer: {},
                },
            },
        },
    },
})
