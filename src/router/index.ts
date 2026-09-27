// import { createRouter, createWebHistory } from 'vue-router'

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [],
// })

// export default router


import { createRouter, createWebHistory } from 'vue-router'

import home_page from '@/pages/Home.vue'
import video_page from '@/pages/Video.vue'
import music_page from '@/pages/Music.vue'
import user_page from '@/pages/User.vue'

const routes = [
  {
    name:'home',
    path: '/',
    component: home_page
  },
  {
    name:'video',
    path: '/video',
    component: video_page
  },
  {
    name:'music',
    path: '/music',
    component: music_page
  },
  {
    name:'user',
    path: '/user',
    component: user_page
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
