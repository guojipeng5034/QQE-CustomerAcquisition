<template>
	<view class="result-container">
		<view class="top-back">
			<image src="https://static.campustop.net/global/wechat/20250822-103614.jpg" class="top-back-img"
				mode="widthFix" />
			<view class="title-text">快酷英语</view>
			<view class="title-phone">{{formatPhone(userStore.userInfo?.phone)}}</view>
			<view class="title-two">
				<view class="title-inde">测试报告</view>
				<view class="title-inde-chr">TEST REPORT</view>
			</view>
			<view class="title-bottom"></view>
		</view>
		<view class="score-card">
			<view class="score-title">
			</view>
			<view class="score-text">
				<view class="content">
					<GaugeChart :value="quizStore.score" :max-value="12" />
				</view>

				<view v-if="resultDetails">
					<view class="fun-mig">
						<view class="fun-text">迁徙力等级</view>
						<view class="fun-sub-text">{{ resultDetails.title }}</view>
					</view>
					<view class="fun-mig">
						<view class="fun-text">评语</view>
						<view class="fun-sub-text">{{ resultDetails.description }}</view>
					</view>
				</view>
				
			</view>
		</view>

		<view class="action-buttons">
			<button v-if="canReview" class="button review-button" @click="quizStore.startReview">
				答题记录
			</button>
		</view>
	</view>
</template>

<script setup>
	import {
		computed,
		ref,
		onMounted
	} from 'vue';
	import {
		useQuizStore
	} from '@/stores/quiz';
	import {
		useUserStore
	} from '@/stores/user';
	import {
		onLoad
	} from '@dcloudio/uni-app';
	// *** 1. 引入您的评级数据 ***
	// 请确保这个文件路径是正确的
	import { evaluationLevels } from '@/data/questions.js';
	import GaugeChart from './components/GaugeChart.vue';

	const quizStore = useQuizStore();
	const userStore = useUserStore();

	const canReview = computed(() => {
		return quizStore.questions.length > 0 && Array.isArray(quizStore.selectedAnswers) && quizStore
			.selectedAnswers.length > 0;
	});
	
	// *** 2. 删除旧的 feedbackMessage，创建新的 resultDetails ***
	const resultDetails = computed(() => {
		// 处理正在加载或数据未同步的情况
		if (!quizStore.hasSyncedResult && quizStore.score === 0) {
			return {
				title: "正在计算...",
				description: "请稍候，我们正在为您生成评估结果。",
			};
		}
		
		const score = quizStore.score;
		
		// 根据分数查找对应的级别对象
		const foundLevel = evaluationLevels.find(level =>
			score >= level.min_score && score <= level.max_score
		);
		
		// 如果找到了，就返回该对象；如果没找到，返回一个默认的未定义对象
		return foundLevel || {
			title: "结果异常",
			description: "无法匹配到对应的分数等级，请检查数据。",
		};
	});


	const formatPhone = (phone) => {
		if (phone && typeof phone === 'string' && phone.length === 11) {
			return phone.slice(0, 3) + '****' + phone.slice(7);
		}
		return phone;
	};

	onLoad(() => {
		
		// 如果页面被直接打开，questions为空，则加载题目数据用于回顾
		if (quizStore.questions.length === 0) {
			quizStore.loadQuestionsForReview();
		}
	});
</script>

<style>
	/* 样式部分保持不变 */
	.result-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #FFFFFF;
		position: relative;
	}

	.content {
		display: flex;
		justify-content: center;
		padding: 0rpx;
	}

	.title-text {
		display: flex;
		justify-content: center;
		align-items: center;
		color: #FFFFFF;
		font-weight: bold;
		font-size: 34rpx;
		position: absolute;
		top: 130rpx;
		left: 50%;
		transform: translate(-50%, -50%);
		letter-spacing: 2rpx;
	}

	.title-phone {
		color: #FFFFFF;
		position: absolute;
		top: 110rpx;
		left: 50rpx;
	}

	.top-back {
		width: 100%;
		position: relative;
		padding: 0;
		margin: 0;
		border: 0;
	}

	.top-back-img {
		width: 100%;
		display: block;
	}

	.title-two {
		display: flex;
		flex-direction: column;
		position: absolute;
		top: 240rpx;
		left: 50rpx;
	}

	.title-inde {
		font-weight: 600;
		font-size: 52rpx;
		color: #FFFFFF;
		line-height: 80rpx;
		text-align: left;
		font-style: normal;
		letter-spacing: 4rpx;
	}

	.title-inde-chr {
		margin-top: 16rpx;
		font-weight: 500;
		font-size: 34rpx;
		color: rgba(255, 255, 255, 0.6);
		/* 设置白色文字的透明度为 60% */
		line-height: 40rpx;
		letter-spacing: 1rpx;
		text-align: left;
		font-style: normal;
	}

	.title-bottom {
		background: #FFFFFF;
		border-radius: 52rpx 52rpx 0 0;
		width: 100%;
		height: 60rpx;
		position: absolute;
		bottom: 0;
		padding: 0;
		margin: 0 0 -1px 0;
	}

	.score-card {
		background: #FFFFFF;
		background-color: #fff;
		text-align: center;
		width: 100%;
		border: 0;
		padding: 0;
		margin: 0;
	}

	.score-title {
		margin-bottom: 1px;
	}

	.action-buttons {
		position: fixed;
		bottom: 66rpx;
		display: flex;
		justify-content: center;
		width: 100%;
		margin-top: 40px;
	}

	.button {
		width: 90%;
		padding: 10rpx 0;
		border-radius: 24rpx;
	}

	.review-button {
		background: #FFFFFF;
		border: 2rpx solid #20BAF2;
		color: #20BAF2;
	}

	.fun-mig {
		margin: 30rpx 40rpx;
		background: #F2F7F9;
		border-radius: 22rpx;
		display: flex;
		flex-direction: column;
		text-align: left;
		padding: 30rpx 40rpx;
	}

	.fun-text {
		font-weight: bold;
		font-size: 32rpx;
		color: #222222;
		line-height: 46rpx;
		text-align: left;
		font-style: normal;
	}

	.fun-sub-text {
		margin-top: 16rpx;
		font-weight: 400;
		font-size: 30rpx;
		color: #666666;
		line-height: 44rpx;
		text-align: left;
		font-style: normal;
	}
</style>