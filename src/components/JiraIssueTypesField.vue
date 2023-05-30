<script setup>
import { useJiraForm } from '../stores/jiraForm'
const store = useJiraForm()
</script>
<template>
  <div class="field-position">
    <label for="issueType" class="form-labels-pos required-field"
      >Тип проблемы</label
    >
    <select
      id="issueType"
      v-model="store.chosenIssueType"
      class="centered-form-field field-border"
      @change="store.clearCustomFields"
    >
      <option
        v-for="(issue, index) in store.actualIssueTypes"
        :key="issue.id"
        :value="index"
      >
        {{ issue.name }}
      </option>
    </select>
  </div>
</template>
