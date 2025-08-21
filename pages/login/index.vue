<template>
	<view class="login-container">
		<input class="input" type="number" placeholder="请输入手机号" v-model="phone" />
		<view class="code-container">
			<input class="input code-input" type="number" placeholder="请输入验证码" v-model="code" />
			<button class="button" @click="sendCode">发送验证码</button>
		</view>
		<button class="button login-button" @click="login">登录</button>
	</view>
</template>

<script>
import { useUserStore } from '@/stores/user';

export default {
  data() {
    return {
      phone: '',
      code: ''
    };
  },
  methods: {
    sendCode() {
      // 在这里实现发送验证码的逻辑
      console.log('发送验证码到', this.phone);
    },
    login() {
      const userStore = useUserStore();
      // 在这里实现登录逻辑
      console.log('手机号:', this.phone, '验证码:', this.code);
      userStore.login({ phone: this.phone });
      // 登录成功后
      uni.redirectTo({
        url: '/pages/quiz/index'
      });
    }
  }
};
</script>

<style>
.login-container {
  padding: 20px;
}

.input {
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0 10px;
  margin-bottom: 20px;
}

.code-container {
  display: flex;
}

.code-input {
  flex: 1;
  margin-right: 10px;
}

.button {
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #fff;
  background-color: #007aff;
  border-radius: 5px;
}

.login-button {
  margin-top: 20px;
}
</style>