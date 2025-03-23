<!-- layouts/DefaultLayout.vue -->
<template>
  <v-app :theme="theme">
    <!-- Topbar -->
    <v-app-bar color="primary" density="compact">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Admin Dashboard</v-toolbar-title>
      <v-spacer></v-spacer>

      <!-- Search Icon and Search Bar -->
      <div class="search-container">
        <v-slide-x-transition>
          <v-text-field
              v-if="showSearch"
              v-model="searchQuery"
              placeholder="Search..."
              variant="solo"
              flat
              hide-details
              class="search-bar"
              :class="{ expanded: showSearch }"
              bg-color="transparent"
              @click.stop
          ></v-text-field>
        </v-slide-x-transition>
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
            <v-icon class="mr-2">mdi-logout</v-icon>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" permanent :style="{ top: '64px', height: 'calc(100vh - 64px)' }">
      <v-list>
        <v-list-item
            v-for="(item, index) in drawerItems"
            :key="index"
            :to="item.route"
            :prepend-icon="item.icon"
            link
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main :style="{ marginLeft: drawer ? '20px' : '0', transition: 'margin 0.3s ease' }">
      <v-container>
        <slot></slot> <!-- This will display the page content dynamically -->
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { setAuthToken } from '@/services/auth';

const router = useRouter();

const drawer = ref(true);
const showSearch = ref(false);
const searchQuery = ref('');
const profileMenu = ref(false);
const theme = ref('light');

const drawerItems = ref([
  { title: 'Dashboard', icon: 'mdi-view-dashboard', route: '/dashboard' },
  { title: 'Users', icon: 'mdi-account-group', route: '/users' },
  { title: 'Roles', icon: 'mdi-account-group', route: '/roles' },
  { title: 'Permissions', icon: 'mdi-account-group', route: '/permissions' },
  { title: 'Settings', icon: 'mdi-cog', route: '/settings' },
]);

function toggleSearch() {
  showSearch.value = !showSearch.value;
}

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
}

async function logout() {
  try {
    await api.post('/auth/logout');
    setAuthToken(null);
    await router.push('/login');
  } catch (error) {
    console.error('Logout Error:', error);
  }
}
</script>

<style scoped>
.search-container {
  display: flex;
  align-items: center;
  position: relative;
  margin-right: 16px;
}

.search-bar {
  width: 0;
  transition: width 0.3s ease;
}

.search-bar.expanded {
  width: 200px;
}

.search-icon {
  position: relative;
  z-index: 2;
}
</style>