<script lang="ts">
export default { name: 'Music' }
</script>
<script setup lang="ts">
import { ref, watch ,computed} from 'vue'
import axios from 'axios'
import { API_BASE,API_BASE_MUSIC } from '@/config.ts'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { showSuccessToast, showFailToast, Button } from 'vant';
import { useSearchStore } from '@/stores/search'


import { useRoute } from 'vue-router'
const route = useRoute()

let index = 0;
const token = getToken()
let key = ref('')
// const music_list = ref<any[]>([])
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
		const list = data.data.data.data;
		if(index==0){
			store.listMusic=[]	
		}
		store.listMusic.push(...list)
		console.log('音乐列表:', store.listMusic)

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
	store.listMusic = []
	finished.value = false
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

const store = useSearchStore()

watch(() => store.keyword, (val) => {
	console.log('music搜索关键词:', val)
	store.search_data()
})
let musicUrl = ref('')
function bofang(name :string) {
	musicUrl.value=API_BASE_MUSIC+'/music/'+name+'?key='+key.value
}

</script>
<template>
	<div class="page">
		<div class="list-wrap">
			<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
				<van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad"
					:offset="50">
					<van-cell v-for="item in store.listMusic" :key="item.id" :title="item.title" :label="item.artist"
						@click="bofang(item.name)">
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
</template>


<style lang="scss" scoped>
/* page 撑满"内容区"（tabbar 之上的那块） */
.page {
	display: flex;
	flex-direction: column;
	height: 100%;
	/* 注意：不是 100vh，而是父容器给的高度 */
	overflow: hidden;
}

.list-wrap {
	flex: 1;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
}

.player-bar {
	flex-shrink: 0;
	background: #fff;
	padding: 8px 12px;
}

.player-bar audio {
	width: 100%;
}
</style>