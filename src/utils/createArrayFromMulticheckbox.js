const makeArrayFromCheckboxes = (checkBoxesValues, allowedValues) => {
  const basicArr = []

  if (import.meta.env.DEV)
    console.table([JSON.parse(checkBoxesValues), allowedValues])

  JSON.parse(checkBoxesValues).forEach((checked, index) => {
    if (checked) basicArr.push({ value: allowedValues[index].value })
  })
  return basicArr
}

export { makeArrayFromCheckboxes }
