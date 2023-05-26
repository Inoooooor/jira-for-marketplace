<script setup>
import { ref, onUpdated, watch, onUnmounted } from 'vue'
import { useJiraForm } from '../stores/jiraForm'
import { storeToRefs } from 'pinia'

const props = defineProps({ checkBoxFields: { type: Array, required: true } })

console.log(Array.isArray(props.checkBoxFields))

const store = useJiraForm()

const emit = defineEmits(['checkBoxChange'])

const checkBoxValues = ref([])

const { formSubmitCount } = storeToRefs(store)

const uniqueCheckboxId = `list ${Math.random() * 1e18}`

const tabsWrapper = document.querySelector('.tabs')

const clearValues = () => (checkBoxValues.value.length = 0)

const dropDownHide = () => {
  const checkList = document.getElementById(uniqueCheckboxId)
  if (checkList?.classList.contains('visible'))
    checkList.classList.remove('visible')
}

const dropDownToggle = () => {
  const checkList = document.getElementById(uniqueCheckboxId)
  if (checkList.classList.contains('visible'))
    checkList.classList.remove('visible')
  else checkList.classList.add('visible')
}

const stopListHideOnclick = (e) => e.stopPropagation()

tabsWrapper.addEventListener('click', dropDownHide)

onUpdated(() => emit('checkBoxChange', JSON.stringify(checkBoxValues.value)))

onUnmounted(() => tabsWrapper.removeEventListener('click', dropDownHide))

watch(formSubmitCount, clearValues)
</script>
<template>
  <div :id="uniqueCheckboxId" class="dropdown-check-list" tabindex="100">
    <span class="anchor" @click.stop="dropDownToggle">Выберите значения</span>
    <ul class="items" @click="stopListHideOnclick">
      <li
        v-for="(option, index) in checkBoxFields"
        :key="index"
        class="hover:bg-gray-200"
      >
        <input
          v-model="checkBoxValues[index]"
          class="align-middle"
          type="checkbox"
        />
        {{ option.value }}
      </li>
    </ul>
  </div>
</template>
<style lang="scss">
.dropdown-check-list {
  display: inline-block;
  grid-column-start: 4;
  grid-column-end: 9;
  position: relative;

  .anchor {
    position: relative;
    cursor: pointer;
    display: inline-block;
    width: 100%;
    height: 100%;
    border: 1px solid #ccc;
    line-height: 2.5rem;
    padding-left: 0.25rem;
    border-radius: 0.25rem;

    &:after {
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

    &:active:after {
      right: 10px;
      top: 30%;
    }
  }

  ul.items {
    padding: 2px;
    width: 100%;
    display: none;
    margin: 0;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    border-top: none;
    position: absolute;
    background-color: white;

    li {
      list-style: none;
      width: 100%;
    }
  }
}

.dropdown-check-list.visible {
  .anchor {
    color: #0094ff;
    border: black solid 3px;
  }
  .items {
    display: block;
    z-index: 10;
  }
}
</style>
