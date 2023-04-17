<script setup>
// const childDebugger = () => console.log('child')
import { ref } from 'vue'

defineProps(['fieldsList'])

const emit = defineEmits(['inputChange'])

const FieldsValues = ref([])

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
    <input
      :id="field.key"
      type="text"
      class="wide-form-field border border-gray-300 rounded"
      @input="inputChange()"
      v-model="FieldsValues[index]"
    />
  </div>
</template>
<style lang=""></style>
