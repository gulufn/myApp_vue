<script lang="ts">
export default {name: 'Home'}
</script>
<script setup lang="ts">
import {NCard,NTabs,NTabPane,NForm,NFormItemRow,NButton,NInput} from "naive-ui";
</script>


<template>
  <n-card>
    <n-tabs
      class="card-tabs"
      default-value="signin"
      size="large"
      animated
      pane-wrapper-style="margin: 0 -4px"
      pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
    >
      <n-tab-pane name="signin" tab="登录">
        <n-form>
          <n-form-item-row label="用户名">
            <n-input />
          </n-form-item-row>
          <n-form-item-row label="密码">
            <n-input />
          </n-form-item-row>
        </n-form>
        <n-button type="primary" block secondary strong>
          登录
        </n-button>
      </n-tab-pane>
      <n-tab-pane name="signup" tab="注册">
        <n-form>
          <n-form-item-row label="用户名">
            <n-input />
          </n-form-item-row>
          <n-form-item-row label="密码">
            <n-input />
          </n-form-item-row>
          <n-form-item-row label="重复密码">
            <n-input />
          </n-form-item-row>
        </n-form>
        <n-button type="primary" block secondary strong>
          注册
        </n-button>
      </n-tab-pane>
      
      <n-tab-pane name="sign" tab="免密登录">
        <n-form>
          <n-form-item-row label="用户名">
            <n-input />
          </n-form-item-row>
          <n-form-item-row label="密码">
            <n-input />
          </n-form-item-row>
          <n-form-item-row label="重复密码">
            <n-input />
          </n-form-item-row>
        </n-form>
        <n-button type="primary" block secondary strong>
          注册
        </n-button>
      </n-tab-pane>
    </n-tabs>
  </n-card>
  

<img src="@/assets/img/home_icon_in.svg" />
<img src="@/assets/img/video_icon_in.svg" />
<img src="@/assets/img/music_icon_in.svg" />
<img src="@/assets/img/user_icon_in.svg" />
<br>
<img src="@/assets/img/home_icon.svg" />
<img src="@/assets/img/video_icon.svg" />
<img src="@/assets/img/music_icon.svg" />
<img src="@/assets/img/user_icon.svg" />


  <h1>df</h1>
  <h1>df</h1>
  <h1>df</h1>
  <h1>df</h1>
  <h1>df</h1>
  <h1>df</h1>
  <h1>df</h1>
  <h1>df</h1>
  <h1>df</h1>
  <h1>df</h1>
  <h1>df</h1>
  <h1>df</h1>
  <h1>df</h1>
</template>
  

<style lang="scss" scoped>

</style>