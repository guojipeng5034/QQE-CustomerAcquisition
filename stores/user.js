// stores/user.js (改造后)

import { defineStore } from 'pinia';
import { loginWithWeixin, loginWithSmsCode } from '@/api/api.js';

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: !!uni.getStorageSync('token'), // 根据本地是否有token来判断初始登录状态
    userInfo: uni.getStorageSync('userInfo') || null,
    token: uni.getStorageSync('token') || '',
  }),
  actions: {
    // 处理微信登录的 Action
    async handleWxLogin(code, encryptedData, iv) {
      try {
        const res = await loginWithWeixin(code, encryptedData, iv);
        // 假设后端成功后返回 { code: 200, data: { userInfo: {...}, token: '...' } }
        this.setLoginInfo(res.data);
        return Promise.resolve(res.data);
      } catch (error) {
        console.error("微信登录失败", error);
        return Promise.reject(error);
      }
    },
    
    // 处理H5登录的 Action
    async handleSmsLogin(phone, code) {
        try {
            const res = await loginWithSmsCode(phone, code);
            this.setLoginInfo(res.data);
            return Promise.resolve(res.data);
        } catch (error) {
            console.error("H5登录失败", error);
            return Promise.reject(error);
        }
    },

    // 统一设置登录信息并持久化存储
    setLoginInfo(data) {
      this.isLoggedIn = true;
      this.userInfo = data.userInfo;
      this.token = data.token;

      uni.setStorageSync('userInfo', data.userInfo);
      uni.setStorageSync('token', data.token);
    },

    // 退出登录
    logout() {
      this.isLoggedIn = false;
      this.userInfo = null;
      this.token = '';

      uni.removeStorageSync('userInfo');
      uni.removeStorageSync('token');
    },
  },
});