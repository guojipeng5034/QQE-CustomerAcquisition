<template>
	<view class="container">
		<view class="login-wrapper">
			<image class="logo" src="/static/logo.png"></image>
			<view class="app-name">获客答题系统</view>
			<view class="slogan">请授权手机号以继续</view>
			<button class="button" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
				<uni-icons type="weixin" size="22" color="#fff" style="margin-right: 8px;"></uni-icons>
				微信手机号一键登录
			</button>
		</view>
		<view class="intro">正在跳转到H5登录...</view>
		</view>
</template>

<script setup>
import { useUserStore } from '@/stores/user';
import { onLoad } from '@dcloudio/uni-app';

const userStore = useUserStore();

/**
 * @description: 用户点击授权手机号按钮后的回调
 * @param {object} e 微信授权事件对象
 */
const getPhoneNumber = (e) => {
	// 1. 检查用户是否拒绝了授权
	if (e.detail.errMsg !== 'getPhoneNumber:ok') {
		uni.showToast({
			title: '您已取消授权',
			icon: 'none'
		});
		return;
	}

	// 2. 获取登录凭证 code
	uni.login({
		provider: 'weixin',
		success: async (loginRes) => {
			if (loginRes.code) {
				// 3. 调用 store action，将 code 和加密数据一起发送到后端
				try {
					await userStore.handleWxLogin(
						loginRes.code,
						e.detail.encryptedData,
						e.detail.iv
					);
					
					// 4. 登录成功，跳转到答题页面
					uni.redirectTo({
						url: '/pages/quiz/index'
					});

				} catch (error) {
					// 登录失败，在 userStore 的 action 中已经有统一的 toast 提示
					console.error('登录流程失败:', error);
				}
			} else {
				uni.showToast({ title: '获取登录凭证失败', icon: 'none' });
			}
		},
		fail: (err) => {
			uni.showToast({ title: '微信登录调用失败', icon: 'none' });
			console.error('uni.login 失败:', err);
		}
	});
};

// 页面加载时的生命周期钩子
onLoad(() => {
	// 如果是 H5 环境，直接重定向到 H5 的登录页
	// #ifdef H5
	uni.redirectTo({
		url: '/pages/login/index'
	});
	// #endif
});
</script>

<style>
.container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	background-color: #f8f8f8;
}

.login-wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
}

.logo {
	width: 80px;
	height: 80px;
	border-radius: 12px;
	margin-bottom: 20px;
}

.app-name {
	font-size: 22px;
	font-weight: bold;
	margin-bottom: 10px;
}

.slogan {
	font-size: 14px;
	color: #999;
	margin-bottom: 40px;
}

.button {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 80vw;
	max-width: 300px;
	background-color: #1aad19;
	color: white;
	border-radius: 25px;
	font-size: 16px;
	padding: 10px 0;
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.intro {
	font-size: 14px;
	color: #888;
}
</style>