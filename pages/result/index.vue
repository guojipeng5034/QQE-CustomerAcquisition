<template>
	<view class="result-container">
		<view class="result-text">您答对了 {{ quizStore.score }} 道题！</view>
		<button class="button" @click="quizStore.startReview">回顾</button>
		<button class="button" @click="restart">重新答题</button>
	</view>
</template>

<script>
import { useQuizStore } from '@/stores/quiz';
import { mapStores } from 'pinia';

export default {
  computed: {
    ...mapStores(useQuizStore)
  },
  methods: {
    restart() {
      uni.redirectTo({
        url: '/pages/quiz/index'
      });
    }
  }
};
</script>

<style>
.result-container {
  padding: 20px;
  text-align: center;
}

.result-text {
  font-size: 20px;
  margin-bottom: 20px;
}
.button {
  margin-top: 10px;
}
</style>