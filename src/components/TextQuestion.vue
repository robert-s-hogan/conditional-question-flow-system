<template>
  <div class="mb-4 space-x-4 relative">
    <input
      type="text"
      v-model="answer"
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
    initialAnswer: String,
  },
  data() {
    return {
      answer: this.initialAnswer || "",
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
    },
  },
  methods: {
    validate(answer = this.answer) {
      // Only show errors if the user has interacted with the input
      if (!this.hasInteracted) {
        this.isValid = false;
        this.$emit("validated", false);
        return;
      }

      const schema = yup
        .string()
        .required("This field is required.")
        .matches(
          /^([a-zA-Z]+\s[a-zA-Z]+|[a-zA-Z]+\s[a-zA-Z]+\s[a-zA-Z]+)$/,
          "Please enter either two names separated by a space or three names separated by two spaces."
        );

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
      this.hasInteracted = true; // Mark that the user has interacted with the input
      this.validateDebounced();
    },
    validateDebounced: debounce(function () {
      this.validate(this.answer);
    }, 300),
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
