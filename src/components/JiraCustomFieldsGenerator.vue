<script setup>
import { ref } from 'vue'
import JiraSelectDropBox from './JiraSelectDropBox.vue'
import JiraCustomTextInput from './JiraCustomTextInput.vue'
import JiraCustomUrlInput from './JiraCustomUrlInput.vue'
import JiraCustomFloatInput from './JiraCustomFloatInput.vue'
import JiraCustomDateInput from './JiraCustomDateInput.vue'
import JiraCustomSelect from './JiraCustomSelect.vue'
import HDE from '../plugin'
import { useJiraForm } from '../stores/jiraForm'

const store = useJiraForm()

const TYPE_BASE = 'com.atlassian.jira.plugin.system.customfieldtypes:'

const parentIssuesArr = ref([])
const { systemDomain } = HDE.vars
const parentIssuesUrl = `https://${systemDomain}/rest/api/3/search?maxResults=10000&fields=id`

const getParentIssues = async () => {
  try {
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

const checkBoxChange = (checkBoxArray, index) => {
  store.customFieldsValues[index] = checkBoxArray
}

getParentIssues()
</script>
<template>
  <div
    v-for="(field, index) in store.customFieldsToRender"
    :key="field.key"
    class="field-position"
  >
    <label :for="field.key" class="form-labels-pos required-field">{{
      field.name
    }}</label>
    <template v-if="field.schema.custom.includes('textfield')">
      <JiraCustomTextInput :input-id="field.key" :input-index="index" />
    </template>
    <template v-if="field.schema.custom.includes('epic-label')">
      <JiraCustomTextInput :input-id="field.key" :input-index="index" />
    </template>
    <template v-if="field.schema.custom.includes('url')">
      <JiraCustomUrlInput :input-id="field.key" :input-index="index" />
    </template>
    <template v-else-if="field.schema.custom.includes('float')">
      <JiraCustomFloatInput :input-id="field.key" :input-index="index" />
    </template>
    <template v-else-if="field.schema.custom.includes('datepicker')">
      <JiraCustomDateInput :input-id="field.key" :input-index="index" />
    </template>
    <template v-else-if="field.schema.custom.includes('select')">
      <JiraCustomSelect :field="field" :select-index="index" />
    </template>
    <template
      v-else-if="field.schema.type === 'issuelink' && parentIssuesArr.length"
    >
      <select
        :id="field.key"
        v-model="store.customFieldsValues[index]"
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
    <template v-else-if="field.schema.custom === TYPE_BASE + 'multicheckboxes'">
      <JiraSelectDropBox
        :check-box-fields="field.allowedValues"
        @check-box-change="checkBoxChange($event, index)"
      />
    </template>
  </div>
</template>
<style lang=""></style>
