<script setup>
import { useJiraForm } from '../stores/jiraForm'
const store = useJiraForm()
</script>
<template>
  <div class="grid grid-cols-12">
    <label for="executor" class="form-labels-pos required-field"
      >Описание</label
    >
    <textarea
      name="executor"
      required
      id="executor"
      class="wide-form-field max-h-[200px] min-h-[30px] auto-rows-max"
      placeholder="Опишите здесь проблему"
      v-model="store.descriptionField"
    ></textarea>
  </div>
</template>
