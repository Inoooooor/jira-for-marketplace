<script setup>
import { ref } from 'vue'
import HDE from '../plugin'
const hasParentTicketId = ref(HDE.getState().ticketValues.parentTicketId)
const { hdeSystemDomain } = HDE.vars
const ticketUrl = `https://${hdeSystemDomain}/ru/ticket/list/search/`
const searchResults = ref([])
const searchInput = ref('')
const childTickets = ref(null)

const putParentTicket = async (parentId) => {
  try {
    const { ticketId } = HDE.getState()
    const bindParentUrl = `https://${hdeSystemDomain}/ru/ticket/data/link/id/${ticketId}/parentId/${parentId}`
    await HDE.ajax({
      url: bindParentUrl,
      method: 'PUT',
      responseType: 'json',
    })
    hasParentTicketId.value = parentId
  } catch (error) {
    console.log(error)
  }
}
const getTickets = async () => {
  try {
    const { data } = await HDE.ajax({
      url: ticketUrl,
      method: 'GET',
      responseType: 'json',
      params: {
        search: searchInput.value,
        ticketPid: 0,
      },
    })
    searchResults.value = data
  } catch (error) {
    console.log(error)
  }
}
getTickets()
const getChildTickets = async () => {
  try {
    const { hdeSystemDomain } = HDE.vars
    const { ticketId } = HDE.getState()
    const childTicketsUrl = `https://${hdeSystemDomain}/ru/ticket/data/sub-tickets/id/${ticketId}/`
    const { data } = await HDE.ajax({
      url: childTicketsUrl,
      responseType: 'json',
      method: 'GET',
    })
    childTickets.value = data
  } catch (error) {
    console.log(error)
  }
}
getChildTickets()

const unbindChildTicket = async () => {
  try {
    const { ticketId } = HDE.getState()
    const unbindUrl = `https://${hdeSystemDomain}/ru/ticket/data/unlink/id/${ticketId}/`
    await HDE.ajax({
      url: unbindUrl,
      responseType: 'json',
      method: 'PUT',
    })
    hasParentTicketId.value = null
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <template v-if="!hasParentTicketId && !childTickets">
    <div class="grid grid-cols-12 h-[53px]">
      <label
        for="bindIssue"
        class="col-span-2 place-self-center after:content-['(?)'] after:ml-0.5 after:text-gray-400"
        >Cвязать заявки HDE
      </label>
      <input
        v-model="searchInput"
        placeholder="Поиск заявок"
        type="text"
        name="bindIssue"
        id="bindIssue"
        class="col-span-7 border-gray-500 border h-6 place-self-center w-full"
        @input="getTickets()"
      />
    </div>

    <div v-if="searchResults.length">
      <ul>
        <li
          v-for="(ticket, index) in searchResults"
          :key="index"
          class="grid grid-cols-[3fr_10fr] gap-2 h-8"
        >
          <button @click="putParentTicket(ticket.id)" class="h-4/5">
            Привязать к этой задаче
          </button>
          <div>
            <a
              :href="`https://${hdeSystemDomain}/ru/ticket/list/filter/id/1/ticket/${ticket.id}`"
              target="_blank"
              >[#{{ ticket.uniqueId }}]</a
            >
            {{ ticket.title }}
          </div>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Нет связанных заявок</p>
    </div>
  </template>
  <template v-else-if="childTickets">
    <div>
      <p>Подзаявки:</p>
      <ul>
        <li
          class="h-8 bg-gray-100 my-1 px-1 flex items-center"
          v-for="(ticket, index) in childTickets"
          :key="index"
        >
          <div>
            <a
              :href="`https://${hdeSystemDomain}/ru/ticket/list/filter/id/1/ticket/${ticket.id}`"
              target="_blank"
              >[#{{ ticket.uniqueId }}] {{ ticket.title }}</a
            >
            <span class="text-gray-500">
              от {{ ticket.createdAt }}. Последнее изменение
              {{ ticket.updatedAt }}. Статус: {{ ticket.status }}</span
            >
          </div>
        </li>
      </ul>
    </div>
  </template>
  <template v-else-if="!childTickets && hasParentTicketId">
    <div class="flex justify-start items-center gap-2">
      <div>
        <a
          :href="`https://${hdeSystemDomain}/ru/ticket/list/filter/id/1/ticket/${hasParentTicketId}`"
          target="_blank"
          ><button>Перейти к главной заявке</button></a
        >
      </div>
      <div>
        <button @click="unbindChildTicket">Отвязать от главной задачи</button>
      </div>
    </div>
  </template>
</template>
<style scope lang="css"></style>
