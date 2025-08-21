<template>
	<view class="entry-container">
		<view class="loading-wrapper">
			<view class="loading-text">正在加载，请稍候...</view>
			<progress percent="100" active stroke-width="3" active-mode="forwards" :duration="20"
				class="loading-progress"></progress>
		</view>
	</view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const { loginState } = storeToRefs(userStore);

onShow(() => {
	console.log('当前登录状态:', loginState.value);
	uni.redirectTo({
		url: '/pages/index/index'
	});
	const handleRedirect = (state) => {
		if (state === 'hasResult') {
			uni.redirectTo({
				url: '/pages/result/index'
			});
			return true;
		} else if (state === 'loggedIn') {
			uni.redirectTo({
				url: '/pages/quiz/index'
			});
			return true;
		} else if (state === 'guest') {
			uni.redirectTo({
				url: '/pages/index/index'
			});
			return true;
		}
		return false;
	};
	
	// 如果进入页面时状态已确定，直接跳转
	if (handleRedirect(loginState.value)) {
		return;
	}

	// 否则，监听状态变化
	const unwatch = loginState.watch((newState) => {
		if (handleRedirect(newState)) {
			unwatch(); // 成功跳转后停止监听
		}
	});
});
</script>

<style>
	.entry-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		background-color: #fff;
	}

	.loading-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 80%;
	}

	.logo {
		width: 80px;
		height: 80px;
		margin-bottom: 20px;
	}

	.loading-text {
		font-size: 14px;
		color: #999;
		margin-bottom: 15px;
	}

	.loading-progress {
		width: 100%;
	}
</style>