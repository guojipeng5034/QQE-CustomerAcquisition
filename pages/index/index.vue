<template>
	<view class="container">
		<!-- 		<view class="logo"></view> -->
		<view class="login-wrapper">
			<view class="app-name">测测你的<view class="app-name-green">迁徙力</view>
			</view>
			<view class="slogan">Discover Your Migration Power</view>
			<button class="button" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
				开始答题
				<image src="../../static/images/right.svg" class="righticon"></image>
			</button>
			<view class="btndown">
				3分钟测试，解锁你的专属迁徙力语言报告
			</view>
			<!-- <view class="agreements">
				<image src="../../static/images/sure.svg" class="sure-righticon"></image>登录即代表您已同意
				<text class="link" @click="goToAgreement">《用户服务协议》</text>
				<text class="separator">和</text>
				<text class="link" @click="goToPrivacy">《隐私政策》</text>
			</view> -->
		</view>
		<view class="intro">正在跳转到H5登录...</view>
	</view>
</template>

<script setup>
	import {
		useUserStore
	} from '@/stores/user';
	import {
		onLoad
	} from '@dcloudio/uni-app';

	const userStore = useUserStore();
	const goToAgreement = () => {
		uni.navigateTo({
			url: '/pages/agreement/index'
		});
	};

	const goToPrivacy = () => {
		uni.navigateTo({
			url: '/pages/privacy/index'
		});
	};
	const getPhoneNumber = async (e) => {
		// 1. 检查用户是否拒绝
		if (e.detail.errMsg !== 'getPhoneNumber:ok') {
			uni.showToast({
				title: '您已取消授权',
				icon: 'none'
			});
			return;
		}
		// 2. 检查 code 是否获取成功
		if (!e.detail.code) {
			uni.showToast({
				title: '获取授权码失败',
				icon: 'none'
			});
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
		/* 设置背景图 */
		/* 设置背景图和渐变叠加 */
		background-image: linear-gradient(183deg, rgba(0, 0, 0, 0) 50%, rgba(0, 49, 93, 0.69)100%), url('https://static.campustop.net/global/wechat/20250827-102312.jpg');
		background-size: cover;
		/* 图片完全覆盖容器 */
		background-position: center;
		/* 图片居中显示 */
		background-repeat: no-repeat;
		/* 图片不重复 */
	}

	.login-wrapper {
		display: flex;
		position: fixed;
		bottom: 15.5vh;
		flex-direction: column;
		align-items: center;
		text-align: center;
		width: 100%;
	}

	/* .logo {
		position: fixed;
		top: 119rpx;
		left: 40rpx;
		width: 232rpx;
		height: 71rpx;
		background-image: url('https://static.campustop.net/global/wechat/logo.svg');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	} */

	.app-name {
		display: flex;
		font-size: 76rpx;
		font-weight: bold;
		margin-bottom: 10px;
		color: #FFFFFF;
	}

	.app-name-green {
		color: #8EF5B4;
	}

	.slogan {
		font-size: 34rpx;
		color: #FFFFFF;
		margin-bottom: 40px;
	}

	.button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 42vh;
		background-color: #20BAF2;
		color: white;
		font-weight: 500;
		border-radius: 20rpx;
		font-size: 32rpx;
		padding: 14rpx 0 14rpx 20rpx;
	}

	.btndown {
		margin-top: 30rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #FFFFFF;
		font-size: 28rpx;
	}

	.righticon {
		margin: 0 10rpx;
		height: 54rpx;
		width: 45rpx;
	}

	.sure-righticon {
		margin: 0 10rpx;
		height: 32rpx;
		width: 32rpx;
	}

	.intro {
		display: none;
		/* 在微信小程序中隐藏H5的提示 */
		font-size: 14px;
		color: #888;
	}

	.agreements {
		position: fixed;
		bottom: 60rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 40rpx;
		font-size: 24rpx;
		color: #F2F7F9;
	}

	.agreements .link {
		text-decoration: underline;
		border-bottom: none;
		/* 移除H5环境下的border */
		padding-bottom: 0;
	}

	.agreements .separator {
		margin: 0 10rpx;
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