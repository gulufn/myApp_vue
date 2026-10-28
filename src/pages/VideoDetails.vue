<script lang="ts">
export default { name: 'VideoDetails' }
</script>
<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed, onUnmounted } from 'vue'
import axios from 'axios'
import { API_BASE, API_BASE_VIDEO } from '@/config.ts'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { showSuccessToast, showFailToast, Button } from 'vant';
import { useSearchStore } from '@/stores/search'
import { useWindowSize } from '@vant/use'
import { useRouter, useRoute } from 'vue-router'


const store = useSearchStore()
const route = useRoute()

const key = ref(route.query.key)
const index = ref(Number(route.params.idx))
const order = ref('0001')




const path = ref('')
const leixing = ref('')
const sources = ref('')
const is_favorite = ref()
const id = ref()
const title = ref()
const episodes = ref()

const item = store.listVideo?.[4]
if (item) {
    path.value = store.listVideo[index.value]['path']
    leixing.value = store.listVideo[index.value]['class']
    sources.value = store.listVideo[index.value]['sources']
    is_favorite.value = store.listVideo[index.value]['is_favorite']
    id.value = store.listVideo[index.value]['id']
    title.value = store.listVideo[index.value]['title']
    episodes.value = store.listVideo[index.value]['episodes']

    const video_details = {
        'class': store.listVideo[index.value]['class'],
        'cover_image': store.listVideo[index.value]['cover_image'],
        'episodes': store.listVideo[index.value]['episodes'],
        'id': store.listVideo[index.value]['id'],
        'is_favorite': store.listVideo[index.value]['is_favorite'],
        'path': store.listVideo[index.value]['path'],
        'sources': store.listVideo[index.value]['sources'],
        'title': store.listVideo[index.value]['title']
    }
    localStorage.setItem('video_details', JSON.stringify(video_details))
} else {
    const raw = localStorage.getItem('video_details')
    const video_details = raw ? JSON.parse(raw) : null
    console.log('dfggfdsgf', video_details)
    path.value = video_details['path']
    leixing.value = video_details['class']
    sources.value = video_details['sources']
    is_favorite.value = video_details['is_favorite']
    id.value = video_details['id']
    title.value = video_details['title']
    episodes.value = video_details['episodes']
}


const video_url = ref(API_BASE_VIDEO + '/video/' + path.value + '?key=' + key.value + '&form=' + leixing.value + '&file_source=' + 'tv_' + order.value + '_' + sources.value)
const videoRef = ref<HTMLVideoElement>()
const token = getToken()

//创建时就加载第一个视频
onMounted(() => {
    const video = videoRef.value
    if (!video) return
    if (sources.value.split('.').pop() === 'flv') {
        const player = flvjs.createPlayer({
            type: 'flv',
            url: video_url.value
        });
        player.attachMediaElement(video);     //把视频流绑到这个视频标签上
        player.load();
        // player.play();
    } else {
        video.src = video_url.value
        video.load()
        video.play().catch((err) => {
            // 只忽略自动播放被拦截,其他错误还是打出来
            if (err.name !== 'NotAllowedError') {
                console.error('播放失败:', err)
            }
        })
    }
})


const currentEpisode = ref(1) // 当前播放的集数
function selectEpisode(ep: number) {
    order.value = String(ep).padStart(4, '0')
    currentEpisode.value = ep
    video_url.value = API_BASE_VIDEO + '/video/' + path.value + '?key=' + key.value + '&form=' + leixing.value + '&file_source=' + 'tv_' + order.value + '_' + sources.value
    console.log(video_url.value)
}

//video_url变化时更新推流
watch(video_url, async (url) => {
    const video = videoRef.value
    if (!video) return
    if (sources.value.split('.').pop() === 'flv') {
        const player = mpegts.createPlayer({
            type: 'flv',
            url: url
        }, {

        }
        );
        player.attachMediaElement(video);     //把视频流绑到这个视频标签上
        player.load();
        player.play();
    } else {
        video.src = url
        video.load()
        video.play().catch((err) => {
            // 只忽略自动播放被拦截,其他错误还是打出来
            if (err.name !== 'NotAllowedError') {
                console.error('播放失败:', err)
            }
        })
    }
})


