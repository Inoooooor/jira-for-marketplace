<script setup>
import HDE from '../plugin'
import { ref } from 'vue'
import bindIssuesTab from './bindIssueTab.vue'
import { addIdToDescription } from '../controllers/idToJiraDescription.js'
import loadingScreen from './loadingScreen.vue'

// variables
let { uniqueId } = HDE.getState().ticketValues
uniqueId = `[#${uniqueId}]`
const { systemDomain } = HDE.vars
const reportersUrl = `https://${systemDomain}/rest/api/3/users/search?&maxResults=1000`
const getUrl = `https://${systemDomain}/rest/api/3/project/search?expand=issueTypes`
const createIssueUrl = `https://${systemDomain}/rest/api/2/issue/`
// let getComponentsUrl = ref(null)
const response = ref(null)
// const JiraComponentsResponse = ref(null)
let chosenProject = ref(0)
let summaryValue = ref('')
let descriptionValue = ref('')
let issueTypeValue = ref('')
let componentValue = ref('')
// let environmentOptions = ref('')
let environmentValue = ref('')
let reportersList = ref('')
let reporterValue = ref('')

//functions
const getQuery = async () => {
  try {
    const { data } = await HDE.request({
      auth: 'authTest',
      url: getUrl,
      method: 'GET',
      contentType: 'application/json',
    })
    response.value = data.values
    console.log('проекты', response.value)
  } catch (error) {
    console.log(error)
  }
}

// const makeValidCompUrl = () => {
//   getComponentsUrl.value = `https://${systemDomain}/rest/api/2/issue/createmeta?projectKeys=${
//     response.value.projects[chosenProject.value].key
//   }&issuetypeNames=${issueTypeValue.value}&expand=projects.issuetypes.fields`
// }

// const getEnvironment = (fieldsObj) => {
//   for (const key in fieldsObj) {
//     if (fieldsObj[key].name === 'Environment') {
//       environmentOptions.value = fieldsObj[key].allowedValues
//       break
//     }
//   }
// }

// const getComponents = async () => {
//   try {
//     makeValidCompUrl()
//     const { data } = await HDE.request({
//       auth: 'authTest',
//       url: getComponentsUrl.value,
//       method: 'GET',
//       contentType: 'application/json',
//     })
//     JiraComponentsResponse.value =
//       data.projects[0].issuetypes[0].fields.components.allowedValues
//     const customFields = data.projects[0].issuetypes[0].fields
//     getEnvironment(customFields)
//   } catch (error) {
//     console.log(error)
//   }
// }

const getReportersList = async () => {
  try {
    const { data } = await HDE.request({
      auth: 'authTest',
      url: reportersUrl,
      method: 'GET',
      contentType: 'application/json',
    })
    reportersList.value = data.filter(
      (user) => user.accountType === 'atlassian'
    )
    console.log('АВТОРЫ', reportersList.value)
  } catch (error) {
    console.log(error)
  }
}
getReportersList()

const createIssue = async () => {
  try {
    const testCustom = 'customfield_12700'
    const hdeIdList = await addIdToDescription()
    if (reporterValue.value) {
      await HDE.request({
        auth: 'authTest',
        url: createIssueUrl,
        method: 'POST',
        contentType: 'application/json',
        data: {
          fields: {
            project: {
              key: response.value.projects[chosenProject.value].key,
            },
            summary: `${summaryValue.value} ${uniqueId}`,
            description: `${descriptionValue.value}${hdeIdList}`,
            issuetype: {
              name: issueTypeValue.value,
            },
            [testCustom]: [
              {
                value: environmentValue.value,
              },
            ],
            components: [
              {
                name: componentValue.value,
              },
            ],
            reporter: {
              self: reporterValue.value,
            },
          },
        },
      })
      alert('Задача создана успешно!')
      clearInput()
    } else {
      await HDE.request({
        auth: 'authTest',
        url: createIssueUrl,
        method: 'POST',
        contentType: 'application/json',
        data: {
          fields: {
            project: {
              key: response.value.projects[chosenProject.value].key,
            },
            summary: `${summaryValue.value} ${uniqueId}`,
            description: `${descriptionValue.value}${hdeIdList}`,
            issuetype: {
              name: issueTypeValue.value,
            },
            [testCustom]: [
              {
                value: environmentValue.value,
              },
            ],
            components: [
              {
                name: componentValue.value,
              },
            ],
          },
        },
      })
      alert('Задача создана успешно!')
      clearInput()
    }
  } catch (error) {
    console.log(error)
  }
}

