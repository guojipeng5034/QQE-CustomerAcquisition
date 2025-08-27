<template>
	<view class="quiz-container">
		<view v-if="reviewMode" class="floating-back-button" @click="goBack">
			<uni-icons type="back" size="24" color="#000"></uni-icons>
		</view>
		<view v-if="!reviewMode" class="title-text">CampusTop快酷</view>
		<view v-if="reviewMode" class="title-text">答题记录</view>
		<view v-if="loading" class="loading">
			<uni-load-more status="loading"></uni-load-more>
		</view>
		<view v-else-if="currentQuestion">
			<view class="status-bar-container">
				<view class="progress-index">
					<progress :percent="(currentQuestionIndex + 1) / questions.length * 100" stroke-width="10"
						border-radius="9" activeColor="#20BAF2" class="loading-progress" />
				</view>
				<view class="progress-text">
					<view style="color: #222222;font-size: 28rpx;font-weight: 700;">{{ currentQuestionIndex + 1 }}
					</view> / {{ questions.length }}
				</view>
			</view>

			<view class="question-wrapper">
				<view class="question-title">
					{{currentQuestionIndex + 1}}.{{ currentQuestion.title }}
				</view>
				<view class="options">
					<view v-for="(option, index) in currentQuestion.options" :key="index" class="option"
						:class="getOptionClass(option, index)" @click="!reviewMode && quizStore.selectAnswer(index)">
						<view class="option-prefix">{{ String.fromCharCode(65 + index)+'.' }}</view>
						<view class="option-text">{{ option.text }}</view>

						<image v-if="reviewMode && option.correct" class="feedback-icon"
							src="/static/images/sure.svg" />
						<image v-if="reviewMode && selectedAnswers[currentQuestionIndex] === index && !option.correct"
							class="feedback-icon" src="/static/images/error.svg" />
					</view>
				</view>
			</view>
			<view v-if="reviewMode" class="answer-review">
				<view class="review-title">正确答案</view>
				<view class="review-content">
					<view class="bottom-text" v-if="userAnswerIndex === correctAnswerIndex">
						正确答案是 <view style="font-weight: bold;padding-left:10rpx;">{{ correctAnswerLetter }}</view>，回答正确
					</view>
					<view v-else class="bottom-text">
						正确答案是 <view style="font-weight: bold;padding-left:10rpx;"> {{ correctAnswerLetter }}</view>
						，你的答案是 <view style="color: #FF4A4A;font-weight: bold;padding-left:10rpx;">{{ userAnswerLetter }}
						</view>，回答错误
					</view>
				</view>
			</view>
			<view class="navigation-buttons">
				<button v-if="currentQuestionIndex > 0" class="button2" @click="quizStore.prevQuestion">
					上一题
				</button>
				<button v-if="currentQuestionIndex < questions.length - 1" class="button"
					:class="{ 'disabled-style': selectedAnswers[currentQuestionIndex] === null && !reviewMode }"
					:disabled="selectedAnswers[currentQuestionIndex] === null && !reviewMode"
					@click="quizStore.nextQuestion">
					下一题
				</button>
				<button v-if="currentQuestionIndex === questions.length - 1 && !reviewMode" class="button submit-button"
					:class="{ 'disabled-style': selectedAnswers[currentQuestionIndex] === null }"
					:disabled="selectedAnswers[currentQuestionIndex] === null" @click="quizStore.submit">
					提 交
					<uni-icons type="checkmark" color="#fff"></uni-icons>
				</button>
				<button v-if="currentQuestionIndex === questions.length - 1 && reviewMode" class="button"
					@click="goBack">
					返回报告
				</button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		computed
	} from 'vue';
	import {
		useQuizStore
	} from '@/stores/quiz';
	import {
		storeToRefs
	} from 'pinia';
	import {
		onLoad
	} from '@dcloudio/uni-app';

	const quizStore = useQuizStore();
	// 使用 storeToRefs 保持响应性
	const {
		loading,
		questions,
		currentQuestionIndex,
		currentQuestion,
		selectedAnswers,
		reviewMode,
	} = storeToRefs(quizStore);
	// --- 将计算属性放在这里 ---
	const correctAnswerIndex = computed(() => {
		if (!currentQuestion.value) return -1;
		return currentQuestion.value.options.findIndex(option => option.correct);
	});

	const correctAnswerLetter = computed(() => {
		if (correctAnswerIndex.value !== -1) {
			return String.fromCharCode(65 + correctAnswerIndex.value);
		}
		return '';
	});

	const userAnswerIndex = computed(() => {
		return selectedAnswers.value[currentQuestionIndex.value];
	});

	const userAnswerLetter = computed(() => {
		if (userAnswerIndex.value !== null && userAnswerIndex.value !== -1) {
			return String.fromCharCode(65 + userAnswerIndex.value);
		}
		return '';
	});
	// --- 计算属性结束 ---
	// 计算每个选项的 class
	const getOptionClass = (option, index) => {
		const selected = selectedAnswers.value[currentQuestionIndex.value] === index;
		if (reviewMode.value) {
			if (option.correct) {
				return 'correct';
			}
			if (selected && !option.correct) {
				return 'incorrect';
			}
		} else {
			if (selected) {
				return 'selected';
			}
		}
		return '';
	};

	// 返回上一页（仅回顾模式）
	const goBack = () => {
		uni.navigateBack();
	};

	onLoad((options) => {
		if (options.review) {
			quizStore.reviewMode = true;
		} else {
			// 如果不是回顾模式，则重置并获取新问题
			quizStore.reset();
		}
	});
