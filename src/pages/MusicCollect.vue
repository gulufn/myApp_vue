<script lang="ts">
export default { name: 'music_collect' }
</script>
<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import axios from 'axios'
import { API_BASE, API_BASE_MUSIC } from '@/config.ts'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { showSuccessToast, showFailToast, Button } from 'vant';
import { useSearchStore } from '@/stores/search'
import { useRoute } from 'vue-router'

const route = useRoute()
let youbiao = ref('0');
let last_youbiao = '0'
const token = getToken()
let key = ref('')
const store = useSearchStore()
let status = ref(0)



//获取音乐列表
async function get_music_collect_list() {
    let data = await axios.post(`${API_BASE}` + '/music/music_collect', {
        token: token,
        youbiao: youbiao.value
    })
    if (data.data.status == 1) {
        console.log(data.data.data)
        key.value = data.data.key
        const list = data.data.data;
        if (youbiao.value == '0') {
            store.listMusic = []
        }
        store.listMusic.push(...list)
        status.value = 1
    } else {
        showFailToast(data.data.message)
        status.value = 0
    }
}
get_music_collect_list()

const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);

const onLoad = async () => {

    await new Promise(r => setTimeout(r, 800));
    try {
        last_youbiao = youbiao.value
        youbiao.value = store.listMusic.at(-1)['created_at']
        console.log('时间', youbiao.value)
        if (last_youbiao != youbiao.value) {
            await get_music_collect_list();   // ✅ 等请求完成
        }
        if (last_youbiao == youbiao.value) {
            finished.value = true
        }
    } finally {
        if (status.value == 1) {
            loading.value = false;    // ✅ 无论成败都重置
        } else {
            loading.value = true;    // ✅ 无论成败都重置
        }

    }
}
async function onRefresh() {
    await new Promise(r => setTimeout(r, 800));
    store.listMusic = []
    youbiao.value = '0'
    finished.value = false
    get_music_collect_list()
        .then(() => {
            refreshing.value = false
        })
        .catch(() => {
            refreshing.value = false
        })
}
let musicUrl = ref('')
function bofang(name: string) {
    musicUrl.value = API_BASE_MUSIC + '/music/' + name + '?key=' + key.value
}
async function toggleFavorite(item: any) {
    console.log('切换收藏:', item)
    let data = await axios.post(`${API_BASE}` + '/music/toggle_favorites', {
        token: token,
        music_id: item.id,
        is_favorite: item.is_favorite
    })
    if (data.data.status == 1) {
        item.is_favorite = !item.is_favorite
        showFailToast(data.data.message)
    } else {
        showFailToast(data.data.message)
    }
}
</script>

<template>
    <div class="page-outer">
        <div class="page">
            <div class="list-wrap">
                <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                    <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad"
                        :offset="50">
                        <van-cell v-for="item in store.listMusic" :key="item.id" :title="item.title"
                            :label="item.artist" @click="bofang(item.name)">
                            <template #right-icon>
                                <van-icon :name="item.is_favorite ? 'star' : 'star-o'"
                                    :color="item.is_favorite ? '#ff5000' : '#c8c9cc'" size="20"
                                    @click='toggleFavorite(item)' />
                            </template>
                        </van-cell>
                    </van-list>
                </van-pull-refresh>
            </div>
            <!-- 播放器：固定在底部 -->
            <div class="player-bar">
                <audio :src="musicUrl" controls autoplay></audio>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.page {
    display: flex;
    flex-direction: column;
    height: 85vh;
    /* 现在 .users 有高度了，这个生效 */
    overflow: hidden;
}

.list-wrap {
    flex: 1;
    min-height: 0;
    /* 必须加 */
    overflow-y: auto;
}

.player-bar {
    width: 100%;
    margin: auto;
    flex-shrink: 0;
}

.player-bar audio {
    width: 100%;
}
</style>