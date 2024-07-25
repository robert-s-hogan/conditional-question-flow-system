<template>
  <div class="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
    <h1 class="text-2xl font-bold mb-6">Questionnaire</h1>
    <div v-if="currentQuestion">
      <p class="mb-4">{{ currentQuestion.question }}</p>
      <component
        :is="currentQuestionComponent"
        :initial-answer="currentAnswer"
        :options="currentQuestion.options || []"
        @validated="handleValidation"
        @answer="handleAnswer"
      ></component>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
    <div v-else>
      <p>No more questions</p>
    </div>
    <div class="flex justify-between mt-6">
      <button @click="prevQuestion" :disabled="!canGoBack" class="btn-previous">
        Previous
      </button>
      <button
        @click="nextQuestion"
        :disabled="!isCurrentAnswerValid"
        class="btn-success"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import questionConfig from "@/data/questionConfig.json";
import YesNoRadio from "@/components/YesNoRadio.vue";
import TextQuestion from "@/components/TextQuestion.vue";
import NumberQuestion from "@/components/NumberQuestion.vue";
import YearQuestion from "@/components/YearQuestion.vue";
import SelectQuestion from "@/components/SelectQuestion.vue";

export default {
  components: {
    YesNoRadio,
    TextQuestion,
    NumberQuestion,
    YearQuestion,
    SelectQuestion,
  },
  data() {
    return {
      questions: questionConfig.questions,
      currentQuestionId: "Q1",
      answers: {},
      errorMessage: "",
      isCurrentAnswerValid: false,
      questionHistory: [],
    };
  },
  computed: {
    currentQuestion() {
      return this.questions.find((q) => q.id === this.currentQuestionId);
    },
    currentQuestionComponent() {
      if (this.currentQuestion) {
        switch (this.currentQuestion.type) {
          case "yes_no":
            return "YesNoRadio";
          case "text":
            return "TextQuestion";
          case "number":
            return "NumberQuestion";
          case "year":
            return "YearQuestion";
          case "select":
            return "SelectQuestion";
        }
      }
      return null;
    },
    currentAnswer() {
      return this.answers[this.currentQuestionId] || null;
    },
    canGoBack() {
      return this.currentQuestionId !== "Q1";
    },
  },
  methods: {
    handleValidation(isValid) {
      this.isCurrentAnswerValid = isValid;
    },
    handleAnswer(answer) {
      this.answers[this.currentQuestionId] = answer;
    },
    nextQuestion() {
      this.handleAnswer(this.currentAnswer); // Ensure the current answer is saved
      const next = this.currentQuestion.next;
      if (typeof next === "string") {
        this.questionHistory.push(this.currentQuestionId);
        this.currentQuestionId = next;
      } else if (typeof next === "object") {
        this.questionHistory.push(this.currentQuestionId);
        this.currentQuestionId = next[this.answers[this.currentQuestionId]];
      }

      if (this.currentQuestionId === "summary" || !this.currentQuestion) {
        sessionStorage.setItem("formData", JSON.stringify(this.answers));
        this.$router.push({ name: "QuestionnaireSummary" });
      } else {
        this.isCurrentAnswerValid = false;
      }
    },
    prevQuestion() {
      if (this.questionHistory.length > 0) {
        this.currentQuestionId = this.questionHistory.pop();
        this.isCurrentAnswerValid = true; // Assuming previous answers are valid
      }
    },
  },
};
</script>
