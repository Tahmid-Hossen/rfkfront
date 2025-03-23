<template>
  <v-sheet border rounded>
    <v-data-table
        :headers="headers"
        :hide-default-footer="users.length < 11"
        :items="users"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>
            <v-icon color="medium-emphasis" icon="mdi-account-multiple" size="x-small" start></v-icon>
            User Management
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn class="me-2" prepend-icon="mdi-plus" rounded="lg" text="Create User" border @click="add"></v-btn>
        </v-toolbar>
      </template>

      <template #item.role="{ value }">
        <v-chip color="primary" variant="outlined" small>{{ value }}</v-chip>
      </template>

      <template #item.permission="{ value }">
        <v-chip v-for="(perm, index) in value" :key="index" color="secondary" variant="outlined" small class="me-1">
          {{ perm }}
        </v-chip>
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-icon color="medium-emphasis" icon="mdi-pencil" size="small" @click="edit(item)"></v-icon>
          <v-icon color="medium-emphasis" icon="mdi-delete" size="small" @click="remove(item.id)"></v-icon>
        </div>
      </template>

      <template #no-data>
        <v-btn prepend-icon="mdi-backup-restore" rounded="lg" text="Reset data" variant="text" border @click="fetchUsers"></v-btn>
      </template>
    </v-data-table>
  </v-sheet>

  <!-- Add/Edit User Dialog -->
  <v-dialog v-model="dialog" max-width="600">
    <v-card :subtitle="isEditing ? 'Update User' : 'Create User'" :title="isEditing ? 'Edit User' : 'Add User'">
      <template #text>
        <v-row dense>
          <!-- User Name -->
          <v-col cols="12" md="12">
            <v-text-field v-model="record.name" label="User*" required></v-text-field>
          </v-col>

          <!-- Email -->
          <v-col cols="12" md="12">
            <v-text-field v-model="record.email" label="Email*" required></v-text-field>
          </v-col>

          <!-- Role -->
          <v-col cols="12" md="12">
            <v-select v-model="record.role" :items="roles" label="Role*" required></v-select>
          </v-col>

          <!-- Permissions (Checkboxes) -->
          <v-col cols="12">
            <label class="text-subtitle-1">Permissions*</label>
            <v-checkbox
                v-for="(perm, index) in permissions"
                :key="index"
                v-model="record.permissions"
                :label="perm"
                :value="perm"
                density="compact"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>

        <small class="text-caption text-medium-emphasis">*Indicates required field</small>
      </template>
      <v-divider></v-divider>

      <v-card-actions class="bg-surface-light">
        <v-btn text="Cancel" variant="plain" @click="dialog = false"></v-btn>
        <v-spacer></v-spacer>
        <v-btn text="Save" @click="saveUser"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, shallowRef, onMounted } from "vue";
import api from "../services/api"; // Import your Axios API service

const DEFAULT_RECORD = { name: "", email: "", role: "", permissions: [] };
const users = ref([]);
const record = ref(DEFAULT_RECORD);
const dialog = shallowRef(false);
const isEditing = shallowRef(false);
const roles = ref(["Super Admin", "SCM", "Vendor", "Management"]);
const permissions = ref(["View Users", "Create Users", "Edit Users", "Delete Users", "Assign Permissions"]);

const headers = [
  { title: "User", key: "name", align: "start" },
  { title: "Email", key: "email" },
  { title: "Role", key: "role" },
  { title: "Permission", key: "permissions" },
  { title: "Actions", key: "actions", align: "end", sortable: false },
];

onMounted(fetchUsers);

async function fetchUsers() {
  try {
    const response = await api.get("/users");
    if (response.data.status && response.data.data) {
      users.value = response.data.data.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role[0], // Assuming you have only one role per user
        permissions: user.permissions,
      }));
    } else {
      users.value = [];
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

function add() {
  isEditing.value = false;
  record.value = { ...DEFAULT_RECORD };
  dialog.value = true;
}

function edit(user) {
  isEditing.value = true;
  record.value = { ...user };
  dialog.value = true;
}

function remove(id) {
  users.value = users.value.filter((user) => user.id !== id);
}

async function saveUser() {
  if (!record.value.name || !record.value.email || !record.value.role) {
    alert("Please fill in all required fields.");
    return;
  }

  try {
    if (isEditing.value) {
      const response = await api.put(`/users/${record.value.id}`, record.value);
      if (response.data.status) {
        alert("User updated successfully!");
      } else {
        alert("Failed to update user.");
      }
    } else {
      const response = await api.post("/users", record.value);
      if (response.data.status) {
        alert("User created successfully!");
      } else {
        alert("Failed to create user.");
      }
    }
    fetchUsers();
    dialog.value = false;
    resetForm();
  } catch (error) {
    console.error("Error saving user:", error);
    alert("An error occurred while saving the user.");
  }
}

function resetForm() {
  record.value = { ...DEFAULT_RECORD };
}
</script>
