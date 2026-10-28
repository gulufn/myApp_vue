<script lang="ts">
export default { name: 'VideoList' }
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
import { useRouter } from 'vue-router'


const router = useRouter()
let index = 0;
const token = getToken()
let key = ref('')
let status = ref(0)

const store = useSearchStore()

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
		// console.log('视频列表:', list)
		for (const i of list) {
			const url = API_BASE_VIDEO + '/video/' + i.name + '?key=' + key.value + '&form=' + i.form;
			const video_json = await axios.get(url)
			console.log(video_json['data'])
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
console.log(store.listVideo)



const { width } = useWindowSize()
const columnNum = computed(() => {
	return Math.floor((width.value-40) / 165) || 1
})
watch(() => width.value, (val) => {
	console.log('列数:', Math.floor(width.value / 180))
})

let v = ref('')
function videoUrl(index: any) {
//   v.value= `${API_BASE_VIDEO}/video/${item.path}?key=${key.value}&form=${item.form}&file_source=bbb.mp4`
  router.push(`/video/detail/${index}`)   // 直接拼路径
  // 或者用命名路由：
  // router.push({ name: 'video-detail', params: { index } })
}
</script>

<template>
	<div>
		<van-grid :border="false" :column-num=columnNum class="video-grid" >
			<van-grid-item v-for="(item,index) in store.listVideo" :title="item.title" @click="videoUrl(index)">
				<van-image width="178" height="100" fit="cover"
					:src="`${API_BASE_VIDEO}/video/${item.path}?key=${key}&form=${item.class}&file_source=img.png`"
					@click="" />
				<p>{{item.title}}</p>
			</van-grid-item>
		</van-grid>
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