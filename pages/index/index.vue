<template>
	<view class="container">
		<view class="login-wrapper">
			<view class="app-name">获客答题系统</view>
			<view class="slogan">请授权手机号以继续</view>
			<button class="button" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
				开始答题
			</button>
		</view>
		<view class="intro">正在跳转到H5登录...</view>
	</view>
</template>

<script setup>
import { useUserStore } from '@/stores/user';
import { onLoad } from '@dcloudio/uni-app';

const userStore = useUserStore();

const getPhoneNumber = async (e) => {
	// 1. 检查用户是否拒绝
	if (e.detail.errMsg !== 'getPhoneNumber:ok') {
		uni.showToast({ title: '您已取消授权', icon: 'none' });
		return;
	}
	// 2. 检查 code 是否获取成功
	if (!e.detail.code) {
		uni.showToast({ title: '获取授权码失败', icon: 'none' });
		return;
	}
	
	try {
		// 3. 调用新的 handleRegister action，并传入从按钮事件中获取的 code
		await userStore.handleRegister(e.detail.code);
		
		// 注册成功后，store 的状态会变为 loggedIn，可以跳转了
		uni.redirectTo({
			url: '/pages/quiz/index'
		});
	} catch (error) {
		// 错误提示已统一处理
		console.error('授权流程失败:', error);
	}
};

onLoad(() => {
	// H5 平台的逻辑保持不变
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
		display: none;
		/* 在微信小程序中隐藏H5的提示 */
		font-size: 14px;
		color: #888;
	}

	/* #ifdef H5 */
	.login-wrapper {
		display: none;
		/* 在H5中隐藏微信登录按钮 */
	}

	.intro {
		display: block;
		/* 在H5中显示提示文字 */
	}

	/* #endif */
</style>