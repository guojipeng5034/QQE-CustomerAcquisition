// stores/user.js

import { defineStore } from 'pinia';
import { getRealPhoneNumber, loginWithSmsCode, silentLogin } from '@/api/api.js';
import { useQuizStore } from './quiz'; // 引入 quiz store

export const useUserStore = defineStore('user', {
  state: () => ({
    // 'pending': 待定, 'loggedIn': 已登录(未答题), 'guest': 访客(新用户), 'hasResult': 已有结果
    loginState: 'pending',
    userInfo: uni.getStorageSync('userInfo') || null,
    token: uni.getStorageSync('token') || '',
    openid: uni.getStorageSync('openid') || '',
  }),
  getters: {
    isLoggedIn: (state) => state.loginState === 'loggedIn' || state.loginState === 'hasResult',
  },
  actions: {
    async handleSilentLogin() {
      this.loginState = 'pending';
      try {
        const code = await this.getLoginCode();
		console.log(code)
        const res = await silentLogin(code);
        
        // **核心判断逻辑**
        if (res.data && res.data.userInfo) {
          // 用户存在，继续判断是否已答题
          // 假设：已答题的用户信息中包含 score 字段且不为null
          if (res.data.userInfo.score !== null && res.data.userInfo.score !== undefined) {
            // 已有答题结果
            this.setLoginInfo(res.data);
            
            // 将用户的分数和答案同步到 quizStore，以便结果页显示
            const quizStore = useQuizStore();
            quizStore.syncResult(res.data.userInfo.score, res.data.userInfo.answers);

            this.loginState = 'hasResult';

          } else {
            // 老用户，但未答题
            this.setLoginInfo(res.data);
            this.loginState = 'loggedIn';
          }
        } else {
          // 新用户
          this.openid = res.data.openid;
          this.token = res.data.token;
          uni.setStorageSync('openid', res.data.openid);
          uni.setStorageSync('token', res.data.token);
          this.loginState = 'guest';
        }
        return Promise.resolve(this.loginState);
      } catch (error) {
        this.loginState = 'guest';
        console.error("静默登录失败", error);
        return Promise.reject(error);
      }
    },

    // ... handleWxLogin 和其他方法保持不变 ...
    async handleWxLogin(e) {
      try {
        const code = await this.getLoginCode();
        const res = await getRealPhoneNumber(e.target.code);
        const phoneNumber = res.phoneNumber;
        const registeredUserInfo = { phone: phoneNumber, id: this.openid, name: '微信用户' };
        
        this.setLoginInfo({
            userInfo: registeredUserInfo,
            token: this.token
        });
        
        this.loginState = 'loggedIn';
        
        uni.showToast({
          title: '授权成功！',
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

    setLoginInfo(data) {
      this.userInfo = data.userInfo;
      this.token = data.token;
      this.openid = data.openid || this.openid;

      uni.setStorageSync('userInfo', data.userInfo);
      uni.setStorageSync('token', data.token);
      if(this.openid) uni.setStorageSync('openid', this.openid);
    },

    async handleSmsLogin(phone, code) {
        try {
            const res = await loginWithSmsCode(phone, code);
            this.setLoginInfo(res.data);
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
      this.token = '';
      this.openid = '';
      uni.clearStorageSync();
    },
  },
});