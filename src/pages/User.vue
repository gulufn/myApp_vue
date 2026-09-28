<script lang="ts">
export default { name: 'User' }
</script>
<script setup lang="ts">
import { ref } from 'vue'
import Login from '@/components/user/Login.vue'
import Profile from '@/components/user/Profile.vue'
import { getToken, setToken, removeToken } from '@/utils/auth'
import axios from 'axios'
import { API_BASE } from '@/config'

let isLoggedIn = ref(false)
let isprofileIn = ref(false)



console.log(getToken())
async function verify_token() {
	let url = `${API_BASE}` + '/user/verify_token?token=' + getToken()
	let data = await axios.get(url)
	if (data.data.status == 0) {
		isLoggedIn.value = true
		isprofileIn.value = false
	} else {
		isLoggedIn.value = false
		isprofileIn.value = true
	}
	console.log(data.data.status)
}
verify_token()

</script>


<template>
	<div>
		<Login v-if="isLoggedIn" />
		<Profile v-if="isprofileIn" />
	</div>
</template>


<style lang="scss" scoped></style>