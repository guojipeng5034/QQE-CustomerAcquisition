// stores/quiz.js

import { defineStore } from 'pinia';
import { useUserStore } from './user';
import { submitQuizResult } from '@/api/api.js';
import { questions as rawQuestions } from '@/data/questions.js';

const fetchQuestionsFromAPI = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      const formattedQuestions = rawQuestions.map(q => ({
        title: q.question,
        options: q.options.map((optionText, index) => ({
          text: optionText,
          correct: index === q.answer
        })),
        explanation: q.explanation || "This is a default explanation."
      }));
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
    _score: 0,
    hasSyncedResult: false,
  }),
  getters: {
    currentQuestion: (state) => state.questions[state.currentQuestionIndex],
    score: (state) => {
      if (state.hasSyncedResult) {
        return state._score;
      }
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
    syncResult(score, answers) {
      this._score = score;
      this.selectedAnswers = answers || [];
      this.hasSyncedResult = true;
    },
    
    // [新增] 只加载题目，不重置分数和答案，专门给结果页的回顾功能使用
    async loadQuestionsForReview() {
        if (this.questions.length > 0) return; // 如果已经有题目了，就不重复加载
        this.loading = true;
        try {
            this.questions = await fetchQuestionsFromAPI();
        } catch (error) {
            console.error("加载回顾题目失败", error);
        } finally {
            this.loading = false;
        }
    },

    async fetchQuestions() {
      this.loading = true;
      try {
        this.questions = await fetchQuestionsFromAPI();
        this.selectedAnswers = new Array(this.questions.length).fill(null);
        this._score = 0;
        this.hasSyncedResult = false;
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
      
      try {
        await submitQuizResult(userStore.openid, this.score);
        console.log("答题结果提交成功");
        
        if (userStore.userInfo) {
            userStore.userInfo.score = this.score;
            uni.setStorageSync('userInfo', userStore.userInfo);
        }

      } catch (error) {
        console.error("提交分数失败", error);
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