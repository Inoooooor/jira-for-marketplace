<script setup>
import { ref, onUpdated, inject, watch } from 'vue'

const isFormBtnClicked = inject('buttonClickListener')

defineProps(['checkBoxFields'])

const emit = defineEmits(['checkBoxChange'])

const checkBoxValues = ref([])
const uniqueCheckboxId = `list ${Math.random() * 1e18}`

onUpdated(() => emit('checkBoxChange', JSON.stringify(checkBoxValues.value)))

watch(isFormBtnClicked, () => {
  checkBoxValues.value.length = 0
})

const dropDownHide = () => {
  const checkList = document.getElementById(uniqueCheckboxId)
  if (checkList?.classList.contains('visible'))
    checkList.classList.remove('visible')
}

document.querySelector('.tabs').addEventListener('click', () => dropDownHide())

const dropDownToggle = (e) => {
  const checkList = document.getElementById(uniqueCheckboxId)
  if (checkList.classList.contains('visible'))
    checkList.classList.remove('visible')
  else checkList.classList.add('visible')
  e.stopPropagation()
}

const stopListHideOnclick = (e) => e.stopPropagation()
</script>
<template>
  <div :id="uniqueCheckboxId" class="dropdown-check-list" tabindex="100">
    <span class="anchor" @click="dropDownToggle($event)"
      >Выберите значения</span
    >
    <ul class="items" @click="stopListHideOnclick">
      <li
        class="hover:bg-gray-200"
        v-for="(option, index) in checkBoxFields"
        :key="index"
      >
        <input
          class="align-middle"
          type="checkbox"
          v-model="checkBoxValues[index]"
        />
        {{ option.value }}
      </li>
    </ul>
  </div>
</template>
<style>
.dropdown-check-list {
  display: inline-block;
  grid-column-start: 4;
  grid-column-end: 9;
  position: relative;
}

.dropdown-check-list .anchor {
  position: relative;
  cursor: pointer;
  display: inline-block;
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
  line-height: 2.5rem;
  padding-left: 0.25rem;
  border-radius: 0.25rem;
}

.dropdown-check-list .anchor:after {
  position: absolute;
  content: '';
  border-left: 2px solid black;
  border-top: 2px solid black;
  padding: 5px;
  right: 10px;
  top: 30%;
  -moz-transform: rotate(-135deg);
  -ms-transform: rotate(-135deg);
  -o-transform: rotate(-135deg);
  -webkit-transform: rotate(-135deg);
  transform: rotate(-135deg);
}

.dropdown-check-list .anchor:active:after {
  right: 10px;
  top: 30%;
}

.dropdown-check-list ul.items {
  padding: 2px;
  width: 100%;
  display: none;
  margin: 0;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  border-top: none;
  position: absolute;
  background-color: white;
}

.dropdown-check-list ul.items li {
  list-style: none;
  width: 100%;
}

.dropdown-check-list.visible .anchor {
  color: #0094ff;
  border: black solid 3px;
}

.dropdown-check-list.visible .items {
  display: block;
  z-index: 10;
}
</style>
