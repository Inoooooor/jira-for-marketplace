<script setup>
// const childDebugger = () => console.log('child')
import { ref } from 'vue'

defineProps(['fieldsList'])

const emit = defineEmits(['inputChange'])

const FieldsValues = ref([])

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
    <template v-if="field.schema.type === 'string'">
      <input
        :id="field.key"
        type="text"
        class="wide-form-field border border-gray-300 rounded"
        @input="inputChange()"
        v-model="FieldsValues[index]"
      />
    </template>
    <template v-else-if="field.schema.type === 'number'">
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
    <template v-else-if="field.schema.type === 'option'">
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
