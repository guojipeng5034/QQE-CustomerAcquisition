<template>
	<view class="login-container">
		<view class="login-wrapper">
			<image class="logo" src="/static/logo.png"></image>
			<view class="title">手机号登录</view>
			<view class="subtitle">未注册的手机号登录后将自动注册</view>

			<view class="input-group">
				<uni-easyinput
					prefixIcon="phone"
					type="number"
					v-model="phone"
					placeholder="请输入手机号"
					:inputBorder="false"
					maxlength="11"
				></uni-easyinput>
			</view>
			<view class="input-group code-group">
				<uni-easyinput
					prefixIcon="locked"
					type="number"
					v-model="code"
					placeholder="请输入验证码"
					:inputBorder="false"
					maxlength="6"
				></uni-easyinput>
				<button class="button code-button" :disabled="isCountingDown" @click="sendCode">
					{{ countdownText }}
				</button>
			</view>

			<button class="button login-button" @click="login">登 录</button>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const phone = ref('');
const code = ref('');

// --- 验证码倒计时逻辑 ---
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

/**
 * @description: 发送验证码
 */
const sendCode = () => {
	// 1. 简单的手机号格式校验
	const phoneRegex = /^1[3-9]\d{9}$/;
	if (!phoneRegex.test(phone.value)) {
		uni.showToast({
			title: '请输入正确的手机号',
			icon: 'none'
		});
		return;
	}
	
	// 2. 在这里调用发送验证码的真实API
	console.log('向手机号', phone.value, '发送验证码');
	uni.showToast({
		title: '验证码已发送',
		icon: 'none'
	});

	// 3. 开始倒计时
	startCountdown();
};

/**
 * @description: 登录
 */
const login = async () => {
	if (!phone.value || !code.value) {
		uni.showToast({ title: '请输入手机号和验证码', icon: 'none' });
		return;
	}
	
	try {
		// 调用 store action 发起登录请求
		await userStore.handleSmsLogin(phone.value, code.value);
		// 登录成功，跳转到答题页
		uni.redirectTo({
			url: '/pages/quiz/index'
		});
	} catch (error) {
		// 登录失败，在 userStore 的 action 中已有统一的 toast 提示
		console.error('H5登录失败:', error);
	}
};
</script>

<style>
.login-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 15vh;
	background-color: #f8f8f8;
	height: 100vh;
}

.login-wrapper {
	width: 90vw;
	max-width: 400px;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.logo {
	width: 60px;
	height: 60px;
	margin-bottom: 20px;
}

.title {
	font-size: 24px;
	font-weight: bold;
	margin-bottom: 10px;
}

.subtitle {
	font-size: 14px;
	color: #999;
	margin-bottom: 40px;
}

.input-group {
	width: 100%;
	margin-bottom: 20px;
	background-color: #fff;
	border-radius: 8px;
	box-shadow: 0 2px 8px rgba(0,0,0,0.05);
	/* uni-easyinput 默认样式调整 */
	--easyinput-input-height: 50px;
	--easyinput-font-size: 16px;
}
.code-group {
	display: flex;
	align-items: center;
}
.code-group .uni-easyinput {
	flex: 1;
}

.button {
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 25px;
	font-size: 16px;
	height: 50px;
}

.code-button {
	background-color: transparent;
	color: #007aff;
	font-size: 14px;
	padding: 0 15px;
	margin-left: 10px;
	border: none;
	white-space: nowrap; /* 防止文字换行 */
}
.code-button::after {
	border: none;
}
.code-button[disabled] {
	color: #999;
	background-color: transparent;
}

.login-button {
	width: 100%;
	margin-top: 20px;
	background-color: #007aff;
	color: white;
	box-shadow: 0 4px 10px rgba(0, 122, 255, 0.2);
}
</style>