<script setup>
// const childDebugger = () => console.log('child')
import { ref } from 'vue'
import { TYPE_BASE } from '../config/configs'

defineProps(['fieldsList'])

const emit = defineEmits(['inputChange'])

const FieldsValues = ref([])

// const baseType = 'com.atlassian.jira.plugin.system.customfieldtypes:'
// const stringifyFieldValue = (index) => FieldsValues[index] = FieldsValues[index].toString()

const inputChange = () => emit('inputChange', FieldsValues.value)
</script>
<template>
  <div
    class="grid grid-cols-12"
    v-for="(field, index) in fieldsList"
    :key="index"
  >
    <label :for="field.key" class="form-labels-pos required-field"
      >{{ field.name }} {{ field.schema.type }}</label
    >
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
        pattern="https://.*"
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
    <template v-else-if="field.schema.custom === TYPE_BASE + 'select'">
      <select
        :id="field.key"
        class="wide-form-field border border-gray-300 rounded"
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
  </div>
</template>
<style lang=""></style>
