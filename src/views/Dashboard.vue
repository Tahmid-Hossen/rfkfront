<template>
  <v-app :theme="theme">
    <!-- Topbar -->
    <v-app-bar color="primary" density="compact">
      <!-- Menu Icon (Left) -->
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <!-- Title -->
      <v-toolbar-title>Admin Dashboard</v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Search Icon and Search Bar -->
      <div class="search-container">
        <!-- Search Bar (Expands on Click) -->
        <v-slide-x-transition>
          <v-text-field
              v-if="showSearch"
              v-model="searchQuery"
              placeholder="Search..."
              variant="solo"
              flat
              hide-details
              class="search-bar"
              bg-color="transparent"
              @click.stop
          ></v-text-field>
        </v-slide-x-transition>

        <!-- Search Icon (Right) -->
        <v-btn icon @click="toggleSearch" class="search-icon">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </div>

      <!-- Dark/Light Mode Toggle -->
      <v-btn icon @click="toggleTheme">
        <v-icon>{{ theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>

      <!-- Profile Icon with Dropdown -->
      <v-menu v-model="profileMenu" offset-y>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="logout">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Navigation Drawer (Below Topbar) -->
    <v-navigation-drawer v-model="drawer" permanent :style="{ top: '64px', height: 'calc(100vh - 64px)' }">
      <v-list>
        <v-list-item
            v-for="(item, index) in drawerItems"
            :key="index"
            :value="item.route"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main :style="{ marginLeft: drawer ? '256px' : '0', transition: 'margin 0.3s ease' }">
      <v-container>
        <p>Welcome to the Admin Dashboard!</p>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Drawer state
const drawer = ref(true); // Fixed by default

// Search bar state
const showSearch = ref(false);
const searchQuery = ref('');

// Profile menu state
const profileMenu = ref(false);

// Theme state
const theme = ref('light');

// Drawer items
const drawerItems = ref([
  { title: 'Dashboard', icon: 'mdi-view-dashboard', route: '/dashboard' },
  { title: 'Users', icon: 'mdi-account-group', route: '/users' },
  { title: 'Settings', icon: 'mdi-cog', route: '/settings' },
]);

// Toggle search bar
function toggleSearch() {
  showSearch.value = !showSearch.value;
}

// Toggle theme between dark and light
function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
}

// Logout function
function logout() {
  router.push('/');
}
</script>

<style scoped>
/* Search container */
.search-container {
  display: flex;
  align-items: center;
  position: relative;
  margin-right: 16px;
}

/* Search bar styling */
.search-bar {
  width: 200px;
  border-radius: 24px; /* Add border radius */
  background-color: transparent; /* Transparent background */
  position: absolute;
  right: 40px; /* Position to the left of the search icon */
  z-index: 1; /* Ensure it appears above other elements */
}

/* Search icon styling */
.search-icon {
  position: relative;
  z-index: 2; /* Ensure it appears above the search bar */
}
</style>