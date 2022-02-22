export default defineNuxtRouteMiddleware((to, from) => {
    const cookie = useCookie('jwt')
    console.log(cookie.value)
    if (!cookie.value) return navigateTo('login')
})
