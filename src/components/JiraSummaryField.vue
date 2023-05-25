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
      maxlength="50"
      required
      name=""
      id="subject"
      class="wide-form-field border-gray-500 border"
      placeholder="Дайте здесь сводку проблемы"
      v-model="store.summaryField"
    />
  </div>
</template>
<style lang="scss"></style>