const clearInput = () => {
  summaryValue.value = ''
  descriptionValue.value = ''
  componentValue.value = ''
  environmentValue.value = ''
}
getQuery()

const valueCheck = (value) => console.log(value)
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
            v-if="response && true"
            @submit.prevent="createIssue()"
            action=""
            class="grid grid-rows-10 h-full gap-2"
          >
            <div class="grid grid-cols-12">
              <label for="jiraProject" class="form-labels-pos required-field"
                >Проект
              </label>
              <select
                name="jiraProject"
                id="jiraProject"
                class="centered-form-field"
                v-model="chosenProject"
                @change="valueCheck(chosenProject)"
              >
                <option
                  v-for="(project, index) in response"
                  :key="index"
                  :value="index"
                >
                  {{ project.name }}
                </option>
              </select>
            </div>
            <div class="grid grid-cols-12">
              <label for="issueType" class="form-labels-pos required-field"
                >Тип проблемы</label
              >
              <select
                name=""
                id="issueType"
                class="centered-form-field"
                v-model="issueTypeValue"
                @change="valueCheck(issueTypeValue)"
              >
                <option
                  v-for="(issue, index) in response[chosenProject].issueTypes"
                  :value="issue.self"
                  :key="index"
                >
                  {{ issue.name }}
                </option>
              </select>
            </div>

            <template v-if="reportersList">
              <div class="grid grid-cols-12">
                <label for="author" class="form-labels-pos">Автор</label>
                <select
                  v-model="reporterValue"
                  name=""
                  id="author"
                  class="centered-form-field"
                  @change="valueCheck(reporterValue)"
                >
                  <option value="">Не определен</option>
                  <option
                    v-for="(reporter, index) in reportersList"
                    :value="reporter.self"
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
            <div class="grid grid-cols-12">
              <label for="subject" class="form-labels-pos required-field"
                >Тема</label
              >
              <input
                name=""
                id="subject"
                class="wide-form-field border-gray-500 border"
                placeholder="Дайте здесь сводку проблемы"
                v-model="summaryValue"
              />
            </div>
            <!--
            <div class="grid grid-cols-12">
              <label for="executor" class="form-labels-pos required-field"
                >Описание
              </label>
              <textarea
                name="executor"
                id="executor"
                class="wide-form-field max-h-[200px] auto-rows-max"
                placeholder="Опишите здесь проблему"
                v-model="descriptionValue"
              ></textarea>
            </div>
            <template v-if="JiraComponentsResponse">
              <div class="grid grid-cols-12">
                <label for="components" class="form-labels-pos required-field"
                  >Components</label
                >
                <select
                  name=""
                  id="components"
                  class="wide-form-field border"
                  v-model="componentValue"
                >
                  <option
                    v-for="(component, index) in JiraComponentsResponse"
                    :key="index"
                    :value="component.name"
                  >
                    {{ component.name }}
                  </option>
                </select>
              </div>
            </template>
            <template v-if="environmentOptions">
              <div class="grid grid-cols-12">
                <label for="environment" class="form-labels-pos required-field"
                  >Environment</label
                >
                <select
                  name=""
                  id="environment"
                  class="wide-form-field border"
                  v-model="environmentValue"
                >
                  <option
                    v-for="(environment, index) in environmentOptions"
                    :key="index"
                    :value="environment.value"
                  >
                    {{ environment.value }}
                  </option>
                </select>
              </div>
            </template>
            <div class="grid grid-cols-12">
              <button
                class="col-span-2 border border-blue-500 place-self-end self-center rounded hover:bg-blue-500 hover:text-white col-start-7 p-1"
              >
                Создать проблему
              </button>
            </div> -->
          </form>
          <template v-else>
            <loadingScreen />
          </template>
        </div>
      </div>
      <div class="tab">
        <input type="radio" name="css-tabs" id="tab-2" class="tab-switch" />
        <label for="tab-2" class="tab-label">Связать задачи</label>
        <div class="tab-content w-full grid grid-rows-[1fr_minmax(100px,_7fr)]">
          <bindIssuesTab />
        </div>
      </div>
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
}
.tabs::before,
.tabs::after {
  content: '';
  display: table;
}
.tabs::after {
  clear: both;
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
}
.tab-label:hover {
  top: -0.25rem;
  transition: top 0.25s;
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
