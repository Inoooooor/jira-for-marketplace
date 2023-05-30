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
    type="number"
    min="1"
    step="0.001"
    class="wide-form-field field-border"
  />
</template>
