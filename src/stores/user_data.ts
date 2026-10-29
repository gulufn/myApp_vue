import { ref } from 'vue'
import { defineStore } from 'pinia'

export const emailStore = defineStore('email', () => {
    const email = ref('')

    return { email }
})