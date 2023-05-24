const createBasicFields = ({
  project,
  summary,
  description,
  hdeTicketId,
  issuetype,
  reporter = null,
  hdeChildTickets,
}) => {
  const basicFieldsObj = {
    project: {
      key: project,
    },
    summary: `${summary} ${hdeTicketId}`,
    description: {
      content: [
        {
          content: [
            {
              text: `${description}${hdeChildTickets}`,
              type: 'text',
            },
          ],
          type: 'paragraph',
        },
      ],
      type: 'doc',
      version: 1,
    },
    issuetype: {
      id: issuetype,
    },
    reporter: reporter
      ? {
          id: reporter,
        }
      : null,
  }
  return basicFieldsObj
}

export { createBasicFields }
