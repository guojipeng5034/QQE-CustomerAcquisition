<template>
	<view class="gauge-chart-container">

		<view class="progress-bar" :style="progressStyle"></view>

		<view class="gauge-value">
			<text class="value-text">{{ animatedValue.toFixed(0) }}</text>
			<text class="value-unit">综合得分</text>
		</view>

	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		watch,
		onMounted
	} from 'vue';

	const props = defineProps({
		value: {
			type: Number,
			default: 0
		},
		// 您可以根据实际情况调整最大值，例如 100 分
		maxValue: {
			type: Number,
			default: 100
		}
	});

	let animationTimer = null;
	const animatedValue = ref(0);

	// 计算动态style，用于控制背景尺寸（实现动画）
	const progressStyle = computed(() => {
		const clampedValue = Math.max(0, Math.min(props.value, props.maxValue));
		const percentage = clampedValue / props.maxValue;

		// 通过改变背景的宽度百分比（从0%到100%）来实现填充动画
		return {
			'background-size': `${percentage * 100}% 100%`,
		};
	});

	// 数字动画逻辑
	const animateValue = (targetValue) => {
		if (animationTimer) {
			clearInterval(animationTimer);
		}
		const startValue = animatedValue.value;
		const duration = 800;
		const frameRate = 60;
		const totalFrames = duration / (1000 / frameRate);
		const increment = (targetValue - startValue) / totalFrames;
		if (Math.abs(increment) < 0.01) {
			animatedValue.value = targetValue;
			return;
		}
		let currentFrame = 0;
		animationTimer = setInterval(() => {
			currentFrame++;
			animatedValue.value += increment;
			if (currentFrame >= totalFrames) {
				clearInterval(animationTimer);
				animationTimer = null;
				animatedValue.value = targetValue;
			}
		}, 1000 / frameRate);
	};

	watch(() => props.value, (newValue, oldValue) => {
		if (newValue !== oldValue) {
			animateValue(newValue);
		}
	});

	onMounted(() => {
		animatedValue.value = 0;
		if (props.value > 0) {
			animateValue(props.value);
		}
	});
</script>

<style scoped>
	.gauge-chart-container {
		position: relative;
		width: 370rpx;
		height: 220rpx;
		margin: 0 auto;
		/* 确保背景图路径正确 */
		background-image: url("/static/images/fractionback.svg");
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-position: center;
	}

	.progress-bar {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;

		/* 1. 设置进度条的渐变背景 */
		background-image: linear-gradient(to right, #20CB7E, #10C872);
		background-repeat: no-repeat;

		/* 2. 应用SVG文件作为遮罩 */
		mask-image: url("/static/images/gauge-mask.svg");
		-webkit-mask-image: url("/static/images/gauge-mask.svg");

		/* 3. 设置遮罩的尺寸和位置 */
		mask-size: 100% 100%;
		-webkit-mask-size: 100% 100%;
		mask-repeat: no-repeat;
		-webkit-mask-repeat: no-repeat;

		/* 4. 动画关键：让 background-size 的变化产生过渡效果 */
		transition: background-size 0.8s ease-in-out;
		/* --- 新增下面这行代码 --- */
		/* 5. 添加圆角以实现圆弧形端点 */
		border-radius: 30rpx;
	}

	.gauge-value {
		position: absolute;
		top: 70%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.value-text {
		font-size: 68rpx;
		font-weight: bold;
		color: #333;
	}

	.value-unit {
		font-size: 28rpx;
		color: #888;
	}
</style>