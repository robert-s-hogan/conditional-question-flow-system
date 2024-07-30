<template>
  <div class="mb-4 space-x-4">
    <select
      v-model="answer"
      @change="handleInput"
      :class="inputClass"
      class="input"
    >
      <option value="" disabled>Select an option</option>
      <option v-for="option in options" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
    <p v-if="errorMessage" class="text-red-500 text-sm mt-2">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script>
import * as yup from "yup";

export default {
  props: {
    initialAnswer: {
      type: String,
      default: "",
    },
    options: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      answer: this.initialAnswer,
      errorMessage: "",
      isValid: false,
      hasInteracted: false,
    };
  },
  computed: {
    inputClass() {
      return this.isValid ? "border-green-500" : "border-gray-300";
    },
  },
  watch: {
    answer(newAnswer) {
      this.validate(newAnswer);
      this.$emit("update:answer", newAnswer); // Emit the updated answer
    },
  },
  methods: {
    validate(answer = this.answer) {
      if (!this.hasInteracted) {
        this.isValid = false;
        return;
      }

      const schema = yup.string().required("Please select an option.");
      schema
        .validate(answer)
        .then(() => {
          this.errorMessage = "";
          this.isValid = true;
          this.$emit("validated", true);
        })
        .catch((err) => {
          this.errorMessage = err.message;
          this.isValid = false;
          this.$emit("validated", false);
        });
    },
    handleInput() {
      this.hasInteracted = true;
      this.validate();
      this.$emit("input", this.answer); // Emit the answer for parent to capture
    },
  },
  mounted() {
    this.validate(this.answer);
  },
};
</script>

<style scoped>
.input {
  @apply mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm;
}
.error-message {
  @apply text-red-500;
}
</style>
