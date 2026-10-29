<script lang="ts">
export default { name: 'profile' }
</script>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { emailStore } from '@/stores/user_data'
import { useRouter, useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()
const store = emailStore()

const isProfile = computed(() => route.name === 'user')

const name = store.email
const accountName = ref(name.split('@')[0])
const accountHandle = ref(name)

const avatarUrl = ref('')
const avatarError = ref(false)

const onAvatarError = () => {
	avatarError.value = true
}

const accountInitial = computed(() => {
	if (!accountName.value) return '?'
	return accountName.value.charAt(0).toUpperCase()
})


const music_collect = () => {
	router.push(`/user/music_collect`)
}
const video_collect = () => {
	router.push(`/user/video_collect`)
}
const user_setting = () => {
	router.push(`/user/user_setting`)
}
const login_out = () => {
	console.log('退出登录')
}
</script>

<template>
	<div profile-root>
		<div class="profile-page" v-show="isProfile">
			<div class="profile-header">
				<div class="avatar-wrapper">
					<img v-if="!avatarError" :src="avatarUrl" alt="头像" class="avatar-img" @error="onAvatarError" />
					<div v-else class="avatar-fallback">
						{{ accountInitial }}
					</div>
				</div>

				<div class="account-info">
					<div class="account-name">{{ accountName }}</div>
					<div class="account-handle">{{ accountHandle }}</div>
				</div>
			</div>

			<div class="settings">
				<van-cell-group inset>
					<van-cell title="音乐收藏" is-link @click="music_collect" />
				</van-cell-group>
				<van-cell-group inset>
					<van-cell title="视频收藏" is-link @click="video_collect" />
				</van-cell-group>
				<van-cell-group inset>
					<van-cell title="账号设置" is-link @click="user_setting" />
				</van-cell-group>
				<van-cell-group inset>
					<van-cell title="退出登录" is-link @click="login_out" />
				</van-cell-group>
			</div>
		</div>
		<div class="users">
			<router-view />
		</div>
	</div>
</template>

<style lang="scss" scoped>
.profile-root {
	/* 假设 Profile 最外层是这个类 */
	height: 100%;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}



.settings {

	// 每组分隔
	:deep(.van-cell-group--inset) {
		margin-bottom: 12px;
		margin-top: 12px;
		border-radius: 12px;
	}

	// 单个 cell 高度增加，内容更松
	:deep(.van-cell) {
		padding-top: 16px;
		padding-bottom: 16px;
		font-size: 15px;
	}
}

.profile-page {
	width: 100%;
	//   max-width: 480px;
	margin-top: 2px;
	// margin: 24px auto;
	font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 长方形区域 */
.profile-header {
	display: flex;
	align-items: center;
	gap: 16px;
	padding: 20px 24px;
	background: #ffffff;
	border: 1px solid #edf0f5;
	border-radius: 16px;
}

/* 左侧圆形头像 */
.avatar-wrapper {
	flex-shrink: 0;
	width: 64px;
	height: 64px;
	border-radius: 50%;
	overflow: hidden;
	background: #eef2f9;
}

.avatar-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
}

.avatar-fallback {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #4a6cf0;
	color: #fff;
	font-size: 24px;
	font-weight: 600;
}

/* 右侧账户信息 */
.account-info {
	flex: 1;
	min-width: 0;
}

.account-name {
	font-size: 18px;
	font-weight: 600;
	color: #1a1f2e;
	line-height: 1.3;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.account-handle {
	margin-top: 4px;
	font-size: 13px;
	color: #8b95a8;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

/* 移动端微调 */
@media (max-width: 380px) {
	.profile-header {
		padding: 16px 18px;
		gap: 12px;
	}

	.avatar-wrapper {
		width: 56px;
		height: 56px;
	}

	.account-name {
		font-size: 16px;
	}
}
</style>