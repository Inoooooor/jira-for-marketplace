const makeArrayFromCheckboxes = (checkBoxesValues, allowedValues) => {
  const basicArr = []
  checkBoxesValues.forEach((checked, index) => {
    if (checked === true) basicArr.push({ value: allowedValues[index].value })
  })
  return basicArr
}

export { makeArrayFromCheckboxes }
