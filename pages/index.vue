<template>
    <div class="bg-blue-600">
        <nav class="container flex bg-red-300 mx-auto py-4 justify-around">
            <div>
                <h3>here goes the logo</h3>
            </div>
            <div class="space-x-4 lg:flex">
                <nuxt-link to="idols" class="text-white">Idols</nuxt-link>
                <nuxt-link to="#" class="text-white">About</nuxt-link>
            </div>
        </nav>
        <div class="container bg-gray-50 mx-auto min-h-screen">
            <div class="columns-2">
                <p>Well, let me tell you something, ...</p>
                <p class="break-after-column">Sure, go ahead, laugh...</p>
                <p>Maybe we can live without...</p>
                <p>Look. If you think this is...</p>
            </div>
            <button
                class="bg-red-50 min-w-full shadow-lg rounded-lg"
                @click="login"
            >
                +
            </button>
        </div>
    </div>
</template>
<script setup>
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
const cookie = useCookie('jwt')
function login() {
    console.log('add')
    const auth = getAuth()
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result)
            const token = credential.accessToken
            cookie.value = token
            console.log(cookie.value)
            // The signed-in user info.
            const user = result.user
            // ...
        })
        .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code
            const errorMessage = error.message
            // The email of the user's account used.
            const email = error.email
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error)
            // ...
        })
}
//const cookie = useCookie('jwt')
//cookie.value = 'nice'
</script>
