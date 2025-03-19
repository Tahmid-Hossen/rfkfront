<template>
  <v-sheet class="mx-auto" width="300">
    <v-form ref="form" fast-fail @submit.prevent="login">
      <v-text-field v-model="email" :rules="emailRules" label="Email" type="email" required></v-text-field>
      <v-text-field v-model="password" :rules="passwordRules" label="Password" type="password" required></v-text-field>

      <v-btn class="mt-2" type="submit" block :loading="loading">Login</v-btn>

      <v-alert v-if="warning" type="warning" class="mt-4">{{ warning }}</v-alert>
      <v-alert v-if="error" type="error" class="mt-4">{{ error }}</v-alert>

      <v-snackbar v-model="snackbar" :timeout="2000" color="success">
        Login successful! Redirecting to the dashboard...
      </v-snackbar>
    </v-form>
  </v-sheet>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";
import { setAuthToken } from "@/services/auth"; // Import helper function

const email = ref("");
const password = ref("");
const form = ref(null);
const router = useRouter();
const loading = ref(false);
const error = ref("");
const warning = ref("");
const snackbar = ref(false);

const emailRules = [
  (v) => !!v || "Email is required",
  (v) => /.+@.+\..+/.test(v) || "Email must be valid",
];

const passwordRules = [
  (v) => !!v || "Password is required",
  (v) => v.length >= 6 || "Password must be at least 6 characters",
];

async function login() {
  error.value = "";
  warning.value = "";

  const { valid } = await form.value.validate();
  if (!valid) return;

  loading.value = true;

  try {
    const response = await api.post("/auth/login", {
      email: email.value,
      password: password.value,
    });

    const token = response.data?.data?.token;
    if (token) {
      setAuthToken(token);
      snackbar.value = true;

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } else {
      warning.value = response.data.message || "Login failed. No token received.";
    }
  } catch (err) {
    console.error("API Error:", err);
    error.value = err.response?.data?.message || "An error occurred. Please try again.";
  } finally {
    loading.value = false;
  }
}
</script>
