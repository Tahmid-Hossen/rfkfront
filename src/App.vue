<template>
  <template v-if="isLoginPage">
    <!-- Only show LoginPanel on the login page -->
    <router-view></router-view>
  </template>
  <template v-else>
    <!-- Show DefaultLayout for all other pages except login -->
    <DefaultLayout>
      <router-view></router-view>
    </DefaultLayout>
  </template>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import DefaultLayout from "@/layouts/DefaultLayout.vue";

// Check if the current route is the login page
const route = useRoute();
const isLoginPage = computed(() => route.path === "/login");
</script>