</script>

<style>
	.quiz-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		/* 设置背景图 */
		background-image: url('https://static.campustop.net/global/wechat/20250822-103609.jpg');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;

	}

	.floating-back-button {
		position: absolute;
		top: 100rpx;
		left: 30rpx;
		z-index: 99;
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.title-text {
		margin-top: 103rpx;
		font-weight: bold;
		font-size: 34rpx;
		color: #222222;
		height: 49rpx;
		font-style: normal;
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.loading {
		margin-top: 50%;
	}

	.loading-progress {
		width: 100%;
	}

	/* 顶部状态栏 */
	.status-bar-container {
		margin-top: 40rpx;
		padding: 0 20rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.progress-index {
		width: 38vh;
	}

	.progress-text {
		font-size: 26rpx;
		display: flex;
		align-items: center;
		color: #9A9A9A;
	}

	/* 避免内容被顶部遮挡 */
	.question-wrapper {
		padding: 36rpx;
	}

	/* 问题区域 */
	.question-title {
		font-size: 18px;
		font-weight: bold;
		line-height: 1.5;
		margin-bottom: 20px;
	}

	.question-tag {
		background-color: #007aff;
		color: #fff;
		padding: 2px 6px;
		border-radius: 4px;
		font-size: 12px;
		margin-right: 8px;
	}

	/* 选项 */
	.options .option {
		display: flex;
		text-align: left;
		padding: 15px;
		border: 1px solid #EFF5F6;
		border-radius: 22rpx;
		margin-bottom: 12px;
		transition: all 0.2s ease;
		background-color: #EFF5F6;
		position: relative;
		padding-right: 40px;
		word-break: break-word;
	}

	.option-prefix {
		font-weight: bold;
		display: flex;
		width: 35rpx;
	}

	.option-text {
		width: 90%;
	}

	.option.selected {
		border-color: #20BAF2;
		background-color: #E2F7FF;
	}

	.option.correct {
		border-color: #0ECE74;
		background-color: #EAFAF7;
	}

	.option.incorrect {
		border-color: #e54d42;
		background-color: #fff1f0;
	}

	.feedback-icon {
		width: 24px;
		height: 24px;
		position: absolute;
		right: 15px;
		top: 50%;
		transform: translateY(-50%);
		z-index: 1;
	}

	.explanation-wrapper {
		padding: 0 15px 120px;
	}

	.explanation-text {
		font-size: 15px;
		line-height: 1.6;
	}

	.navigation-buttons {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-around;
		padding: 15px;
		padding-bottom: calc(15px + constant(safe-area-inset-bottom));
		padding-bottom: calc(15px + env(safe-area-inset-bottom));
	}

	.button {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		margin: 0 5px;
		font-weight: 500;
		font-size: 30rpx;
		height: 98rpx;
		border-radius: 24rpx;
		letter-spacing: 2rpx;
		color: #FFFFFF;
		background-color: #20BAF2;
		border: none;
	}

	.button2 {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		margin: 0 5px;
		font-weight: 500;
		font-size: 30rpx;
		height: 98rpx;
		border-radius: 24rpx;
		letter-spacing: 2rpx;
		background: #FFFFFF;
		border-radius: 24rpx;
		color: #20BAF2;
		border: 2rpx solid #20BAF2;

	}

	.button::after {
		border: none;
	}

	.button.disabled-style[disabled] {
		background-color: #B4E6F8 !important;
		color: #fff !important;
		border: none !important;
		opacity: 1;
	}

	.button.disabled-style[disabled]::after {
		border: none;
	}

	.submit-button {
		color: #FFFFFF;
		background-color: #20BAF2;
	}

	.answer-review {
		margin-top: 40rpx;
		padding: 30rpx 0;
		border-top: 1rpx solid #D6DEE6;
		margin: 0 30rpx;
	}

	.review-title {
		font-weight: bold;
		margin-bottom: 20rpx;
	}

	.review-content {
		color: #333;
	}

	.bottom-text {
		display: flex;
		align-items: center;
	}
</style>