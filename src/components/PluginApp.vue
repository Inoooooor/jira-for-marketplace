<script setup>
import HDE from '../plugin'
import { ref, provide } from 'vue'
import { addIdToDescription } from '../utils/addChildTicketsToDescription'
import loadingScreen from './loadingScreen.vue'
import customFieldsGenerator from './customFieldsGenerator.vue'
import JiraProjectFIeld from './JiraProjectField.vue'
import JiraReporterField from './JiraReporterField.vue'
import JiraSpectatorCheckbox from './JiraSpectatorCheckbox.vue'
import JiraSummaryField from './JiraSummaryField.vue'
import JiraDescriptionField from './JiraDescriptionField.vue'
import JiraFormButton from './JiraFormButton.vue'
import { makeArrayFromCheckboxes } from '../utils/createArrayFromMulticheckbox'
import { createBasicFields } from '../utils/createBasicFields'
import { useJiraForm } from '../stores/jiraForm'

const store = useJiraForm()

store.getCreateMeta()

const TYPE_BASE = 'com.atlassian.jira.plugin.system.customfieldtypes:'

const uniqueId = `[#${HDE.getState().ticketValues.uniqueId}]`
const { systemDomain } = HDE.vars

const reportersUrl = `https://${systemDomain}/rest/api/3/users/search?&maxResults=1000`
const createIssueUrl = `https://${systemDomain}/rest/api/3/issue/`

let reportersList = ref('')
const customFieldsValues = ref([])
const listenerForMultiCheckboxErase = ref(0)

provide('buttonClickListener', listenerForMultiCheckboxErase)

const getReportersList = async () => {
  try {
    const { data } = await HDE.request({
      auth: 'JiraAuth',
      url: reportersUrl,
      method: 'GET',
      contentType: 'application/json',
    })
    reportersList.value = data.filter(
      (user) => user.accountType === 'atlassian'
    )
  } catch (error) {
    console.log(error)
  }
}

getReportersList()

const addCustomFields = (basicObj) => {
  store.customFieldsToRender.forEach((field, index) => {
    if (field.schema.custom === TYPE_BASE + 'select') {
      basicObj[field.key] = {
        value: store.customFieldsValues[index],
      }
    } else if (field.schema.custom === TYPE_BASE + 'multicheckboxes') {
      basicObj[field.key] = makeArrayFromCheckboxes(
        store.customFieldsValues[index],
        field.allowedValues
      )
    } else if (field.schema.type === 'issuelink') {
      basicObj[field.key] = { key: store.customFieldsValues[index] }
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
    const hdeIdList = await addIdToDescription()
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
    clearInput()
  } catch (error) {
    console.log(error)
  }
}

const clearInput = () => {
  store.clearCustomFields()
  listenerForMultiCheckboxErase.value++
}

const fillValuesFromFields = (emittedFieldsArray) => {
  customFieldsValues.value = emittedFieldsArray
}
</script>

<template>
  <div class="wrapper text-[14px]">
    <div class="tabs">
      <div class="tab">
        <input
          type="radio"
          name="css-tabs"
          id="tab-1"
          checked
          class="tab-switch"
        />
        <label for="tab-1" class="tab-label">Создать задачи</label>
        <div class="tab-content w-full h-full">
          <form
            v-if="store.response"
            @submit.prevent="createIssue()"
            action=""
            class="grid grid-rows-10 gap-2 h-full"
          >
            <JiraProjectFIeld />
            <div class="grid grid-cols-12 h-10">
              <label for="issueType" class="form-labels-pos required-field"
                >Тип проблемы</label
              >
              <select
                name=""
                id="issueType"
                class="centered-form-field"
                v-model="store.chosenIssueType"
                @change="clearInput()"
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
            <JiraReporterField />
            <JiraSpectatorCheckbox />
            <JiraSummaryField />
            <JiraDescriptionField />
            <customFieldsGenerator
              @input-change="fillValuesFromFields($event)"
            />
            <JiraFormButton />
          </form>
          <template v-else>
            <loadingScreen />
          </template>
        </div>
      </div>
      <!-- Связка задач в джире в разработке, не удалять -->
      <!-- <div class="tab">
        <input type="radio" name="css-tabs" id="tab-2" class="tab-switch" />
        <label for="tab-2" class="tab-label">Связать задачи</label>
        <div class="tab-content w-full grid grid-rows-[1fr_minmax(100px,_7fr)]">
          <bindIssuesTab />
        </div>
      </div> -->
    </div>
  </div>
</template>

<style lang="scss">
.wrapper {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}
.tabs {
  position: relative;
  background: #2684ff;
  height: 14.75rem;
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
