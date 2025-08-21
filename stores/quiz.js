import { defineStore } from 'pinia';

// 模拟API获取问题
const fetchQuestionsFromAPI = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { title: 'Vue中组件通信的方式有哪些？', options: [{ text: 'props', correct: true }, { text: 'event bus', correct: true }, { text: 'vuex', correct: true }, { text: '以上都是', correct: true }] },
        { title: 'v-if和v-show的区别是什么？', options: [{ text: 'v-if是真正的条件渲染', correct: true }, { text: 'v-show只是简单的CSS切换', correct: true }, { text: 'v-if的切换开销更大', correct: true }, { text: '以上都是', correct: true }] },
        { title: 'Vue的生命周期钩子函数有哪些？', options: [{ text: 'beforeCreate', correct: true }, { text: 'created', correct: true }, { text: 'mounted', correct: true }, { text: '以上都是', correct: true }] },
        { title: '如何实现Vue组件的复用？', options: [{ text: '使用props传递数据', correct: true }, { text: '使用slot分发内容', correct: true }, { text: '使用mixin混入', correct: true }, { text: '以上都是', correct: true }] },
        { title: 'Vue中key的作用是什么？', options: [{ text: '提高渲染效率', correct: true }, { text: '用于区分不同的节点', correct: true }, { text: '以上都不是', correct: false }, { text: 'A和B都是', correct: true }] },
        { title: '什么是虚拟DOM？', options: [{ text: '一个JS对象', correct: true }, { text: '用来描述真实DOM', correct: true }, { text: '可以提高渲染性能', correct: true }, { text: '以上都是', correct: true }] },
        { title: 'Vue中如何进行双向数据绑定？', options: [{ text: 'v-model', correct: true }, { text: 'v-bind', correct: false }, { text: 'v-on', correct: false }, { text: 'v-text', correct: false }] },
        { title: 'Vue Router的模式有哪些？', options: [{ text: 'hash模式', correct: true }, { text: 'history模式', correct: true }, { text: 'abstract模式', correct: true }, { text: '以上都是', correct: true }] },
        { title: 'Vuex的state是什么？', options: [{ text: '存放状态的地方', correct: true }, { text: '是响应式的', correct: true }, { text: '以上都不是', correct: false }, { text: 'A和B都是', correct: true }] },
        { title: '如何在Vue中自定义指令？', options: [{ text: '使用directives选项', correct: true }, { text: '使用Vue.directive()', correct: true }, { text: '以上都不是', correct: false }, { text: 'A和B都是', correct: true }] },
      ]);
    }, 500); // 模拟500ms延迟
  });
};

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    questions: [],
    currentQuestionIndex: 0,
    selectedAnswers: [],
    loading: false,
    reviewMode: false,
  }),
  getters: {
    currentQuestion: (state) => state.questions[state.currentQuestionIndex],
    score: (state) => {
      return state.questions.reduce((count, question, index) => {
        const selectedOptionIndex = state.selectedAnswers[index];
        if (selectedOptionIndex !== undefined && question.options[selectedOptionIndex].correct) {
          return count + 1;
        }
        return count;
      }, 0);
    },
  },
  actions: {
    async fetchQuestions() {
      this.loading = true;
      this.questions = await fetchQuestionsFromAPI();
      this.loading = false;
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
    submit() {
      uni.redirectTo({
        url: '/pages/result/index',
      });
    },
    startReview() {
      this.reviewMode = true;
      this.currentQuestionIndex = 0;
      uni.redirectTo({
        url: '/pages/quiz/index?review=true',
      });
    },
    reset() {
      this.questions = [];
      this.currentQuestionIndex = 0;
      this.selectedAnswers = [];
      this.reviewMode = false;
    },
  },
});