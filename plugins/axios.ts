import { defineNuxtPlugin } from "#app"
import axios from "axios"

export default defineNuxtPlugin(()=>{
    return{
        provide:{
            axios
        }
    }
})