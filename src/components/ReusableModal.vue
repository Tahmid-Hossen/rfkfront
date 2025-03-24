<template>
  <v-dialog :model-value="modelValue" max-width="600" @update:model-value="$emit('update:modelValue', $event)">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <slot></slot> <!-- Slot for dynamic content -->
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="bg-surface-light">
        <v-btn text="Cancel" variant="plain" @click="$emit('update:modelValue', false)"></v-btn>
        <v-spacer></v-spacer>
        <v-btn text="Save" @click="$emit('save')"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
defineProps({
  modelValue: Boolean, // Controls dialog visibility
  title: String, // Modal title
});

defineEmits(["update:modelValue", "save"]);
</script>
