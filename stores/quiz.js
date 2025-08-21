// stores/quiz.js

import { defineStore } from 'pinia';
import { useUserStore } from './user'; // 引入 user store
import { submitQuizResult } from '@/api/api.js'; // 引入提交 API

// 模拟从API获取问题数据
// 在真实项目中，这里会是一个真正的网络请求
const fetchQuestionsFromAPI = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { 
          title: 'Vue中组件通信的方式有哪些？', 
          options: [{ text: 'props', correct: false }, { text: 'event bus', correct: false }, { text: 'vuex', correct: false }, { text: '以上都是', correct: true }],
          explanation: 'props 用于父子组件通信，event bus 可用于任意组件通信，vuex 是官方的状态管理库，也用于组件通信。所以“以上都是”是正确的。'
        },
        { 
          title: 'v-if 和 v-show 的区别是什么？', 
          options: [{ text: 'v-if 是真正的条件渲染', correct: false }, { text: 'v-show 只是简单的 CSS 切换', correct: false }, { text: 'v-if 的切换开销更大', correct: false }, { text: '以上都是', correct: true }],
          explanation: 'v-if 会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建；v-show 只是简单地基于 CSS 进行切换。因此，v-if 适用于运行时条件很少改变的情况，v-show 则适用于需要频繁切换的情况。'
        },
        { 
          title: 'Vue的生命周期钩子函数有哪些？', 
          options: [{ text: 'beforeCreate', correct: false }, { text: 'created', correct: false }, { text: 'mounted', correct: false }, { text: '以上都是', correct: true }],
          explanation: 'Vue组件有一系列的生命周期钩子，从创建到销毁，包括 beforeCreate, created, beforeMount, mounted, beforeUpdate, updated, beforeDestroy, destroyed 等。'
        },
        { 
          title: '如何实现Vue组件的复用？', 
          options: [{ text: '使用props传递数据', correct: false }, { text: '使用slot分发内容', correct: false }, { text: '使用mixin混入', correct: false }, { text: '以上都是', correct: true }],
          explanation: 'Props, slot 和 mixin 都是 Vue 中实现组件逻辑和内容复用的重要方式。'
        },
        { 
          title: 'Vue中key的作用是什么？', 
          options: [{ text: '提高渲染效率', correct: false }, { text: '用于区分不同的节点', correct: false }, { text: '以上都不是', correct: false }, { text: 'A和B都是', correct: true }],
          explanation: 'key 的主要作用是给虚拟DOM中的节点一个唯一的标识，以便在数据变化时，Vue可以更高效地对比新旧节点，从而复用和重新排序现有元素，减少不必要的DOM操作。'
        },
        { 
          title: '什么是虚拟DOM？', 
          options: [{ text: '一个JS对象', correct: false }, { text: '用来描述真实DOM', correct: false }, { text: '可以提高渲染性能', correct: false }, { text: '以上都是', correct: true }],
          explanation: '虚拟DOM（Virtual DOM）是一个用JavaScript对象表示真实DOM树的结构。当状态变更时，会生成一个新的虚拟DOM树与旧树进行比较（diff算法），只将差异部分应用到真实DOM上，从而提高渲染性能。'
        },
        { 
          title: 'Vue中如何进行双向数据绑定？', 
          options: [{ text: 'v-model', correct: true }, { text: 'v-bind', correct: false }, { text: 'v-on', correct: false }, { text: 'v-text', correct: false }],
          explanation: 'v-model 是 Vue 提供的语法糖，用于在表单控件元素上创建双向数据绑定。它本质上是 v-bind:value 和 v-on:input 的结合。'
        },
        { 
          title: 'Vue Router的模式有哪些？', 
          options: [{ text: 'hash模式', correct: false }, { text: 'history模式', correct: false }, { text: 'abstract模式', correct: false }, { text: '以上都是', correct: true }],
          explanation: 'Vue Router 支持 hash（使用URL的hash来模拟一个完整的URL）、history（利用HTML5 History API来完成URL跳转且无须重新加载页面）和 abstract（支持所有JavaScript运行环境，如 Node.js 服务器端）三种模式。'
        },
        {
          title: 'Vuex的state是什么？',
          options: [{ text: '存放状态的地方', correct: false }, { text: '是响应式的', correct: false }, { text: '以上都不是', correct: false }, { text: 'A和B都是', correct: true }],
          explanation: 'State 是 Vuex 中存储应用级别状态的核心。它是一个单一的对象，包含了应用的所有状态，并且是响应式的，当 state 中的数据改变时，所有依赖此数据的组件都会自动更新。'
        },
        {
          title: '如何在Vue中自定义指令？',
          options: [{ text: '使用directives选项', correct: false }, { text: '使用Vue.directive()', correct: false }, { text: '以上都不是', correct: false }, { text: 'A和B都是', correct: true }],
          explanation: '可以在组件内部通过 `directives` 选项来注册局部指令，也可以通过 `app.directive()` (Vue 3) 或 `Vue.directive()` (Vue 2) 来注册全局指令。'
        }
      ]);
    }, 500); // 模拟500ms的网络延迟
  });
};

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    questions: [],
    currentQuestionIndex: 0,
    selectedAnswers: [], // 使用数组索引来存储每个问题的答案
    loading: false,
    reviewMode: false,
  }),
  getters: {
    // 获取当前正在回答的问题对象
    currentQuestion: (state) => state.questions[state.currentQuestionIndex],
    
    // 计算最终得分
    score: (state) => {
      return state.questions.reduce((count, question, index) => {
        const selectedOptionIndex = state.selectedAnswers[index];
        // 确保答案存在，并且对应的选项是正确的
        if (selectedOptionIndex !== undefined && selectedOptionIndex !== null && question.options[selectedOptionIndex]?.correct) {
          return count + 1;
        }
        return count;
      }, 0);
    },
  },
  actions: {
    // 从API获取问题列表
    async fetchQuestions() {
      this.loading = true;
      try {
        this.questions = await fetchQuestionsFromAPI();
        // 初始化一个长度与问题数量相同，值全为null的数组来存放答案
        this.selectedAnswers = new Array(this.questions.length).fill(null);
      } catch (error) {
        console.error("获取问题失败", error);
        uni.showToast({ title: '题目加载失败', icon: 'none' });
      } finally {
        this.loading = false;
      }
    },
    
    // 选择答案
    selectAnswer(optionIndex) {
      // 如果是回顾模式，则不允许修改答案
      if (this.reviewMode) return;
      this.selectedAnswers[this.currentQuestionIndex] = optionIndex;
    },
    
    // 下一题
    nextQuestion() {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
      }
    },
    
    // 上一题
    prevQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
      }
    },
    
    // 提交答题结果
    async submit() {
      const userStore = useUserStore();
      if (!userStore.isLoggedIn) {
        uni.showToast({ title: '请先登录后再提交', icon: 'none' });
        // 实际项目中可以跳转到登录页
        return;
      }

      const result = {
        answers: this.selectedAnswers,
        score: this.score,
        userId: userStore.userInfo?.id || 'unknown' // 附带用户信息, 使用可选链操作符防止报错
      };

      try {
        // 调用API提交结果
        await submitQuizResult(result);
        console.log("答题结果提交成功");
      } catch (error) {
        console.error("提交失败", error);
        // 即使提交失败，也让用户看到结果，可以给一个提示
        uni.showToast({ title: '提交失败，但仍可查看结果', icon: 'none' });
      } finally {
        // 无论成功与否，都跳转到结果页
        uni.redirectTo({
          url: '/pages/result/index',
        });
      }
    },
    
    // 开始回顾模式
    startReview() {
      this.reviewMode = true;
      this.currentQuestionIndex = 0;
      // 使用navigateTo方便用户返回结果页面
      uni.navigateTo({
        url: '/pages/quiz/index?review=true',
      });
    },
    
    // 重置答题状态（用于重新答题）
    reset() {
      this.questions = [];
      this.currentQuestionIndex = 0;
      this.selectedAnswers = [];
      this.reviewMode = false;
      this.loading = false;
      // 调用 fetchQuestions 来重新开始
      this.fetchQuestions(); 
    },
  },
});