<script setup>
import HDE from '../plugin'
import { useJiraForm } from '../stores/jiraForm'
import addChildTicketsToDescription from '../utils/addChildTicketsToDescription'
import CorpLoadingScreen from './CorpLoadingScreen.vue'
import JiraCustomFieldsGenerator from './JiraCustomFieldsGenerator.vue'
import JiraProjectFIeld from './JiraProjectField.vue'
import JiraReporterField from './JiraReporterField.vue'
import JiraSpectatorCheckbox from './JiraSpectatorCheckbox.vue'
import JiraSummaryField from './JiraSummaryField.vue'
import JiraDescriptionField from './JiraDescriptionField.vue'
import JiraFormButton from './JiraFormButton.vue'
import JiraIssueTypesField from './JiraIssueTypesField.vue'
import createArrayFromMulticheckbox from '../utils/createArrayFromMulticheckbox'
import createBasicFields from '../utils/createBasicFields'

const store = useJiraForm()

const TYPE_BASE = 'com.atlassian.jira.plugin.system.customfieldtypes:'

const uniqueId = `[#${HDE.getState().ticketValues.uniqueId}]`

const { systemDomain } = HDE.vars

const createIssueUrl = `https://${systemDomain}/rest/api/3/issue/`

const selectedField = (selected) => {
  return { value: selected }
}

const selectedIssue = (selected) => {
  return { key: selected }
}

const addCustomFields = (basicObj) => {
  store.customFieldsToRender.forEach((field, index) => {
    if (field.schema.custom === TYPE_BASE + 'select') {
      basicObj[field.key] = selectedField(store.customFieldsValues[index])
    } else if (field.schema.custom === TYPE_BASE + 'multicheckboxes') {
      basicObj[field.key] = createArrayFromMulticheckbox(
        store.customFieldsValues[index],
        field.allowedValues
      )
    } else if (field.schema.type === 'issuelink') {
      basicObj[field.key] = selectedIssue(store.customFieldsValues[index])
    } else {
      basicObj[field.key] = store.customFieldsValues[index]
    }
  })
  return basicObj
}

const createDataForIssue = (hdeIdList) => {
  let basicFieldsObj = createBasicFields({
    project: store.projectKey,
    summary: store.summaryField,
    description: store.descriptionField,
    hdeTicketId: uniqueId,
    issuetype: store.issueTypeId,
    reporter: store.reporter,
    hdeChildTickets: hdeIdList,
  })

  basicFieldsObj = addCustomFields(basicFieldsObj)

  if (import.meta.env.DEV) console.log(basicFieldsObj)

  return { fields: basicFieldsObj }
}

const createIssue = async () => {
  try {
    if (!store.summaryField || !store.descriptionField) {
      alert('Заполните все поля')
      return
    }
    const hdeIdList = await addChildTicketsToDescription()
    const { data } = await HDE.request({
      auth: 'JiraAuth',
      url: createIssueUrl,
      method: 'POST',
      contentType: 'application/json',
      data: createDataForIssue(hdeIdList),
    })
    if (data.errors) {
      alert(JSON.stringify(data.errors))
      return
    }
    alert('Задача создана успешно!')
    store.clearCustomFields()
  } catch (error) {
    console.log(error)
  }
}

store.getCreateMeta()
</script>

<template>
  <div class="wrapper text-[14px]">
    <div class="tabs">
      <div class="tab">
        <input
          id="tab-1"
          type="radio"
          name="css-tabs"
          checked
          class="tab-switch"
        />
        <label for="tab-1" class="tab-label">Создать задачи</label>
        <div class="tab-content w-full h-full">
          <form
            v-if="store.response?.length"
            action=""
            class="grid grid-rows-10 gap-2 h-full"
            @submit.prevent="createIssue()"
          >
            <JiraProjectFIeld />
            <JiraIssueTypesField />
            <JiraReporterField />
            <JiraSpectatorCheckbox />
            <JiraSummaryField />
            <JiraDescriptionField />
            <JiraCustomFieldsGenerator />
            <JiraFormButton />
          </form>
          <template v-else>
            <CorpLoadingScreen />
          </template>
        </div>
      </div>
      <!-- Связка задач в джире в разработке, не удалять -->
      <!-- <div class="tab">
        <input type="radio" name="css-tabs" id="tab-2" class="tab-switch" />
        <label for="tab-2" class="tab-label">Связать задачи</label>
        <div class="tab-content w-full grid grid-rows-[1fr_minmax(100px,_7fr)]">
          <BindIssuesTab />
        </div>
      </div> -->
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}
.tabs {
  position: relative;
  background: #2684ff;
  height: 100%;
  &:before,
  &:after {
    content: '';
    display: table;
  }
  &:after {
    clear: both;
  }
}
.tab {
  float: left;
}
.tab-switch {
  display: none;
}
.tab-label {
  position: relative;
  display: block;
  line-height: 2.75em;
  height: 3em;
  padding: 0 1.618em;
  background: #2684ff;
  border-right: 0.125rem solid #2684ff;
  color: #fff;
  cursor: pointer;
  top: 0;
  transition: all 0.25s;

  &:hover {
    top: -0.25rem;
    transition: top 0.25s;
  }
}
.tab-content {
  height: 100%;
  position: absolute;
  z-index: 1;
  top: 2.75em;
  left: 0;
  padding: 1.618rem;
  background: #fff;
  color: #2c3e50;
  opacity: 0;
  transition: all 0.35s;
}
.tab-switch:checked + .tab-label {
  background: #fff;
  color: #2c3e50;
  border-bottom: 0;
  border-right: 0.125rem solid #fff;
  transition: all 0.35s;
  z-index: 1;
  top: -0.0625rem;
}
.tab-switch:checked + label + .tab-content {
  z-index: 2;
  opacity: 1;
  transition: all 0.35s;
}
</style>
