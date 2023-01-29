// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    components: true,
    serverHandlers: [
        { route: '/api', handler: 'server/index.ts' },
        { route: '/api/**', handler: 'server/index.ts' },
    ],
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
})
