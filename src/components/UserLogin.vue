<template>
  <div>
    <button @click="logInWithGoogle">Log In with Google</button>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import { auth, provider, signInWithPopup } from "../firebaseConfig";

export default {
  name: "UserLogin",
  data() {
    return {
      error: null,
    };
  },
  methods: {
    async logInWithGoogle() {
      try {
        const result = await signInWithPopup(auth, provider);
        console.log("User logged in:", result.user);
        this.$router.push("/questionnaire");
      } catch (error) {
        this.error = "Login failed. Please try again.";
        console.error("Error during login:", error);
      }
    },
  },
};
</script>

<style>
.error {
  color: red;
}
</style>
