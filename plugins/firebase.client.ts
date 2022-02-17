import { defineNuxtPlugin } from '#app'
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'

export default defineNuxtPlugin(() => {
    const app = initializeApp({
        apiKey: 'AIzaSyDgE2RkSGGaL7m8D552AMahF8oqUUmqfE8',
        authDomain: 'kdaebakapp.firebaseapp.com',
        databaseURL: 'https://kdaebakapp.firebaseio.com',
        projectId: 'kdaebakapp',
        storageBucket: 'kdaebakapp.appspot.com',
        messagingSenderId: '511153755020',
        appId: '1:511153755020:web:76aa7f594c1bc75a2d7ca9',
        measurementId: 'G-DHW6L0MNXD',
    })
    getAnalytics(app)
})
