import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { API_BASE } from '@/config.ts'

export const useSearchStore = defineStore('search', () => {
    let token = ref('')
    let keyword = ref('')
    let thisPage = ref('')
    let searchTrigger = ref(0)
    let listMusic = ref([])
    let listVideo = ref([])
    // 触发搜索
    function triggerSearch() {
        searchTrigger.value++
    }
    // 搜索数据
    async function search_data() {
        if (thisPage.value === 'music') {
            listMusic.value = []
            let data = await axios.post(`${API_BASE}` + '/music/search_music', {
                token: token,
                keyword: keyword
            })
            listMusic.value = data.data.data
        } else if (thisPage.value === 'video') {
            listVideo.value = []
            let data = await axios.post(`${API_BASE}` + '/video/search_video', {
                token: token,
                keyword: keyword
            })
            listVideo.value = data.data.data
        }
    }
    // 返回数据
    return { token, keyword, thisPage, searchTrigger, listMusic, listVideo, triggerSearch, search_data }
})