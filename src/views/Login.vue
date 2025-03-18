<template>
  <v-sheet class="mx-auto" width="300">
    <v-form fast-fail @submit.prevent="login">
      <v-text-field
          v-model="email"
          :rules="emailRules"
          label="Email"
          type="email"
          required
      ></v-text-field>

      <v-text-field
          v-model="password"
          :rules="passwordRules"
          label="Password"
          type="password"
          required
      ></v-text-field>

      <v-btn class="mt-2" type="submit" block :loading="loading">Login</v-btn>

      <!-- Error Message -->
      <v-alert v-if="error" type="error" class="mt-4">
        {{ error }}
      </v-alert>
    </v-form>
  </v-sheet>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const email = ref('');
const password = ref('');
const router = useRouter();
const loading = ref(false); // Loading state
const error = ref(''); // Error message

const emailRules = [
  (v) => !!v || 'Email is required',
  (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
];

const passwordRules = [
  (v) => !!v || 'Password is required',
  (v) => v.length >= 6 || 'Password must be at least 6 characters',
];

async function login() {
  // Reset error message
  error.value = '';

  // Validate form
  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields.';
    return;
  }

  // Set loading state
  loading.value = true;

  try {
    // Make API call
    const response = await axios.post('http://127.0.0.1:8000/api/auth/login', {
      email: email.value,
      password: password.value,
    });

    // Handle successful login
    if (response.data.success) {
      // Redirect to the dashboard
      router.push('/dashboard');
    } else {
      // Show error message from the API
      error.value = response.data.message || 'Login failed. Please try again.';
    }
  } catch (err) {
    // Handle API errors
    error.value = err.response?.data?.message || 'An error occurred. Please try again.';
  } finally {
    // Reset loading state
    loading.value = false;
  }
}
</script>

<style scoped>
/* Add your styles here */
</style>