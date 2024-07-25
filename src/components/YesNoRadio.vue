<template>
  <div class="mb-4 space-x-4">
    <label class="inline-flex items-center">
      <input
        type="radio"
        v-model="answer"
        value="yes"
        class="form-radio"
        @change="handleChange"
      />
      <span class="ml-2">Yes</span>
    </label>
    <label class="inline-flex items-center ml-4">
      <input
        type="radio"
        v-model="answer"
        value="no"
        class="form-radio"
        @change="handleChange"
      />
      <span class="ml-2">No</span>
    </label>
  </div>
</template>

<script>
export default {
  props: {
    initialAnswer: String,
  },
  data() {
    return {
      answer: this.initialAnswer || null,
      hasInteracted: false, // Track if the user has interacted with the radio buttons
    };
  },
  watch: {
    initialAnswer: {
      immediate: true,
      handler(newValue) {
        this.answer = newValue;
        this.hasInteracted = false; // Reset interaction state
        this.$emit("validated", newValue !== null); // Emit validation state
      },
    },
  },
  methods: {
    handleChange() {
      this.hasInteracted = true; // Mark that the user has interacted with the input
      this.$emit("answer", this.answer);
      this.$emit("validated", this.answer !== null);
    },
  },
  mounted() {
    // Emit initial validation state
    this.$emit("validated", this.answer !== null);
  },
};
</script>
