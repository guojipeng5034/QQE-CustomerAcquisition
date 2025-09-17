// stores/quiz.js

import {
	defineStore
} from 'pinia';
import {
	useUserStore
} from './user';
import {
	submitQuizResult
} from '@/api/api.js';

export const useQuizStore = defineStore('quiz', {
	state: () => ({
		questions: [],
		currentQuestionIndex: 0,
		selectedAnswers: [],
		loading: false,
		reviewMode: false,
		_score: 0,
		hasSyncedResult: uni.getStorageSync('hasSyncedResult') || false,
		questionsStr: [],
		evaluationLevels: []
	}),
	getters: {
		currentQuestion: (state) => state.questions[state.currentQuestionIndex],
		score: (state) => {
			if (state.hasSyncedResult) {
				return state._score;
			}
			return state.questions.reduce((count, question, index) => {
				const selectedOptionIndex = state.selectedAnswers[index];
				if (selectedOptionIndex !== undefined && selectedOptionIndex !== null && question
					.options[selectedOptionIndex]?.correct) {
					return count + 1;
				}
				return count;
			}, 0);
		}
	},
	actions: {
		syncResult(score, answers) {
			this._score = score;
			// 匹配每道题的选项字母
			const matches = answers.match(/(\d+)\.([A-D])\([^\)]+\)/g);

			const result = matches.map(item => {
				// 提取选项字母
				const letter = item.match(/\.(\w)\(/)[1];
				// 转换为索引
				return 'ABCD'.indexOf(letter);
			});
			this.selectedAnswers = result
			this.hasSyncedResult = true;
			uni.setStorageSync('hasSyncedResult', true);
		},
		async loadQuestionsForReview() {
			if (this.questions.length > 0) return; // 如果已经有题目了，就不重复加载
			this.loading = true;
			try {
				this.questions = this.questionsStr.map(q => ({
					title: q.question,
					options: q.options.map((optionText, index) => ({
						text: optionText,
						correct: index === q.answer
					})),
					explanation: q.explanation ||
						"This is a default explanation."
				}));
			} catch (error) {
				console.error("加载回顾题目失败", error);
			} finally {
				this.loading = false;
			}
		},

		async fetchQuestions() {
			this.loading = true;
			try {
				this.questions = this.questionsStr.map(q => ({
					title: q.question,
					options: q.options.map((optionText, index) => ({
						text: optionText,
						correct: index === q.answer
					})),
					explanation: q.explanation ||
						"This is a default explanation."
				}));
				this.selectedAnswers = new Array(this.questions.length).fill(null);
				this._score = 0;
				this.hasSyncedResult = false;
				uni.removeStorageSync('hasSyncedResult');
			} catch (error) {
				console.error("获取问题失败", error);
				uni.showToast({
					title: '题目加载失败',
					icon: 'none'
				});
			} finally {
				this.loading = false;
			}
		},
		selectAnswer(optionIndex) {
			if (this.reviewMode) return;
			this.selectedAnswers[this.currentQuestionIndex] = optionIndex;
		},
		nextQuestion() {
			if (this.currentQuestionIndex < this.questions.length - 1) {
				this.currentQuestionIndex++;
			}
		},
		prevQuestion() {
			if (this.currentQuestionIndex > 0) {
				this.currentQuestionIndex--;
			}
		},
		async submit() {
			const userStore = useUserStore();
			// [核心修改] 在提交前，先根据用户答案计算出最终分数
			const finalScore = this.score;
			// [核心修改] 立刻更新 store 内部的 _score 状态
			this._score = finalScore;
			// 格式化答案
			const remarks = this.questions.map((question, index) => {
				const selectedOptionIndex = this.selectedAnswers[index];
				const userAnswerLetter = String.fromCharCode(65 + selectedOptionIndex);
				const isCorrect = question.options[selectedOptionIndex]?.correct ? '(正确)' : '(错误)';
				return `${index + 1}.${userAnswerLetter}${isCorrect}`;
			}).join(';');

			try {
				// 将格式化后的答案作为remarks字段提交
				await submitQuizResult(userStore.openid, finalScore, remarks);

				if (userStore.userInfo) {
					userStore.userInfo.score = finalScore;
					uni.setStorageSync('userInfo', userStore.userInfo);
				}

			} catch (error) {
				console.error("提交分数失败", error);
				uni.showToast({
					title: '提交失败，但仍可查看结果',
					icon: 'none'
				});
			} finally {
				this.hasSyncedResult = true;
				uni.setStorageSync('hasSyncedResult', true);
				uni.redirectTo({
					url: '/pages/result/index',
				});
			}
		},
		startReview() {
			this.reviewMode = true;
			this.currentQuestionIndex = 0;
			uni.navigateTo({
				url: '/pages/quiz/index?review=true',
			});
		},
		reset() {
			this.currentQuestionIndex = 0;
			this.selectedAnswers = [];
			this.reviewMode = false;
			this.fetchQuestions();
		},
	},
});