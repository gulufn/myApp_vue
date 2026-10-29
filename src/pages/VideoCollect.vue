<script lang="ts">
export default { name: 'video_collect' }
</script>
<script setup lang="ts">
import { ref, computed } from 'vue'
import axios from 'axios'
import { API_BASE, API_BASE_VIDEO } from '@/config.ts'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { showSuccessToast, showFailToast, Button } from 'vant';
import { useSearchStore } from '@/stores/search'
import { useWindowSize } from '@vant/use'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
let youbiao = ref('0');
let last_youbiao = '0'
const token = getToken()
let key = ref('')
const store = useSearchStore()
let status = ref(0)



//获取音乐列表
async function get_video_collect_list() {
	let data = await axios.post(`${API_BASE}` + '/video/get_collect', {
		token: token,
		youbiao: youbiao.value
	})
	if (data.data.status == 1) {
		console.log(data.data.data)
		key.value = data.data.key
		const list = data.data.data;
		console.log('shipppp', list)
		if (youbiao.value == '0') {
			store.listVideo = []
		}
		for (const i of list) {
			const url = API_BASE_VIDEO + '/video/' + i.name + '?key=' + key.value + '&form=' + i.form;
			const video_json = await axios.get(url)
			video_json['data']['data']['id'] = i['id']
			video_json['data']['data']['is_favorite'] = i['is_favorite']
			video_json['data']['data']['created_at'] = i['created_at']
			if (video_json['data']['status']) {
				store.listVideo.push(video_json['data']['data'])
			}
		}
		status.value = 1

	} else {
		showFailToast(data.data.message)
		status.value = 0
	}
}
get_video_collect_list()

const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);

const onLoad = async () => {

	await new Promise(r => setTimeout(r, 800));
	try {
		last_youbiao = youbiao.value
		youbiao.value = store.listVideo.at(-1)['created_at']
		console.log('时间', youbiao.value)
		if (last_youbiao != youbiao.value) {
			await get_video_collect_list();   // ✅ 等请求完成
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
	store.listVideo = []
	youbiao.value = '0'
	finished.value = false
	get_video_collect_list()
		.then(() => {
			refreshing.value = false
		})
		.catch(() => {
			refreshing.value = false
		})
}

async function toggleFavorite(item: any) {
	console.log('切换收藏:', item)
	let data = await axios.post(`${API_BASE}` + '/video/toggle_favorites', {
		token: token,
		video_id: item.id,
		is_favorite: item.is_favorite
	})
	if (data.data.status == 1) {
		item.is_favorite = !item.is_favorite
		showFailToast(data.data.message)
	} else {
		showFailToast(data.data.message)
	}
}

function videoUrl(id: any, key: any) {
	//   v.value= `${API_BASE_VIDEO}/video/${item.path}?key=${key.value}&form=${item.form}&file_source=bbb.mp4`
	// router.push(`/video/detail/${idx}`,)   // 直接拼路径
	router.push({ name: 'video-detail', params: { id }, query: { key: key } })
}
</script>

<template>
	<div class="list-wrap">
		<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
			<van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :offset="50">
				<van-cell v-for="item in store.listVideo" :key="item.id" :title="item.title" :label="item.created_at" @click="videoUrl(item.id,key)">
					<template #right-icon>
						<van-icon :name="item.is_favorite ? 'star' : 'star-o'"
							:color="item.is_favorite ? '#ff5000' : '#c8c9cc'" size="20" @click="toggleFavorite(item)" />
					</template>
				</van-cell>
			</van-list>
		</van-pull-refresh>
	</div>

</template>
<style lang="scss" scoped>


.list-wrap {
	flex: 1;
	min-height: 20px;
	/* 必须加 */
	overflow-y: auto;
}

</style>