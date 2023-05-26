import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import HDE from '../plugin'
import isFieldCustom from '../utils/filterCustomFields'

export const useJiraForm = defineStore('jiraForm', () => {
  const { systemDomain } = HDE.vars

  const getCreateMetaUrl = `https://${systemDomain}/rest/api/3/issue/createmeta?expand=projects.issuetypes.fields`

  const response = ref(null)
  const chosenProject = ref(1)
  const chosenIssueType = ref(0)
  const customFieldsValues = ref([])
  const reporter = ref('')
  const summaryField = ref('')
  const descriptionField = ref('')

  const resetChosenIssueType = () => {
    chosenIssueType.value = 0
  }

  const clearCustomFields = () => {
    customFieldsValues.value.length = 0
    summaryField.value = ''
    descriptionField.value = ''
  }

  const projectKey = computed(() => response.value[chosenProject.value].key)

  const issueTypeId = computed(
    () =>
      response.value[chosenProject.value].issuetypes[chosenIssueType.value].id
  )

  const actualIssueTypes = computed(
    () => response.value[chosenProject.value].issuetypes
  )

  const customFieldsToRender = computed(() =>
    Object.values(
      response.value[chosenProject.value].issuetypes[chosenIssueType.value]
        .fields
    ).filter((field) => isFieldCustom(field))
  )

  const getCreateMeta = async () => {
    try {
      const { data } = await HDE.request({
        auth: 'JiraAuth',
        url: getCreateMetaUrl,
        method: 'GET',
        contentType: 'application/json',
      })
      response.value = data.projects
      if (import.meta.env.DEV) console.log('from pinia', response.value)
    } catch (error) {
      console.log(error)
    }
  }

  return {
    response,
    customFieldsToRender,
    chosenProject,
    chosenIssueType,
    customFieldsValues,
    reporter,
    summaryField,
    descriptionField,
    actualIssueTypes,
    issueTypeId,
    projectKey,
    resetChosenIssueType,
    getCreateMeta,
    clearCustomFields,
  }
})
