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
    type="date"
    min="1943-01-01"
    max="2039-12-31"
    class="wide-form-field field-border h-full"
  />
</template>
