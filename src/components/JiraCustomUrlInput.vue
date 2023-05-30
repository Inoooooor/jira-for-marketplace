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
    type="url"
    pattern="https?://.*"
    placeholder="https://example.com"
    required
    maxlength="80"
    class="wide-form-field field-border"
  />
</template>
