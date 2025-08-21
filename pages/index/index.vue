<template>
	<view class="container">
		<button class="button" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">微信手机号一键登录</button>
		<view class="intro" v-if="!isWeixin">正在跳转到H5登录...</view>
	</view>
</template>

<script>
import { useUserStore } from '@/stores/user';

export default {
  data() {
    return {
      isWeixin: false
    };
  },
  onLoad() {
    // #ifdef H5
    uni.redirectTo({
      url: '/pages/login/index'
    });
    // #endif

    // #ifdef MP-WEIXIN
    this.isWeixin = true;
    // #endif
  },
  methods: {
    getPhoneNumber(e) {
      const userStore = useUserStore();
      if (e.detail.errMsg === 'getPhoneNumber:ok') {
        // 在这里，您应该将加密的数据发送到后端解密，然后进行登录
        console.log('用户授权手机号', e.detail);
        userStore.login({ phone: '微信用户' }); // 模拟登录
        uni.redirectTo({
          url: '/pages/quiz/index'
        });
      } else {
        // 用户拒绝授权
        console.log('用户拒绝授权');
      }
    }
  }
}
</script>

<style>
.container {
  padding: 20px;
  font-size: 14px;
  line-height: 24px;
}
.button {
  margin-top: 50px;
}
</style>