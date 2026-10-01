<script lang="ts">
export default { name: 'Music' }
</script>
<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { API_BASE } from '@/config.ts'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { showSuccessToast, showFailToast, Button } from 'vant';

let index = 0;
const token = getToken()
let key = ref('')
const music_list = ref<any[]>([])
let status = ref(0)

//获取音乐列表
async function get_music_list() {
	let data = await axios.post(`${API_BASE}` + '/music/get_music_list', {
		token: token,
		index: index
	})
	if (data.data.status == 1) {
		status.value = 1
		key.value = data.data.data.key
		const list = data.data.data.data;   // 后端返回的 10 条
		music_list.value.push(...list)
		console.log('音乐列表:', music_list)

	} else {
		status.value = 0
		showFailToast(data.data.message)
	}
}
get_music_list()

const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);

const onLoad = async () => {
	await new Promise(r => setTimeout(r, 800));
	try {
		index = index + 10
		await get_music_list();   // ✅ 等请求完成
	} finally {
		if(status.value == 1){
			loading.value = false;    // ✅ 无论成败都重置
		}else{
			loading.value = true;    // ✅ 无论成败都重置
		}
		
	}
}
async function onRefresh() {
	await new Promise(r => setTimeout(r, 800));
	index = 1000
	music_list.value = []
	finished.value = false
	get_music_list()
	get_music_list()
		.then(() => {
			refreshing.value = false
		})
		.catch(() => {
			refreshing.value = false
		})
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
	<div>
		<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
			<van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :offset="50">
				<van-cell v-for="item in music_list" :key="item.id" :title="item.title" :label="item.artist">
					<template #right-icon>
						<van-icon :name="item.is_favorite ? 'star' : 'star-o'" :color="item.is_favorite ? '#ff5000' : '#c8c9cc'" size="20" @click='toggleFavorite(item)' />
					</template>
				</van-cell>
			</van-list>
		</van-pull-refresh>
	</div>
</template>


<style lang="scss" scoped></style>