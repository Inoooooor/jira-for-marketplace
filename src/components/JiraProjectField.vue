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
  <div class="field-position">
    <label for="jiraProject" class="form-labels-pos required-field"
      >Проект</label
    >
    <select
      id="jiraProject"
      v-model="store.chosenProject"
      name="jiraProject"
      class="centered-form-field field-border"
      @change="zerofier()"
    >
      <option
        v-for="(project, index) in store.response"
        :key="project.id"
        :value="index"
      >
        {{ project.name }}
      </option>
    </select>
  </div>
</template>
<style lang="scss"></style>
