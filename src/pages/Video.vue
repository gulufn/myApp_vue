<script lang="ts">
export default { name: 'Video' }
</script>
<!-- <script src="https://cdn.jsdelivr.net/npm/flv.js@1.6.2/dist/flv.min.js"></script> -->
<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import axios from 'axios'
import { API_BASE, API_BASE_VIDEO } from '@/config.ts'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { showSuccessToast, showFailToast, Button } from 'vant';
import { useSearchStore } from '@/stores/search'
import { useWindowSize } from '@vant/use'
import { useRouter, useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()
const store = useSearchStore()
const { width } = useWindowSize()
const columnNum = computed(() => {
	return Math.floor((width.value - 40) / 165) || 1
})

const isDetail = computed(() => route.name === 'video-detail')

let index = 0;
const token = getToken()
let key = ref('')
let status = ref(0)

//获取视频列表
async function get_video_list() {
	let data = await axios.post(`${API_BASE}` + '/video/get_video_list', {
		token: token,
		index: index
	})
	if (data.data.status == 1) {
		status.value = 1
		key.value = data.data.data.key
		const list = data.data.data.data;
		console.log(list)
		for (const i of list) {
			const url = API_BASE_VIDEO + '/video/' + i.name + '?key=' + key.value + '&form=' + i.form;
			const video_json = await axios.get(url)
			video_json['data']['data']['id'] = i['id']
			video_json['data']['data']['is_favorite'] = i['is_favorite']
			if (video_json['data']['status']) {
				store.listVideo.push(video_json['data']['data'])
			}
		}
	} else {
		status.value = 0
		showFailToast(data.data.message)
	}
}
get_video_list()

const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);

const onLoad = async () => {
	await new Promise(r => setTimeout(r, 800));
	try {
		index = index + 3
		await get_video_list();   // ✅ 等请求完成
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
	index = 1000
	store.listVideo = []
	finished.value = false
	get_video_list()
		.then(() => {
			refreshing.value = false
		})
		.catch(() => {
			refreshing.value = false
		})
}





watch(() => width.value, (val) => {
	console.log('列数:', Math.floor(width.value / 180))
})

let v = ref('')
function videoUrl(id: any, key: any) {
	//   v.value= `${API_BASE_VIDEO}/video/${item.path}?key=${key.value}&form=${item.form}&file_source=bbb.mp4`
	// router.push(`/video/detail/${idx}`,)   // 直接拼路径
	router.push({ name: 'video-detail', params: { id }, query: { key: key } })
}
watch(() => store.keyword, async (val) => {
	console.log('video搜索关键词:', val)
	await store.search_data()
	const item = store.listVideo?.[0]
    console.log(item ? '有数据' : '没有数据')
})
</script>
<template>
	<div>
		<van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" v-show="!isDetail"
			:offset="10">
			<van-grid :border="false" :column-num=columnNum class="video-grid" v-show="!isDetail">
				<van-grid-item v-for="(item) in store.listVideo" :title="item.title" @click="videoUrl(item.id, key)">
					<van-image width="178" height="100" fit="cover"
						:src="`${API_BASE_VIDEO}/video/${item.path}?key=${key}&form=${item.class}&file_source=img.png`"
						@click="" />
					<p>{{ item.title }}</p>
				</van-grid-item>
			</van-grid>
		</van-list>

		<router-view />
	</div>

</template>


<style lang="scss" scoped>
/* 让每个格子的内容区水平居中 */
.video-grid :deep(.van-grid-item__content) {
	padding-left: 20px;
	padding-right: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
	/* 水平居中 */
	justify-content: center;
	padding: 8px 0;
	/* 上下留点空隙，左右不要 padding，让格子均分 */
}
</style>