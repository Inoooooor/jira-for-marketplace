import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import HDE from '../plugin'

export const useJiraForm = defineStore('jiraForm', () => {
  const { systemDomain } = HDE.vars

  const getCreateMetaUrl = `https://${systemDomain}/rest/api/3/issue/createmeta?expand=projects.issuetypes.fields`

  const response = ref(null)
  const chosenProject = ref(1)
  const chosenIssueType = ref(0)

  const resetChosenIssueType = () => {
    chosenIssueType.value = 0
  }

  const isFieldCustom = (field) => {
    const fieldFilters = ['summary', 'description', 'issuetype', 'project']
    if (!fieldFilters.includes(field.key) && field.required) return true
    return false
  }

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
    getCreateMeta,
    response,
    customFieldsToRender,
    chosenProject,
    chosenIssueType,
    resetChosenIssueType,
  }
})
