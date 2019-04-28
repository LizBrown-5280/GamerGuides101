<template>
  <div>
    <h3>Progression of your account...</h3>
    <p>Coming Soon</p>
  </div>
</template>

<script>
// import {mapGetters} from 'vuex'

export default {
  data () {
    return {
    }
  },
  computed: {
    // yourWvWRank () {
    //   if (this.endpointData.account[0].hasOwnProperty('wvw_rank') && !this.endpointData.wvw) {
    //     this.requestEndpointData(['/v2/wvw/ranks?ids=all', false, 'setEndpointData', 'wvw'])
    //   }

    //   // if (this.endpointData.worlds !== undefined) {
    //   //   let txt = this.endpointData.worlds[0][0].name + ' - id: ' + this.endpointData.worlds[0][0].id + ' - population: ' + this.endpointData.worlds[0][0].population

    //   //   return txt
    //   // }
    //   return 'not ready'
    // }
  },
  methods: {
    requestEndpointData (arr) {
      return new Promise((resolve, reject) => {
        this.setEndpointData(arr)
        resolve('done')
      })
    }
  },
  created () {
    //  @param arr [array]: [endpointUrl 'string', useKey boolean, mutation name 'string', dateNameToUse 'string'
    // this.requestEndpointData(['account/achievements', 'setTabsApiData', 'progression'])
    // this.requestEndpointData(['account/dungeons', 'setTabsApiData', 'progression'])
    // this.requestEndpointData(['account/masteries', 'setTabsApiData', 'progression'])
  }
}
</script>

<style scoped lang="scss">
</style>