// let is_favorite = ref(is_favorite.value)


async function toggleStar() {
    console.log('切换收藏:', is_favorite.value)
    console.log(id.value);
    let data = await axios.post(`${API_BASE}` + '/video/toggle_favorites', {
        token: token,
        video_id: id.value,


        is_favorite: is_favorite.value
    })
    if (data.data.status == 1) {
        // item.is_favorite = !item.is_favorite
        showFailToast(data.data.message)
    } else {
        showFailToast(data.data.message)
    }
    is_favorite.value = !is_favorite.value
    if(item){
        store.listVideo[index.value]['is_favorite'] = !store.listVideo[index.value]['is_favorite']
    }
    
}

</script>
<template>
    <div class="episode-selector">
        <div class="video-stage">
            <video ref="videoRef" controls controlslist="nodownload" />
        </div>

        <div class="title-row">
            <button class="star-btn" :class="{ active: is_favorite }" @click="toggleStar"
                :aria-label="is_favorite ? '取消收藏' : '收藏'" :aria-pressed="is_favorite">
                <svg viewBox="0 0 24 24" class="star-icon" aria-hidden="true">
                    <path
                        d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.3l-5.8 3.06 1.1-6.46-4.69-4.58 6.49-.94L12 2.5z" />
                </svg>
            </button>
            <h4>{{ title }}</h4>
        </div>
        <hr>
        <van-button v-for="ep in episodes" :key="ep" size="small" :type="currentEpisode === ep ? 'primary' : 'default'"
            @click="selectEpisode(ep)">
            第{{ ep }}集
        </van-button>
    </div>

</template>


<style lang="scss" scoped>
@media (max-width: 2000px) {
    .video-stage {
        background-color: #f7f8fa;
        padding: auto;
        margin: auto;
        width: 60%;
        /* 或固定宽度，如 800px */
        aspect-ratio: 16 / 9;
        /* 舞台比例固定，尺寸就不随视频变 */
        background: #000;
        /* 留边处统一黑底 */
    }

    .video-stage video {
        width: 100%;
        height: 100%;
        object-fit: contain;
        /* 视频按比例完整显示，多余部分留黑边 */
    }
}

@media (max-width: 768px) {
    .video-stage {
        width: 100%;
        /* 或固定宽度，如 800px */
        aspect-ratio: 16 / 9;
        /* 舞台比例固定，尺寸就不随视频变 */
        background: #000;
        /* 留边处统一黑底 */
    }

    .video-stage video {
        width: 100%;
        height: 100%;
        object-fit: contain;
        /* 视频按比例完整显示，多余部分留黑边 */
    }
}

.star-btn {
    background: none;
    border: none;
    padding: 6px;
    cursor: pointer;
    line-height: 0;
    border-radius: 50%;
    transition: background-color 0.2s;
}

.star-btn:hover {
    background: rgba(255, 200, 0, 0.12);
}

.star-icon {
    width: 28px;
    height: 28px;
    /* 未选中：空心灰色 */
    fill: none;
    stroke: #9aa0a6;
    stroke-width: 1.8;
    stroke-linejoin: round;
    transition: fill 0.2s, stroke 0.2s, transform 0.15s;
}

/* 选中：实心金色 */
.star-btn.active .star-icon {
    fill: #f5b301;
    stroke: #f5b301;
}

/* 点击时轻微放大 */
.star-btn:active .star-icon {
    transform: scale(0.85);
}

/* 可选：选中时弹一下 */
.star-btn.active .star-icon {
    animation: star-pop 0.25s ease;
}

@keyframes star-pop {
    0% {
        transform: scale(0.7);
    }

    60% {
        transform: scale(1.15);
    }

    100% {
        transform: scale(1);
    }
}

.title-row {
    display: flex;
    align-items: center;
    /* 垂直居中对齐 */
    gap: 8px;
    /* 按钮和标题之间的间距 */
}

/* 按钮固定大小，不被压缩 */
.star-btn {
    flex-shrink: 0;
}

/* 标题占满剩余空间，超出省略 */
.video-title {
    flex: 1;
    min-width: 0;
    /* 关键：允许在 flex 里收缩并触发省略号 */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
    /* 去掉 h4 默认上下 margin，避免影响对齐 */
}
</style>