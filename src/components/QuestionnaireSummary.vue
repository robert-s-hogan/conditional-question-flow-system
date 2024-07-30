<template>
  <div class="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
    <h2 class="text-2xl font-bold mb-6">Summary</h2>
    <div v-if="Object.keys(formData).length">
      <div v-for="(value, key) in formData" :key="key" class="text-left mb-4">
        <p>
          <strong class="text-gray-700">{{ getQuestionText(key) }}:</strong>
        </p>
        <p>
          <span class="text-gray-900">{{ formatAnswer(value, key) }}</span>
        </p>
      </div>
      <button @click="finalSubmit" class="btn-primary mt-4">Submit</button>
      <p
        v-if="submissionMessage"
        :class="{ 'text-green-500': isSuccess, 'text-red-500': !isSuccess }"
        class="mt-2"
      >
        {{ submissionMessage }}
      </p>
    </div>
    <div v-else>
      <p>No data available.</p>
    </div>
  </div>
</template>

<script>
import { db, collection, addDoc } from "../firebaseConfig";
import questionConfig from "@/data/questionConfig.json";

export default {
  name: "QuestionnaireSummary",
  data() {
    return {
      formData: {},
      submissionMessage: "",
      isSuccess: false,
      questions: questionConfig.questions, // Store questions in data
    };
  },
  methods: {
    getQuestionText(questionId) {
      const question = this.questions.find((q) => q.id === questionId);
      return question ? question.question : questionId;
    },
    formatAnswer(value, key) {
      const question = this.questions.find((q) => q.id === key);
      if (!question) return value;

      switch (question.type) {
        case "number":
          return `$${parseFloat(value).toLocaleString()}`;
        case "year":
          return value;
        case "text":
          return value;
        case "select":
        case "yes_no":
          return value;
        default:
          return value;
      }
    },
    async finalSubmit() {
      try {
        await addDoc(collection(db, "finalQuestionnaireData"), this.formData);
        this.submissionMessage = "Data submitted successfully!";
        this.isSuccess = true;
        this.$router.push({ name: "SuccessPage" });
      } catch (error) {
        console.error("Error submitting final data: ", error);
        this.submissionMessage = "Failed to submit data. Please try again.";
        this.isSuccess = false;
      }
    },
  },
  created() {
    const savedData = sessionStorage.getItem("formData");
    if (savedData) {
      this.formData = JSON.parse(savedData);
    }
  },
};
</script>
