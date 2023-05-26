<script setup>
import { ref } from 'vue'
import JiraSelectDropBox from './JiraSelectDropBox.vue'
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

getParentIssues()

const checkBoxChange = (checkBoxArray, index) => {
  store.customFieldsValues[index] = checkBoxArray
}
</script>
<template>
  <div
    class="grid grid-cols-12 h-10"
    v-for="(field, index) in store.customFieldsToRender"
    :key="index"
  >
    <label :for="field.key" class="form-labels-pos required-field">{{
      field.name
    }}</label>
    <template v-if="field.schema.custom === TYPE_BASE + 'textfield'">
      <input
        :id="field.key"
        required
        type="text"
        class="wide-form-field border border-gray-300 rounded"
        v-model="store.customFieldsValues[index]"
      />
    </template>
    <template
      v-if="field.schema.custom === 'com.pyxis.greenhopper.jira:gh-epic-label'"
    >
      <input
        :id="field.key"
        required
        type="text"
        class="wide-form-field border border-gray-300 rounded"
        v-model="store.customFieldsValues[index]"
      />
    </template>
    <template v-if="field.schema.custom === TYPE_BASE + 'url'">
      <input
        :id="field.key"
        type="url"
        pattern="https?://.*"
        placeholder="https://example.com"
        required
        maxlength="80"
        class="wide-form-field border border-gray-300 rounded"
        v-model="store.customFieldsValues[index]"
      />
    </template>
    <template v-else-if="field.schema.custom === TYPE_BASE + 'float'">
      <input
        :id="field.key"
        required
        type="number"
        min="1"
        step="0.001"
        class="wide-form-field border border-gray-300 rounded"
        v-model="store.customFieldsValues[index]"
      />
    </template>
    <template v-else-if="field.schema.custom === TYPE_BASE + 'datepicker'">
      <input
        :id="field.key"
        required
        type="date"
        min="1943-01-01"
        max="2039-12-31"
        class="wide-form-field border border-gray-300 rounded h-full"
        v-model="store.customFieldsValues[index]"
      />
    </template>
    <template v-else-if="field.schema.custom === TYPE_BASE + 'select'">
      <select
        :id="field.key"
        required
        class="wide-form-field border border-gray-300 rounded h-full"
        v-model="store.customFieldsValues[index]"
      >
        <option
          v-for="(option, index) in field.allowedValues"
          :key="index"
          :value="option.value"
        >
          {{ option.value }}
        </option>
      </select>
    </template>
    <template
      v-else-if="field.schema.type === 'issuelink' && parentIssuesArr.length"
    >
      <select
        :id="field.key"
        required
        class="wide-form-field border border-gray-300 rounded h-full"
        v-model="store.customFieldsValues[index]"
      >
        <option
          v-for="(option, index) in parentIssuesArr"
          :key="index"
          :value="option.key"
        >
          {{ option.key }}
        </option>
      </select>
    </template>
    <template v-else-if="field.schema.custom === TYPE_BASE + 'multicheckboxes'">
      <JiraSelectDropBox
        :check-box-fields="field.allowedValues"
        @checkBoxChange="checkBoxChange($event, index)"
      />
    </template>
  </div>
</template>
<style lang=""></style>
