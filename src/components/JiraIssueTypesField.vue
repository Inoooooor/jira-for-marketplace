<script setup>
import { useJiraForm } from '../stores/jiraForm'
const store = useJiraForm()
</script>
<template>
  <div class="grid grid-cols-12 h-10">
    <label for="issueType" class="form-labels-pos required-field"
      >Тип проблемы</label
    >
    <select
      name=""
      id="issueType"
      class="centered-form-field"
      v-model="store.chosenIssueType"
      @change="store.clearCustomFields"
    >
      <option
        v-for="(issue, index) in store.actualIssueTypes"
        :value="index"
        :key="index"
      >
        {{ issue.name }}
      </option>
    </select>
  </div>
</template>
