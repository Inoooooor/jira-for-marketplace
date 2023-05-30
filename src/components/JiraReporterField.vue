<script setup>
import { useJiraForm } from '../stores/jiraForm'
import HDE from '../plugin'
import { ref } from 'vue'

const { systemDomain } = HDE.vars

const store = useJiraForm()

const reportersUrl = `https://${systemDomain}/rest/api/3/users/search?&maxResults=1000`

const reporters = ref(null)

const getReportersList = async () => {
  try {
    const { data } = await HDE.request({
      auth: 'JiraAuth',
      url: reportersUrl,
      method: 'GET',
      contentType: 'application/json',
    })
    reporters.value = data.filter((user) => user.accountType === 'atlassian')
  } catch (error) {
    console.log(error)
  }
}

getReportersList()
</script>
<template v-if="reporters">
  <div class="field-position">
    <label for="author" class="form-labels-pos">Автор</label>
    <select
      id="author"
      v-model="store.reporter"
      class="centered-form-field field-border"
    >
      <option value="">Не определен</option>
      <option
        v-for="reporter in reporters"
        :key="reporter.accountId"
        :value="reporter.accountId"
      >
        {{ reporter.displayName }}
      </option>
    </select>
  </div>
</template>

<style lang="scss"></style>
