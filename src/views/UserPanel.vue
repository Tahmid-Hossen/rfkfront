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
    <v-dialog v-model="dialog" max-width="500">
      <v-card :subtitle="isEditing ? 'Update User' : 'Create User'" :title="isEditing ? 'Edit User' : 'Add User'">
        <template #text>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="record.user" label="User"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="record.email" label="Email"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select v-model="record.role" :items="roles" label="Role"></v-select>
            </v-col>
            <v-col cols="12">
              <v-select v-model="record.permission" :items="permissions" label="Permission" multiple></v-select>
            </v-col>
          </v-row>
        </template>
        <v-divider></v-divider>
        <v-card-actions class="bg-surface-light">
          <v-btn text="Cancel" variant="plain" @click="dialog = false"></v-btn>
          <v-spacer></v-spacer>
          <v-btn text="Save" @click="save"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, shallowRef, onMounted } from "vue";
import api from "../services/api";

const DEFAULT_RECORD = { user: "", email: "", role: "", permission: [] };
const users = ref([]);
const record = ref(DEFAULT_RECORD);
const dialog = shallowRef(false);
const isEditing = shallowRef(false);
const roles = ref(["Super Admin", "Admin", "SCM", "Vendor"]);
const permissions = ref(["view users", "create users", "edit users", "delete users", "assign permissions"]);

const headers = [
  { title: "User", key: "user", align: "start" },
  { title: "Email", key: "email" },
  { title: "Role", key: "role" },
  { title: "Permission", key: "permission" },
  { title: "Actions", key: "actions", align: "end", sortable: false },
];

onMounted(fetchUsers);

async function fetchUsers() {
  try {
    const response = await api.get("/users");
    if (response.data.status && response.data.data) {
      users.value = response.data.data.map((user) => ({
        id: user.id,
        user: user.name,
        email: user.email,
        role: user.role[0],
        permission: user.permissions,
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

function save() {
  dialog.value = false;
}
</script>
