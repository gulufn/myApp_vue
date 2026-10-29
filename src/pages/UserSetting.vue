<script lang="ts">
export default { name: 'user_setting' }
</script>
<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Field as VanField, CellGroup as VanCellGroup } from 'vant'
import { emailStore } from '@/stores/user_data'
import axios from 'axios'
import { API_BASE, API_BASE_MUSIC } from '@/config.ts'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { showSuccessToast, showFailToast, Button } from 'vant';
import { useSearchStore } from '@/stores/search'
import { useRoute } from 'vue-router'

const store = emailStore()
const name = ref(store.email)


const flag = ref(true)
function fanzhuan() {
    flag.value = !flag.value
}
const isDisabled = ref(false)
let captcha_countdown = ref<any>('获取验证码')
async function get_captcha() {
    let data = await axios.post(`${API_BASE}` + '/user/get_email_captcha', {
        email: name.value
    })
    if (data.data.status == 1) {
        isDisabled.value = true
        captcha_countdown.value = 60
        let timer = setInterval(() => {
            captcha_countdown.value--   // ← 这是"减"
            if (captcha_countdown.value <= 0) {
                clearInterval(timer)                     // ← 这是"停"
                captcha_countdown.value = '点击获取验证码'
                isDisabled.value = false
            }
        }, 1000)
    } else {
        showFailToast(data.data.message)
    }
}

const pwd = ref('')
const new_pwd = ref('')
const new_pwd_again = ref('')
const captcha_email = ref('')

// 两次密码是否一致
const isPwdMatch = computed(() => {
    // 第一次还没输入时，不提示"不一致"
    if (!new_pwd_again.value) return true
    return new_pwd.value === new_pwd_again.value
})

async function put_pwd() {
    if (pwd.value == '' || new_pwd.value == '' || new_pwd_again.value == '') {
        showFailToast('有单元格为空')
    } else {
        let data = await axios.post(`${API_BASE}` + '/user/change_pwd_by_old_pwd', {
            token: getToken(),
            pwd: pwd.value,
            new_pwd: new_pwd_again.value
        })
        console.log(data)
        if (data.data.status == 1) {
            pwd.value=''
            new_pwd.value=''
            new_pwd_again.value=''
            showFailToast(data.data.message)
        } else {
            pwd.value=''
            new_pwd.value=''
            new_pwd_again.value=''
            showFailToast(data.data.message)
        }
    }
}

async function put_email() {
    if (captcha_email.value == '' || new_pwd.value == '' || new_pwd_again.value == '' || new_pwd_again.value.length<6) {
        showFailToast('有单元格为空或密码长度小于6位')
    } else {
        let data = await axios.post(`${API_BASE}` + '/user/change_pwd_by_email_captcha', {
            token: getToken(),
            captcha_email:captcha_email.value,
            new_pwd: new_pwd_again.value
        })
        console.log(data)
        if(data.data.status == 1){
            captcha_email.value=''
            new_pwd.value=''
            new_pwd_again.value=''
            showFailToast(data.data.message)
        }else{
            captcha_email.value=''
            new_pwd.value=''
            new_pwd_again.value=''
            showFailToast(data.data.message)
        }
    }
}

</script>

<template>
    <div class="page">
        <h3>{{ name }}</h3>
        <br><br>
        <van-cell-group inset v-if="flag">
            <van-field v-model="pwd" type="text" label="旧密码" placeholder="请输入旧密码" />
            <van-field v-model="new_pwd" type="text" label="新密码" placeholder="请输入新密码" :maxlength="20" />
            <van-field v-model="new_pwd_again" type="text" label="新密码" placeholder="请再次输入新密码"
                :error-message="isPwdMatch ? '' : '两次输入的密码不一致'" :maxlength="20" />
            <br />
            <span style="color: #1989fa; font-size: 13px;" @click="fanzhuan">忘记密码？</span>
            <br><br>
            <van-button type="primary" @click="put_pwd">提交</van-button>
        </van-cell-group>


        <van-cell-group inset v-if="!flag">
            <van-field center v-model="captcha_email" type="text" label="验证码" placeholder="请输入邮箱验证码" :maxlength="20" >
                <template #button>
                    <van-button size="small" type="primary" @click="get_captcha" :disabled="isDisabled">
                        {{ captcha_countdown }}
                    </van-button>
                </template>
            </van-field>
            <van-field v-model="new_pwd" type="text" label="新密码" placeholder="请输入新密码" :maxlength="20" />
            <van-field v-model="new_pwd_again" type="text" label="新密码" placeholder="请再次输入新密码"
                :error-message="isPwdMatch ? '' : '两次输入的密码不一致'" :maxlength="20" />
            <br />
            <span style="color: #1989fa; font-size: 13px;" @click="fanzhuan">其它方法？</span>
            <br><br>
            <van-button type="primary" @click="put_email">提交</van-button>
        </van-cell-group>


    </div>
</template>
<style lang="scss" scoped>
.page {
    // margin-top: 10%;
    text-align: center;


}
</style>