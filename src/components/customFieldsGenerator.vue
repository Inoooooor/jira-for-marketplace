<script setup>
// const childDebugger = () => console.log('child')
import { ref } from 'vue'
import { TYPE_BASE } from '../config/configs'
import selectDropBox from './selectDropBox.vue'

defineProps(['fieldsList'])

const emit = defineEmits(['inputChange'])

const inputChange = () => emit('inputChange', FieldsValues.value)

const FieldsValues = ref([])

const checkBoxChange = (checkBoxArray, index) => {
  // console.log('В ГЕНЕРАТОРЕ в жсоне', checkBoxArray)
  // console.log('На каком месте индекс', index)
  FieldsValues.value[index] = checkBoxArray
  console.log(
    'ПОсле добавления в массив значений в ГЕНЕРАТОРЕ',
    FieldsValues.value
  )
  inputChange()
}

// {{ field.schema.type }}

// const testCheckValues = (arr) => console.log('С компонента чекбоксов', arr)

// const baseType = 'com.atlassian.jira.plugin.system.customfieldtypes:'
// const stringifyFieldValue = (index) => FieldsValues[index] = FieldsValues[index].toString()
</script>
<template>
  <div
    class="grid grid-cols-12 h-10"
    v-for="(field, index) in fieldsList"
    :key="index"
  >
    <label :for="field.key" class="form-labels-pos required-field">{{
      field.name
    }}</label>
    <template v-if="field.schema.custom === TYPE_BASE + 'textfield'">
      <input
        :id="field.key"
        type="text"
        class="wide-form-field border border-gray-300 rounded"
        @input="inputChange()"
        v-model="FieldsValues[index]"
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
        @input="inputChange()"
        v-model="FieldsValues[index]"
      />
    </template>
    <template v-else-if="field.schema.custom === TYPE_BASE + 'float'">
      <input
        :id="field.key"
        type="number"
        min="1"
        step="0.001"
        class="wide-form-field border border-gray-300 rounded"
        @input="inputChange()"
        v-model="FieldsValues[index]"
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
        @input="inputChange()"
        v-model="FieldsValues[index]"
      />
    </template>
    <template v-else-if="field.schema.custom === TYPE_BASE + 'select'">
      <select
        :id="field.key"
        class="wide-form-field border border-gray-300 rounded h-full"
        @change="inputChange()"
        v-model="FieldsValues[index]"
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
    <template v-else-if="field.schema.custom === TYPE_BASE + 'multicheckboxes'">
      <selectDropBox
        :checkBoxFields="field.allowedValues"
        @checkBoxChange="checkBoxChange($event, index)"
      />
    </template>
  </div>
</template>
<style lang=""></style>
