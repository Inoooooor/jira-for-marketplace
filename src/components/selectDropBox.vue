<script setup>
// const checkList = document.getElementById('list1')
// checkList.getElementsByClassName('anchor')[0].onclick = function (evt) {
//   if (checkList.classList.contains('visible'))
//     checkList.classList.remove('visible')
//   else checkList.classList.add('visible')
// }
import { ref, onUpdated, inject, watch } from 'vue'

const isFormBtnClicked = inject('buttonClickListener')

// console.log('фром парентс парент', test)

defineProps(['checkBoxFields'])

const emit = defineEmits(['checkBoxChange'])

const checkBoxValues = ref([])

onUpdated(() => emit('checkBoxChange', JSON.stringify(checkBoxValues.value)))

watch(isFormBtnClicked, () => {
  // console.log('changed in parent', isFormBtnClicked.value)
  checkBoxValues.value.length = 0
})

// const testCheckValues = (arr) => console.log(arr)

const dropDownToggle = () => {
  const checkList = document.getElementById('list1')
  if (checkList.classList.contains('visible'))
    checkList.classList.remove('visible')
  else checkList.classList.add('visible')
}
</script>
<template>
  <div id="list1" class="dropdown-check-list" tabindex="100">
    <span class="anchor" @click="dropDownToggle()">Select Fruits</span>
    <ul class="items">
      <li v-for="(option, index) in checkBoxFields" :key="index">
        <input type="checkbox" v-model="checkBoxValues[index]" />
        {{ option.value }}
        {{ option.id }}
      </li>
      <!-- <li><input type="checkbox" />Apple</li>
      <li><input type="checkbox" />Apple</li>
      <li><input type="checkbox" />Apple</li>
      <li><input type="checkbox" />Apple</li>
      <li><input type="checkbox" />Apple</li>
      <li><input type="checkbox" />Apple</li> -->
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
  /* padding: 5px 50px 5px 10px; */
  width: 100%;
  height: 80%;
  border: 1px solid #ccc;
}

.dropdown-check-list .anchor:after {
  position: absolute;
  content: '';
  border-left: 2px solid black;
  border-top: 2px solid black;
  padding: 5px;
  right: 10px;
  top: 20%;
  -moz-transform: rotate(-135deg);
  -ms-transform: rotate(-135deg);
  -o-transform: rotate(-135deg);
  -webkit-transform: rotate(-135deg);
  transform: rotate(-135deg);
}

.dropdown-check-list .anchor:active:after {
  right: 8px;
  top: 21%;
}

.dropdown-check-list ul.items {
  padding: 2px;
  width: 100%;
  display: none;
  margin: 0;
  border: 1px solid #ccc;
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
}

.dropdown-check-list.visible .items {
  display: block;
}
</style>
