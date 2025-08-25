<template>
	<view class="login-container">
		<!-- #ifdef H5 -->
		<image src="https://static.campustop.net/global/wechat/logo.svg" class="logo"></image>
		<view class="login-wrapper">
			<view class="app-name">测测你的<view class="app-name-green">迁徙力</view>
			</view>
			<view class="slogan">Discover Your Migration Power</view>

			<view class="input-group">
				<input type="number" class="input-field" placeholder="手机号码" placeholder-class="input-placeholder"
					maxlength="11" v-model="phone" />
			</view>

			<view class="input-group code-group">
				<input type="number" class="input-field" placeholder="验证码" placeholder-class="input-placeholder"
					maxlength="6" v-model="code" />
				<view class="code-button" :class="{ 'is-counting-down': isCountingDown }" @click="sendCode">
					{{ countdownText }}
				</view>
			</view>

			<button class="button" @click="login">开始答题<image src="../../static/images/right.svg" class="righticon">
				</image></button>
			<view class="btndown">
				<image src="../../static/images/sure.svg" class="righticon"></image>3分钟测试，解锁你的专属迁徙力语言报告
			</view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script setup>
	// #ifdef H5
	import {
		ref,
		computed
	} from 'vue';
	import {
		useUserStore
	} from '@/stores/user';

	const userStore = useUserStore();
	const phone = ref('');
	const code = ref('');

	const countdown = ref(0);
	const timer = ref(null);

	const isCountingDown = computed(() => countdown.value > 0);
	const countdownText = computed(() => {
		return isCountingDown.value ? `${countdown.value}秒后重发` : '获取验证码';
	});

	const startCountdown = () => {
		countdown.value = 60;
		timer.value = setInterval(() => {
			if (countdown.value > 0) {
				countdown.value--;
			} else {
				clearInterval(timer.value);
				timer.value = null;
			}
		}, 1000);
	};

	const sendCode = () => {
		// 如果正在倒计时，则不执行任何操作
		if (isCountingDown.value) return;

		const phoneRegex = /^1[3-9]\d{9}$/;
		if (!phoneRegex.test(phone.value)) {
			uni.showToast({
				title: '请输入正确的手机号',
				icon: 'none'
			});
			return;
		}

		console.log('向手机号', phone.value, '发送验证码');
		uni.showToast({
			title: '验证码已发送',
			icon: 'none'
		});

		startCountdown();
	};

	const login = async () => {
		if (!phone.value) {
			uni.showToast({
				title: '请输入手机号',
				icon: 'none'
			});
			return;
		}
		if (!code.value) {
			uni.showToast({
				title: '请输入验证码',
				icon: 'none'
			});
			return;
		}


		try {
			await userStore.handleSmsLogin(phone.value, code.value);
			uni.redirectTo({
				url: '/pages/quiz/index'
			});
		} catch (error) {
			console.error('H5登录失败:', error);
		}
	};
	// #endif
</script>

<style>
	.login-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		/* 设置背景图 */
		/* 设置背景图和渐变叠加 */
		background-image: linear-gradient(183deg, rgba(0, 0, 0, 0) 0%, rgba(0, 49, 93, 0.69) 100%), url('https://static.campustop.net/global/wechat/20250822-103545.jpg');
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
	}

	.logo {
		position: fixed;
		top: 119rpx;
		left: 40rpx;
		width: 232rpx;
		height: 71rpx;
	}

	.app-name {
		display: flex;
		font-size: 76rpx;
		font-weight: bold;
		margin-bottom: 10px;
		color: #FFFFFF;
		letter-spacing: 4rpx;
	}

	.app-name-green {
		color: #8EF5B4;
	}

	.slogan {
		font-size: 34rpx;
		color: #FFFFFF;
		margin-bottom: 40px;
		letter-spacing: 2rpx;
	}

	/* --- 新增样式开始 --- */
	.input-group {
		display: flex;
		width: 85vw;
		border: 1px solid #D6DEE6;
		background: #FFFFFF;
		border-radius: 24rpx;
		padding: 24rpx 30rpx;
		margin-bottom: 40rpx;
		box-sizing: border-box;
	}


	.input-field {
		flex: 1;
		font-size: 32rpx;
		color: #222222;
		height: 100%;
		text-align: left;
	}

	.input-placeholder {
		color: #9AA0A3;
		font-size: 32rpx;
	}

	.code-button {
		font-size: 28rpx;
		color: #9AA0A3;
		border-left: 1px solid #9AA0A3;
		padding-left: 20rpx;
		white-space: nowrap;
		/* 防止文字换行 */
	}

	.code-button.is-counting-down {
		color: #999999;
	}

	/* --- 新增样式结束 --- */

	.button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 85vw;
		background-color: #20BAF2;
		color: white;
		font-weight: 500;
		border-radius: 24rpx;
		font-size: 32rpx;
		padding: 10rpx 0 10rpx 20rpx;
		letter-spacing: 3rpx;
		box-sizing: border-box;
	}

	.btndown {
		margin-top: 30rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #FFFFFF;
		font-size: 28rpx;
		letter-spacing: 1rpx;
	}

	.righticon {
		margin: 0 10rpx;
		height: 54rpx;
		width: 45rpx;
	}
</style>