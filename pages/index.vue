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
        <button @click="cookie='holis'">
      +
    </button>
    </div>
    
</div>
</template>
<script setup>
    const cookie = useCookie('jwt')
    cookie.value = 'nice'
    console.log(cookie.value)
</script>