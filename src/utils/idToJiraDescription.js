import HDE from '../plugin'
const addIdToDescription = async () => {
  try {
    const { hdeSystemDomain } = HDE.vars
    const { ticketId } = HDE.getState()
    const childTicketsUrl = `https://${hdeSystemDomain}/ru/ticket/data/sub-tickets/id/${ticketId}/`
    const { data } = await HDE.ajax({
      url: childTicketsUrl,
      responseType: 'json',
      method: 'GET',
    })
    if (data) {
      const childTicketStr = data.reduce(
        (acc, ticket) =>
          acc +
          `[${ticket.uniqueId}|https://${hdeSystemDomain}/ru/ticket/list/filter/id/1/ticket/${ticket.id}]\n`,
        `
        Количество связанных заявок в HelpDeskEddy: ${data.length}
        Заявки в HelpDeskEddy:
        `
      )
      return childTicketStr
    } else {
      return ''
    }
  } catch (error) {
    console.log(error)
  }
}
addIdToDescription()
export { addIdToDescription }
