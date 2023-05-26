<script setup>
import { useJiraForm } from '../stores/jiraForm'
const store = useJiraForm()
</script>
<template>
  <div class="grid grid-cols-12 h-10">
    <label for="subject" class="form-labels-pos required-field"
      >Тема стора</label
    >
    <input
      id="subject"
      v-model="store.summaryField"
      maxlength="50"
      required
      class="wide-form-field border-gray-500 border"
      placeholder="Дайте здесь сводку проблемы"
    />
  </div>
</template>
<style lang="scss"></style>
