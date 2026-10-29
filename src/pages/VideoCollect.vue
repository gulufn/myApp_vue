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

const route = useRoute()
const router = useRouter()
const store = useSearchStore()
const { width } = useWindowSize()
const columnNum = computed(() => {
	return Math.floor((width.value - 40) / 165) || 1
})

</script>

<template>
视频收藏
</template>
<style lang="scss" scoped></style>