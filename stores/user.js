// stores/user.js

import { defineStore } from 'pinia';
import { silentLogin, getRealPhoneNumber, loginWithSmsCode, submitQuizResult } from '@/api/api.js';
import { useQuizStore } from './quiz';

export const useUserStore = defineStore('user', {
  state: () => ({
    // 'pending': 待定, 'loggedIn': 已登录(未答题), 'guest': 访客(新用户), 'hasResult': 已有结果
    loginState: 'pending',
    userInfo: uni.getStorageSync('userInfo') || null,
    openid: uni.getStorageSync('openid') || '',
    token: uni.getStorageSync('token') || '',
  }),
  getters: {
    isLoggedIn: (state) => state.loginState === 'loggedIn' || state.loginState === 'hasResult',
  },
  actions: {
    async handleSilentLogin() {
      this.loginState = 'pending';
      try {
        const code = await this.getLoginCode();
        const res = await silentLogin(code);
        
        this.openid = res.openId;
        uni.setStorageSync('openid', res.openId);

        if (res.hasRecord) {
          // 老用户
          const userRecord = res.userRecord;
          this.setLoginInfo(userRecord);

          // [核心修正] 判断 score 字段是否存在且不为 null (允许 score 为 0)
          if (userRecord.score !== null && userRecord.score !== undefined) {
            // 已有答题结果
            const quizStore = useQuizStore();
            // 假设后端在 userRecord 中也返回了用户的答案记录 "answers" 字段
            const answersArray = JSON.parse(userRecord.answers || '[]');
            quizStore.syncResult(userRecord.score, answersArray);
            this.loginState = 'hasResult';
          } else {
            // 老用户，但未答题
            this.loginState = 'loggedIn';
          }
        } else {
          // 新用户
          this.loginState = 'guest';
        }
        return Promise.resolve(this.loginState);
      } catch (error) {
        this.loginState = 'guest';
        console.error("静默登录失败", error);
        return Promise.reject(error);
      }
    },

    async handleRegister(code) {
      try {
        const res = await getRealPhoneNumber(code, this.openid);
        this.setLoginInfo(res.userRecord);
        this.loginState = 'loggedIn';
        uni.showToast({
          title: res.message || '授权成功！',
          icon: 'success'
        });
        return Promise.resolve();
      } catch (error) {
        console.error("手机号授权/注册流程失败", error);
        return Promise.reject(error);
      }
    },
    
    getLoginCode() {
        return new Promise((resolve, reject) => {
            uni.login({
                provider: 'weixin',
                success: res => res.code ? resolve(res.code) : reject(new Error('获取code失败')),
                fail: err => reject(err)
            });
        });
    },

    setLoginInfo(userRecord) {
      this.userInfo = userRecord;
      this.openid = userRecord.openid;
      uni.setStorageSync('userInfo', userRecord);
      uni.setStorageSync('openid', userRecord.openid);
    },

    async handleSmsLogin(phone, code) {
        try {
            const res = await loginWithSmsCode(phone, code);
            this.setLoginInfo(res.data.userInfo);
            this.loginState = 'loggedIn';
            return Promise.resolve(res.data);
        } catch (error) {
            this.loginState = 'guest';
            console.error("H5登录失败", error);
            return Promise.reject(error);
        }
    },
    logout() {
      this.loginState = 'guest';
      this.userInfo = null;
      this.openid = '';
      uni.clearStorageSync();
    },
  },
});