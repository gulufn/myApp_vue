import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { API_BASE ,API_BASE_VIDEO} from '@/config.ts'


export const useSearchStore = defineStore('search', () => {
    let token = ref('')
    let keyword = ref('')
    let thisPage = ref('')
    let searchTrigger = ref(0)
    let listMusic = ref<any[]>([])
    let listVideo = ref<any[]>([])
    // 触发搜索
    function triggerSearch() {
        searchTrigger.value++
    }
    // 搜索数据
    async function search_data() {
        if (thisPage.value === 'music') {
            listMusic.value = []
            let data = await axios.post(`${API_BASE}` + '/music/search_music', {
                token: token.value,
                keyword: keyword.value
            })
            listMusic.value = data.data.data.data
        } else if (thisPage.value === 'video') {
            // listVideo.value = []
            let data = await axios.post(`${API_BASE}` + '/video/search_video', {
                token: token.value,
                keyword: keyword.value
            })
            const key = data.data.data.key
            const list = data.data.data.data;
            for (const i of list) {
                const url = API_BASE_VIDEO + '/video/' + i.name + '?key=' + key + '&form=' + i.form;
                const video_json = await axios.get(url)
                // console.log('js',i['id'])
                video_json['data']['data']['id'] = i['id']
                video_json['data']['data']['is_favorite'] = i['is_favorite']
                if (video_json['data']['status']) {
                    listVideo.value.push(video_json['data']['data'])
                    listVideo.value.unshift(video_json['data']['data'])
                }
            }
        }
    }
    // 返回数据
    return { token, keyword, thisPage, searchTrigger, listMusic, listVideo, triggerSearch, search_data }
})