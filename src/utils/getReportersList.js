import HDE from '../plugin'

const getReportersList = async (reportersUrl, dataVar) => {
  try {
    const { data } = await HDE.request({
      auth: 'JiraAuth',
      url: reportersUrl,
      method: 'GET',
      contentType: 'application/json',
    })
    dataVar = data.filter((user) => user.accountType === 'atlassian')
    console.log('АВТОРЫ ДЕКОМП', dataVar)
  } catch (error) {
    console.log(error)
  }
}

export { getReportersList }
