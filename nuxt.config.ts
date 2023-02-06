// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    components: true,
    runtimeConfig: {
        googleApplicationCredentials: '',
        imgurId: '',
        jwtKey: '',
        mongoPath: '',
        secretKey: '',
        public: {
            apiBase: '/api',
        },
    },
    nitro: {
        plugins: ['~/server/index.ts'],
    },
})
