import axios from 'axios'
//  *******************************************************************************************
//  AJAX'ing w/ Axios
//
//  This function is a promise that returns back either:
//  payload.connectionSucceeded = true            or false
//  payload.data                = response.data   or String(e)
//
//  storeAs{} is along for the ride for use in the return of a Promise.all() or whatever
//
//  In main.js --> axios.defaults.baseURL = 'https://api.guildwars2.com'
//  *******************************************************************************************
export function axiosGet (endPointUrl, storeAs) {
  let payload = {}
  if (storeAs !== undefined) { payload.storeAs = storeAs }

  return axios.get(endPointUrl)
    .then(response => {
      payload.connectionSucceeded = true
      if (payload.hasOwnProperty('storeAs')) {
        payload.storeAs.data = response.data
      } else {
        payload.data = response.data
      }
      return payload
    })
    .catch(e => {
      payload.connectionSucceeded = false
      payload.data = [String(e)]
      return payload
    })
}
