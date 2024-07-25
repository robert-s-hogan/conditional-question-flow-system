<template>
  <div class="mb-4 space-x-4 relative">
    <div class="relative">
      <span
        class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500"
        >$</span
      >
      <input
        type="text"
        v-model="formattedAnswer"
        :class="inputClass"
        @input="handleInput"
        @blur="formatValue"
        class="input pl-7"
        placeholder="0"
      />
      <span v-if="isValid" class="absolute right-3 top-3 text-green-500"
        >&#10003;</span
      >
    </div>
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
      formattedAnswer: this.formatNumber(this.initialAnswer),
      errorMessage: "",
      isValid: false,
      hasInteracted: false, // New state to track if the user has interacted with the input
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
      this.formattedAnswer = this.formatNumber(newAnswer);
    },
    formattedAnswer(newFormattedAnswer) {
      if (newFormattedAnswer !== this.formatNumber(this.answer)) {
        const rawValue = this.parseNumber(newFormattedAnswer);
        this.answer = rawValue;
      }
    },
  },
  methods: {
    formatNumber(value) {
      if (value === null || value === undefined || value === "") return "";
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    parseNumber(value) {
      if (typeof value === "string") {
        return parseFloat(value.replace(/,/g, ""));
      }
      return value;
    },
    validate(answer = this.answer) {
      // Only show errors if the user has interacted with the input
      if (!this.hasInteracted) {
        this.isValid = false;
        this.$emit("validated", false);
        return;
      }

      const schema = yup
        .number()
        .positive("Please enter a positive number.")
        .required("Please enter a valid number.");

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
    handleInput(event) {
      this.hasInteracted = true; // Mark that the user has interacted with the input
      this.formattedAnswer = event.target.value;
      this.validateDebounced();
    },
    validateDebounced: debounce(function () {
      this.validate(this.answer);
    }, 300),
    formatValue() {
      this.formattedAnswer = this.formatNumber(this.answer);
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
.input::placeholder {
  text-align: right;
}
.relative .input {
  padding-left: 2.5rem; /* Adjust padding for the dollar sign */
}
.error-message {
  @apply text-red-500;
}
</style>
