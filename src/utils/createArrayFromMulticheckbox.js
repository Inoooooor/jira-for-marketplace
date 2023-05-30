const createArrayFromMulticheckbox = (checkBoxesValues, allowedValues) => {
  const basicArr = []

  if (import.meta.env.DEV) console.table([checkBoxesValues, allowedValues])

  checkBoxesValues.forEach((checked, index) => {
    if (checked) basicArr.push({ value: allowedValues[index].value })
  })
  return basicArr
}

export default createArrayFromMulticheckbox
