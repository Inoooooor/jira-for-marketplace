<script setup>
import { useJiraForm } from '../stores/jiraForm'
import HDE from '../plugin'
import { ref } from 'vue'
const { systemDomain } = HDE.vars

const store = useJiraForm()

const parentIssuesArr = ref([])

defineProps({
  selectId: { type: String, required: true },
  selectIndex: { type: Number, required: true },
})

const getParentIssues = async () => {
  try {
    const parentIssuesUrl = `https://${systemDomain}/rest/api/3/search?maxResults=10000&fields=id`
    const { data } = await HDE.request({
      auth: 'JiraAuth',
      url: parentIssuesUrl,
      method: 'GET',
      contentType: 'application/json',
    })
    parentIssuesArr.value = data.issues
  } catch (error) {
    console.log(error)
  }
}

getParentIssues()
</script>
<template>
  <select
    :id="selectId"
    v-model="store.customFieldsValues[selectIndex]"
    required
    class="wide-form-field field-border h-full"
  >
    <option
      v-for="option in parentIssuesArr"
      :key="option.id"
      :value="option.key"
    >
      {{ option.key }}
    </option>
  </select>
</template>
