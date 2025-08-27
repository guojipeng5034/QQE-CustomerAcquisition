<template>
	<view class="entry-container">
		<view class="loading-wrapper">
			<view class="loading-text">正在加载，请稍候...</view>
			<progress percent="100" active stroke-width="3" active-mode="forwards" :duration="20" activeColor="#20BAF2"
				class="loading-progress"></progress>
		</view>
	</view>
</template>

<script setup>
	import {
		onShow
	} from '@dcloudio/uni-app';

	onShow(() => {
		// 1. 获取在 App.vue 中启动的异步登录任务
		const loginPromise = getApp().globalData.loginPromise;

		const handleRedirect = (state) => {
			let targetUrl = '';
			if (state === 'hasResult') {
				targetUrl = '/pages/result/index';
			} else if (state === 'loggedIn') {
				targetUrl = '/pages/quiz/index';
			} else if (state === 'guest') {
				targetUrl = '/pages/index/index';
			}

			if (targetUrl) {
				uni.redirectTo({
					url: targetUrl
				});
			} else {
				// 发生意外，跳转到授权页作为保底方案
				uni.redirectTo({
					url: '/pages/index/index'
				});
			}
		};

		// 2. [核心修改] 主动等待 Promise 完成
		if (loginPromise && typeof loginPromise.then === 'function') {
			loginPromise.then(finalState => {
				console.log('静默登录完成，最终状态:', finalState);
				handleRedirect(finalState);
			}).catch(error => {
				console.error('等待静默登录时发生错误:', error);
				// 即使出错，也跳转到授权页
				handleRedirect('guest');
			});
		} else {
			// 如果 Promise 不存在（不太可能发生），直接跳转到授权页
			console.warn('在 entry 页面未找到 loginPromise');
			handleRedirect('guest');
		}
	});
</script>

<style>
	.entry-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		background-image: linear-gradient(183deg, rgba(0, 0, 0, 0) 50%, rgba(0, 49, 93, 0.69) 100%), url('https://static.campustop.net/global/wechat/20250827-102312.jpg');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}

	.loading-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 80%;
	}

	.loading-text {
		font-size: 14px;
		color: #FFF;
		margin-bottom: 15px;
	}

	.loading-progress {
		width: 100%;
	}
</style>