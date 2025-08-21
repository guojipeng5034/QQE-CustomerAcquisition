<template>
	<view class="quiz-container">
		<view v-if="quizStore.loading" class="loading">
			<uni-load-more status="loading"></uni-load-more>
		</view>
		<view v-else>
			<view class="progress-bar">
				<progress :percent="(quizStore.currentQuestionIndex + 1) / quizStore.questions.length * 100" stroke-width="10" />
				<view class="progress-text">{{ quizStore.currentQuestionIndex + 1 }}/{{ quizStore.questions.length }}</view>
			</view>

			<view class="question-container" v-if="quizStore.currentQuestion">
				<view class="question">{{ quizStore.currentQuestion.title }}</view>
				<view class="options">
					<view
						v-for="(option, index) in quizStore.currentQuestion.options"
						:key="index"
						class="option"
						:class="{
              'selected': !quizStore.reviewMode && selectedOption === index,
              'correct': quizStore.reviewMode && option.correct,
              'incorrect': quizStore.reviewMode && quizStore.selectedAnswers[quizStore.currentQuestionIndex] === index && !option.correct
            }"
						@click="selectOption(index)"
					>
						{{ option.text }}
						<text v-if="quizStore.reviewMode && !option.correct && quizStore.selectedAnswers[quizStore.currentQuestionIndex] === index" class="correct-answer-indicator"> (正确答案: {{ getCorrectAnswerText(quizStore.currentQuestion) }})</text>
					</view>
				</view>
			</view>

			<view class="navigation-buttons">
				<button v-if="quizStore.currentQuestionIndex > 0" class="button prev-button" @click="quizStore.prevQuestion">上一题</button>
				<button v-if="quizStore.currentQuestionIndex < quizStore.questions.length - 1" class="button next-button" :disabled="selectedOption === null" @click="nextQuestion">下一题</button>
				<button v-if="quizStore.currentQuestionIndex === quizStore.questions.length - 1" class="button submit-button" :disabled="selectedOption === null" @click="quizStore.submit">提交</button>
			</view>
		</view>
	</view>
</template>

<script>
import { useQuizStore } from '@/stores/quiz';
import { mapStores } from 'pinia';

export default {
  computed: {
    ...mapStores(useQuizStore),
    selectedOption() {
      return this.quizStore.selectedAnswers[this.quizStore.currentQuestionIndex];
    }
  },
  methods: {
    selectOption(index) {
      this.quizStore.selectAnswer(index);
    },
    nextQuestion() {
      this.quizStore.nextQuestion();
    },
    getCorrectAnswerText(question) {
      const correctAnswer = question.options.find(option => option.correct);
      return correctAnswer ? correctAnswer.text : '';
    }
  },
  onLoad(options) {
    if (options.review) {
      this.quizStore.reviewMode = true;
    } else {
      this.quizStore.reset();
      this.quizStore.fetchQuestions();
    }
  }
};
</script>

<style>
.quiz-container {
  padding: 20px;
}
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
/* 其他样式保持不变 */
.progress-bar {
		margin-bottom: 20px;
	}

	.progress-text {
		text-align: center;
		margin-top: 5px;
	}

	.question-container {
		margin-bottom: 20px;
	}

	.question {
		font-size: 18px;
		margin-bottom: 20px;
	}

	.option {
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 5px;
		margin-bottom: 10px;
		cursor: pointer;
	}

	.option.selected {
		border-color: #007aff;
		background-color: #e6f7ff;
	}

	.option.correct {
		border-color: green;
		background-color: #f6ffed;
	}

	.option.incorrect {
		border-color: red;
		background-color: #fff1f0;
	}

	.correct-answer-indicator {
		color: green;
		font-weight: bold;
	}

	.navigation-buttons {
		display: flex;
		justify-content: space-between;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 20px;
		background-color: #fff;
	}

	.button {
		flex: 1;
		margin: 0 5px;
	}
</style>