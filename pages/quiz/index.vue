<template>
	<view class="quiz-container">
		<view class="title-text">块酷英语</view>
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
						<text class="option-prefix">{{ String.fromCharCode(65 + index) }}</text>
						<text>{{ option.text }}</text>

						<image v-if="reviewMode && option.correct" class="feedback-icon"
							src="/static/images/sure.svg" />
						<image v-if="reviewMode && selectedAnswers[currentQuestionIndex] === index && !option.correct"
							class="feedback-icon" src="/static/images/error.svg" />
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
	/* 样式部分保持不变，此处省略以保持简洁 */
	/* 整体布局 */
	.quiz-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		/* 设置背景图 */
		background-image: url('https://static.campustop.net/global/wechat/20250822-103609.jpg');
		background-size: cover;
		/* 图片完全覆盖容器 */
		background-position: center;
		/* 图片居中显示 */
		background-repeat: no-repeat;
		/* 图片不重复 */

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
		align-items: center;
		padding: 15px;
		border: 1px solid #EFF5F6;
		border-radius: 22rpx;
		margin-bottom: 12px;
		transition: all 0.2s ease;
		background-color: #EFF5F6;
		position: relative;
		/* 新增：允许文字占据剩余空间 */
		justify-content: flex-start;
		/* 新增：为右侧图标预留内边距 */
		padding-right: 40px;
		/* 这个值需要根据您的图标宽度和间距进行调整 */
		word-break: break-word;
		/* 允许长单词换行 */
	}

	.option-prefix {
		font-weight: bold;
		margin-right: 10px;
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
		/* 修改：与选项右内边距保持一致或稍小 */
		right: 15px;
		/* 可以根据需要调整 */
		top: 50%;
		transform: translateY(-50%);
		z-index: 1;
		/* 确保图标在文字上方 */
	}

	/* 答案解析 */
	.explanation-wrapper {
		padding: 0 15px 120px;
		/* 底部留出空间给按钮 */
	}

	.explanation-text {
		font-size: 15px;
		line-height: 1.6;
	}

	/* 底部按钮 */
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
		/* 再次尝试移除边框 */
		opacity: 1;
	}

	/* 也可以为 disabled 状态下的伪元素单独设置 */
	.button.disabled-style[disabled]::after {
		border: none;
	}

	.submit-button {
		color: #FFFFFF;
		background-color: #20BAF2;
	}
</style>