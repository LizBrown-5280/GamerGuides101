// This is not being used at this moment, code comes from GuildWars2.vue and should be moved here when time permits.
// Actually this code, when the final version from GuildWars2.vue should be put into a cron job.

import {axiosGet} from '@/utils/axiosGet'

export default {
  async getWvwRanks () {
    let endPointUrl = '/v2/wvw/ranks?ids=all'
    const payload = {
      dataType: 'openData',
      endpointGrp: 'wvw',
      path1: 'ranks'
    }
    payload.data = await this.axiosGetData(endPointUrl)
    this.$store.commit('setGw2Data', payload)
  },
  async getCurrencies () {
    let endPointUrl = '/v2/currencies?ids=all'
    const payload = {
      dataType: 'openData',
      endpointGrp: 'currencies'
    }
    payload.data = await this.axiosGetData(endPointUrl)
    this.$store.commit('setGw2Data', payload)
  },
  async getProfessions () {
    let endPointUrl = '/v2/professions?ids=all'
    const payload = {
      dataType: 'openData',
      endpointGrp: 'professions'
    }
    payload.data = await this.axiosGetData(endPointUrl)
    this.$store.commit('setGw2Data', payload)
  },
 
  async getCraftCats () {
    //  returns a small array of material crafting categories' ids
    let endPointUrl = '/v2/materials'
    let catIds = await this.axiosGetData(endPointUrl)
    return catIds
  },
  async getCraftCatItems (catIds) {
    //  using array from above returns a set of arrays, per categories, of material item ids in each category
    const payload = {
      dataType: 'openData',
      endpointGrp: 'items',
      path1: 'mats',
      data: []
    }
    var i = 0
    var len = catIds.length

    for (i; i < len; i++) {
      let endPointUrl = '/v2/materials/' + catIds[i]
      let catData = await this.axiosGetData(endPointUrl)
      payload.data.push(catData)
    }
    this.$store.commit('setGw2Data', payload)
  }
}