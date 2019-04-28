import Vue from 'vue'
//  Because I need to add new reactive objects properties use Vue.set
//  Read about Vue.set() at - https://vuejs.org/v2/api/ && https://vuejs.org/v2/guide/reactivity.html

export default {
  setApiKey (state, value) {
    state.apiKey = value
  },
  setApiKeyErrorMsg (state, value) {
    state.apiKeyErrorMsg = value
  },
  setPermissions (state, value) {
    let tabs = JSON.parse(JSON.stringify(state.tabs))
    Object.entries(tabs).forEach(([key, val]) => {
      if (value.includes(key)) {
        tabs[key].permission = true
      }
    })
    state.tabs = tabs
  },
  setTabDataState (state, payload) {
    Vue.set(state.tabs[payload.tabName], payload.key, payload.data)
  },
  setGw2Data (state, payload) {
    if (payload.path2) {
      Vue.set(state.gw2[payload.dataType][payload.endpointGrp][payload.path1], payload.path2, payload.data)
    } else if (payload.path1) {
      Vue.set(state.gw2[payload.dataType][payload.endpointGrp], payload.path1, payload.data)
    } else if (!payload.path1) {
      Vue.set(state.gw2[payload.dataType], payload.endpointGrp, payload.data)
    }
  },
  setAppendData (state, payload) {
    let list = state.gw2[payload.dataType][payload.endpointGrp].concat(payload.data)
    list.sort((a, b) => a.id - b.id)
    Vue.set(state.gw2[payload.dataType], payload.endpointGrp, list)
  },
  resetEndpointData (state) {
  }
}
