<script setup>
import { useJiraForm } from '../stores/jiraForm'
const store = useJiraForm()

defineProps({
  field: { type: Object, required: true },
  selectIndex: { type: Number, required: true },
})
</script>
<template>
  <select
    :id="field.key"
    v-model="store.customFieldsValues[selectIndex]"
    required
    class="wide-form-field field-border h-full"
  >
    <option
      v-for="option in field.allowedValues"
      :key="option.id"
      :value="option.value"
    >
      {{ option.value }}
    </option>
  </select>
</template>
