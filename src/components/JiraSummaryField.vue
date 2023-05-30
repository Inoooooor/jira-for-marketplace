<script setup>
import { useJiraForm } from '../stores/jiraForm'
const store = useJiraForm()
</script>
<template>
  <div class="field-position">
    <label for="subject" class="form-labels-pos required-field">Тема</label>
    <input
      id="subject"
      v-model="store.summaryField"
      maxlength="50"
      required
      class="wide-form-field field-border"
      placeholder="Дайте здесь сводку проблемы"
    />
  </div>
</template>
<style lang="scss"></style>
