<template>
	<view class="result-container">
		<view class="score-card">
			<view class="score-title">您的答题结果</view>
			<view class="score-text">
				<text class="score">{{ quizStore.score }}</text>
				<text v-if="quizStore.questions.length > 0" class="total"> / {{ quizStore.questions.length }}</text>
			</view>
			<view class="score-feedback">{{ feedbackMessage }}</view>
		</view>

		<view class="action-buttons">
			<button 
				v-if="canReview"
				class="button review-button" 
				@click="quizStore.startReview"
			>
				回顾答案
			</button>
		</view>
	</view>
</template>

<script setup>
import { computed } from 'vue';
import { useQuizStore } from '@/stores/quiz';
import { useUserStore } from '@/stores/user';
import { onLoad } from '@dcloudio/uni-app';

const quizStore = useQuizStore();
const userStore = useUserStore();

// 计算是否可以回顾
const canReview = computed(() => {
	// 确保 quizStore 中有题目数据，并且 selectedAnswers 是一个有内容的数组
	return quizStore.questions.length > 0 && Array.isArray(quizStore.selectedAnswers) && quizStore.selectedAnswers.length > 0;
});

const feedbackMessage = computed(() => {
	// 如果是直接跳转过来的，questions可能为空，需要安全处理
	const total = quizStore.questions.length || 10;
	if(total === 0 && !quizStore.hasSyncedResult) return "正在计算...";

	const rate = quizStore.score / total;
	if (rate === 1) return "太棒了，全部正确！";
	if (rate >= 0.8) return "非常不错，继续努力！";
	if (rate >= 0.6) return "成绩合格，再接再厉！";
	return "还有提升空间哦，加油！";
});

onLoad(() => {
    // [核心修正]
    // 无论是刚答完题过来，还是静默登录直接跳转过来，
    // 我们都需要题目数据来支撑“回顾”功能和计算总分。
    // 但只有在静默登录跳转过来时才需要手动加载。
    // loadQuestionsForReview 方法能安全地加载题目而不重置分数。
	if (quizStore.questions.length === 0) {
		quizStore.loadQuestionsForReview();
	}
});
</script>

<style>
.result-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100vh;
	background-color: #f4f4f4;
	padding: 20px;
}
.score-card {
	background-color: #fff;
	border-radius: 12px;
	padding: 30px;
	text-align: center;
	width: 100%;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.score-title {
	font-size: 24px;
	font-weight: bold;
	margin-bottom: 20px;
}
.score-text {
	margin-bottom: 20px;
}
.score {
	font-size: 48px;
	color: #007aff;
	font-weight: bold;
}
.total {
	font-size: 24px;
	color: #888;
}
.score-feedback {
	font-size: 16px;
	color: #666;
}
.action-buttons {
	display: flex;
	justify-content: center;
	width: 100%;
	margin-top: 40px;
}
.button {
	width: 80%;
	max-width: 300px;
	border-radius: 20px;
}
.review-button {
	background-color: #007aff;
	color: #fff;
}
</style>