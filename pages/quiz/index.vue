<template>
	<view class="quiz-container">
		<view v-if="loading" class="loading">
			<uni-load-more status="loading"></uni-load-more>
		</view>
		<view v-else-if="currentQuestion">
			<view class="status-bar-container">
				<uni-nav-bar
					:title="reviewMode ? '回顾答案' : '在线答题'"
					:left-icon="reviewMode ? 'back' : ''"
					@clickLeft="goBack"
					fixed
				>
					<template v-slot:right>
						<view class="progress-text">{{ currentQuestionIndex + 1 }}/{{ questions.length }}</view>
					</template>
				</uni-nav-bar>
				<progress :percent="(currentQuestionIndex + 1) / questions.length * 100" stroke-width="3" activeColor="#007aff" />
			</view>

			<view class="question-wrapper">
				<view class="question-title">
					<text class="question-tag">单选</text>
					{{ currentQuestion.title }}
				</view>
				<view class="options">
					<view
						v-for="(option, index) in currentQuestion.options"
						:key="index"
						class="option"
						:class="getOptionClass(option, index)"
						@click="quizStore.selectAnswer(index)"
					>
						<text class="option-prefix">{{ String.fromCharCode(65 + index) }}</text>
						<text>{{ option.text }}</text>
					</view>
				</view>
			</view>

			<view v-if="reviewMode" class="explanation-wrapper">
				<uni-card title="答案解析" :is-shadow="false">
					<text class="explanation-text">{{ currentQuestion.explanation }}</text>
				</uni-card>
			</view>

			<view class="navigation-buttons">
				<button v-if="currentQuestionIndex > 0" class="button" @click="quizStore.prevQuestion">
					<uni-icons type="arrow-left" color="#fff"></uni-icons>
					上一题
				</button>
				<button
					v-if="currentQuestionIndex < questions.length - 1"
					class="button"
					:disabled="selectedAnswers[currentQuestionIndex] === null && !reviewMode"
					@click="quizStore.nextQuestion"
				>
					下一题
					<uni-icons type="arrow-right" color="#fff"></uni-icons>
				</button>
				<button
					v-if="currentQuestionIndex === questions.length - 1 && !reviewMode"
					class="button submit-button"
					:disabled="selectedAnswers[currentQuestionIndex] === null"
					@click="quizStore.submit"
				>
					提 交
					<uni-icons type="checkmark" color="#fff"></uni-icons>
				</button>
			</view>
		</view>
	</view>
</template>

<script setup>
import { computed } from 'vue';
import { useQuizStore } from '@/stores/quiz';
import { storeToRefs } from 'pinia';
import { onLoad } from '@dcloudio/uni-app';

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
	min-height: 100vh;
	background-color: #f4f4f4;
}
.loading {
	margin-top: 50%;
}

/* 顶部状态栏 */
.status-bar-container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	z-index: 10;
	background-color: #fff;
}
.progress-text {
	padding-right: 20rpx;
	font-size: 14px;
}
/* 避免内容被顶部遮挡 */
.question-wrapper {
	margin-top: 100px;
	padding: 15px;
	background-color: #fff;
	border-radius: 8px;
	margin: 100px 15px 15px;
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
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	margin-bottom: 12px;
	transition: all 0.2s ease;
	background-color: #fcfcfc;
}
.option-prefix {
	font-weight: bold;
	margin-right: 10px;
}
.option.selected {
	border-color: #007aff;
	background-color: #e6f7ff;
	color: #007aff;
}
.option.correct {
	border-color: #18bc37;
	background-color: #f6ffed;
}
.option.incorrect {
	border-color: #e54d42;
	background-color: #fff1f0;
}

/* 答案解析 */
.explanation-wrapper {
	padding: 0 15px 120px; /* 底部留出空间给按钮 */
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
	background-color: #fff;
	border-top: 1px solid #f0f0f0;
}
.button {
	display: flex;
	align-items: center;
	justify-content: center;
	flex: 1;
	margin: 0 5px;
	background-color: #007aff;
	color: #fff;
}
.button[disabled] {
	background-color: #c8c9cc;
	color: #fff;
}
.submit-button {
	background-color: #18bc37;
}
</style>