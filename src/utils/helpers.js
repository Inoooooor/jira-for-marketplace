const makeArrayFromCheckboxes = (checkBoxesValues, allowedValues) => {
  const basicArr = []
  console.log(JSON.parse(checkBoxesValues))
  console.log(allowedValues)
  JSON.parse(checkBoxesValues).forEach((checked, index) => {
    if (checked === true) basicArr.push({ value: allowedValues[index].value })
  })
  return basicArr
}

export { makeArrayFromCheckboxes }
