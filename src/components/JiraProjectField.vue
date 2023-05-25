<script setup>
import { useJiraForm } from '../stores/jiraForm'

const store = useJiraForm()

// Избегание ошибки отрисовки несуществующего типа проблемы
const zerofier = () => {
  store.resetChosenIssueType()
  store.clearCustomFields()
}
</script>
<template>
  <div class="grid grid-cols-12 h-10">
    <label for="jiraProject" class="form-labels-pos required-field"
      >Проект</label
    >
    <select
      name="jiraProject"
      id="jiraProject"
      class="centered-form-field"
      v-model="store.chosenProject"
      @change="zerofier()"
    >
      <option
        v-for="(project, index) in store.response"
        :key="index"
        :value="index"
      >
        {{ project.name }}
      </option>
    </select>
  </div>
</template>
<style lang="scss"></style>
