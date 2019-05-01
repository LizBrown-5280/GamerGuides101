//  Chose thisAJAX pattern after reviewing this site:
//  https://vuejsdevelopers.com/2017/08/28/vue-js-ajax-recipes/
import axios from 'axios'
import {pwdHelper} from '../utils/pwdHelper'

export default {
  _requestEndpointData,
  /**
  * Verifies and commits api key from user and verifies which endpoint access is permitted to
  * @param  {obj} store
  * @param  {str} apiKeyValue
  **/
  setApiKey ({dispatch, commit, state}, apiKeyValue) {
    // !!!!  missing -> clear all data and errors before starting with new api key
    commit('setApiKeyErrorMsg', null)

    // !!!! For Dev use only, commented out other wise.
    apiKeyValue = pwdHelper(apiKeyValue)

    //  commit key into store, even if empty, and check permission's url
    commit('setApiKey', apiKeyValue)

    if (apiKeyValue !== '' && apiKeyValue !== null) {
      let endPointUrl = '/v2/tokeninfo?access_token=' + apiKeyValue

      //  calls the ajax function - if succeeded: commits permissions data, if failed: commits error data and
      // !!!! --> needs to reset all data to null
      _requestEndpointData(endPointUrl).then((response) => {
        if (response.connectionSucceeded) {
          commit('setPermissions', response.data.permissions)
        } else if (!response.connectionSucceeded) {
          commit('setApiKeyErrorMsg', response.data)
        }
      })
    }
  }
}

//  ******************
//  HELPER FUNCTIONS
//  ******************
//  This function is a promise that returns back, hopefully, usable data
//  !!!! Can I put/use this AJAX function from its own folder/file something like 'services/GetDataFromAPI.js'
//  !!!! Duh, can't I just import and call axiosGet(payload) from utils/axiosGet.js?????
//  In main.js --> axios.defaults.baseURL = 'https://api.guildwars2.com'
function _requestEndpointData (endPointUrl) {
  return axios.get(endPointUrl)
    .then(response => {
      let responseData = {
        connectionSucceeded: true,
        data: response.data
      }
      return responseData
    })
    .catch(e => {
      console.log('url is: ' + endPointUrl)
      //  if key is typo'ed or if too short/long set state's apiKeyErrorMsg with appropriate error msg
      let apiKeyErrorMsg = String(e)

      if (apiKeyErrorMsg.indexOf('400') > -1) {
        apiKeyErrorMsg = 'You\'ve typo\'ed your key.'
      } else if (apiKeyErrorMsg.indexOf('403') > -1) {
        apiKeyErrorMsg = 'Your key is either empty or too short or too long OR doesn\'t contain the needed permission.'
      } else if (apiKeyErrorMsg.indexOf('404') > -1) {
        apiKeyErrorMsg = e + ': Sorry that data is currently not available'
      }

      let responseData = {
        connectionSucceeded: false,
        data: apiKeyErrorMsg
      }
      return responseData
    })
}
