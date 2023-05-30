<script setup>
import { useJiraForm } from '../stores/jiraForm'
const store = useJiraForm()
</script>
<template>
  <div class="field-position--no-height">
    <label for="executor" class="form-labels-pos required-field"
      >Описание</label
    >
    <textarea
      id="executor"
      v-model="store.descriptionField"
      name="executor"
      required
      class="wide-form-field max-h-[200px] min-h-[30px] auto-rows-max"
      placeholder="Опишите здесь проблему"
    ></textarea>
  </div>
</template>
