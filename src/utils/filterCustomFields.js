const isFieldCustom = (field) => {
  const fieldFilters = ['summary', 'description', 'issuetype', 'project']
  return !fieldFilters.includes(field.key) && field.required
}

export default isFieldCustom
