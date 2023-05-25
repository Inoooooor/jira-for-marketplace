<script setup>
import HDE from '../plugin'
import { ref, computed, provide } from 'vue'
import { addIdToDescription } from '../utils/idToJiraDescription.js'
import loadingScreen from './loadingScreen.vue'
import customFieldsGenerator from './customFieldsGenerator.vue'
import { makeArrayFromCheckboxes } from '../utils/helpers'
import { createBasicFields } from '../utils/createBasicFields'
import { useJiraForm } from '../stores/jiraForm'

const store = useJiraForm()

store.getCreateMeta()

const TYPE_BASE = 'com.atlassian.jira.plugin.system.customfieldtypes:'

const uniqueId = `[#${HDE.getState().ticketValues.uniqueId}]`
const { systemDomain } = HDE.vars

const reportersUrl = `https://${systemDomain}/rest/api/3/users/search?&maxResults=1000`
// const getUrl = `https://${systemDomain}/rest/api/3/issue/createmeta?expand=projects.issuetypes.fields`
const createIssueUrl = `https://${systemDomain}/rest/api/3/issue/`

// const response = ref(null)
let chosenProject = ref(1)
let summaryValue = ref('')
let descriptionValue = ref('')
let reportersList = ref('')
let reporterValue = ref('')
const customFieldsValues = ref([])
const chosenIssueType = ref(0)
const listenerForMultiCheckboxErase = ref(0)

provide('buttonClickListener', listenerForMultiCheckboxErase)

const isFieldCustom = (field) => {
  const fieldFilters = ['summary', 'description', 'issuetype', 'project']
  if (!fieldFilters.includes(field.key) && field.required) return true
  return false
}

const fieldsList = computed(() =>
  Object.values(
    store.response[chosenProject.value].issuetypes[chosenIssueType.value].fields
  ).filter((field) => isFieldCustom(field))
)

//functions
// const getQuery = async () => {
//   try {
//     const { data } = await HDE.request({
//       auth: 'JiraAuth',
//       url: getUrl,
//       method: 'GET',
//       contentType: 'application/json',
//     })
//     response.value = data.projects
//   } catch (error) {
//     console.log(error)
//   }
// }

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
  let customFieldsFilter = [
    'textfield',
    'float',
    'url',
    'datepicker',
    'multicheckboxes',
  ]

  customFieldsFilter = customFieldsFilter.map((item) => TYPE_BASE + item)

  fieldsList.value.forEach((field, index) => {
    if (field.schema.custom === TYPE_BASE + 'select') {
      basicObj[field.key] = {
        value: customFieldsValues.value[index],
      }
    } else if (customFieldsFilter.includes(field.schema.custom)) {
      basicObj[field.key] = customFieldsValues.value[index]
    } else if (field.schema.custom === TYPE_BASE + 'multicheckboxes') {
      basicObj[field.key] = makeArrayFromCheckboxes(
        JSON.parse(customFieldsValues.value[index]),
        field.allowedValues
      )
    } else if (field.schema.type === 'issuelink') {
      basicObj[field.key] = { key: customFieldsValues.value[index] }
    }
  })
  return basicObj
}

const createDataForIssue = (hdeIdList) => {
  let basicFieldsObj = createBasicFields({
    project: store.response[chosenProject.value].key,
    summary: summaryValue.value,
    description: descriptionValue.value,
    hdeTicketId: uniqueId,
    issuetype:
      store.response[chosenProject.value].issuetypes[chosenIssueType.value].id,
    reporter: reporterValue.value,
    hdeChildTickets: hdeIdList,
  })

  basicFieldsObj = addCustomFields(basicFieldsObj)

  if (import.meta.env.DEV) console.log(basicFieldsObj)

  return { fields: basicFieldsObj }
}

const createIssue = async () => {
  try {
    if (!summaryValue.value || !descriptionValue.value) {
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
  summaryValue.value = ''
  descriptionValue.value = ''
  customFieldsValues.value.length = 0
  listenerForMultiCheckboxErase.value++
}

// getQuery()

// Избегание ошибки отрисовки несуществующего типа проблемы
const zerofier = () => {
  chosenIssueType.value = 0
  customFieldsValues.value.length = 0
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
            <div class="grid grid-cols-12 h-10">
              <label for="jiraProject" class="form-labels-pos required-field"
                >Проект</label
              >
              <select
                name="jiraProject"
                id="jiraProject"
                class="centered-form-field"
                v-model="chosenProject"
                @change="zerofier()"
              >
                <option
                  v-for="(project, index) in store.response"
                  :key="index"
                  :value="index"
                >
                  {{ project.name }}
                </option>
              </select>
            </div>
            <div class="grid grid-cols-12 h-10">
              <label for="issueType" class="form-labels-pos required-field"
                >Тип проблемы</label
              >
              <select
                name=""
                id="issueType"
                class="centered-form-field"
                v-model="chosenIssueType"
                @change="clearInput()"
              >
                <option
                  v-for="(issue, index) in store.response[chosenProject]
                    .issuetypes"
                  :value="index"
                  :key="index"
                >
                  {{ issue.name }}
                </option>
              </select>
            </div>

            <template v-if="reportersList">
              <div class="grid grid-cols-12 h-10">
                <label for="author" class="form-labels-pos">Автор</label>
                <select
                  v-model="reporterValue"
                  name=""
                  id="author"
                  class="centered-form-field"
                >
                  <option value="">Не определен</option>
                  <option
                    v-for="(reporter, index) in reportersList"
                    :value="reporter.accountId"
                    :key="index"
                  >
                    {{ reporter.displayName }}
                  </option>
                </select>
              </div>
            </template>
            <div
              class="grid grid-cols-12 place-items-start content-center border-b"
            >
              <input
                class="col-start-4 col-span-1 h-4 checkbox-label relative invisible"
                type="checkbox"
                name=""
                id="addSpectator"
              />
            </div>
            <div class="grid grid-cols-12 h-10">
              <label for="subject" class="form-labels-pos required-field"
                >Тема</label
              >
              <input
                maxlength="50"
                required
                name=""
                id="subject"
                class="wide-form-field border-gray-500 border"
                placeholder="Дайте здесь сводку проблемы"
                v-model="summaryValue"
              />
            </div>
            <div class="grid grid-cols-12">
              <label for="executor" class="form-labels-pos required-field"
                >Описание</label
              >
              <textarea
                name="executor"
                required
                id="executor"
                class="wide-form-field max-h-[200px] min-h-[30px] auto-rows-max"
                placeholder="Опишите здесь проблему"
                v-model="descriptionValue"
              ></textarea>
            </div>
            <customFieldsGenerator
              :fieldsList="fieldsList"
              @input-change="fillValuesFromFields($event)"
            />
            <div class="grid grid-cols-12">
              <button
                class="col-span-2 border border-blue-500 place-self-end self-center rounded hover:bg-blue-500 hover:text-white col-start-7 p-1"
              >
                Создать проблему
              </button>
            </div>
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
* {
  box-sizing: border-box;
}
body {
  background: #2c3e50;
  color: #ecf0f1;
  line-height: 1.618em;
}
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
