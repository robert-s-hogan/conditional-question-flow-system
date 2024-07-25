<template>
  <div class="mb-4 space-x-4 relative">
    <input
      type="number"
      v-model.number="answer"
      min="1900"
      max="2100"
      :class="inputClass"
      @input="handleInput"
      class="input"
    />
    <span v-if="isValid" class="absolute right-3 top-3 text-green-500"
      >&#10003;</span
    >
    <p v-if="errorMessage" class="text-red-500 text-sm mt-2">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script>
import * as yup from "yup";
import debounce from "lodash/debounce";

export default {
  props: {
    initialAnswer: Number,
  },
  data() {
    return {
      answer: this.initialAnswer || null,
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
      this.validateDebounced(newAnswer);
    },
  },
  methods: {
    validate(answer = this.answer) {
      if (!this.hasInteracted) {
        this.isValid = false;
        this.$emit("validated", false);
        return;
      }

      const schema = yup
        .number()
        .typeError("Please enter a valid number.")
        .min(1900, "Year must be between 1900 and 2100.")
        .max(2100, "Year must be between 1900 and 2100.")
        .required("Please enter a valid year.");

      schema
        .validate(answer)
        .then(() => {
          this.errorMessage = "";
          this.isValid = true;
          this.$emit("validated", true);
          this.$emit("answer", answer); // Emit the valid answer
        })
        .catch((err) => {
          this.errorMessage = err.message;
          this.isValid = false;
          this.$emit("validated", false);
        });
    },
    handleInput() {
      this.hasInteracted = true;
      this.validateDebounced();
    },
    validateDebounced: debounce(function () {
      this.validate(this.answer);
    }, 300),
    submit() {
      this.validate();
      if (this.isValid) {
        this.$emit("answer", Number(this.answer));
      }
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
