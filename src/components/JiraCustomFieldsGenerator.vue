<script setup>
import JiraSelectDropBox from './JiraSelectDropBox.vue'
import JiraCustomTextInput from './JiraCustomTextInput.vue'
import JiraCustomUrlInput from './JiraCustomUrlInput.vue'
import JiraCustomFloatInput from './JiraCustomFloatInput.vue'
import JiraCustomDateInput from './JiraCustomDateInput.vue'
import JiraCustomSelect from './JiraCustomSelect.vue'
import JiraSubtaskSelect from './JiraSubtaskSelect.vue'
import { useJiraForm } from '../stores/jiraForm'

const store = useJiraForm()

const isTextOrEpicLabel = (customSchema = '') => {
  if (customSchema.includes('textfield')) return true
  if (customSchema.includes('epic-label')) return true
  return false
}
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
    <template v-if="isTextOrEpicLabel(field.schema.custom)">
      <JiraCustomTextInput :input-id="field.key" :input-index="index" />
    </template>
    <template v-else-if="field.schema.custom?.includes('url')">
      <JiraCustomUrlInput :input-id="field.key" :input-index="index" />
    </template>
    <template v-else-if="field.schema.custom?.includes('float')">
      <JiraCustomFloatInput :input-id="field.key" :input-index="index" />
    </template>
    <template v-else-if="field.schema.custom?.includes('datepicker')">
      <JiraCustomDateInput :input-id="field.key" :input-index="index" />
    </template>
    <template v-else-if="field.schema.custom?.includes('select')">
      <JiraCustomSelect :field="field" :select-index="index" />
    </template>
    <template v-else-if="field.schema.type?.includes('issuelink')">
      <JiraSubtaskSelect :select-id="field.key" :select-index="index" />
    </template>
    <template v-else-if="field.schema.custom?.includes('multicheckboxes')">
      <JiraSelectDropBox
        :check-box-fields="field.allowedValues"
        :multi-checkbox-index="index"
      />
    </template>
  </div>
</template>
