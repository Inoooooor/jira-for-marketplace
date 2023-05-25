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
  <div class="grid grid-cols-12 h-10">
    <label for="author" class="form-labels-pos">Автор</label>
    <select
      v-model="store.reporter"
      name=""
      id="author"
      class="centered-form-field"
    >
      <option value="">Не определен</option>
      <option
        v-for="(reporter, index) in reporters"
        :value="reporter.accountId"
        :key="index"
      >
        {{ reporter.displayName }}
      </option>
    </select>
  </div>
</template>

<style lang="scss"></style>
