<script setup>
import { useJiraForm } from '../stores/jiraForm'
const store = useJiraForm()

defineProps({
  inputId: { type: String, required: true },
  inputIndex: { type: Number, required: true },
})
</script>
<template>
  <input
    :id="inputId"
    v-model="store.customFieldsValues[inputIndex]"
    required
    class="wide-form-field field-border"
    type="text"
  />
</template>
