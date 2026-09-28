import { createRouter, createWebHistory } from 'vue-router'

import home_page from '@/pages/Home.vue'
import video_page from '@/pages/Video.vue'
import music_page from '@/pages/Music.vue'
import user_page from '@/pages/User.vue'

const routes = [
	{
		name: 'home',
		path: '/',
		component: home_page,
		meta: { title: '首页' }
	},
	{
		name: 'video',
		path: '/video',
		component: video_page,
		meta: { title: '视频' }
	},
	{
		name: 'music',
		path: '/music',
		component: music_page,
		meta: { title: '音乐' }
	},
	{
		name: 'user',
		path: '/user',
		component: user_page,
		meta: { title: '我的' }
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

export default router
