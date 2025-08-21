// stores/quiz.js

import { defineStore } from 'pinia';
import { useUserStore } from './user';
import { submitQuizResult } from '@/api/api.js';
import { questions as rawQuestions } from '@/data/questions.js';

const fetchQuestionsFromAPI = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      const formattedQuestions = rawQuestions.map(q => {
        return {
          title: q.question,
          options: q.options.map((optionText, index) => ({
            text: optionText,
            correct: index === q.answer
          })),
          explanation: q.explanation || "This is a default explanation."
        };
      });
      resolve(formattedQuestions);
    }, 500);
  });
};

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    questions: [],
    currentQuestionIndex: 0,
    selectedAnswers: [],
    loading: false,
    reviewMode: false,
    // 新增一个 score 状态，用于直接接收老用户的分数
    _score: 0,
  }),
  getters: {
    currentQuestion: (state) => state.questions[state.currentQuestionIndex],
    // 修改 score getter，使其能处理两种情况
    score: (state) => {
      // 如果是已答题用户，直接返回同步过来的分数
      if (state._score > 0) {
        return state._score;
      }
      // 否则，实时计算分数
      return state.questions.reduce((count, question, index) => {
        const selectedOptionIndex = state.selectedAnswers[index];
        if (selectedOptionIndex !== undefined && selectedOptionIndex !== null && question.options[selectedOptionIndex]?.correct) {
          return count + 1;
        }
        return count;
      }, 0);
    },
  },
  actions: {
    // [新增] 用于从 userStore 同步已有的答题结果
    syncResult(score, answers) {
      this._score = score;
      this.selectedAnswers = answers || [];
    },
    
    // ... 其他 actions 保持不变 ...
    async fetchQuestions() {
      this.loading = true;
      try {
        this.questions = await fetchQuestionsFromAPI();
        this.selectedAnswers = new Array(this.questions.length).fill(null);
        this._score = 0; // 开始新答题时，重置同步来的分数
      } catch (error) {
        console.error("获取问题失败", error);
        uni.showToast({ title: '题目加载失败', icon: 'none' });
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
      const result = {
        answers: this.selectedAnswers,
        score: this.score,
        userId: userStore.userInfo?.id || 'unknown'
      };

      try {
        await submitQuizResult(result);
        console.log("答题结果提交成功");
      } catch (error) {
        console.error("提交失败", error);
        uni.showToast({ title: '提交失败，但仍可查看结果', icon: 'none' });
      } finally {
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