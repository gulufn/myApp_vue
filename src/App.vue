<script lang="ts">
export default { name: 'App' }
</script>
<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import type { SearchInstance } from 'vant'
import { useRoute } from 'vue-router'
import { getToken, setToken, removeToken } from '@/utils/auth'
import {useSearchStore} from '@/stores/search'

const store = useSearchStore()

const route = useRoute()
const showSearch = ref(false)
const msg = computed<string>(() => route.meta.title as string || '')
const onClickLeft = () => history.back();
const showSearchBtn = computed(() => route.meta.title === '音乐' || route.meta.title === '视频')

// 搜索关键词,数据
const keyword = ref('')

// 取消搜索
const cancelSearch = () => {
	showSearch.value = false
	keyword.value = ''
}
// 监听 showSearchBtn 的变化，如果为 false，则取消搜索
watch(showSearchBtn, (val) => {
	if (!val) { cancelSearch() }
})
// 监听路由变化，清空搜索框
watch(msg, (val) => {
	cancelSearch()
	if(msg.value === '音乐'){store.thisPage = 'music'}
	if(msg.value === '视频'){store.thisPage = 'video'}
	store.token = getToken() || ''
	
})


const searchInput = ref<SearchInstance | null>(null)  // 关键在这里
// 打开时自动聚焦
watch(showSearch, async (val) => {
	if (val) {
		await nextTick()
		searchInput.value?.focus()  // 现在类型正确，不会报错
	}
})
watch(keyword, (val) => {
	console.log('搜索关键词:', val)
	store.keyword = keyword.value  // 将搜索关键词存入 Pinia
})


// 搜索方法
const onSearch = () => {
  console.log('搜索：', keyword.value)
  // 调接口 / 跳转等
}








</script>
<template>
	<div class="app">
		<header class="app-header">
			<nav class="nav-header">
				<router-link to="/">首页</router-link>
				<router-link to="/video">视频</router-link>
				<router-link to="/music">音乐</router-link>
				<router-link to="/user">我的</router-link>
			</nav>
			<div class="title_show">
				<van-nav-bar v-if="!showSearch" :title="msg" left-arrow @click-left="onClickLeft">
					<template #right v-if="showSearchBtn">
						<van-icon name="search" size="18" @click="showSearch = true" />
					</template>
				</van-nav-bar>
				<van-search v-else v-model="keyword" placeholder="请输入搜索关键词" show-action ref="searchInput" @search="onSearch">
					<template #action>
						<div @click="cancelSearch">取消</div>
					</template>
					<template #left>
						<div @click="onSearch">搜索</div>
					</template>
				</van-search>
			</div>

		</header>
		<main class="app-content">
			<router-view />
		</main>
		<footer class="app-footer">
			<nav class="tabbar-footer">
				<router-link to="/">
					<span class="icon">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
							stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
							class="svg_home_title">
							<path
								d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
							<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
						</svg>
					</span>
					<span>首页</span>
				</router-link>
				<router-link to="/video">
					<span class="icon">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
							stroke="#1989fa" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
							class="svg_video_title">
							<rect width="20" height="14" x="2" y="3" rx="2" />
							<path class="svg_video_body"
								d="M15.033 9.44a.647.647 0 0 1 0 1.12l-4.065 2.352a.645.645 0 0 1-.968-.56V7.648a.645.645 0 0 1 .967-.56z" />
							<path d="M7 21h10" />
						</svg>
					</span>
					<span>视频</span>
				</router-link>
				<router-link to="/music">
					<span class="icon">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
							stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
							class="svg_music_title">
							<path d="M9 18V5l12-2v13" />
							<circle cx="6" cy="18" r="3" />
							<circle cx="18" cy="16" r="3" />
						</svg>
					</span>
					<span>音乐</span>
				</router-link>
				<router-link to="/user">
					<span class="icon">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
							stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
							class="svg_user_title">
							<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
							<circle cx="12" cy="7" r="4" />
						</svg>
					</span>
					<span>我的</span>
				</router-link>
			</nav>
		</footer>
	</div>
</template>



<style lang="scss" scoped>
.app {
	border: 1px solid rgb(5, 26, 13);
	height: 100%;
	display: flex;
	flex-direction: column;
	background-color: #f7f8fa;

	.nav-header {
		display: flex;
	}

	.title_show {
		display: none;
	}

	.tabbar-footer {
		display: none;
	}

	@media (max-width: 768px) {
		.nav-header {
			display: none;
		}

		.tabbar-footer {
			display: flex;
		}

		.title_show {
			display: block;
			;

		}
	}



	.app-header {
		border: 1px solid rgb(237, 7, 7);

		.nav-header {
			border: 1px solid rgb(186, 169, 15);
			flex: 0 0 auto;
			min-height: 44px;
			height: auto;
			align-items: center;

			a {
				flex: 1;
				text-align: center;
				text-decoration: none;
				color: rgb(77, 74, 74);
			}

			a.router-link-active {
				color: #000000;
				font-weight: bold;
			}
		}
	}



	.app-content {
		border: 1px solid rgb(0, 255, 98);
		flex: 1 1 auto;
		min-height: 0;
		overflow-y: auto;

	}



	.app-footer {
		border: 1px solid rgb(104, 43, 165);

		.tabbar-footer {
			border: 1px solid rgb(218, 112, 146);
			flex: 0 0 auto;
			min-height: 44px;
			height: auto;
			align-items: center;

			a {
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				gap: 2px;
				min-height: 50px;
				padding: 6px 0;
				text-decoration: none;
				color: #999;
				font-size: 12px;
				transition: color 0.3s;

				.icon {
					font-size: 20px;
					line-height: 1;

					.svg_home_title {
						stroke: currentColor;
					}

					.svg_video_title {
						stroke: currentColor;
					}

					.svg_video_body {
						fill: none;
					}

					.svg_music_title {
						stroke: currentColor;
					}

					.svg_user_title {
						stroke: currentColor;
					}

				}

				&.router-link-active {
					color: #1989fa; // 选中色，可换成你项目的主题色
					font-weight: 600;

					.icon {
						transform: translateY(-1px);
					}

					.svg_home_title {
						stroke: #1989fa;
					}

					.svg_video_title {
						stroke: #1989fa;
					}

					.svg_video_body {
						fill: #1989fa;
					}

					.svg_music_title {
						stroke: #1989fa;
					}

					.svg_user_title {
						stroke: #1989fa;
					}

				}
			}
		}
	}



}
</style>
